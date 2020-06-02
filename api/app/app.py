#!flask/bin/python
from flask import Flask, request, jsonify, make_response, has_request_context
from flask_caching import Cache
from covid import Covid
from contextlib import closing
import requests
from requests.exceptions import HTTPError
from flask.logging import default_handler
from flask_caching import Cache
from . import sort

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "simple", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 3000
}
app = Flask(__name__)
# set up caching config
app.config.from_mapping(config)
cache = Cache(app)

# Get global Covid data using Covid from Pip3
@app.route("/locations/world", methods=["GET"])
def covid_get_data():
    try:
        covid = Covid()
        return jsonify(covid.get_data())

    except HTTPError as http_err:
        return jsonify(message='Error getting World Covid Data, Pip Covid API error', status=500),500

    except Exception as err:
        return jsonify(message='Error getting World Covid Data, Pip Covid API error', status=500),500

@app.route("/locations/us", methods=["GET"])
def covid_get_united_states_data():
    try:
        response = requests.get("http://covidtracking.com/api/states")
        return response.text

    except HTTPError as http_err:
        return jsonify(message='Error getting World Covid Data, CovidTracking.com API error', status=500),500

    except Exception as err:
        return jsonify(message='Error getting World Covid Data, CovidTracking.com API error', status=500),500

@app.route("/locations/uscounties", methods=["GET"])
def covid_get_united_states_counties_data():
    try:
        response = requests.get("https://disease.sh/v2/jhucsse/counties")
        return response.text

    except HTTPError as http_err:
        return jsonify(message='Error getting World Covid Data, https://disease.sh API error', status=500),500

    except Exception as err:
        return jsonify(message='Error getting World Covid Data, https://disease.sh API error', status=500),500

@app.route("/testData", methods=["GET"])
def covid_get_testData():
    return jsonify(testData)

@app.route("/", methods=["GET"])
def flask_is_up():
    return "OK"

if __name__ == "__main__":

    app.run(host="http://0.0.0.0:5000/")
