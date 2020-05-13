#!flask/bin/python

from flask import Flask, request, jsonify, make_response, has_request_context
from covid import Covid
from contextlib import closing
import requests
from requests.exceptions import HTTPError
import csv
import json
from flask.logging import default_handler

app = Flask(__name__)

@app.route("/covid", methods=["GET"])
def covid_get_data():
    # Get global Covid data using Covid Pip
    covid = Covid()
    return jsonify(covid.get_data())

@app.route("/covidUnitedStates", methods=["GET"])
def covid_get_united_states_data():
    try:
        response = requests.get('http://covidtracking.com/api/states')

        return response.text
    except HTTPError as http_err:
        print('HTTP error occurred: ',http_err)
        return http_err
    except Exception as err:
        print('Other error occurred: ',err)
        return err

    return 'err'

@app.route("/covidUnitedStatesCounties", methods=["GET"])
def covid_get_united_states_counties_data():
    try:
        response = requests.get('https://disease.sh/v2/jhucsse/counties')
        # jsonResponse = response.json()
        print('counties response ', response.text)
        return response.text

    except HTTPError as http_err:
        print('HTTP error occurred: ',http_err)
        return http_err
    except Exception as err:
        print('Other error occurred: ',err)
        return err

    return 'err'

@app.route("/testData", methods=["GET"])
def covid_get_testData():
    # testData for offline dev
    return jsonify(testData)

@app.route("/", methods=["GET"])
def flask_is_up():
    return "OK"


if __name__ == "__main__":

    class RequestFormatter(logging.Formatter):
        def format(self, record):
            if has_request_context():
                record.url = request.url
                record.remote_addr = request.remote_addr
            else:
                record.url = None
                record.remote_addr = None

            return super().format(record)

    formatter = RequestFormatter(
        '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
        '%(levelname)s in %(module)s: %(message)s'
    )
    default_handler.setFormatter(formatter)

    app.run(host="http://0.0.0.0:5000/", DEBUG=True)
