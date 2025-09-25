/**
 * Configuration Google Places API
 * 
 * Instructions de configuration :
 * 1. Remplacez 'YOUR_GOOGLE_PLACES_API_KEY' par votre vraie clé API Google
 * 2. Dans Google Cloud Console, configurer les restrictions :
 *    - Referrer HTTP : https://order-system-debug.preview.emergentagent.com/*
 *    - APIs activées : Places API + Maps JavaScript API
 *    - Restriction géographique : France
 *    - Quotas recommandés : 10k requêtes/jour Places Autocomplete
 * 
 * Coût estimé : ~0.017€ par requête d'autocomplétion
 */

// Configuration de l'API Google Places
export const GOOGLE_PLACES_CONFIG = {
  // Remplacez cette clé par votre vraie clé API Google Places
  API_KEY: 'YOUR_GOOGLE_PLACES_API_KEY',
  
  // Restriction géographique à la France
  COUNTRY_RESTRICTION: 'fr',
  
  // Types de lieux pour l'autocomplétion (adresses)
  TYPES: ['address'],
  
  // Champs à récupérer (pour optimiser les coûts)
  FIELDS: ['formatted_address', 'geometry', 'address_components'],
  
  // Configuration pour la restriction géographique France
  BOUNDS: {
    north: 51.1241999,
    south: 41.3253002,
    east: 9.5625,
    west: -5.5591003
  }
};

// Fonction pour charger l'API Google Places
export const loadGooglePlacesAPI = () => {
  return new Promise((resolve, reject) => {
    // Vérifier si l'API est déjà chargée
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve(window.google);
      return;
    }

    // Créer le script pour charger l'API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_CONFIG.API_KEY}&libraries=places&region=${GOOGLE_PLACES_CONFIG.COUNTRY_RESTRICTION}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve(window.google);
      } else {
        reject(new Error('Google Places API failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Places API script'));
    };

    document.head.appendChild(script);
  });
};