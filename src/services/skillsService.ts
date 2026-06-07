import { supabase } from '../lib/supabase';
import type { SkillDB, SkillInput } from '../types';

export const skillsService = {
  async getSkills(options?: {
    category?: 'programming' | 'web' | 'database' | 'tools' | 'soft' | 'other';
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('skills')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('proficiency', { ascending: false })
      .order('sort_order', { ascending: true });

    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }
    if (options?.limit) {
      const offsetVal = options.offset ?? 0;
      query = query.range(offsetVal, offsetVal + options.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { skills: data as SkillDB[], total: count || 0 };
  },

  async getFeaturedSkills(limit = 6) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('proficiency', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as SkillDB[];
  },

  async getSkillById(id: string) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as SkillDB | null;
  },

  async getSkillBySlug(slug: string) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;
    return data as SkillDB | null;
  },

  async createSkill(skill: SkillInput) {
    const slug = skill.slug ?? skill.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data, error } = await supabase
      .from('skills')
      .insert([{ ...skill, slug }])
      .select()
      .single();

    if (error) throw error;
    return data as SkillDB;
  },

  async updateSkill(id: string, updates: Partial<SkillInput>) {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SkillDB;
  },

  async deleteSkill(id: string) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getSkillsByCategory() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('published', true)
      .order('proficiency', { ascending: false });

    if (error) throw error;

    const grouped = (data as SkillDB[]).reduce((acc, skill) => {
      const cat = skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {} as Record<string, SkillDB[]>);

    return grouped;
  },
};
