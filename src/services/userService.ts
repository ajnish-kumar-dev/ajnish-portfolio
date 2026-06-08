import { supabase } from '../lib/supabase';
import type { UserProfile, UserProfileInput } from '../types';

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as UserProfile;
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfileInput>
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// Get all users (admin only)
export async function getAllUsers(filters?: {
  search?: string;
  role?: string;
  limit?: number;
  offset?: number;
}): Promise<{ users: UserProfile[]; total: number }> {
  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
  }
  if (filters?.role) {
    query = query.eq('role', filters.role);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { users: (data || []) as UserProfile[], total: count || 0 };
}

// Get user stats (admin only)
export async function getUserStats(): Promise<{
  total: number;
  clients: number;
  admins: number;
}> {
  const { data: users } = await supabase
    .from('user_profiles')
    .select('role');

  const all = users || [];
  return {
    total: all.length,
    clients: all.filter(u => u.role === 'client').length,
    admins: all.filter(u => u.role === 'admin').length,
  };
}
