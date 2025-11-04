from flask import Flask, request, jsonify
import joblib
import pandas as pd

# --- Load model as before ---
try:
    model = joblib.load('hybrid_maintenance_model_v2.pkl')
    scaler = joblib.load('scaler_v2.pkl')
    feature_names = joblib.load('features_v2.pkl')
    print("✅ Models and scaler loaded successfully.")
except FileNotFoundError as e:
    print(f"❌ Error loading .pkl file: {e}")
    exit()
except Exception as e:
    print(f"❌ An error occurred: {e}")
    exit()

app = Flask(__name__)

@app.route('/')
def home():
    return "ML Model API is running."

# --- 1️⃣ ADD ADMIN LOGIN ROUTE ---
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    admin_id = data.get('adminId')
    password = data.get('password')

    # Example login validation (replace with DB logic)
    if admin_id == "admin123" and password == "password123":
        return jsonify({
            "token": "fake-jwt-token-admin",
            "admin": {"id": admin_id, "name": "Admin User"}
        }), 200
    else:
        return jsonify({"message": "Invalid admin credentials"}), 401


# --- 2️⃣ ADD USER LOGIN ROUTE ---
@app.route('/api/auth/login', methods=['POST'])
def user_login():
    data = request.get_json()
    user_id = data.get('userId')
    password = data.get('password')

    if user_id == "user123" and password == "123456":
        return jsonify({
            "token": "fake-jwt-token-user",
            "user": {"id": user_id, "name": "Regular User"}
        }), 200
    else:
        return jsonify({"message": "Invalid user credentials"}), 401


# --- 3️⃣ EXISTING PREDICTION ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()
        input_df = pd.DataFrame([input_data], columns=feature_names)
        missing_cols = [col for col in feature_names if col not in input_df.columns]
        if missing_cols:
            return jsonify({'error': f'Missing features: {", ".join(missing_cols)}'}), 400
        scaled_data = scaler.transform(input_df)
        prediction = model.predict(scaled_data)
        return jsonify({'predicted_cost': prediction[0]})
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
