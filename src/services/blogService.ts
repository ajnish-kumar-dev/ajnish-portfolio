import { supabase } from '../lib/supabase';
import type { BlogPostDB, BlogPostInput, BlogCommentDB, BlogCommentInput } from '../types';

export const blogService = {
  // ==================== Blog Posts ====================

  async getPosts(options?: {
    category?: string;
    featured?: boolean;
    tag?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }
    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }
    if (options?.limit) {
      const offsetVal = options.offset ?? 0;
      query = query.range(offsetVal, offsetVal + options.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { posts: data as BlogPostDB[], total: count || 0 };
  },

  async getFeaturedPosts(limit = 3) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as BlogPostDB[];
  },

  async getPostById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as BlogPostDB | null;
  },

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;
    return data as BlogPostDB | null;
  },

  async createPost(post: BlogPostInput) {
    const slug = post.slug ?? post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        slug,
        read_time_minutes: readTime,
        published_at: post.published ? new Date().toISOString() : null,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as BlogPostDB;
  },

  async updatePost(id: string, updates: Partial<BlogPostInput>) {
    const updateData: Record<string, unknown> = { ...updates };

    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      updateData.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    if (updates.published) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPostDB;
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async incrementViews(id: string) {
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('views_count')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('blog_posts')
      .update({ views_count: (post.views_count || 0) + 1 })
      .eq('id', id);

    if (error) throw error;
  },

  async incrementLikes(id: string) {
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('likes_count')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('blog_posts')
      .update({ likes_count: (post.likes_count || 0) + 1 })
      .eq('id', id);

    if (error) throw error;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true);

    if (error) throw error;

    const categories = [...new Set(data.map(p => p.category))];
    return categories;
  },

  async getTags() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('published', true);

    if (error) throw error;

    const allTags = data.flatMap(p => p.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags;
  },

  // ==================== Blog Comments ====================

  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BlogCommentDB[];
  },

  async getReplies(parentId: string) {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('parent_id', parentId)
      .eq('approved', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as BlogCommentDB[];
  },

  async submitComment(comment: BlogCommentInput) {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{ ...comment, approved: false }])
      .select()
      .single();

    if (error) throw error;
    return data as BlogCommentDB;
  },

  async approveComment(id: string) {
    const { data, error } = await supabase
      .from('blog_comments')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogCommentDB;
  },

  async deleteComment(id: string) {
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPendingComments() {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*, blog_posts(title)')
      .eq('approved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ==================== Related Posts ====================

  async getRelatedPosts(postId: string, limit = 3) {
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('category, tags')
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', post.category)
      .neq('id', postId)
      .limit(limit);

    if (error) throw error;
    return data as BlogPostDB[];
  },
};
