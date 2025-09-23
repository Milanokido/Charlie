import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharlieHome from './components/CharlieHome';
import OrdersAdmin from './components/OrdersAdmin';
import { CartProvider } from './components/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CharlieHome />} />
            <Route path="/admin-orders" element={<OrdersAdmin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;