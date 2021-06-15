#!flask/bin/python
from flask import Flask, request, jsonify, make_response, has_request_context
from covid import Covid
from contextlib import closing
import requests
from requests.exceptions import HTTPError
from flask.logging import default_handler
from . import sort

app = Flask(__name__)
# set up caching config

# Get global Covid data using Covid from Pip3
@app.route("/locations/world")
def covid_get_data():
    # response = requests.get("https://disease.sh/v2/jhucsse")
    # return response.text

    covid = Covid()
    data = covid.get_data()
    return jsonify(data)
   # return jsonify(data)
    """
    except HTTPError as http_err:
        return jsonify(message='Error getting World Covid Data, Pip Covid API error', status=500),500

    except Exception as err:
        return jsonify(message='Error getting World Covid Data, Pip Covid API error', status=500),500
    """

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
