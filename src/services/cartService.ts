import { supabase } from '../lib/supabase';
import type { CartItem, Product } from '../types';

export interface CartWithProduct extends CartItem {
  product: Product;
}

// Get user's cart
export async function getCart(userId: string): Promise<CartWithProduct[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as CartWithProduct[];
}

// Add item to cart
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<CartItem> {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data as CartItem;
  }

  // Create new item
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      quantity,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CartItem;
}

// Update cart item quantity
export async function updateCartItem(
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<CartItem> {
  if (quantity <= 0) {
    return removeCartItem(userId, cartItemId);
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as CartItem;
}

// Remove item from cart
export async function removeCartItem(userId: string, cartItemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Clear cart
export async function clearCart(userId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// Get cart count
export async function getCartCount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).reduce((sum, item) => sum + item.quantity, 0);
}

// Calculate cart totals
export async function calculateCartTotals(
  userId: string,
  couponCode?: string
): Promise<{
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: CartWithProduct[];
}> {
  const items = await getCart(userId);
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  let discount = 0;

  if (couponCode) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('active', true)
      .single();

    if (coupon) {
      if (coupon.discount_type === 'percentage') {
        discount = subtotal * (coupon.discount_value / 100);
      } else {
        discount = coupon.discount_value;
      }
    }
  }

  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total, items };
}
