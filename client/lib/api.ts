// API utility functions for organizations and users
import type { Organization as DBOrganization, User as DBUser } from "@shared/schema";

// Frontend types (matching existing frontend structure)
export interface User {
  id: number;
  name: string;
  role: 'admin' | 'coordinator';
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  avatar: string | null;
  pendingRequests: number;
  status: 'active' | 'blocked' | 'inactive';
  email: string;
  phone: string | null;
  website: string | null;
  users: User[];
}

// Convert database organization to frontend format
function formatOrganization(dbOrg: DBOrganization, users: DBUser[] = []): Organization {
  return {
    id: dbOrg.id,
    name: dbOrg.name,
    slug: dbOrg.slug,
    avatar: dbOrg.avatar,
    pendingRequests: dbOrg.pendingRequests,
    status: dbOrg.status,
    email: dbOrg.email,
    phone: dbOrg.phone,
    website: dbOrg.website,
    users: users.map(u => ({ id: u.id, name: u.name, role: u.role })),
  };
}

// Organizations API
export const organizationsApi = {
  async getAll(): Promise<Organization[]> {
    const res = await fetch('/api/organizations');
    if (!res.ok) throw new Error('Failed to fetch organizations');
    const dbOrgs: DBOrganization[] = await res.json();
    
    // Fetch users for each organization
    const orgsWithUsers = await Promise.all(
      dbOrgs.map(async (org) => {
        const users = await usersApi.getByOrganization(org.id);
        return formatOrganization(org, users);
      })
    );
    
    return orgsWithUsers;
  },

  async getById(id: number): Promise<Organization> {
    const [orgRes, usersRes] = await Promise.all([
      fetch(`/api/organizations/${id}`),
      fetch(`/api/organizations/${id}/users`),
    ]);
    
    if (!orgRes.ok) throw new Error('Organization not found');
    
    const dbOrg: DBOrganization = await orgRes.json();
    const users: DBUser[] = usersRes.ok ? await usersRes.json() : [];
    
    return formatOrganization(dbOrg, users);
  },

  async create(data: { name: string; slug: string; email: string; phone?: string; website?: string; avatar?: string }): Promise<Organization> {
    const res = await fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create organization');
    }
    
    const dbOrg: DBOrganization = await res.json();
    return formatOrganization(dbOrg, []);
  },

  async update(id: number, data: Partial<{ name: string; slug: string; email: string; phone: string; website: string; status: 'active' | 'blocked' | 'inactive'; avatar: string; pendingRequests: number }>): Promise<Organization> {
    const res = await fetch(`/api/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update organization');
    }
    
    const dbOrg: DBOrganization = await res.json();
    const users = await usersApi.getByOrganization(id);
    return formatOrganization(dbOrg, users);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`/api/organizations/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete organization');
    }
  },
};

// Users API
export const usersApi = {
  async getByOrganization(organizationId: number): Promise<DBUser[]> {
    const res = await fetch(`/api/organizations/${organizationId}/users`);
    if (!res.ok) return [];
    return res.json();
  },

  async create(organizationId: number, data: { name: string; role: 'admin' | 'coordinator' }): Promise<DBUser> {
    const res = await fetch(`/api/organizations/${organizationId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create user');
    }
    
    return res.json();
  },

  async update(id: number, data: Partial<{ name: string; role: 'admin' | 'coordinator' }>): Promise<DBUser> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete user');
    }
  },
};
