from flask import Flask, request, session
from dotenv import load_dotenv
import os
import json
import mysql.connector
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from flask_bcrypt import Bcrypt
from datetime import datetime


load_dotenv()

app = Flask(__name__)
app.config["DEBUG"] = True
app.config['SECRET_KEY'] = "my secret key"

db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_user = os.environ.get("DB_USERNAME")
db_password = os.environ.get("DB_PASSWORD")
db_database = os.environ.get("DB_DATABASE")
ssl_ca = os.environ.get("SSL_CA")

# configuration used to connect to TiDB Cloud
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

app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_pre_ping': True}

db = SQLAlchemy(app)

# conn = mysql.connector.connect(**config)

# LoginManager is needed for our application 
# to be able to log in and out users
login_manager = LoginManager()
login_manager.init_app(app)

bcrypt = Bcrypt(app)


class User(UserMixin, db.Model):
    __tablename__ = "user"
 
    userId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    customer = db.relationship('Customer', backref='user', uselist=False)

    def get_id(self):
           return (self.userId)
    def __str__(self):
        return self.username
    
class Person(db.Model):
    __tablename__ = "person"

    personId = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.DateTime, default=datetime.now())
    address = db.relationship('Address', backref='person', uselist=False)
    customer = db.relationship('Customer', backref='person', uselist=False)

    def __str__(self):
        return self.firstname
    
class Address(db.Model):
    __tablename__ = "address"

    addressId = db.Column(db.Integer, primary_key=True)
    streetNum = db.Column(db.String, nullable=False)
    street = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(200), nullable=False)
    state = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(200), nullable=False)
    zipcode = db.Column(db.String, nullable=False)
    personId = db.Column(db.Integer, db.ForeignKey('person.personId'), unique=True)

    def __str__(self):
        return self.streetNum


class Customer(db.Model):
    __tablename__ = "customer"

    customerId = db.Column(db.Integer, primary_key=True)
    personId = db.Column(db.Integer, db.ForeignKey('person.personId'))
    userId = db.Column(db.Integer, db.ForeignKey('user.userId'))
    account = db.relationship('Account', backref='customer')

    def __str__(self):
        return f"{self.personId}"
    

class Account(db.Model):
    __tablename__ = "account"

    accountNumber = db.Column(db.Integer, primary_key=True)
    accountType = db.Column(db.String(20), nullable=False)
    balance = db.Column(db.Float, default=0.0, nullable=False)
    dateOpen = db.Column(db.DateTime, default=datetime.utcnow)
    dateClose = db.Column(db.DateTime)
    accountStatus = db.Column(db.String(20), default="Active",nullable=False)
    customerId = db.Column(db.Integer, db.ForeignKey('customer.customerId'))
    transaction = db.relationship('Transactions', backref='account')

    def __str__(self):
        return f"{self.accountNumber}"


class Transactions(db.Model):
    __tablename__ = "transactions"
    
    transactionId = db.Column(db.Integer, primary_key=True)
    transactionType = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now())
    accountNumber = db.Column(db.Integer, db.ForeignKey('account.accountNumber'))


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

# Creates a user loader callback that returns the user object given an id
@login_manager.user_loader
def loader_user(user_id):
    return User.query.get(user_id)

@app.route("/api/customer/register", methods = ['GET', 'POST'])
def customerRegister():

    print(request.json)
    if request.method == 'POST':
        data = request.json

        user = User.query.filter_by(username=data.get('username', '')).first()
        if user:
            return {'message' : "A user with that username already exists!", 'isSuccess' : False}
        #user
        newUser = User()
        username = data.get('username', '')
        password = data.get('password', '')
        email = data.get('email', '')

        newUser.username = username
        newUser.password = hashPassword(password)
        newUser.email = email

        db.session.add(newUser)
        db.session.commit()

        #Person
        newPerson = Person()
        firstname = data.get('firstName', '')
        lastname = data.get('lastName', '')
        dob = data.get('dob', '').strip()
        
        newPerson.firstname = firstname
        newPerson.lastname = lastname
        newPerson.dob = datetime.strptime(dob, '%m/%d/%Y')
        db.session.add(newPerson)
        db.session.commit()

        #Address
        newAdress = Address()
        streetNum, street = data.get('street', '').split(" ", 1)
        city = data.get('city', '')
        state = data.get('state', '')
        country = data.get('country', '')
        zipcode = data.get('zip', '')

        newAdress.streetNum = streetNum
        newAdress.street = street
        newAdress.city = city
        newAdress.state = state
        newAdress.country = country
        newAdress.zipcode = zipcode
        newAdress.personId = newPerson.personId

        db.session.add(newAdress)
        db.session.commit()


        #Customer
        newCustomer = Customer()
        newCustomer.personId = newPerson.personId
        newCustomer.userId = newUser.userId

        db.session.add(newCustomer)
        db.session.commit()


        return {'message' : "User account created successfully!", 'isSuccess' : True}

    return {'message' : "User account creation failed!", 'isSuccess' : False}


