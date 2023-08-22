"""
This script runs the python_webapp_flask application using a development server.
"""

from os import environ
from ZoningComparison import app

if __name__ == '__main__':
    HOST = 'localhost' # environ.get('SERVER_HOST', '0.0.0.0')
    try:
        #PORT = int(environ.get('SERVER_PORT', '8000'))
        PORT = 9000
    except ValueError:
        PORT = 8000

    app.run(debug = True)
