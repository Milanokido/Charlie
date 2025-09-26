// Manual test script to validate the customization features
// Run this in browser console to test the customization logic

console.log("=== Testing Customization Logic ===");

// Test 1: Tacos item detection
const tacosCategory = "🌯 Tacos";
const tacosItem = { name: "Tacos", price: "10,00 €" };

const isTacosCustomizable = (tacosCategory.includes('Tacos') || tacosCategory.includes('Sandwichs Baguette') || tacosCategory.includes('Frites') || (tacosCategory.includes('Tex Mex') && tacosItem.name.includes('Box')));

console.log("Tacos should be customizable:", isTacosCustomizable);

// Test 2: Frites item detection  
const fritesCategory = "🍟 Frites";
const fritesItem = { name: "Nature moyenne", price: "4,00 €" };

const isFritesCustomizable = (fritesCategory.includes('Tacos') || fritesCategory.includes('Sandwichs Baguette') || fritesCategory.includes('Frites') || (fritesCategory.includes('Tex Mex') && fritesItem.name.includes('Box')));

console.log("Frites should be customizable:", isFritesCustomizable);

// Test 3: Tex-Mex Box detection
const texMexCategory = "🌶️ Tex Mex";
const texMexBox = { name: "Box", price: "29,90 €" };

const isTexMexCustomizable = (texMexCategory.includes('Tacos') || texMexCategory.includes('Sandwichs Baguette') || texMexCategory.includes('Frites') || (texMexCategory.includes('Tex Mex') && texMexBox.name.includes('Box')));

console.log("Tex-Mex Box should be customizable:", isTexMexCustomizable);

console.log("=== Test Complete ===");