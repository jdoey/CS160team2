from flask import Flask
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://username:password@localhost/db_name'

# db = SQLAlchemy(app)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"