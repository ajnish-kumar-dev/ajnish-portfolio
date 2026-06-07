import { supabase } from '../lib/supabase';
import type { TestimonialDB, TestimonialInput } from '../types';

export const testimonialsService = {
  async getTestimonials(options?: {
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('testimonials')
      .select('*', { count: 'exact' })
      .eq('approved', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }
    if (options?.limit) {
      const offsetVal = options.offset ?? 0;
      query = query.range(offsetVal, offsetVal + options.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { testimonials: data as TestimonialDB[], total: count || 0 };
  },

  async getFeaturedTestimonials(limit = 3) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as TestimonialDB[];
  },

  async getTestimonialById(id: string) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as TestimonialDB | null;
  },

  async submitTestimonial(testimonial: TestimonialInput) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ ...testimonial, approved: false }])
      .select()
      .single();

    if (error) throw error;
    return data as TestimonialDB;
  },

  async approveTestimonial(id: string) {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TestimonialDB;
  },

  async updateTestimonial(id: string, updates: Partial<TestimonialInput>) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TestimonialDB;
  },

  async deleteTestimonial(id: string) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPendingTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TestimonialDB[];
  },
};
