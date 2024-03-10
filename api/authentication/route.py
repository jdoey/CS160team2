from flask import Flask, request, session
from authentication.setting import db, app, login_manager, bcrypt
from flask_login import login_user, logout_user, login_required, current_user
# from authentication.setting import conn, app
from datetime import datetime
from authentication.model import User, Person, Address, Customer, Account
import json

@app.route("/api/python")
def hello_world():
    # cur = conn.cursor()
    # cur.execute("SELECT * FROM user")
    # result = cur.fetchall()
    # cur.close()

    result = Customer.query.all()
    
    return result[1].account[0].__str__()



# Creates a user loader callback that returns the user object given an id
@login_manager.user_loader
def loader_user(user_id):
    return User.query.get(user_id)

@app.route("/api/customer/register", methods = ['POST'])
def customerRegister():
    # cur = conn.cursor()
    
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form.get('username')).first()
        if user:
            return {'message' : "There is another with this username", 'isSuccess' : False}
        #user
        newUser = User()
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')

        newUser.username = username
        newUser.password = hashPassword(password)
        newUser.email = email

        db.session.add(newUser)
        db.session.commit()

        #Person
        newPerson = Person()
        firstname = request.form.get('firstname')
        lastname = request.form.get('lastname')
        # dob = request.form.get('dob')
        
        newPerson.firstname = firstname
        newPerson.lastname = lastname
        # newPerson.dob = dob
        db.session.add(newPerson)
        db.session.commit()

        #Address
        newAdress = Address()
        streetNum = request.form.get('streetNum')
        street = request.form.get('street')
        city = request.form.get('city')
        state = request.form.get('state')
        country = request.form.get('country')
        zipcode = request.form.get('zipcode')

        newAdress.streetNum = int(streetNum)
        newAdress.street = street
        newAdress.city = city
        newAdress.state = state
        newAdress.country = country
        newAdress.zipcode = int(zipcode)
        newAdress.personId = newPerson.personId

        db.session.add(newAdress)
        db.session.commit()


        #Customer
        newCustomer = Customer()
        newCustomer.personId = newPerson.personId
        newCustomer.userId = newUser.userId

        db.session.add(newCustomer)
        db.session.commit()

        #Account
        # newAccount = Account()
        # accountType = request.form.get('accountType')
        # balance = request.form.get('balance')
        # accountStatus = request.form.get('accountStatus')

        # newAccount.accountType = accountType
        # newAccount.balance = float(balance)
        # newAccount.accountStatus = accountStatus
        # newAccount.customerId = newCustomer.customerId

        # db.session.add(newAccount)
        # db.session.commit()

        return {'message' : "Sucessfully creating user", 'isSuccess' : True}
        
        


    return {'message' : "Fail to create user", 'isSuccess' : False}


@app.route("/api/customer/login", methods = ['POST'])
def loginCustomer():
    if current_user.is_authenticated:
        return {'message' : "You are already login", 'isSuccess' : False}
    
    if request.method == "POST":
        user = User.query.filter_by(username=request.form.get("username")).first()

        if user and authenticate(user.password, request.form.get("password")):
           
            login_user(user, remember=True)
            return {'message' : "Login sucessfully", 'isSuccess' : True}
   
    return {'message' : "Login fail", 'isSuccess' : False}

@app.route("/api/customer/logout", methods = ['POST'])
def logoutCustomer():
    if current_user and current_user.is_authenticated:
        logout_user()
        return {'message' : "Logout sucessfully", 'isSuccess' : True}
    
    return {'message' : "User is not login", 'isSuccess' : False}


def hashPassword(password):
    
    return bcrypt.generate_password_hash(password).decode('utf-8') 

def authenticate(hashed_password, password):
    return bcrypt.check_password_hash(hashed_password, password) 


@app.route("/api/customer/login/after", methods = ['GET'])
@login_required
def testLogin():
    
    return f"{current_user.is_authenticated}"




@app.route("/api/customer/account", methods = ['POST'])
@login_required
def createAccount():

    newAccount = Account()
    accountType = request.form.get('accountType')
    balance = request.form.get('balance')
    accountStatus = request.form.get('accountStatus')

    newAccount.accountType = accountType
    newAccount.balance = float(balance)
    newAccount.accountStatus = accountStatus
    newAccount.customerId = current_user.customer.customerId

    db.session.add(newAccount)
    db.session.commit()

    
    return {'message' : "Sucessfully creating account", 'isSuccess' : True}


@app.route("/api/customer/balance", methods = ['GET'])
@login_required
def accountBalance():
    res = []
    id = current_user.customer.customerId
    accounts = Account.query.filter_by(customerId=id)

    for account in accounts:
        res.append({"type": account.accountType, 'balance' : account.accountNumber, "status": account.accountStatus})
    
    return {"accounts": res, 'isSuccess' : True}