@app.route("/api/customer/login", methods = ['POST'])
def loginCustomer():
    
    if current_user.is_authenticated:
        return {'message' : "You are already logged in", 'isSuccess' : False}
    
    if request.method == "POST":
        data = request.json
        username = data.get("username", '')
        password = data.get("password", '')
        user = User.query.filter_by(username=username).first()

        if user and authenticate(user.password, password):
            login_user(user, remember=True)
            return {'message' : "Login successful", 'isSuccess' : True}
   
    return {'message' : "Incorrect username or password", 'isSuccess' : False}

@app.route("/api/customer/logout", methods = ['POST'])
def logoutCustomer():
    if current_user and current_user.is_authenticated:
        logout_user()
        return {'message' : "Logout successful", 'isSuccess' : True}
    
    return {'message' : "User is not logged in", 'isSuccess' : False}


def hashPassword(password):
    
    return bcrypt.generate_password_hash(password).decode('utf-8') 

def authenticate(hashed_password, password):
    return bcrypt.check_password_hash(hashed_password, password) 


@app.route("/api/customer/account", methods = ['POST'])
@login_required
def createAccount():

    data = request.json
    accountType = data.get('accountType').lower()
    balance = data.get('balance')
    accountStatus = data.get('accountStatus')

    account = Account.query.filter_by(accountType=accountType, customerId=current_user.customer.customerId).first()
    if account is None:
        newAccount = Account()
        newAccount.accountType = accountType
        newAccount.balance = balance
        newAccount.accountStatus = accountStatus
        newAccount.customerId = current_user.customer.customerId

        db.session.add(newAccount)
        db.session.commit()

    
        return {'message' : "Sucessfully creating account", 'isSuccess' : True}
    
    return {'message' : "This account is existed", 'isSuccess' : False}


@app.route("/api/customer/balance", methods = ['GET'])
@login_required
def accountBalance():
    res = []
    id = current_user.customer.customerId
    accounts = Account.query.filter_by(customerId=id)

    for account in accounts:
        res.append({"accountNumber" : account.accountNumber, "type": account.accountType, 'balance' : account.balance, "status": account.accountStatus})
    
    return {"accounts": res, 'isSuccess' : True}

@app.route("/api/customer/updateAccount", methods = ['Post'])
@login_required
def updateAccount():
    data = request.json
    accountNumber = data.get('accountNumber')
    accountStatus = data.get('accountStatus')
    customerId = current_user.customer.customerId

    account = Account.query.filter_by(customerId=customerId, accountNumber=accountNumber).first()

    if account:
        account.accountStatus = accountStatus
        if accountStatus == "Active":
            account.dateClose = None
        else:
            account.dateClose = datetime.now()
        db.session.commit()
        return {"message" : "Update successfully", "isSuccess" : True}
    
    return {"message" : "Fail to update", "isSuccess" : False}

#-----------TRANSACTION SERVICE------------------------------------

def logTransaction(accountNumber, transactionType, amount, date):
    transaction = Transactions()
    transaction.accountNumber = accountNumber
    transaction.transactionType = transactionType
    transaction.amount = amount
    transaction.date = date

    db.session.add(transaction)
    db.session.commit()

@app.route("/api/transaction/deposit", methods = ['POST'])
@login_required
def deposit():
    data = request.json
    accountNumber = data.get('accountNumber', '')
    accountStatus = data.get('accountStatus', '')
    amount = data.get('amount', '')

    account = Account.query.filter_by(accountNumber=accountNumber).first()

    if account and accountStatus == "Active":
        account.balance += amount
        db.session.commit()
        logTransaction(accountNumber, "deposit", float(amount), datetime.now())

        return {"message" : "Deposit successful", "isSuccess" : True}
    
    return {"message" : "Deposit failed", "isSuccess" : False}

@app.route("/api/transaction/withdraw", methods = ['POST'])
@login_required
def withdraw():
    data = request.json
    accountNumber = data.get('accountNumber', '')
    accountStatus = data.get('accountStatus', '')
    amount = data.get('amount', '')

    account = Account.query.filter_by(accountNumber=accountNumber).first()

    if account and accountStatus == "Active":
        account.balance -= amount
        db.session.commit()
        logTransaction(accountNumber, "withdraw", float(amount), datetime.now())

        return {"message" : "Withdraw successful", "isSuccess" : True}
    
    return {"message" : "Withdraw failed", "isSuccess" : False}



@login_manager.unauthorized_handler
def unauthorized_callback():
    return {'message' : "User is not login", 'isSuccess' : False}


if __name__ == '__main__':
    app.run()