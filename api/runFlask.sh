#!/bin/bash
# flask settings
export FLASK_APP=/var/www/html/covidtrack/api/app/app.py
export FLASK_DEBUG=0

/var/www/html/covidtrack/api/venv/bin/flask run 

# --host=0.0.0.0 --port=80
