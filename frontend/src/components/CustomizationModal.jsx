import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

const CustomizationModal = ({ isOpen, onClose, item, category, onAddToCart }) => {
  const [selectedMeats, setSelectedMeats] = useState([]);
  const [selectedCheeses, setSelectedCheeses] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedBacon, setSelectedBacon] = useState(false);
  const [selectedBoxOption, setSelectedBoxOption] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !item) return null;

  const isTacos = category?.name?.includes('Tacos');
  const isSandwich = category?.name?.includes('Sandwichs Baguette');
  const isFrites = category?.name?.includes('Frites');
  const isBowls = category?.name?.includes('Bowls');
  const isTexMex = category?.name?.includes('Tex Mex') && item?.name?.includes('Box');
  const needsCustomization = isTacos || isSandwich || isFrites || isBowls || isTexMex;

  // Available options for Bowls
  const bowlMeats = [
    'Kebab',
    'Escalope', 
    'Tenders',
    'Cordon bleu'
  ];
  const availableMeats = [
    'Kebab',
    'Escalope',
    'Tenders',
    'Nuggets', 
    'Steak',
    'Poulet pané',
    'Cordon bleu'
  ];

  const availableCheeses = [
    'Cheddar',
    'Raclette'
  ];

  const availableSauces = [
    'Mayo',
    'Ketchup', 
    'Harissa',
    'Samouraï',
    'Algérienne',
    'Biggy',
    'Blanche',
    'Poivre',
    'Chilli',
    'Barbecue'
  ];

  // Calculate price with options
  const calculatePrice = () => {
    const basePrice = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    let extraCost = 0;

    // Extra meat cost (second meat +1€)
    if (selectedMeats.length > 1) {
      extraCost += selectedMeats.length - 1;
    }

    // Cheese supplements (+1€ each)
    extraCost += selectedCheeses.length;

    // Bacon supplement for Frites (+1€)
    if (selectedBacon) {
      extraCost += 1;
    }

    return (basePrice + extraCost) * quantity;
  };

  // Handle meat selection (max 3 for Tacos)
  const handleMeatToggle = (meat) => {
    setSelectedMeats(prev => {
      if (prev.includes(meat)) {
        return prev.filter(m => m !== meat);
      } else if (prev.length < 3) {
        return [...prev, meat];
      } else {
        // Replace first meat if at max (3)
        return [prev[1], prev[2], meat];
      }
    });
  };

  // Handle cheese selection
  const handleCheeseToggle = (cheese) => {
    setSelectedCheeses(prev => {
      if (prev.includes(cheese)) {
        return prev.filter(c => c !== cheese);
      } else {
        return [...prev, cheese];
      }
    });
  };

  // Handle sauce selection (max 2)
  const handleSauceToggle = (sauce) => {
    setSelectedSauces(prev => {
      if (prev.includes(sauce)) {
        return prev.filter(s => s !== sauce);
      } else if (prev.length < 2) {
        return [...prev, sauce];
      } else {
        // Replace first sauce with new one if already at max
        return [prev[1], sauce];
      }
    });
  };

  // Validate form
  const isValidSelection = () => {
    if (isTacos && selectedMeats.length === 0) {
      return false;
    }
    if (isBowls && selectedMeats.length === 0) {
      return false;
    }
    if (isTexMex && !selectedBoxOption) {
      return false;
    }
    return true;
  };

  // Format options for display
  const formatOptionsText = () => {
    const parts = [];
    
    if (selectedMeats.length > 0) {
      if (isBowls) {
        // For Bowls: first meat included, extras +1€
        const meatText = selectedMeats.length > 1 
          ? `${selectedMeats[0]}, ${selectedMeats.slice(1).join(', ')} (+${selectedMeats.length - 1} €)`
          : selectedMeats[0];
        parts.push(`Viandes: ${meatText}`);
      } else {
        // For Tacos: second meat onwards +1€
        const meatText = selectedMeats.length > 1 
          ? `${selectedMeats[0]}, ${selectedMeats.slice(1).join(', ')} (+${selectedMeats.length - 1} €)`
          : selectedMeats[0];
        parts.push(`Viandes: ${meatText}`);
      }
    }

    if (selectedCheeses.length > 0) {
      const cheeseText = selectedCheeses.map(c => `${c} (+1 €)`).join(', ');
      parts.push(`Supplément: ${cheeseText}`);
    }

    if (isBowls) {
      parts.push('Sauce fromagère incluse');
    }

    if (selectedBacon) {
      parts.push('Supplément: Bacon (+1 €)');
    }

    if (selectedBoxOption) {
      parts.push(`Option: ${selectedBoxOption}`);
    }

    if (selectedSauces.length > 0) {
      parts.push(`Sauces: ${selectedSauces.join(', ')}`);
    }

    if (isBowls) {
      parts.push('Boisson incluse');
    }

    return parts.join(' • ');
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isValidSelection()) {
      if (isTacos) {
        alert('Veuillez sélectionner au moins une viande');
      } else if (isTexMex) {
        alert('Veuillez sélectionner une option de box');
      } else {
        alert('Sélection non valide');
      }
      return;
    }

    const optionsText = formatOptionsText();
    const totalPrice = calculatePrice();
    
    const customizedItem = {
      id: `${category.name}-${item.name}`.replace(/\s+/g, '-').toLowerCase() + `-${Date.now()}`,
      name: item.name,
      price: `${totalPrice.toFixed(2)} €`,
      description: item.description,
      category: category.name,
      quantity: quantity,
      options: {
        meats: selectedMeats,
        cheeses: selectedCheeses,
        sauces: selectedSauces,
        bacon: selectedBacon,
        boxOption: selectedBoxOption,
        sauce_fromagere: isBowls ? "incluse" : undefined,
        boisson: isBowls ? "incluse" : undefined,
        optionsText: optionsText
      }
    };

    // Add multiple items if quantity > 1
    for (let i = 0; i < quantity; i++) {
      onAddToCart({ ...customizedItem, quantity: 1 });
    }

    // Reset and close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedMeats([]);
    setSelectedCheeses([]);
    setSelectedSauces([]);
    setSelectedBacon(false);
    setSelectedBoxOption('');
    setQuantity(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Personnaliser {item.name}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Item Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            <p className="text-[#E30613] font-bold mt-2">Prix de base: {item.price}</p>
          </div>

          {needsCustomization && (
            <div className="space-y-6">
              {/* Meat Selection for Tacos */}
              {isTacos && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Choix des viandes * 
                    <span className="text-sm font-normal text-gray-600">
                      (Maximum 3 viandes • Viandes supplémentaires +1€ chacune)
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {availableMeats.map((meat) => (
                      <button
                        key={meat}
                        onClick={() => handleMeatToggle(meat)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          selectedMeats.includes(meat)
                            ? 'border-[#E30613] bg-[#E30613] text-white'
                            : 'border-gray-300 hover:border-[#E30613] text-gray-900'
                        } ${
                          selectedMeats.length >= 3 && !selectedMeats.includes(meat)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={selectedMeats.length >= 3 && !selectedMeats.includes(meat)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{meat}</span>
                          {selectedMeats.includes(meat) && selectedMeats.indexOf(meat) > 0 && (
                            <span className="text-sm font-bold">+1€</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedMeats.length === 0 && (
                    <p className="text-red-600 text-sm mt-2">Veuillez sélectionner au moins une viande</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    {selectedMeats.length}/3 viandes sélectionnées
                  </p>
                </div>
              )}

              {/* Cheese Supplements for Tacos */}
              {isTacos && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Suppléments fromage
                    <span className="text-sm font-normal text-gray-600">
                      (+1€ chacun)
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {availableCheeses.map((cheese) => (
                      <label
                        key={cheese}
                        className="flex items-center p-3 border rounded-lg hover:border-[#E30613] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCheeses.includes(cheese)}
                          onChange={() => handleCheeseToggle(cheese)}
                          className="mr-3 h-4 w-4 text-[#E30613] focus:ring-[#E30613] border-gray-300 rounded"
                        />
                        <span className="text-gray-900">{cheese}</span>
                        <span className="ml-auto text-sm text-gray-600">+1€</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Bacon Supplement for Frites */}
              {isFrites && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Supplément Bacon
                    <span className="text-sm font-normal text-gray-600">
                      (+1€)
                    </span>
                  </h4>
                  <label className="flex items-center p-3 border rounded-lg hover:border-[#E30613] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBacon}
                      onChange={() => setSelectedBacon(!selectedBacon)}
                      className="mr-3 h-4 w-4 text-[#E30613] focus:ring-[#E30613] border-gray-300 rounded"
                    />
                    <span className="text-gray-900">Bacon</span>
                    <span className="ml-auto text-sm text-gray-600">+1€</span>
                  </label>
                </div>
              )}

              {/* Box Choice for Tex-Mex */}
              {isTexMex && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Choix de votre Box *
                  </h4>
                  <div className="space-y-2">
                    {['20 Tenders', '30 Wings'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedBoxOption(option)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          selectedBoxOption === option
                            ? 'border-[#E30613] bg-[#E30613] text-white'
                            : 'border-gray-300 hover:border-[#E30613] text-gray-900'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {!selectedBoxOption && (
                    <p className="text-red-600 text-sm mt-2">Veuillez sélectionner une option de box</p>
                  )}
                </div>
              )}

              {/* Sauce Selection */}
              {(isTacos || isSandwich) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Choix des sauces
                    <span className="text-sm font-normal text-gray-600">
                      (Maximum 2 sauces • {selectedSauces.length}/2)
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSauces.map((sauce) => (
                      <label
                        key={sauce}
                        className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                          selectedSauces.includes(sauce)
                            ? 'border-[#E30613] bg-[#E30613] text-white'
                            : 'border-gray-300 hover:border-[#E30613] text-gray-900'
                        } ${
                          selectedSauces.length >= 2 && !selectedSauces.includes(sauce)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSauces.includes(sauce)}
                          onChange={() => handleSauceToggle(sauce)}
                          disabled={selectedSauces.length >= 2 && !selectedSauces.includes(sauce)}
                          className="sr-only"
                        />
                        <span className="text-sm">{sauce}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Options Summary */}
              {formatOptionsText() && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Votre sélection:</h4>
                  <p className="text-sm text-gray-700">[{formatOptionsText()}]</p>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Quantité</h4>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold text-lg text-gray-900 bg-white border border-gray-300 rounded px-2 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-[#E30613]">
                {calculatePrice().toFixed(2)}€ 
                {quantity > 1 && <span className="text-sm text-gray-600"> (pour {quantity})</span>}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!isValidSelection()}
              className="flex-1 bg-[#E30613] hover:bg-[#B8050F] text-white disabled:opacity-50"
            >
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;