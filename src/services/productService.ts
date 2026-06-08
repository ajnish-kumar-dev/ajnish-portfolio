import { supabase } from '../lib/supabase';
import type { Product, ProductInput } from '../types';

// Generate a slug from a string
const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all products (public - active only)
export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ products: Product[]; total: number }> {
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { products: (data || []) as Product[], total: count || 0 };
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) return null;
  return data as Product;
}

// Get all categories
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('status', 'active');

  if (error) throw error;

  const categories = [...new Set(data?.map(p => p.category) || [])];
  return categories.sort();
}

// Get related products
export async function getRelatedProducts(productId: string, category: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('status', 'active')
    .neq('id', productId)
    .limit(limit);

  if (error) throw error;
  return (data || []) as Product[];
}

// ADMIN FUNCTIONS

// Get all products (admin - includes drafts)
export async function getAdminProducts(filters?: {
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ products: Product[]; total: number }> {
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { products: (data || []) as Product[], total: count || 0 };
}

// Create product (admin only)
export async function createProduct(input: ProductInput): Promise<Product> {
  const slug = input.slug || generateSlug(input.name);

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...input,
      slug,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// Update product (admin only)
export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const updateData = { ...input };
  if (input.name && !input.slug) {
    updateData.slug = generateSlug(input.name);
  }

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// Delete product (admin only)
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get product stats
export async function getProductStats(): Promise<{
  total: number;
  active: number;
  draft: number;
  categories: { category: string; count: number }[];
}> {
  const { data: allProducts } = await supabase
    .from('products')
    .select('status, category');

  const products = allProducts || [];
  const total = products.length;
  const active = products.filter(p => p.status === 'active').length;
  const draft = products.filter(p => p.status === 'draft').length;

  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categories = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  return { total, active, draft, categories };
}
