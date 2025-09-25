import emailjs from 'emailjs-com';

// Configuration EmailJS (vous devrez remplacer par vos vraies clés)
const EMAIL_SERVICE_ID = 'service_charlie_foods';
const EMAIL_TEMPLATE_ID = 'template_commande';
const EMAIL_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

// Initialiser EmailJS
emailjs.init(EMAIL_PUBLIC_KEY);

/**
 * Formate une commande en HTML pour l'email
 */
const formatOrderForEmail = (orderData) => {
  const { items, total, customer, timestamp, orderNumber } = orderData;
  
  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 8px;">${item.name}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">${item.price}</td>
      <td style="padding: 8px; text-align: right;">
        ${(() => {
          const cleanPrice = item.price.toString().replace(',', '.').replace(/[^\d.]/g, '');
          const price = parseFloat(cleanPrice) || 0;
          return (price * item.quantity).toFixed(2);
        })()}€
      </td>
    </tr>
  `).join('');

  return {
    order_number: orderNumber,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_address: customer.address,
    customer_comment: customer.comment || 'Aucun commentaire',
    order_items: itemsHtml,
    order_total: total,
    order_date: timestamp,
    order_summary: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E30613; text-align: center;">🍔 Nouvelle Commande Charlie Foods</h2>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">📋 Informations Client</h3>
          <p><strong>Nom :</strong> ${customer.name}</p>
          <p><strong>Téléphone :</strong> ${customer.phone}</p>
          <p><strong>Adresse :</strong> ${customer.address}</p>
          <p><strong>Commentaire :</strong> ${customer.comment || 'Aucun commentaire'}</p>
        </div>

        <div style="background: white; padding: 15px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">🛒 Détails de la Commande</h3>
          <p><strong>Numéro :</strong> #${orderNumber}</p>
          <p><strong>Date :</strong> ${timestamp}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #E30613; color: white;">
                <th style="padding: 10px; text-align: left;">Article</th>
                <th style="padding: 10px; text-align: center;">Qté</th>
                <th style="padding: 10px; text-align: center;">Prix Unit.</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f8f9fa; font-weight: bold;">
                <td colspan="3" style="padding: 10px; text-align: right;">TOTAL :</td>
                <td style="padding: 10px; text-align: right; color: #E30613;">${total}€</td>
              </tr>
              <tr style="background: #fff3cd;">
                <td colspan="4" style="padding: 10px; text-align: center; font-style: italic;">
                  💰 Paiement à la livraison + 5€ de frais de livraison
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="text-align: center; margin: 20px 0; padding: 15px; background: #d4edda; border-radius: 8px;">
          <p style="margin: 0; color: #155724;">
            📞 <strong>Contactez le client au ${customer.phone} pour confirmer la commande</strong>
          </p>
        </div>
      </div>
    `
  };
};

/**
 * Envoie la commande par email
 */
export const sendOrderByEmail = async (orderData) => {
  try {
    const emailData = formatOrderForEmail(orderData);
    
    // Pour l'instant, on simule l'envoi (vous devrez configurer EmailJS)
    console.log('📧 Commande formatée pour envoi:', emailData);
    
    // Décommentez ces lignes quand EmailJS sera configuré
    /*
    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      emailData
    );
    
    if (response.status === 200) {
      return { success: true, message: 'Commande envoyée par email avec succès' };
    }
    */
    
    // Simulation réussie pour le moment
    return { 
      success: true, 
      message: 'Commande enregistrée (simulation email)' 
    };
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { 
      success: false, 
      message: 'Erreur lors de l\'envoi de la commande' 
    };
  }
};

/**
 * Sauvegarde la commande dans le localStorage (backup)
 */
export const saveOrderLocally = (orderData) => {
  try {
    const orders = JSON.parse(localStorage.getItem('charlieOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('charlieOrders', JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde locale:', error);
    return false;
  }
};

/**
 * Récupère toutes les commandes sauvegardées
 */
export const getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('charlieOrders') || '[]');
  } catch (error) {
    console.error('Erreur lecture commandes:', error);
    return [];
  }
};