from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
model = load_model("baccarat_model.h5")

@app.route("/")
def home():
    return "BPC AI API RUNNING"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.jsons

    player = data["player"]
    banker = data["banker"]

    X = np.array([player + banker])

    pred = model.predict(X)
    result = int(np.argmax(pred))

    mapping = {
        0: "莊",
        1: "閒",
        2: "和"
    }

    return jsonify({
        "prediction": mapping[result],
        "confidence": float(np.max(pred))
    })
