import React, { useEffect, useRef, useState } from 'react';
import { loadGooglePlacesAPI, GOOGLE_PLACES_CONFIG } from '../config/googlePlaces';

const AddressAutocomplete = ({ value, onChange, onAddressSelect, className, placeholder, disabled }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const initializeAutocomplete = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Vérifier que la clé API est configurée
        if (GOOGLE_PLACES_CONFIG.API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') {
          setError('Clé API Google Places non configurée');
          setIsLoading(false);
          return;
        }

        const google = await loadGooglePlacesAPI();
        
        if (!isMounted || !inputRef.current) return;

        // Créer l'instance d'autocomplétion
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: GOOGLE_PLACES_CONFIG.TYPES,
          componentRestrictions: { country: GOOGLE_PLACES_CONFIG.COUNTRY_RESTRICTION },
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(GOOGLE_PLACES_CONFIG.BOUNDS.south, GOOGLE_PLACES_CONFIG.BOUNDS.west),
            new google.maps.LatLng(GOOGLE_PLACES_CONFIG.BOUNDS.north, GOOGLE_PLACES_CONFIG.BOUNDS.east)
          ),
          strictBounds: true,
          fields: GOOGLE_PLACES_CONFIG.FIELDS
        });

        // Écouter la sélection d'une adresse
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (place && place.formatted_address) {
            const addressData = {
              formatted_address: place.formatted_address,
              geometry: place.geometry,
              address_components: place.address_components
            };
            
            // Appeler les callbacks
            onChange(place.formatted_address);
            if (onAddressSelect) {
              onAddressSelect(addressData);
            }
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement de Google Places:', err);
        setError('Erreur de chargement de l\'autocomplétion');
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      isMounted = false;
      // Nettoyer l'instance d'autocomplétion
      if (autocompleteRef.current) {
        try {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (err) {
          // Ignorer les erreurs de nettoyage
        }
      }
    };
  }, [onChange, onAddressSelect]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  // Si erreur de configuration, afficher un input normal
  if (error === 'Clé API Google Places non configurée') {
    return (
      <div>
        <textarea
          value={value}
          onChange={handleInputChange}
          className={className}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
        />
        <p className="text-xs text-amber-600 mt-1">
          ⚠️ Autocomplétion désactivée - Clé API Google Places requise
        </p>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        className={className}
        placeholder={isLoading ? 'Chargement de l\'autocomplétion...' : placeholder}
        disabled={disabled || isLoading}
      />
      {isLoading && (
        <p className="text-xs text-gray-500 mt-1">
          🔄 Chargement de l'autocomplétion d'adresse...
        </p>
      )}
      {error && error !== 'Clé API Google Places non configurée' && (
        <p className="text-xs text-red-500 mt-1">
          ❌ {error}
        </p>
      )}
      {!isLoading && !error && (
        <p className="text-xs text-green-600 mt-1">
          ✅ Autocomplétion d'adresse activée (France)
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;