import { useEffect, useState } from 'react';
import { Check, X, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { testimonialsService } from '../../services/testimonialsService';
import type { TestimonialDB } from '../../types';

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { testimonials: data } = await testimonialsService.getTestimonials({ limit: 100 });
      // Also fetch pending/unapproved
      const allData = await testimonialsService.getPendingTestimonials();
      setTestimonials([...data, ...allData.filter(t => !data.some(d => d.id === t.id))]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await testimonialsService.approveTestimonial(id);
      loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await testimonialsService.deleteTestimonial(id);
      setDeleteConfirm(null);
      loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !t.approved;
    if (filter === 'approved') return t.approved;
    return true;
  });

  const pendingCount = testimonials.filter(t => !t.approved).length;
  const approvedCount = testimonials.filter(t => t.approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage testimonials</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => setFilter('all')} className={`p-4 rounded-lg border-2 transition-all ${filter === 'all' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{testimonials.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">All Testimonials</p>
        </button>
        <button onClick={() => setFilter('pending')} className={`p-4 rounded-lg border-2 transition-all ${filter === 'pending' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
        </button>
        <button onClick={() => setFilter('approved')} className={`p-4 rounded-lg border-2 transition-all ${filter === 'approved' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
            No testimonials found.
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition-all ${
                testimonial.approved
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {testimonial.client_photo_url ? (
                      <img src={testimonial.client_photo_url} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                        {testimonial.client_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.client_name}</h3>
                        {testimonial.approved ? (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">Approved</span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">Pending</span>
                        )}
                        {testimonial.featured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">Featured</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.client_role}
                        {testimonial.client_company && ` at ${testimonial.client_company}`}
                      </p>
                      {testimonial.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < testimonial.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)} className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {expandedId === testimonial.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {!testimonial.approved && (
                      <>
                        <button onClick={() => handleApprove(testimonial.id)} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button onClick={() => setDeleteConfirm(testimonial.id)} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {testimonial.approved && (
                      <button onClick={() => setDeleteConfirm(testimonial.id)} className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {expandedId === testimonial.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{testimonial.testimonial}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Testimonial?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
              <button onClick={() => handleReject(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
