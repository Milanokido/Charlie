#!/usr/bin/env python3
"""
Test the new webhook endpoint for Bowls orders
"""

import requests
import json

def test_new_webhook():
    """Test the new Google Sheets webhook endpoint"""
    
    new_webhook_url = "https://script.google.com/macros/s/AKfycbzQjUSqw6MD9CUyPcpidnR43oAa9zarwO2AMVA829srp164Qu90VQaxmS3qXPDJtdC-/exec"
    
    # Test payload with Bowls data
    test_payload = {
        "token": "MOS123",
        "typeCommande": "emporter",
        "nom": "Test Bowl User",
        "telephone": "0612345678",
        "adresse": "",
        "codePostal": "",
        "ville": "",
        "commentaire": "Test Bowl order",
        "panier": [
            {
                "name": "Bowl", 
                "qty": 1, 
                "price": 10.90, 
                "options": {
                    "meats": ["Kebab", "Escalope"],
                    "sauce_fromagere": "incluse",
                    "sauces": ["Algérienne", "Barbecue"],
                    "boisson": "incluse",
                    "optionsText": "Viandes: Kebab, Escalope (+1 €) • Sauce fromagère incluse • Sauces: Algérienne, Barbecue • Boisson incluse"
                }
            }
        ],
        "total": 10.90,
        "fraisLivraison": 0
    }
    
    print("🔄 Testing new webhook endpoint...")
    print(f"URL: {new_webhook_url}")
    
    try:
        # Test form-urlencoded
        response = requests.post(
            new_webhook_url,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data={'payload': json.dumps(test_payload)},
            timeout=30,
            allow_redirects=True
        )
        
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        response_text = response.text
        print(f"Raw response: {response_text}")
        
        try:
            result = response.json()
            print(f"JSON response: {json.dumps(result, indent=2)}")
            
            if result.get('ok') == True:
                print("✅ New webhook endpoint working!")
                print(f"Order ID: {result.get('order_id')}")
                return True
            else:
                print(f"❌ Webhook returned error: {result}")
                return False
                
        except json.JSONDecodeError:
            print(f"❌ Response not JSON: {response_text}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_new_webhook()
