import { supabase } from '../lib/supabase';
import type { ProfileViewDB, ChatbotLogDB, AnalyticsStats, ChatbotStats, DashboardStats } from '../types';

export const analyticsService = {
  async trackProfileView(view: Partial<ProfileViewDB>) {
    const { data, error } = await supabase
      .from('profile_views')
      .insert([{
        visitor_id: view.visitor_id,
        ip_address: view.ip_address,
        user_agent: view.user_agent,
        referrer: view.referrer,
        session_duration_seconds: view.session_duration_seconds,
        pages_visited: view.pages_visited || [],
      }])
      .select()
      .single();

    if (error) throw error;
    return data as ProfileViewDB;
  },

  async trackChatbotLog(log: Partial<ChatbotLogDB>) {
    const { data, error } = await supabase
      .from('chatbot_logs')
      .insert([{
        session_id: log.session_id!,
        visitor_id: log.visitor_id,
        user_message: log.user_message!,
        bot_response: log.bot_response!,
        intent_detected: log.intent_detected,
        confidence_score: log.confidence_score,
        response_time_ms: log.response_time_ms,
        success: log.success ?? true,
        error_message: log.error_message,
        metadata: log.metadata || {},
      }])
      .select()
      .single();

    if (error) throw error;
    return data as ChatbotLogDB;
  },

  async getAnalyticsStats(startDate?: Date, endDate?: Date): Promise<AnalyticsStats> {
    let query = supabase
      .from('profile_views')
      .select('*');

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    const views = data as ProfileViewDB[];
    const uniqueVisitors = new Set(views.map(v => v.visitor_id).filter(Boolean)).size;
    const avgDuration = views.length > 0
      ? views.reduce((sum, v) => sum + (v.session_duration_seconds || 0), 0) / views.length
      : 0;

    const pageCounts: Record<string, number> = {};
    views.forEach(v => {
      (v.pages_visited || []).forEach(page => {
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });
    });

    const topPages = Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const countryCounts: Record<string, number> = {};
    views.forEach(v => {
      if (v.country) {
        countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
      }
    });

    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const deviceCounts: Record<string, number> = {};
    views.forEach(v => {
      if (v.device_type) {
        deviceCounts[v.device_type] = (deviceCounts[v.device_type] || 0) + 1;
      }
    });

    const topDevices = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const browserCounts: Record<string, number> = {};
    views.forEach(v => {
      if (v.browser) {
        browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      }
    });

    const topBrowsers = Object.entries(browserCounts)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total_views: views.length,
      unique_visitors: uniqueVisitors,
      avg_session_duration: Math.round(avgDuration),
      top_pages: topPages,
      top_countries: topCountries,
      top_devices: topDevices,
      top_browsers: topBrowsers,
    };
  },

  async getChatbotStats(startDate?: Date, endDate?: Date): Promise<ChatbotStats> {
    let query = supabase
      .from('chatbot_logs')
      .select('*');

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    const logs = data as ChatbotLogDB[];
    const uniqueSessions = new Set(logs.map(l => l.session_id)).size;
    const avgResponseTime = logs.length > 0
      ? logs.reduce((sum, l) => sum + (l.response_time_ms || 0), 0) / logs.length
      : 0;
    const successRate = logs.length > 0
      ? (logs.filter(l => l.success).length / logs.length) * 100
      : 0;

    const intentCounts: Record<string, number> = {};
    logs.forEach(l => {
      if (l.intent_detected) {
        intentCounts[l.intent_detected] = (intentCounts[l.intent_detected] || 0) + 1;
      }
    });

    const topIntents = Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total_conversations: logs.length,
      unique_sessions: uniqueSessions,
      avg_response_time: Math.round(avgResponseTime),
      success_rate: Math.round(successRate * 100) / 100,
      top_intents: topIntents,
    };
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      projectsResult,
      skillsResult,
      testimonialsResult,
      contactResult,
      blogResult,
      viewsResult,
      chatbotResult,
    ] = await Promise.all([
      supabase.from('projects').select('id, published', { count: 'exact' }),
      supabase.from('skills').select('id', { count: 'exact' }),
      supabase.from('testimonials').select('id, approved', { count: 'exact' }),
      supabase.from('contact_messages').select('id, status', { count: 'exact' }),
      supabase.from('blog_posts').select('id, published', { count: 'exact' }),
      supabase.from('profile_views').select('id', { count: 'exact' }),
      supabase.from('chatbot_logs').select('id', { count: 'exact' }),
    ]);

    const projects = projectsResult.data || [];
    const testimonials = testimonialsResult.data || [];
    const contacts = contactResult.data || [];
    const blogs = blogResult.data || [];

    return {
      total_projects: projectsResult.count || 0,
      published_projects: projects.filter(p => p.published).length,
      total_skills: skillsResult.count || 0,
      total_testimonials: testimonialsResult.count || 0,
      pending_testimonials: testimonials.filter(t => !t.approved).length,
      total_contact_messages: contactResult.count || 0,
      new_messages: contacts.filter(c => c.status === 'new').length,
      total_blog_posts: blogResult.count || 0,
      published_posts: blogs.filter(b => b.published).length,
      total_profile_views: viewsResult.count || 0,
      total_chatbot_conversations: chatbotResult.count || 0,
    };
  },
};
