import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';
import { createOrder } from '../../services/orderService';
import { updateUserProfile } from '../../services/userService';
import type { Order } from '../../types';
import toast from 'react-hot-toast';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    billing_name: profile?.full_name || '',
    billing_email: user?.email || '',
    billing_address: profile?.address || '',
    billing_city: profile?.city || '',
    billing_state: profile?.state || '',
    billing_country: profile?.country || '',
    billing_postal_code: profile?.postal_code || '',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    save_info: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/dashboard/cart');
    }
  }, [user, items, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        billing_name: profile.full_name || prev.billing_name,
        billing_email: user?.email || prev.billing_email,
        billing_address: profile.address || prev.billing_address,
        billing_city: profile.city || prev.billing_city,
        billing_state: profile.state || prev.billing_state,
        billing_country: profile.country || prev.billing_country,
        billing_postal_code: profile.postal_code || prev.billing_postal_code,
      }));
    }
  }, [profile, user?.email]);

  const { subtotal, count } = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.billing_name.trim()) newErrors.billing_name = 'Name is required';
      if (!formData.billing_email.trim()) newErrors.billing_email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.billing_email)) newErrors.billing_email = 'Invalid email';
    }

    if (stepNumber === 2) {
      if (!formData.card_number.trim()) newErrors.card_number = 'Card number is required';
      else if (!/^\d{16}$/.test(formData.card_number.replace(/\s/g, ''))) {
        newErrors.card_number = 'Invalid card number';
      }
      if (!formData.card_expiry.trim()) newErrors.card_expiry = 'Expiry is required';
      else if (!/^\d{2}\/\d{2}$/.test(formData.card_expiry)) {
        newErrors.card_expiry = 'Use MM/YY format';
      }
      if (!formData.card_cvc.trim()) newErrors.card_cvc = 'CVC is required';
      else if (!/^\d{3,4}$/.test(formData.card_cvc)) {
        newErrors.card_cvc = 'Invalid CVC';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const orderItems = items.map(item => ({
        productId: item.product_id,
        productName: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
        unitPrice: item.product?.price || 0,
      }));

      const newOrder = await createOrder(
        user!.id,
        orderItems,
        {
          billing_name: formData.billing_name,
          billing_email: formData.billing_email,
          billing_address: formData.billing_address,
          billing_city: formData.billing_city,
          billing_state: formData.billing_state,
          billing_country: formData.billing_country,
          billing_postal_code: formData.billing_postal_code,
          payment_method: 'card',
        },
        subtotal,
        tax,
        0,
        total
      );

      // Save billing info if requested
      if (formData.save_info) {
        await updateUserProfile(user!.id, {
          address: formData.billing_address,
          city: formData.billing_city,
          state: formData.billing_state,
          country: formData.billing_country,
          postal_code: formData.billing_postal_code,
        });
        refreshProfile();
      }

      // Clear cart
      await clearCart();

      setOrder(newOrder);
      setStep(3);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'Billing' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Confirm' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= s.num
                    ? 'bg-cyan-500 border-cyan-500 text-slate-900'
                    : 'border-slate-600 text-slate-500'
                }`}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className={`ml-2 ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`w-16 h-0.5 mx-4 ${step > s.num ? 'bg-cyan-500' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-slate-800/50 rounded-xl border border-slate-700"
            >
              {/* Step 1: Billing Info */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">Billing Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.billing_name}
                        onChange={(e) => setFormData({ ...formData, billing_name: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white ${
                          errors.billing_name ? 'border-red-500' : 'border-slate-700'
                        }`}
                      />
                      {errors.billing_name && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.billing_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.billing_email}
                        onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white ${
                          errors.billing_email ? 'border-red-500' : 'border-slate-700'
                        }`}
                      />
                      {errors.billing_email && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.billing_email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.billing_address}
                        onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.billing_city}
                          onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.billing_state}
                          onChange={(e) => setFormData({ ...formData, billing_state: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.billing_country}
                          onChange={(e) => setFormData({ ...formData, billing_country: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.billing_postal_code}
                          onChange={(e) => setFormData({ ...formData, billing_postal_code: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-slate-300">
                      <input
                        type="checkbox"
                        checked={formData.save_info}
                        onChange={(e) => setFormData({ ...formData, save_info: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
                      />
                      Save information for future purchases
                    </label>
                  </div>

                  <button
                    onClick={() => validateStep(1) && setStep(2)}
                    className="w-full mt-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Continue to Payment
                  </button>
                </>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-slate-700">
                      <CreditCard className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Payment Details</h2>
                      <p className="text-sm text-slate-400">Your payment is secure and encrypted</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.card_number}
                        onChange={(e) => setFormData({ ...formData, card_number: formatCardNumber(e.target.value) })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white ${
                          errors.card_number ? 'border-red-500' : 'border-slate-700'
                        }`}
                      />
                      {errors.card_number && (
                        <p className="mt-1 text-sm text-red-400">{errors.card_number}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={formData.card_expiry}
                          onChange={(e) => setFormData({ ...formData, card_expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white ${
                            errors.card_expiry ? 'border-red-500' : 'border-slate-700'
                          }`}
                        />
                        {errors.card_expiry && (
                          <p className="mt-1 text-sm text-red-400">{errors.card_expiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={formData.card_cvc}
                          onChange={(e) => setFormData({ ...formData, card_cvc: e.target.value.replace(/\D/g, '') })}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white ${
                            errors.card_cvc ? 'border-red-500' : 'border-slate-700'
                          }`}
                        />
                        {errors.card_cvc && (
                          <p className="mt-1 text-sm text-red-400">{errors.card_cvc}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Lock className="w-4 h-4" />
                      Your payment info is encrypted and secure
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && order && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
                  <p className="text-slate-400 mb-6">
                    Thank you for your purchase. Your order number is:
                  </p>
                  <div className="inline-block px-6 py-3 bg-slate-700 rounded-lg">
                    <span className="text-xl font-mono text-cyan-400">{order.order_number}</span>
                  </div>
                  <p className="mt-6 text-slate-400">
                    A confirmation email has been sent to {formData.billing_email}
                  </p>

                  <div className="mt-8 flex gap-4 justify-center">
                    <button
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() => navigate('/products')}
                      className="px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          {step < 3 && (
            <div className="md:col-span-1">
              <div className="sticky top-28 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-300 truncate">{item.product?.name}</span>
                      <span className="text-white flex-shrink-0">
                        ${(item.product?.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-700">
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Subtotal ({count} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-700">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
