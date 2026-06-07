import { supabase } from '../lib/supabase';
import type { SiteConfigDB } from '../types';

export const configService = {
  async getConfig(key: string) {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('key', key)
      .maybeSingle();

    if (error) throw error;
    return data as SiteConfigDB | null;
  },

  async getConfigValue<T = unknown>(key: string): Promise<T | null> {
    const config = await this.getConfig(key);
    return config?.value as T | null;
  },

  async getAllConfig() {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;
    return data as SiteConfigDB[];
  },

  async setConfig(key: string, value: Record<string, unknown>, description?: string) {
    const { data, error } = await supabase
      .from('site_config')
      .upsert([
        {
          key,
          value,
          description,
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: 'key' })
      .select()
      .single();

    if (error) throw error;
    return data as SiteConfigDB;
  },

  async deleteConfig(key: string) {
    const { error } = await supabase
      .from('site_config')
      .delete()
      .eq('key', key);

    if (error) throw error;
  },
};

// Default configuration keys
export const CONFIG_KEYS = {
  SITE_NAME: 'site_name',
  SITE_DESCRIPTION: 'site_description',
  CONTACT_EMAIL: 'contact_email',
  SOCIAL_LINKS: 'social_links',
  SEO_META: 'seo_meta',
  THEME_COLORS: 'theme_colors',
  FEATURES: 'features',
  MAINTENANCE_MODE: 'maintenance_mode',
} as const;

// Type-safe configuration values
export interface SiteConfigValue {
  site_name: { value: string };
  site_description: { value: string };
  contact_email: { value: string };
  social_links: {
    value: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  seo_meta: {
    value: {
      title: string;
      description: string;
      keywords: string[];
      ogImage?: string;
    };
  };
  theme_colors: {
    value: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  features: {
    value: {
      chatbot: boolean;
      blog: boolean;
      testimonials: boolean;
      analytics: boolean;
    };
  };
  maintenance_mode: {
    value: {
      enabled: boolean;
      message?: string;
    };
  };
}
