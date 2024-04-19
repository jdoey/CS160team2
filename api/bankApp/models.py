from bankApp.database import db
from flask_login import UserMixin
from datetime import datetime


class User(UserMixin, db.Model):
    __tablename__ = "user"
 
    userId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    customer = db.relationship('Customer', backref='user', uselist=False)
    employee = db.relationship('Employee', backref='user', uselist=False)

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
    employee = db.relationship('Employee', backref='person', uselist=False)

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
    autoTransactions = db.relationship('AutomatedTransactions', backref='account')

    def __str__(self):
        return f"{self.accountNumber}"


class Transactions(db.Model):
    __tablename__ = "transactions"
    
    transactionId = db.Column(db.Integer, primary_key=True)
    transactionType = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now())
    recipient = db.Column(db.String(255))
    accountNumber = db.Column(db.Integer, db.ForeignKey('account.accountNumber'))

class AutomatedTransactions(db.Model):
        __tablename__ = "automatedtransactions"

        autoId = db.Column(db.Integer, primary_key=True)
        transactionType = db.Column(db.String(20), nullable=False)
        amount = db.Column(db.Integer, nullable=False)
        paymentDate = db.Column(db.DateTime, default=datetime.now())
        frequency = db.Column(db.String(20), nullable=False)
        accountNumber = db.Column(db.Integer, db.ForeignKey('account.accountNumber'))

class Employee(db.Model):
    __tablename__ = "employee"

    employeeId = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(20), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('user.userId'))
    personId = db.Column(db.Integer, db.ForeignKey('person.personId'), unique=True)