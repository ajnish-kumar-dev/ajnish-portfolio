import { supabase } from '../lib/supabase';
import type { ExperienceDB, ExperienceInput } from '../types';

export const experienceService = {
  async getExperiences(options?: {
    current?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('experience')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('start_date', { ascending: false });

    if (options?.current !== undefined) {
      query = query.eq('current', options.current);
    }
    if (options?.limit) {
      const offsetVal = options.offset ?? 0;
      query = query.range(offsetVal, offsetVal + options.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { experiences: data as ExperienceDB[], total: count || 0 };
  },

  async getExperienceById(id: string) {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as ExperienceDB | null;
  },

  async createExperience(experience: ExperienceInput) {
    const { data, error } = await supabase
      .from('experience')
      .insert([experience])
      .select()
      .single();

    if (error) throw error;
    return data as ExperienceDB;
  },

  async updateExperience(id: string, updates: Partial<ExperienceInput>) {
    const { data, error } = await supabase
      .from('experience')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ExperienceDB;
  },

  async deleteExperience(id: string) {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
