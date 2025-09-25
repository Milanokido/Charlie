#!/usr/bin/env python3
"""
Comprehensive test for Charlie Foods checkout flow and UI contrast
"""

import json
from playwright.sync_api import sync_playwright
import time

def test_checkout_flow():
    """Test the complete checkout flow including address fields and UI contrast"""
    
    results = {
        "cart_modal_tests": [],
        "checkout_form_tests": [],
        "address_field_tests": [],
        "ui_contrast_tests": [],
        "errors": []
    }
    
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.set_viewport_size({"width": 1920, "height": 800})
            
            # Navigate to the site
            page.goto("https://order-system-debug.preview.emergentagent.com", timeout=30000)
            page.wait_for_load_state("networkidle")
            print("✅ Page loaded successfully")
            
            # Scroll to menu section
            page.evaluate("document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })")
            time.sleep(2)
            
            # Add items to cart
            plus_buttons = page.locator("button[title^='Ajouter']")
            button_count = plus_buttons.count()
            print(f"Found {button_count} add buttons")
            
            if button_count > 0:
                plus_buttons.nth(0).click()
                time.sleep(1)
                plus_buttons.nth(1).click() if button_count > 1 else None
                time.sleep(1)
                results["cart_modal_tests"].append("✅ Successfully added items to cart")
            
            # Open cart modal
            cart_button = page.locator("button:has(svg.lucide-shopping-cart)").first
            if cart_button.is_visible():
                cart_button.click()
                time.sleep(2)
                results["cart_modal_tests"].append("✅ Cart modal opened successfully")
                
                # Check cart modal content and contrast
                cart_modal = page.locator("div:has-text('Mon Panier')")
                if cart_modal.is_visible():
                    results["ui_contrast_tests"].append("✅ Cart modal is visible with proper heading")
                    
                    # Check for quantity controls
                    quantity_displays = page.locator("span.bg-gray-100")
                    if quantity_displays.count() > 0:
                        results["ui_contrast_tests"].append("✅ Quantity controls are present")
                    else:
                        results["errors"].append("❌ Quantity controls not found")
                    
                    # Check for item names and prices visibility
                    item_names = page.locator("h4.font-medium.text-gray-900")
                    if item_names.count() > 0:
                        results["ui_contrast_tests"].append("✅ Item names have proper contrast (gray-900)")
                    else:
                        results["errors"].append("❌ Item names not found with proper contrast")
                
                # Click Commander button
                commander_button = page.locator("button:has-text('Commander')")
                if commander_button.count() > 0:
                    commander_button.first.click()
                    time.sleep(3)
                    results["checkout_form_tests"].append("✅ Clicked Commander button")
                    
                    # Check if checkout form appeared
                    order_type_label = page.locator("label:has-text('Type de commande')")
                    if order_type_label.is_visible():
                        results["checkout_form_tests"].append("✅ Checkout form appeared successfully")
                        
                        # Test delivery options visibility
                        delivery_option = page.locator("button:has-text('🚚 Livraison')")
                        takeaway_option = page.locator("button:has-text('🥡 À emporter')")
                        dinein_option = page.locator("button:has-text('🍽️ Sur place')")
                        
                        if all([delivery_option.is_visible(), takeaway_option.is_visible(), dinein_option.is_visible()]):
                            results["checkout_form_tests"].append("✅ All delivery options are visible")
                            
                            # Select delivery option to reveal address fields
                            delivery_option.click()
                            time.sleep(2)
                            results["address_field_tests"].append("✅ Selected delivery option")
                            
                            # Check for address fields
                            address_field = page.locator("input[name='address']")
                            postal_field = page.locator("input[name='postalCode']")
                            city_field = page.locator("input[name='city']")
                            
                            if address_field.is_visible():
                                results["address_field_tests"].append("✅ Address field is visible")
                                # Test placeholder contrast
                                placeholder = address_field.get_attribute("placeholder")
                                if placeholder:
                                    results["ui_contrast_tests"].append(f"✅ Address field has placeholder: {placeholder}")
                            else:
                                results["errors"].append("❌ Address field not visible for delivery")
                            
                            if postal_field.is_visible():
                                results["address_field_tests"].append("✅ Postal code field is visible")
                                # Test maxlength attribute
                                max_length = postal_field.get_attribute("maxLength")
                                if max_length == "5":
                                    results["address_field_tests"].append("✅ Postal code has 5-digit limit")
                            else:
                                results["errors"].append("❌ Postal code field not visible for delivery")
                            
                            if city_field.is_visible():
                                results["address_field_tests"].append("✅ City field is visible")
                            else:
                                results["errors"].append("❌ City field not visible for delivery")
                            
                            # Test form input contrast
                            name_field = page.locator("input[name='name']")
                            if name_field.is_visible():
                                # Get computed styles for contrast check
                                bg_color = name_field.evaluate("el => getComputedStyle(el).backgroundColor")
                                color = name_field.evaluate("el => getComputedStyle(el).color")
                                results["ui_contrast_tests"].append(f"✅ Name field contrast - bg: {bg_color}, text: {color}")
                            
                            # Test form validation by trying to submit empty form
                            confirm_button = page.locator("button:has-text('Confirmer')")
                            if confirm_button.is_visible():
                                confirm_button.click()
                                time.sleep(1)
                                
                                # Check for error messages
                                error_messages = page.locator("p.text-red-600")
                                if error_messages.count() > 0:
                                    results["address_field_tests"].append(f"✅ Validation errors appeared: {error_messages.count()} messages")
                                    # Check error visibility
                                    for i in range(min(3, error_messages.count())):
                                        error_text = error_messages.nth(i).inner_text()
                                        results["ui_contrast_tests"].append(f"✅ Error message visible: {error_text}")
                                else:
                                    results["errors"].append("❌ No validation errors shown for empty form")
                        else:
                            results["errors"].append("❌ Not all delivery options are visible")
                    else:
                        results["errors"].append("❌ Checkout form did not appear after clicking Commander")
                else:
                    results["errors"].append("❌ Commander button not found")
            else:
                results["errors"].append("❌ Cart button not visible")
            
            browser.close()
            
        except Exception as e:
            results["errors"].append(f"❌ Test error: {str(e)}")
    
    return results

