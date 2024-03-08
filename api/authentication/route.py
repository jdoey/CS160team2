from flask import Flask, request, jsonify
from authentication.setting import db, app
# from authentication.setting import conn, app
from datetime import datetime
from authentication.model import User, Person, Address, Customer, Account


@app.route("/api/python")
def hello_world():
    # cur = conn.cursor()
    # cur.execute("SELECT * FROM user")
    # result = cur.fetchall()
    # cur.close()

    result = Customer.query.all()
    
    return result[1].account[0].__str__()


@app.route("/api/customer/register", methods = ['POST'])
def customerRegister():
    # cur = conn.cursor()
    
    if request.method == 'POST':
        #user
        newUser = User()
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')

        newUser.username = username
        newUser.password = password
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
        newAccount = Account()
        accountType = request.form.get('accountType')
        balance = request.form.get('balance')
        accountStatus = request.form.get('accountStatus')

        newAccount.accountType = accountType
        newAccount.balance = float(balance)
        newAccount.accountStatus = accountStatus
        newAccount.customerId = newCustomer.customerId

        db.session.add(newAccount)
        db.session.commit()

        return f'{newUser.userId}'
        



    # cur.close()

    return request.method