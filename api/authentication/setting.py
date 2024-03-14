import mysql.connector
from dotenv import load_dotenv
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = "my secret key"

load_dotenv()

db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_user = os.environ.get("DB_USERNAME")
db_password = os.environ.get("DB_PASSWORD")
db_database = os.environ.get("DB_DATABASE")
ssl_ca = os.environ.get("SSL_CA")

config = {
    'host': db_host,
    'port': db_port,
    'user': db_user,
    'password': db_password,
    'database': db_database,
    'ssl_ca': ssl_ca,
    'ssl_verify_cert': True, 
    'ssl_verify_identity': True
}

# Configuring database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_database}?ssl_ca={ssl_ca}"
 
# Disable modification tracking
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# conn = mysql.connector.connect(**config)

# LoginManager is needed for our application 
# to be able to log in and out users
login_manager = LoginManager()
login_manager.init_app(app)

bcrypt = Bcrypt(app)


from authentication import route

