#!flask/bin/python

from flask import Flask, request, jsonify
from covid import Covid

app = Flask(__name__)


@app.route("/covid", methods=["GET"])
def covid_get_data():
    covid = Covid()
    print(jsonify(covid.get_data()))
    return jsonify(covid.get_data())


@app.route("/testData", methods=["GET"])
def covid_get_testData():
    # testData for offline dev

    return jsonify(testData)


@app.route("/", methods=["GET"])
def flask_is_up():
    return "OK"


if __name__ == "__main__":
    app.run(host="http://0.0.0.0:5000/", DEBUG=True)
