from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["DEBUG"] = True
app.config['SECRET_KEY'] = "my secret key"

db_host = os.environ.get("TIDB_HOST")
db_port = os.environ.get("TIDB_PORT")
db_user = os.environ.get("TIDB_USER")
db_password = os.environ.get("TIDB_PASSWORD")
db_database = os.environ.get("TIDB_DATABASE")
#ssl_ca = os.environ.get("SSL_CA")

# Configuring database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_database}?ssl_ca=/etc/ssl/ca-bundle.pem&ssl_verify_cert=true&ssl_verify_identity=true"
# app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_database}?ssl_ca={ssl_ca}"
 
# Disable modification tracking
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_pre_ping': True}


# conn = mysql.connector.connect(**config)

# LoginManager is needed for our application 
# to be able to log in and out users
# login_manager = LoginManager()
# login_manager.init_app(app)

# bcrypt = Bcrypt(app)