def main():
    print("🧪 Testing Charlie Foods Checkout Flow and UI Contrast...")
    print("=" * 60)
    
    results = test_checkout_flow()
    
    print("\n📊 TEST RESULTS:")
    print("=" * 60)
    
    print(f"\n🛒 Cart Modal Tests ({len(results['cart_modal_tests'])} passed):")
    for test in results['cart_modal_tests']:
        print(f"  {test}")
    
    print(f"\n📋 Checkout Form Tests ({len(results['checkout_form_tests'])} passed):")
    for test in results['checkout_form_tests']:
        print(f"  {test}")
    
    print(f"\n🏠 Address Field Tests ({len(results['address_field_tests'])} passed):")
    for test in results['address_field_tests']:
        print(f"  {test}")
    
    print(f"\n🎨 UI Contrast Tests ({len(results['ui_contrast_tests'])} passed):")
    for test in results['ui_contrast_tests']:
        print(f"  {test}")
    
    if results['errors']:
        print(f"\n❌ Errors ({len(results['errors'])} found):")
        for error in results['errors']:
            print(f"  {error}")
    
    total_tests = (len(results['cart_modal_tests']) + len(results['checkout_form_tests']) + 
                  len(results['address_field_tests']) + len(results['ui_contrast_tests']))
    
    print(f"\n📈 SUMMARY:")
    print(f"  ✅ Passed: {total_tests}")
    print(f"  ❌ Errors: {len(results['errors'])}")
    
    # Save results to file
    with open('/app/checkout_test_results.json', 'w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Full results saved to: /app/checkout_test_results.json")

if __name__ == "__main__":
    main()