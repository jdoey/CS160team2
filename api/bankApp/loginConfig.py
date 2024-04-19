
from flask_login import LoginManager
from flask_bcrypt import Bcrypt


# LoginManager is needed for our application 
# to be able to log in and out users
login_manager = LoginManager()

bcrypt = Bcrypt()
