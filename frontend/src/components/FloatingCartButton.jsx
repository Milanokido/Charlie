import React, { useMemo, useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

const FloatingCartButton = ({ onCartOpen, isSubmitting = false }) => {
  const { items } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousTotal, setPreviousTotal] = useState(0);

  // Memoized total quantity calculation to avoid unnecessary re-renders
  const totalQuantity = useMemo(() => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [items]);

  // Animation effect when cart count changes
  useEffect(() => {
    if (totalQuantity !== previousTotal && totalQuantity > previousTotal) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPreviousTotal(totalQuantity);
  }, [totalQuantity, previousTotal]);

  const handleClick = () => {
    if (!isSubmitting && onCartOpen) {
      onCartOpen();
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isSubmitting) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isSubmitting}
      aria-label={`Panier, ${totalQuantity} article${totalQuantity !== 1 ? 's' : ''}`}
      className={`
        fixed z-50 
        bottom-4 right-4 
        sm:bottom-6 sm:right-6 
        md:bottom-8 md:right-8
        w-14 h-14 
        bg-[#E30613] hover:bg-[#B8050F] 
        text-white 
        rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-[#E30613] focus:ring-opacity-30
        active:scale-95
        ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${isAnimating ? 'animate-bounce' : ''}
      `}
      style={{
        minWidth: '44px',
        minHeight: '44px',
        // Safe area insets for mobile devices
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)'
      }}
    >
      {/* Cart Icon */}
      <div className="relative flex items-center justify-center w-full h-full">
        <ShoppingCart 
          className="w-6 h-6" 
          strokeWidth={2}
          aria-hidden="true"
        />
        
        {/* Counter Badge */}
        <div 
          className={`
            absolute -top-2 -right-2 
            min-w-[20px] h-5 
            bg-white text-[#E30613] 
            text-xs font-bold 
            rounded-full 
            flex items-center justify-center 
            border-2 border-[#E30613]
            px-1
            transition-transform duration-200
            ${isAnimating ? 'animate-pulse scale-110' : 'scale-100'}
          `}
          aria-live="polite"
          aria-atomic="true"
        >
          {totalQuantity}
        </div>
      </div>
      
      {/* Ripple effect on click */}
      <div 
        className={`
          absolute inset-0 rounded-full 
          bg-white opacity-0 
          transition-opacity duration-150
          pointer-events-none
          ${isAnimating ? 'animate-ping opacity-20' : ''}
        `}
      />
    </button>
  );
};

export default FloatingCartButton;