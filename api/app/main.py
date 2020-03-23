#!flask/bin/python

from flask import Flask, request, jsonify
from covid import Covid
import requests
import json
app = Flask(__name__)

@app.route("/covid", methods=["GET"])
def covid_get_data():
    # Get global Covid data using Covid Pip
    covid = Covid()
    return jsonify(covid.get_data())

@app.route("/covidUnitedStates", methods=["GET"])
def covid_get_united_states_data():
    r = requests.get('http://covidtracking.com/api/states')
    return r.text

@app.route("/testData", methods=["GET"])
def covid_get_testData():
    # testData for offline dev
    return jsonify(testData)

@app.route("/", methods=["GET"])
def flask_is_up():
    return "OK"


if __name__ == "__main__":
    app.run(host="http://0.0.0.0:5000/", DEBUG=True)
