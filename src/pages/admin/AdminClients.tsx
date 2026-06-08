import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Mail,
  Building,
  Calendar,
  User,
  Shield,
  Loader2,
} from 'lucide-react';
import { getAllUsers } from '../../services/userService';
import type { UserProfile } from '../../types';

export function AdminClients() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadClients();
  }, [roleFilter]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const { users: data } = await getAllUsers({
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    search
      ? client.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        client.company?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
        <p className="text-slate-400">Manage registered users</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="">All Roles</option>
          <option value="client">Clients</option>
          <option value="admin">Admins</option>
        </select>
      </motion.div>

      {/* Clients Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : filteredClients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No clients found</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                  client.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}>
                  {client.full_name?.[0] || 'U'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">{client.full_name || 'User'}</h3>
                    {client.role === 'admin' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate">{client.company || 'No company'}</p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{client.id}</span>
                </div>
                {client.company && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{client.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Joined {new Date(client.created_at).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
