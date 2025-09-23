import React, { useState, useEffect } from 'react';
import { getLocalOrders } from '../services/emailService';
import { Eye, Phone, MapPin, Clock, Package } from 'lucide-react';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const localOrders = getLocalOrders();
    setOrders(localOrders.reverse()); // Plus récentes en premier
  };

  const formatPrice = (price) => {
    return typeof price === 'string' ? price : `${price}€`;
  };

  if (selectedOrder) {
    return (
      <div className="orders-admin max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Commande #{selectedOrder.orderNumber}
            </h2>
            <button 
              onClick={() => setSelectedOrder(null)}
              className="px-4 py-2 text-[#E30613] border border-[#E30613] rounded hover:bg-[#E30613] hover:text-white"
            >
              Retour à la liste
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Informations client */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#E30613]" />
                Informations Client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Nom :</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Téléphone :</strong> 
                    <a href={`tel:${selectedOrder.customer.phone}`} className="text-[#E30613] ml-1">
                      {selectedOrder.customer.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <p><strong>Adresse :</strong></p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.address}</p>
                </div>
              </div>
              {selectedOrder.customer.comment && (
                <div className="mt-3">
                  <p><strong>Commentaire :</strong></p>
                  <p className="text-sm text-gray-600 italic">{selectedOrder.customer.comment}</p>
                </div>
              )}
            </div>

            {/* Détails commande */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Package className="mr-2 h-5 w-5 text-[#E30613]" />
                Détails de la Commande
              </h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#E30613] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Article</th>
                      <th className="px-4 py-3 text-center">Quantité</th>
                      <th className="px-4 py-3 text-right">Prix unitaire</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPrice(item.price)}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {(parseFloat(item.price.replace(',', '.').replace(' €', '')) * item.quantity).toFixed(2)}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-bold">Total :</td>
                      <td className="px-4 py-3 text-right font-bold text-[#E30613]">
                        {selectedOrder.total}€
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-600 italic">
                        Paiement à la livraison + 5€ de frais de livraison
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4 border-t">
              <a 
                href={`tel:${selectedOrder.customer.phone}`}
                className="flex-1 bg-[#E30613] text-white px-4 py-3 rounded-lg text-center hover:bg-[#B8050F] flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Appeler le client
              </a>
              <a 
                href={`https://maps.google.com?q=${encodeURIComponent(selectedOrder.customer.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border border-[#E30613] text-[#E30613] px-4 py-3 rounded-lg text-center hover:bg-[#E30613] hover:text-white flex items-center justify-center"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Voir sur la carte
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-admin max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              📋 Gestion des Commandes
            </h1>
            <button 
              onClick={loadOrders}
              className="px-4 py-2 bg-[#E30613] text-white rounded hover:bg-[#B8050F]"
            >
              Actualiser
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            {orders.length} commande(s) enregistrée(s)
          </p>
        </div>

        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Aucune commande enregistrée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-bold text-lg">
                            Commande #{order.orderNumber}
                          </h3>
                          <p className="text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {order.timestamp}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-gray-600">{order.customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-[#E30613]">{order.total}€</p>
                          <p className="text-sm text-gray-600">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="ml-4 px-4 py-2 bg-[#E30613] text-white rounded hover:bg-[#B8050F] flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;