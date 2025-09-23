import React, { createContext, useContext, useReducer, useEffect } from 'react';

// État initial du panier
const initialState = {
  items: [],
  total: 0
};

// Actions du panier
const cartActions = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer pour gérer les actions du panier
const cartReducer = (state, action) => {
  switch (action.type) {
    case cartActions.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // L'article existe déjà, on augmente la quantité
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nouvel article
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const newTotal = updatedItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(',', '.').replace(' €', ''));
        return total + (price * item.quantity);
      }, 0);
      
      return {
        items: updatedItems,
        total: newTotal
      };

    case cartActions.REMOVE_ITEM:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const totalAfterRemove = filteredItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(',', '.').replace(' €', ''));
        return total + (price * item.quantity);
      }, 0);
      
      return {
        items: filteredItems,
        total: totalAfterRemove
      };

    case cartActions.UPDATE_QUANTITY:
      const updatedItemsQuantity = state.items.map(item =>
        item.id === action.payload.id 
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const totalAfterUpdate = updatedItemsQuantity.reduce((total, item) => {
        const price = parseFloat(item.price.replace(',', '.').replace(' €', ''));
        return total + (price * item.quantity);
      }, 0);
      
      return {
        items: updatedItemsQuantity,
        total: totalAfterUpdate
      };

    case cartActions.CLEAR_CART:
      return initialState;

    case cartActions.LOAD_CART:
      return action.payload || initialState;

    default:
      return state;
  }
};

// Contexte du panier
const CartContext = createContext();

// Provider du panier
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('charlieCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: cartActions.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('charlieCart', JSON.stringify(state));
  }, [state]);

  // Actions du panier
  const addItem = (item) => {
    dispatch({ type: cartActions.ADD_ITEM, payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: cartActions.REMOVE_ITEM, payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: cartActions.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: cartActions.CLEAR_CART });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook pour utiliser le contexte du panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};