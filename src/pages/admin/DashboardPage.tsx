import { useEffect, useState } from 'react';
import { FolderKanban, Code2, MessageSquare, FileText, Users, Eye, Bot, Mail, TrendingUp } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import type { DashboardStats } from '../../types';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Projects', value: stats?.total_projects ?? 0, sub: `${stats?.published_projects ?? 0} published`, icon: FolderKanban, color: 'blue' },
    { label: 'Skills', value: stats?.total_skills ?? 0, icon: Code2, color: 'purple' },
    { label: 'Testimonials', value: stats?.total_testimonials ?? 0, sub: `${stats?.pending_testimonials ?? 0} pending`, icon: MessageSquare, color: 'green' },
    { label: 'Blog Posts', value: stats?.total_blog_posts ?? 0, sub: `${stats?.published_posts ?? 0} published`, icon: FileText, color: 'orange' },
    { label: 'Contact Messages', value: stats?.total_contact_messages ?? 0, sub: `${stats?.new_messages ?? 0} new`, icon: Mail, color: 'red' },
    { label: 'Profile Views', value: stats?.total_profile_views ?? 0, icon: Eye, color: 'cyan' },
    { label: 'Chatbot Conversations', value: stats?.total_chatbot_conversations ?? 0, icon: Bot, color: 'pink' },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
    pink: 'from-pink-500 to-pink-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button onClick={loadStats} className="mt-2 text-red-600 hover:text-red-700 font-medium">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your portfolio</p>
        </div>
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
              {stat.sub && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/projects"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
          >
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Add Project</span>
          </a>
          <a
            href="/admin/blog"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
          >
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Write Blog Post</span>
          </a>
          <a
            href="/admin/testimonials"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all"
          >
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Review Testimonials</span>
          </a>
          <a
            href="/admin/skills"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
          >
            <Code2 className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Add Skill</span>
          </a>
        </div>
      </div>
    </div>
  );
}
