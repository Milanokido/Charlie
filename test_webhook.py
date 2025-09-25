#!/usr/bin/env python3
"""
Test script for Charlie Foods checkout webhook integration
"""

import requests
import json

def test_webhook():
    """Test the Google Sheets webhook with sample data"""
    
    webhook_url = "https://script.google.com/macros/s/AKfycby_29hihc8W__dXRn7iclaud0Jk9D1-JwT4NHdJ18nKcbOU5l1Uf27hYXNsKRATP2pD/exec"
    
    # Sample payload as specified in requirements
    test_payload = {
        "token": "MOS123",
        "typeCommande": "livraison",
        "nom": "Jean Dupont",
        "telephone": "0612345678",
        "adresse": "12 rue de Paris",
        "codePostal": "91400",
        "ville": "Orsay",
        "commentaire": "Sonner 2 fois",
        "panier": [
            {"name": "Pizza Margherita", "qty": 2, "price": 9.90, "options": {"taille": "M", "extra": "Olives"}},
            {"name": "Coca 33cl", "qty": 1, "price": 2.50}
        ],
        "total": 22.30,
        "fraisLivraison": 5
    }
    
    print("🔄 Testing Charlie Foods webhook...")
    print(f"URL: {webhook_url}")
    print(f"Payload: {json.dumps(test_payload, indent=2)}")
    
    try:
        response = requests.post(
            webhook_url,
            headers={'Content-Type': 'application/json'},
            json=test_payload,
            timeout=30,
            allow_redirects=True
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Content: {response.text}")
        
        # Try to parse as JSON
        try:
            json_response = response.json()
            print(f"JSON Response: {json.dumps(json_response, indent=2)}")
            
            if json_response.get('ok') == True:
                print("✅ Webhook test successful!")
                print(f"Order ID: {json_response.get('order_id')}")
                print(f"Message: {json_response.get('message')}")
                return True
            else:
                print("❌ Webhook returned error")
                return False
                
        except json.JSONDecodeError:
            print("⚠️  Response is not valid JSON")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_webhook()