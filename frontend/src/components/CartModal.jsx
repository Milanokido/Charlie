import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from './CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState(''); // 'livraison', 'emporter', 'sur-place'
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // Calcul du total avec frais de livraison
  const deliveryFee = orderType === 'livraison' ? 5 : 0;
  const totalWithDelivery = parseFloat(total) + deliveryFee;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nom obligatoire
    if (!orderData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    // Téléphone valide français
    const phonePattern = /^(06|07)[0-9]{8}$/;
    if (!orderData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!phonePattern.test(orderData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format invalide (ex: 06XXXXXXXX)';
    }

    // Adresse obligatoire pour livraison
    if (orderType === 'livraison' && !orderData.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire pour la livraison';
    }

    // Type de commande obligatoire
    if (!orderType) {
      newErrors.orderType = 'Veuillez choisir un type de commande';
    }

    // Minimum de commande pour livraison
    if (orderType === 'livraison' && total < 15) {
      newErrors.minimum = `Minimum 15€ pour la livraison (actuellement ${total.toFixed(2)}€)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction utilitaire pour parser les prix correctement
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    // Remplacer virgule par point et supprimer tout sauf les chiffres et le point
    const cleanPrice = priceStr.toString().replace(',', '.').replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Fonction pour normaliser le téléphone
  const normalizePhone = (phone) => {
    return phone.replace(/[\s\-\.]/g, '');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les données pour Google Sheets avec types corrects
      const orderDetails = {
        token: "MOS123",
        typeCommande: orderType,
        nom: orderData.name.trim(),
        telephone: normalizePhone(orderData.phone),
        adresse: orderType === 'livraison' ? orderData.address.trim() : '',
        commentaire: orderData.comment.trim() || '',
        panier: items.map(item => ({
          id: item.id,
          name: item.name,
          qty: parseInt(item.quantity),
          price: parsePrice(item.price)
        })),
        total: parsePrice(total.toFixed(2)),
        fraisLivraison: orderType === 'livraison' ? 5 : 0,
        totalTTC: parsePrice(totalWithDelivery.toFixed(2)),
        timestamp: new Date().toISOString()
      };

      console.log('📊 Données envoyées à Google Sheets:', orderDetails);

      // Envoi vers Google Sheets avec headers corrects
      const response = await fetch('https://script.google.com/macros/s/AKfycbxGxmlIrWnB176ZM80q-VC_e5ktoq3yGY7QoH_5lbCcXocbHvuBByG9L-NOT1-S0HMM/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails)
      });

      // Vérifier la réponse
      const result = await response.json();
      console.log('📤 Réponse Google Sheets:', result);
      
      if (result.ok === true) {
        setOrderSubmitted(true);
        clearCart();
        
        // Fermer automatiquement après 4 secondes
        setTimeout(() => {
          setOrderSubmitted(false);
          setShowOrderForm(false);
          setOrderType('');
          setOrderData({ name: '', phone: '', address: '', comment: '' });
          onClose();
        }, 4000);
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi vers Google Sheets');
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la commande:', error);
      alert('Erreur lors de l\'envoi de la commande. Veuillez appeler le restaurant au 09 86 15 17 24.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Message de succès
  if (orderSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Merci pour votre commande !
          </h2>
          <p className="text-gray-600 mb-4">
            Votre commande a été transmise au restaurant Charlie Foods.
          </p>
          <div className="bg-[#E30613] text-white p-3 rounded-lg">
            <p className="font-medium">Vous serez contacté sous peu au :</p>
            <p className="text-lg font-bold">{orderData.phone}</p>
          </div>
        </div>
      </div>
    );
  }

  const getMenuNote = (categoryName) => {
    const menuCategories = ['🍔✨ Nos Gourmets', '🍔 Nos Burgers', '🥖 Nos Sandwichs Baguette', '🍽️ Assiettes', '🌯 Tacos'];
    if (menuCategories.some(cat => categoryName.includes(cat.replace(/🍔✨|🍔|🥖|🍽️|🌯/g, '').trim()))) {
      return ' (inclus: frites + boisson 33cl)';
    }
    return '';
  };

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
                      <h4 className="font-medium text-gray-800">
                        {item.name}
                        <span className="text-sm text-gray-500">
                          {getMenuNote(item.category)}
                        </span>
                      </h4>
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
                      
                      <span className="w-8 text-center font-medium bg-gray-100 rounded px-2 py-1">
                        {item.quantity}
                      </span>
                      
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
              {/* Type de commande */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de commande *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'livraison', label: '🚚 Livraison', extra: '+5€' },
                    { value: 'emporter', label: '🥡 À emporter', extra: '' },
                    { value: 'sur-place', label: '🍽️ Sur place', extra: '' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setOrderType(option.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        orderType === option.value 
                          ? 'border-[#E30613] bg-[#E30613] text-white' 
                          : 'border-gray-300 hover:border-[#E30613]'
                      }`}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      {option.extra && <div className="text-xs">{option.extra}</div>}
                    </button>
                  ))}
                </div>
                {errors.orderType && <p className="text-red-500 text-sm mt-1">{errors.orderType}</p>}
              </div>

              {/* Minimum de commande pour livraison */}
              {errors.minimum && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.minimum}</p>
                </div>
              )}

              {/* Informations client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={orderData.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613] ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone * (06XXXXXXXX ou 07XXXXXXXX)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  placeholder="06 12 34 56 78"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613] ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              {orderType === 'livraison' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison *
                  </label>
                  <textarea
                    name="address"
                    value={orderData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Adresse complète avec code postal et ville"
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-[#E30613] ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              )}
              
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Récapitulatif de votre commande</h4>
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1 text-gray-800">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium">{(parsePrice(item.price) * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <hr className="my-2 border-gray-300" />
                <div className="flex justify-between text-sm mb-1 text-gray-800">
                  <span>Sous-total</span>
                  <span className="font-medium">{total.toFixed(2)}€</span>
                </div>
                {orderType === 'livraison' && (
                  <div className="flex justify-between text-sm mb-1 text-gray-800">
                    <span>Frais de livraison</span>
                    <span className="font-medium">5.00€</span>
                  </div>
                )}
                <hr className="my-2 border-gray-400" />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-[#E30613]">{totalWithDelivery.toFixed(2)}€</span>
                </div>
                <p className="text-xs text-gray-700 mt-2">
                  💰 Paiement à la {orderType === 'livraison' ? 'livraison' : 'remise'}
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="border-t p-4">
          {!showOrderForm ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-gray-800">
                  Total: {total.toFixed(2)}€
                </div>
                <Button 
                  onClick={() => clearCart()}
                  variant="outline"
                  disabled={items.length === 0}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Vider le panier
                </Button>
              </div>
              <Button 
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-[#E30613] hover:bg-[#B8050F]"
                disabled={items.length === 0}
              >
                Commander ({total.toFixed(2)}€)
              </Button>
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
                {isSubmitting ? 'Envoi...' : `Confirmer (${totalWithDelivery.toFixed(2)}€)`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;