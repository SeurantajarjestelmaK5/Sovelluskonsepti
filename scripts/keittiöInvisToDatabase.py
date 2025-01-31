import pandas as pd
import json
import firebase_admin
from firebase_admin import credentials, firestore
import os



file_path = "invis_keittiö_2025.xlsx"
# REQUIRES PRIVATE KEY FROM FIREBASE TO WORK
service_account_path = "serviceAccountKey.json"

cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

def parse_kitchen_inventory(file_path):
    excel_data = pd.ExcelFile(file_path)
    df = excel_data.parse("Taul1", skiprows=2, nrows=154)  # Skip metadata rows

    print("Columns in the dataframe:", df.columns)

    all_items = []
    current_category = None

    # Iterate through each row
    for _, row in df.iterrows():
        name = row[0]  # Item name in the first column
        category_row = row[1]
        unit_price = row[3]  # Unit price in the fourth column if it's an item row
        quantity = row[4]  # Quantity in the fifth column
        total_price : int = row[5]  # Total price in the sixth column

        if not pd.isna(category_row) and not pd.isna(name):
            current_category = name.strip()
        
        elif not pd.isna(name) and not pd.isna(quantity):
            if ',' in name:
                name, yksikko = [part.strip() for part in name.split(',', 1)]
            else:
                yksikko = ""  
            alv = 25.5 if current_category == "Muut" else 14  # Set ALV based on category
            
            alv0_price = unit_price / (1 + alv / 100) if unit_price else 0


            total_price_rounded = round(total_price, 2)

            # Create item dictionary
            item = {
                "Nimi": name,
                "Määrä": quantity,
                "Yksikkö": yksikko,
                "Kategoria": current_category,
                "Alv": alv,
                "Hinta": unit_price,
                "Yhteishinta": total_price_rounded,
                "Alv0": round(alv0_price, 2)  # Round to 2 decimal places
            }
            all_items.append(item)

    return all_items

def push_data_to_firebase(data):
    # Push each item to Firebase
    for item in data:
        try:

            location = "keittiö"
            selected_date = "01-2025"
            doc_ref = db.collection("inventaario").document(selected_date).collection(location).document(item["Nimi"])

            # Upload item to Firestore
            doc_ref.set(item)
        except Exception as e:
            print(f"Failed to upload item {item['Nimi']}: {e}")

# Main execution
if __name__ == "__main__":
    # Parse the Excel data
    parsed_data = parse_kitchen_inventory(file_path)
    
    # Log the parsed data instead of pushing to Firebase
    push_data_to_firebase(parsed_data)

