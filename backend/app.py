from flask import Flask, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OPENWEATHER_API_KEY")
CITY = "Chennai"


@app.route("/")
def home():
    return jsonify({"message": "Weather API is running"})


@app.route("/weather")
def weather():

    url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()

    # Handle API errors
    if response.status_code != 200:
        return jsonify({
            "error": data.get("message", "Unable to fetch weather data")
        }), response.status_code

    return jsonify({
        "city": CITY,
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
