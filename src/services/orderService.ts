import { supabase } from '../lib/supabase';
import type { Order, OrderInput, OrderItem, Invoice } from '../types';

// Generate order number
const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

// Generate invoice number
const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

// Get user's orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Order[];
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('id', orderId)
    .single();

  if (error) return null;
  return data as Order;
}

// Create order
export async function createOrder(
  userId: string,
  items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>,
  input: OrderInput,
  subtotal: number,
  tax: number,
  discount: number,
  total: number
): Promise<Order> {
  const orderNumber = generateOrderNumber();

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      status: 'pending',
      subtotal,
      tax,
      discount,
      total,
      coupon_code: input.coupon_code,
      billing_name: input.billing_name,
      billing_email: input.billing_email,
      billing_address: input.billing_address,
      billing_city: input.billing_city,
      billing_state: input.billing_state,
      billing_country: input.billing_country,
      billing_postal_code: input.billing_postal_code,
      payment_method: input.payment_method,
      payment_status: 'pending',
      notes: input.notes,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.quantity * item.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Create invoice
  const invoiceNumber = generateInvoiceNumber();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

  await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      order_id: order.id,
      user_id: userId,
      status: 'sent',
      due_date: dueDate.toISOString().split('T')[0],
    });

  return order as Order;
}

// Update order status (admin)
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  paymentStatus?: Order['payment_status']
): Promise<Order> {
  const updateData: Record<string, unknown> = { status };
  if (paymentStatus) {
    updateData.payment_status = paymentStatus;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;

  // Update invoice status if paid
  if (paymentStatus === 'paid') {
    await supabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('order_id', orderId);
  }

  return data as Order;
}

// Get all orders (admin)
export async function getAllOrders(filters?: {
  status?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: Order[]; total: number }> {
  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { orders: (data || []) as Order[], total: count || 0 };
}

// Get user invoices
export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      order:orders(
        *,
        items:order_items(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Invoice[];
}

// Get invoice by ID
export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      order:orders(
        *,
        items:order_items(*)
      )
    `)
    .eq('id', invoiceId)
    .single();

  if (error) return null;
  return data as Invoice;
}

// Get order stats
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  completed: number;
  totalRevenue: number;
}> {
  const { data: orders } = await supabase
    .from('orders')
    .select('status, total, payment_status');

  const allOrders = orders || [];
  const total = allOrders.length;
  const pending = allOrders.filter(o => o.status === 'pending').length;
  const processing = allOrders.filter(o => o.status === 'processing').length;
  const completed = allOrders.filter(o => o.status === 'completed').length;

  const totalRevenue = allOrders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return { total, pending, processing, completed, totalRevenue };
}

// Get client stats
export async function getClientStats(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  pendingInvoices: number;
}> {
  const { data: orders } = await supabase
    .from('orders')
    .select('status, total')
    .eq('user_id', userId);

  const userOrders = orders || [];
  const totalOrders = userOrders.length;
  const totalSpent = userOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrders = userOrders.filter(
    o => o.status === 'pending' || o.status === 'processing' || o.status === 'active'
  ).length;

  const { data: invoices } = await supabase
    .from('invoices')
    .select('status')
    .eq('user_id', userId)
    .neq('status', 'paid');

  const pendingInvoices = (invoices || []).length;

  return { totalOrders, totalSpent, activeOrders, pendingInvoices };
}
