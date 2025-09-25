#!/usr/bin/env python3
"""
Test the webhook using form-urlencoded method like the frontend will now use
"""

import requests
import json

def test_form_webhook():
    """Test with form-urlencoded to match frontend approach"""
    
    webhook_url = "https://script.google.com/macros/s/AKfycby_29hihc8W__dXRn7iclaud0Jk9D1-JwT4NHdJ18nKcbOU5l1Uf27hYXNsKRATP2pD/exec"
    
    # Test payload
    test_payload = {
        "token": "MOS123",
        "typeCommande": "livraison",
        "nom": "Frontend Form Test",
        "telephone": "0612345678",
        "adresse": "123 rue Frontend",
        "codePostal": "75001",
        "ville": "Paris",
        "commentaire": "Test from form method",
        "panier": [
            {"name": "Le Bacon", "qty": 1, "price": 12.0, "options": {}},
            {"name": "Fish", "qty": 1, "price": 7.0, "options": {}}
        ],
        "total": 19.0,
        "fraisLivraison": 5
    }
    
    print("🔄 Testing form-urlencoded method...")
    
    try:
        # Test form-urlencoded like frontend will do
        response = requests.post(
            webhook_url,
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
                print("✅ Form-urlencoded webhook successful!")
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
    test_form_webhook()
