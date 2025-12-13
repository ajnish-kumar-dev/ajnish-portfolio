import { supabase } from '../lib/supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  read_at: string | null;
  updated_at: string;
}

export const contactService = {
  async submitMessage(data: Omit<ContactMessage, 'id' | 'created_at' | 'read_at' | 'updated_at' | 'status'> & { status?: string }) {
    const { data: result, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: data.status || 'new',
        },
      ])
      .select();

    if (error) throw error;
    return result?.[0];
  },

  async getMessages(
    limit = 50,
    offset = 0,
    status?: 'new' | 'read' | 'replied'
  ) {
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { messages: data as ContactMessage[], total: count || 0 };
  },

  async getMessageById(id: string) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as ContactMessage | null;
  },

  async updateMessageStatus(id: string, status: 'new' | 'read' | 'replied') {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        status,
        read_at: status === 'read' || status === 'replied' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteMessage(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getStats() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('status', { count: 'exact' });

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      new: data?.filter(m => m.status === 'new').length || 0,
      read: data?.filter(m => m.status === 'read').length || 0,
      replied: data?.filter(m => m.status === 'replied').length || 0,
    };

    return stats;
  },
};
