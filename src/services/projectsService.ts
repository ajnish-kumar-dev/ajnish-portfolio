import { supabase } from '../lib/supabase';
import type {
  ProjectDB,
  ProjectInput,
} from '../types';

export const projectsService = {
  async getProjects(options?: {
    status?: 'planning' | 'in-progress' | 'completed' | 'archived';
    category?: 'web' | 'desktop' | 'mobile' | 'academic' | 'other';
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
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
    return { projects: data as ProjectDB[], total: count || 0 };
  },

  async getFeaturedProjects(limit = 3) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as ProjectDB[];
  },

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as ProjectDB | null;
  },

  async getProjectBySlug(slug: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;
    return data as ProjectDB | null;
  },

  async createProject(project: ProjectInput) {
    const slug = project.slug ?? project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, slug }])
      .select()
      .single();

    if (error) throw error;
    return data as ProjectDB;
  },

  async updateProject(id: string, updates: Partial<ProjectInput>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectDB;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async incrementViews(id: string) {
    // Not tracked yet on projects; no-op
  },
};
