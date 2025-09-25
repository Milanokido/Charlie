#!/usr/bin/env python3
"""
Direct test of the webhook with the exact payload structure expected
"""

import requests
import json

def test_webhook_direct():
    """Test the Google Sheets webhook with exact structure"""
    
    webhook_url = "https://script.google.com/macros/s/AKfycby_29hihc8W__dXRn7iclaud0Jk9D1-JwT4NHdJ18nKcbOU5l1Uf27hYXNsKRATP2pD/exec"
    
    # Test payload exactly as frontend sends it
    test_payload = {
        "token": "MOS123",
        "typeCommande": "livraison",
        "nom": "Test Frontend User",
        "telephone": "0612345678",
        "adresse": "123 rue Test",
        "codePostal": "75001",
        "ville": "Paris",
        "commentaire": "Test order from debugging",
        "panier": [
            {"name": "Le Bacon", "qty": 2, "price": 12.0, "options": {}},
            {"name": "Chèvre Burger", "qty": 1, "price": 12.0, "options": {}}
        ],
        "total": 36.0,
        "fraisLivraison": 5
    }
    
    print("🔄 Testing webhook with JSON...")
    print(f"URL: {webhook_url}")
    print(f"Payload: {json.dumps(test_payload, indent=2)}")
    
    try:
        # Test JSON first
        response = requests.post(
            webhook_url,
            headers={'Content-Type': 'application/json'},
            json=test_payload,
            timeout=30,
            allow_redirects=True
        )
        
        print(f"\n📊 JSON Response:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        response_text = response.text
        print(f"Raw Text: {response_text[:500]}...")
        
        try:
            json_response = response.json()
            print(f"Parsed JSON: {json.dumps(json_response, indent=2)}")
            
            if json_response.get('ok') == True:
                print("✅ JSON webhook successful!")
                return True
        except json.JSONDecodeError:
            print("⚠️ Response is not JSON, trying form fallback...")
        
        # Test form-urlencoded fallback
        print(f"\n🔄 Testing webhook with form-urlencoded...")
        form_response = requests.post(
            webhook_url,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data={'payload': json.dumps(test_payload)},
            timeout=30,
            allow_redirects=True
        )
        
        print(f"📊 Form Response:")
        print(f"Status Code: {form_response.status_code}")
        form_text = form_response.text
        print(f"Raw Text: {form_text[:500]}...")
        
        try:
            form_json = form_response.json()
            print(f"Parsed JSON: {json.dumps(form_json, indent=2)}")
            
            if form_json.get('ok') == True:
                print("✅ Form webhook successful!")
                return True
        except json.JSONDecodeError:
            print("❌ Form response also not JSON")
        
        return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_webhook_direct()