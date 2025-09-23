import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from './CartContext';
import { sendOrderByEmail, saveOrderLocally } from '../services/emailService';

const CartModal = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Préparer les données de commande
      const orderDetails = {
        items: items,
        total: total.toFixed(2),
        customer: orderData,
        timestamp: new Date().toLocaleString('fr-FR'),
        orderNumber: Date.now().toString().slice(-6)
      };

      // Sauvegarder localement (backup)
      saveOrderLocally(orderDetails);
      
      // Envoyer par email
      const emailResult = await sendOrderByEmail(orderDetails);
      
      if (emailResult.success) {
        setOrderSubmitted(true);
        clearCart();
        
        // Fermer automatiquement après 3 secondes
        setTimeout(() => {
          setOrderSubmitted(false);
          setShowOrderForm(false);
          onClose();
        }, 3000);
      } else {
        throw new Error(emailResult.message);
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la commande:', error);
      alert('Erreur lors de l\'envoi de la commande. Elle a été sauvegardée localement. Veuillez appeler le restaurant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande envoyée !</h2>
          <p className="text-gray-600">
            Votre commande a été transmise au restaurant. 
            Vous serez contacté pour confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="mr-2" />
            {showOrderForm ? 'Finaliser la commande' : 'Mon Panier'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showOrderForm ? (
          // Vue du panier
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                      <p className="text-[#E30613] font-bold">{item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-600 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Formulaire de commande
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={orderData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse de livraison *
                </label>
                <textarea
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire (optionnel)
                </label>
                <textarea
                  name="comment"
                  value={orderData.comment}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613]"
                  placeholder="Instructions spéciales, étage, code d'accès..."
                />
              </div>

              {/* Récapitulatif */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Récapitulatif</h4>
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{(parseFloat(item.price.replace(',', '.').replace(' €', '')) * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Paiement à la livraison • Frais de livraison : 5€
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="border-t p-4">
          {!showOrderForm ? (
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold text-gray-800">
                Total: {total.toFixed(2)}€
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => clearCart()}
                  variant="outline"
                  disabled={items.length === 0}
                >
                  Vider le panier
                </Button>
                <Button 
                  onClick={() => setShowOrderForm(true)}
                  className="bg-[#E30613] hover:bg-[#B8050F]"
                  disabled={items.length === 0}
                >
                  Commander ({total.toFixed(2)}€)
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button 
                type="button"
                onClick={() => setShowOrderForm(false)}
                variant="outline"
                className="flex-1"
              >
                Retour au panier
              </Button>
              <Button 
                type="submit"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="bg-[#E30613] hover:bg-[#B8050F] flex-1"
              >
                {isSubmitting ? 'Envoi...' : `Confirmer la commande (${total.toFixed(2)}€)`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;