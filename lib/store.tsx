'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, User, TaskItem, TenantPlan } from './types';

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-baltic-tech',
    name: 'Baltic Tech Solutions OÜ',
    slug: 'baltic-tech',
    plan: 'pro',
    createdAt: '2026-01-15',
  },
  {
    id: 'tenant-tallinn-cafe',
    name: 'Tallinn Roasters Hub',
    slug: 'tallinn-roasters',
    plan: 'free',
    createdAt: '2026-02-01',
  },
  {
    id: 'tenant-nordic-saas',
    name: 'Nordic AI Analytics',
    slug: 'nordic-ai',
    plan: 'enterprise',
    createdAt: '2025-11-20',
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'user-vitali',
    name: 'Vitali (Lead Dev)',
    email: 'vitali@baltictech.ee',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vitali',
    role: 'owner',
    tenantId: 'tenant-baltic-tech',
    provider: 'github',
  },
  {
    id: 'user-maria',
    name: 'Maria (Product Mgr)',
    email: 'maria@roastershub.ee',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maria',
    role: 'owner',
    tenantId: 'tenant-tallinn-cafe',
    provider: 'google',
  },
];

const INITIAL_TASKS: TaskItem[] = [
  // Baltic Tech tasks
  {
    id: 'task-1',
    tenantId: 'tenant-baltic-tech',
    title: 'Ühenda Stripe Webhook endpoint',
    description: 'Kuula customer.subscription.updated sündmusi ja uuenda andmebaasi staatust.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Vitali',
    createdAt: '2026-09-07',
  },
  {
    id: 'task-2',
    tenantId: 'tenant-baltic-tech',
    title: 'Seadista Sentry monitooring',
    description: 'Püüa kinni kõik production vead ja jälgi veebilehe latentsust.',
    status: 'done',
    priority: 'medium',
    assignedTo: 'Vitali',
    createdAt: '2026-09-06',
  },
  {
    id: 'task-3',
    tenantId: 'tenant-baltic-tech',
    title: 'Testi OAuth 2.0 sisselogimist',
    description: 'Kontrolli Google ja GitHub autentimist ilma kohalike paroolideta.',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Vitali',
    createdAt: '2026-09-07',
  },

  // Tallinn Roasters Hub tasks (Different Tenant!)
  {
    id: 'task-4',
    tenantId: 'tenant-tallinn-cafe',
    title: 'Osta uued kohvioad Brasiiliast',
    description: 'Võta ühendust tarnijaga ja telli 50kg espressoube.',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Maria',
    createdAt: '2026-09-05',
  },
  {
    id: 'task-5',
    tenantId: 'tenant-tallinn-cafe',
    title: 'Kassasüsteemi uuendus',
    description: 'Uuenda POS terminali tarkvara laupäeva hommikuks.',
    status: 'done',
    priority: 'medium',
    assignedTo: 'Maria',
    createdAt: '2026-09-04',
  },

  // Nordic AI tasks (Different Tenant!)
  {
    id: 'task-6',
    tenantId: 'tenant-nordic-saas',
    title: 'Treeni LLaMA-3 mudelit uutel andmetel',
    description: 'GPU klastri ettevalmistus ja finetuning skriptide käivitamine.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'AI Team',
    createdAt: '2026-09-01',
  },
];

interface SaasContextType {
  tenants: Tenant[];
  currentTenant: Tenant;
  currentUser: User | null;
  tasks: TaskItem[];
  setCurrentTenantId: (id: string) => void;
  addTask: (title: string, description: string, priority: 'low' | 'medium' | 'high') => void;
  updateTaskStatus: (taskId: string, status: 'todo' | 'in_progress' | 'done') => void;
  deleteTask: (taskId: string) => void;
  upgradePlan: (plan: TenantPlan) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any; user: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  loginAs: (provider: 'google' | 'github') => void;
  logout: () => Promise<void>;
  addTenant: (name: string) => void;
  sentryErrors: string[];
  triggerSentryTestError: () => void;
}

const SaasContext = createContext<SaasContextType | null>(null);

import { supabase, isSupabaseConfigured } from './supabase';

