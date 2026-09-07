export type TenantPlan = 'free' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  logoUrl?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'owner' | 'admin' | 'member';
  tenantId: string;
  provider: 'google' | 'github' | 'email';
}

export interface TaskItem {
  id: string;
  tenantId: string; // Crucial for Multi-tenancy!
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
}

export interface BillingDetails {
  plan: TenantPlan;
  priceMonthly: number;
  status: 'active' | 'trialing' | 'canceled';
  nextBillingDate: string;
  tasksLimit: number;
  stripeCustomerId?: string;
}
