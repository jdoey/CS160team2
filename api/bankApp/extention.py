from bankApp.database import db
from bankApp.setting import app
from bankApp.loginConfig import login_manager, bcrypt


db.init_app(app)

login_manager.init_app(app)

bcrypt.init_app(app)