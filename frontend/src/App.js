import React, { useState } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharlieHome from './components/CharlieHome';
import OrdersAdmin from './components/OrdersAdmin';
import { CartProvider } from './components/CartContext';
import FloatingCartButton from './components/FloatingCartButton';
import CartModal from './components/CartModal';

function App() {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CharlieHome />} />
            <Route path="/admin-orders" element={<OrdersAdmin />} />
          </Routes>
          
          {/* Floating Cart Button - visible across all pages */}
          <FloatingCartButton onCartOpen={() => setCartModalOpen(true)} />
          
          {/* Global Cart Modal */}
          <CartModal 
            isOpen={cartModalOpen} 
            onClose={() => setCartModalOpen(false)} 
          />
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;