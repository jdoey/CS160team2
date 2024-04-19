from bankApp.setting import app
from bankApp.extention import db
from bankApp.models import User
from bankApp.routes import withdraw


if __name__ == '__main__':
    app.run()