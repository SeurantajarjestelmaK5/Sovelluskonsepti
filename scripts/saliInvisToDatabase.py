import pandas as pd
import json
import firebase_admin
from firebase_admin import credentials, firestore
import os



excel_file_path = "invis_sali.xlsx"
# REQUIRES PRIVATE KEY FROM FIREBASE TO WORK
service_account_path = "serviceAccountKey.json"

cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

def parse_excel_to_data(file_path):
    excel_data = pd.ExcelFile(file_path)
    all_items = []
    current_category = None


    df = excel_data.parse(excel_data.sheet_names[0], skiprows=3, nrows=109)


    for _, row in df.iterrows():
        name = row[0]  
        unit_price = row[3]  
        quantity = row[4]  
        total_price = row[5]  

        # If "name" is present but "quantity" is NaN, it's a new category
        if pd.isna(total_price) and not pd.isna(name):
            current_category = name.strip()
            
        # Otherwise, it’s an item under the current category
        elif not pd.isna(name) and not pd.isna(quantity):
            alv = 14 if current_category == "ALV14" else 25.5  # Set ALV based on category

            item = {
                "Nimi": name,
                "Määrä": quantity,
                "Yksikkö": "",  # Leave as an empty string
                "Kategoria": current_category,
                "Alv": alv,
                "Hinta": unit_price,
                "Yhteishinta": total_price,
            }
            all_items.append(item)

    return all_items

def push_data_to_firebase(data):
    # Push each item to Firebase
    for item in data:
        try:

            location = "sali"
            selected_date = "10-2024"
            doc_ref = db.collection("inventaario").document(selected_date).collection(location).document(item["Nimi"])

            # Upload item to Firestore
            doc_ref.set(item)
        except Exception as e:
            print(f"Failed to upload item {item['Nimi']}: {e}")

# Main execution
if __name__ == "__main__":
    # Parse the Excel data
    parsed_data = parse_excel_to_data(excel_file_path)
    
    # Log the parsed data instead of pushing to Firebase
    push_data_to_firebase(parsed_data)