export function SaasProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-baltic-tech');
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [sentryErrors, setSentryErrors] = useState<string[]>([]);

  // Real-time synchronization with Supabase (Slide 6 & 8)
  useEffect(() => {
    if (isSupabaseConfigured()) {
      console.log('⚡ Connecting to Supabase database:', process.env.NEXT_PUBLIC_SUPABASE_URL);

      // 1. Fetch tenants from Supabase
      supabase
        .from('tenants')
        .select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            console.log('✅ Loaded tenants from Supabase:', data);
            setTenants(
              data.map((d: any) => ({
                id: d.id,
                name: d.name,
                slug: d.id,
                plan: (d.plan as TenantPlan) || 'free',
                createdAt: d.created_at ? d.created_at.split('T')[0] : '2026-01-01',
              }))
            );
          }
        });

      // 2. Fetch tasks from Supabase
      supabase
        .from('tasks')
        .select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            console.log('✅ Loaded tasks from Supabase:', data);
            setTasks(
              data.map((d: any) => ({
                id: d.id.toString(),
                tenantId: d.tenant_id,
                title: d.title,
                description: d.description || '',
                status: d.status || 'todo',
                priority: 'medium',
                assignedTo: d.assigned_to || 'Tiimiliige',
                createdAt: d.created_at ? d.created_at.split('T')[0] : '2026-09-07',
              }))
            );
          }
        });

      // 3. Supabase Auth: Check session and subscribe to auth changes (Slide 6 & 8)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          console.log('✅ Active Supabase user found:', session.user.email);
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Kasutaja',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.id}`,
            role: 'owner',
            tenantId: currentTenantId,
            provider: (session.user.app_metadata?.provider as any) || 'email',
          });
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          console.log('🔑 Supabase auth state change:', _event, session.user.email);
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Kasutaja',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.id}`,
            role: 'owner',
            tenantId: currentTenantId,
            provider: (session.user.app_metadata?.provider as any) || 'email',
          });
        } else if (_event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // Multi-tenancy filter: Only tasks belonging to the current tenant!
  const tenantTasks = tasks.filter((t) => t.tenantId === currentTenant.id);

  const addTask = (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    // Check plan limits (Free plan has limit of 3 tasks!)
    if (currentTenant.plan === 'free' && tenantTasks.length >= 3) {
      alert(`⚠️ Free plaani limiit täis (maksimaalselt 3 ülesannet)! Uuenda plaan Pro versioonile (Stripe Billing nõue).`);
      return;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      tenantId: currentTenant.id,
      title,
      description,
      status: 'todo',
      priority,
      assignedTo: currentUser?.name || 'Tiimiliige',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => [newTask, ...prev]);

    if (isSupabaseConfigured()) {
      supabase
        .from('tasks')
        .insert({
          tenant_id: currentTenant.id,
          title,
          description,
          status: 'todo',
          assigned_to: currentUser?.name || 'Tiimiliige',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase insert warning:', error.message);
        });
    }
  };

  const updateTaskStatus = (taskId: string, status: 'todo' | 'in_progress' | 'done') => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId && task.tenantId === currentTenant.id ? { ...task, status } : task))
    );

    if (isSupabaseConfigured()) {
      supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .then(({ error }) => {
          if (error) console.warn('Supabase update warning:', error.message);
        });
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => !(t.id === taskId && t.tenantId === currentTenant.id)));

    if (isSupabaseConfigured()) {
      supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .then(({ error }) => {
          if (error) console.warn('Supabase delete warning:', error.message);
        });
    }
  };

  const upgradePlan = (plan: TenantPlan) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === currentTenant.id ? { ...t, plan } : t))
    );

    if (isSupabaseConfigured()) {
      supabase
        .from('tenants')
        .update({ plan })
        .eq('id', currentTenant.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase plan update warning:', error.message);
        });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      loginAs('google');
      return { error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase Sign In Error:', error.message);
    }
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      loginAs('google');
      return { error: null, user: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
        },
      },
    });
    if (error) {
      console.error('Supabase Sign Up Error:', error.message);
    }
    return { error, user: data?.user };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured()) {
      loginAs(provider);
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
  };

  const loginAs = (provider: 'google' | 'github') => {
    const mockUser: User = {
      id: `user-${Date.now()}`,
      name: provider === 'google' ? 'Google Õppur' : 'GitHub Dev',
      email: provider === 'google' ? 'oppur@gmail.com' : 'dev@github.com',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
      role: 'owner',
      tenantId: currentTenant.id,
      provider,
    };
    setCurrentUser(mockUser);
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const addTenant = (name: string) => {
    const newId = `tenant-${Date.now()}`;
    const newT: Tenant = {
      id: newId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      plan: 'free',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTenants((prev) => [...prev, newT]);
    setCurrentTenantId(newId);

    if (isSupabaseConfigured()) {
      supabase
        .from('tenants')
        .insert({
          id: newId,
          name,
          plan: 'free',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase tenant insert warning:', error.message);
        });
    }
  };

  const triggerSentryTestError = () => {
    const errorMsg = `[Sentry Caught Exception] TypeError: Cannot read property 'quota' of undefined at TenantBilling.tsx (${new Date().toLocaleTimeString()})`;
    setSentryErrors((prev) => [errorMsg, ...prev]);
    console.error(errorMsg);
  };

  return (
    <SaasContext.Provider
      value={{
        tenants,
        currentTenant,
        currentUser,
        tasks: tenantTasks,
        setCurrentTenantId,
        addTask,
        updateTaskStatus,
        deleteTask,
        upgradePlan,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        loginAs,
        logout,
        addTenant,
        sentryErrors,
        triggerSentryTestError,
      }}
    >
      {children}
    </SaasContext.Provider>
  );
}

export function useSaas() {
  const ctx = useContext(SaasContext);
  if (!ctx) throw new Error('useSaas must be used within SaasProvider');
  return ctx;
}
