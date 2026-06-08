import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch {
      toast.error('Please login to add items');
    }
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
    >
      <Link to={`/products/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-900">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-slate-700" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {discount > 0 && (
              <span className="px-2 py-1 text-xs font-bold bg-cyan-500 text-slate-900 rounded-lg">
                -{discount}%
              </span>
            )}
            {product.stock_quantity <= 0 && (
              <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Category Tag */}
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 rounded-lg backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {product.short_description && (
            <p className="mt-1 text-sm text-slate-400 line-clamp-2">
              {product.short_description}
            </p>
          )}

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
              />
            ))}
            <span className="ml-1 text-xs text-slate-500">(4.0)</span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm text-slate-500 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity <= 0}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
