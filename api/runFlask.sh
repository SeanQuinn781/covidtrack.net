#!/bin/bash
# flask settings
export FLASK_APP=/var/www/html/react-maps-flask-covid/api/app/app.py
export FLASK_DEBUG=0

/var/www/html/react-maps-flask-covid/api/venv/bin/flask run 

# --host=0.0.0.0 --port=80
