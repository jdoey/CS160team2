from flask import Flask, request, session
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from flask_bcrypt import Bcrypt
from datetime import datetime, timezone
from sqlalchemy import desc
# from apscheduler.schedulers.background import BackgroundScheduler

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
    dateOpen = db.Column(db.DateTime, default=datetime.now(timezone.utc))
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
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    recipient = db.Column(db.String(255))
    accountNumber = db.Column(db.Integer, db.ForeignKey('account.accountNumber'))

class AutomatedTransactions(db.Model):
        __tablename__ = "automatedtransactions"

        autoId = db.Column(db.Integer, primary_key=True)
        transactionType = db.Column(db.String(20), nullable=False)
        amount = db.Column(db.Integer, nullable=False)
        paymentDate = db.Column(db.DateTime, default=datetime.now(timezone.utc))
        frequency = db.Column(db.String(20), nullable=False)
        recipient = db.Column(db.String(255))
        accountNumber = db.Column(db.Integer, db.ForeignKey('account.accountNumber'))

class Employee(db.Model):
    __tablename__ = "employee"

    employeeId = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(20), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('user.userId'))
    personId = db.Column(db.Integer, db.ForeignKey('person.personId'), unique=True)


# scheduler = BackgroundScheduler()

# def executeTransaction(autoId, accountNumber, recipient, amount):
#     account = Account.query.filter_by(accountNumber=accountNumber).first()
#     targetUser = User.query.filter_by(username=recipient).first()
#     autoTransaction = AutomatedTransactions.query.filter_by(autoId=autoId).first()

#     if account and account.accountStatus == "Active":
#         if amount <= account.balance:
#             try:
#                 db.session.begin_nested()
#                 account.balance -= amount
#                 db.session.add(logTransaction(accountNumber, "Payment-", amount, datetime.now(), recipient))
#                 if targetUser:
#                     targetAccount = next((account for account in targetUser.customer.account if account.accountStatus == "Active"), None)
#                     if targetAccount:
#                         targetAccount.balance += amount
#                         db.session.add(logTransaction(targetAccount.accountNumber, "Payment+", amount, datetime.now(), current_user.username))
#                 if autoTransaction:
#                     if autoTransaction.frequency == 'Daily':
#                         autoTransaction.paymentDate += datetime.timedelta(days=1)
#                     elif autoTransaction.frequency == "Weekly":
#                         autoTransaction.paymentDate += datetime.timedelta(days=7)
#                     elif autoTransaction.frequency == "Monthly":
#                         autoTransaction.paymentDate += datetime.teimedelta(days=30)

#                 db.session.commit()
#             except Exception as e:
#                 db.session.rollback()
#                 raise e
#             else: 
#                 db.session.commit()
#                 return {"message" : "Payment successful", "isSuccess" : True}
#         else:
#             return {"message" : "Payment failed: Insufficient funds", "isSuccess" : False}    
#     return {"message" : "Payment failed", "isSuccess" : False}

# def scheduleTransactions():
#     autoTransactions = AutomatedTransactions.query.all()
#     for autoTransaction in autoTransactions:
#         scheduler.add_job(
#             executeTransaction, 'date', run_date=autoTransaction.paymentDate, args=[autoTransaction.autoId, autoTransaction.accountNumber, autoTransaction.recipient, autoTransaction.amount]
#         )
#         print("added job")

@app.route("/api/python")
def hello_world():
    user = User.query.filter_by(username='danh31').first()
    person = Person.query.filter_by(personId=1).first()
    emp = user.employee

    return f"{emp}"


# Creates a user loader callback that returns the user object given an id
@login_manager.user_loader
def loader_user(user_id):
    return User.query.get(user_id)

@app.route("/api/customer/register", methods = ['GET', 'POST'])
def customerRegister():
    
    if current_user.is_authenticated:
        return {'message' : "You are already logged in", 'isSuccess' : False}
    
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


@app.route("/api/user/login", methods = ['GET', 'POST'])
def customerLogin():
    
    if current_user.is_authenticated:
        return {'message' : "You are already logged in", 'isSuccess' : False}
    
    if request.method == "POST":
        data = request.json
        username = data.get("username", '')
        password = data.get("password", '')

        user = User.query.filter_by(username=username).first()

        if user and user.employee:
            return {'message' : "This account is not authorized to login here", 'isSuccess' : False}

        if user and authenticate(user.password, password):
            session['firstname'] = user.customer.person.firstname
            session['lastname'] = user.customer.person.lastname
            session['user_type'] = 'customer'
            login_user(user)
            return {'message' : "Login successful", 'isSuccess' : True}
   
    return {'message' : "Incorrect username or password", 'isSuccess' : False}


@app.route("/api/employee/login", methods = ['GET', 'POST'])
def employeeLogin():
    
    if current_user.is_authenticated:
        return {'message' : "You are already logged in", 'isSuccess' : False}
    
    if request.method == "POST":
        data = request.json
        username = data.get("username", '')
        password = data.get("password", '')

        user = User.query.filter_by(username=username).first()

        if user and user.employee == None:
            return {'message' : "This account is not authorized to login here", 'isSuccess' : False}

        if user.password == password:
            session['firstname'] = user.employee.person.firstname
            session['lastname'] = user.employee.person.lastname
            session['employeeid'] = user.employee.employeeId
            session['position'] = user.employee.position
            session['user_type'] = 'employee'
            login_user(user)
            return {'message' : "Login successful", 'isSuccess' : True}
   
    return {'message' : "Incorrect username or password", 'isSuccess' : False}

@app.route("/api/customer/logout", methods = ['GET'])
def logoutCustomer():
    if current_user and current_user.is_authenticated:
        session.clear()
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
    accountType = data.get('accountType')
    amount = int(data.get('initialDeposit'))

    newAccount = Account()
    newAccount.accountType = accountType
    newAccount.balance = 0
    newAccount.accountStatus = 'Active'
    newAccount.customerId = current_user.customer.customerId

    db.session.add(newAccount)
    db.session.commit()

    return {'message' : "Sucessfully created account", 'isSuccess' : True, 'accountProps': {"accountNumber": newAccount.accountNumber, "amount": amount, "accountStatus": newAccount.accountStatus}}
    

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
    customerId = current_user.customer.customerId

    account = Account.query.filter_by(customerId=customerId, accountNumber=accountNumber).first()

    if account:
        if account.accountStatus == "Active":
            account.accountStatus = "Inactive"
            account.dateClose = datetime.now(timezone.utc)
        else:
            account.accountStatus = "Active"
            account.dateClose = None
        db.session.commit()
        return {"message" : "Update successfully", "isSuccess" : True}
    
    return {"message" : "Fail to update", "isSuccess" : False}

#-----------TRANSACTION SERVICE------------------------------------

def logTransaction(accountNumber, transactionType, amount, date, recipient=None):
    transaction = Transactions()
    transaction.accountNumber = accountNumber
    transaction.transactionType = transactionType
    transaction.amount = amount
    transaction.date = date
    transaction.recipient = recipient
    return transaction
    # db.session.add(transaction)
    # db.session.commit()

@app.route("/api/transaction/deposit", methods = ['POST'])
@login_required
def deposit():
    data = request.json
    accountNumber = int(data.get('accountNumber', ''))
    amount = float(data.get('amount', ''))
    account = Account.query.filter_by(accountNumber=accountNumber).first()

    if account and account.accountStatus == "Active":
        try:
            db.session.begin_nested()
            account.balance += amount
            db.session.add(logTransaction(accountNumber, "Deposit", amount, datetime.now(timezone.utc)))
        except Exception as e:
            db.session.rollback()
            raise e
        else:
            db.session.commit()
            return {"message" : "Deposit successful", "isSuccess" : True}
    return {"message" : "Deposit failed", "isSuccess" : False}

@app.route("/api/transaction/withdraw", methods = ['POST'])
@login_required
def withdraw():
    data = request.json
    accountNumber = data.get('accountNumber', '')
    amount = float(data.get('amount', ''))

    account = Account.query.filter_by(accountNumber=accountNumber).first()

    if account and account.accountStatus == "Active":
        if amount <= account.balance:
            try:
                db.session.begin_nested()
                account.balance -= amount
                db.session.add(logTransaction(accountNumber, "Withdrawal", amount, datetime.now(timezone.utc)))
            except Exception as e:
                db.session.rollback()
                raise e
            else:
                db.session.commit()
                return {"message" : "Withdrawal successful", "isSuccess" : True}
        else:
            return {"message" : "Withdrawal failed: Not enough funds in account", "isSuccess" : False}
    return {"message" : "Withdrawal failed", "isSuccess" : False}

def processPayment(accountNumber, amount, recipient):
    account = Account.query.filter_by(accountNumber=accountNumber).first()
    targetUser = User.query.filter_by(username=recipient).first()

    if account and account.accountStatus == "Active":
        if amount <= account.balance:
            try:
                db.session.begin_nested()
                account.balance -= amount
                db.session.add(logTransaction(accountNumber, "Payment-", amount, datetime.now(timezone.utc), recipient))
                if targetUser:
                    targetAccount = next((account for account in targetUser.customer.account if account.accountStatus == "Active"), None)
                    if targetAccount:
                        targetAccount.balance += amount
                        db.session.add(logTransaction(targetAccount.accountNumber, "Payment+", amount, datetime.now(timezone.utc), current_user.username))
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
            else: 
                db.session.commit()
                return {"message" : "Payment successful", "isSuccess" : True}
        else:
            return {"message" : "Payment failed: Insufficient funds", "isSuccess" : False}    
    return {"message" : "Payment failed", "isSuccess" : False}

@app.route("/api/transaction/payment", methods = ['POST'])
@login_required
def payment():
    data = request.json
    accountNumber = int(data.get('accountNumber', ''))
    amount = float(data.get('amount', ''))
    recipient = data.get('recipient', '')
    return processPayment(accountNumber, amount, recipient)


@app.route("/api/transaction/recurringPayment", methods = ['POST'])
@login_required
def recurringPayment():
    data = request.json
    accountNumber = int(data.get('accountNumber', ''))
    amount = float(data.get('amount', ''))
    recipient = data.get('recipient', '')
    paymentDate = data.get('paymentDate', '')
    transactionType = data.get('transactionType', '')
    frequency = data.get('frequency', '')

    autoTransaction = AutomatedTransactions()
    autoTransaction.accountNumber = accountNumber
    autoTransaction.amount = amount
    autoTransaction.recipient = recipient
    autoTransaction.paymentDate = datetime.strptime(paymentDate, '%m/%d/%Y')
    autoTransaction.transactionType = transactionType
    autoTransaction.frequency = frequency

    db.session.add(autoTransaction)
    db.session.commit()
    # scheduleTransactions()
    return {'message' : "Automated payment created successfully!", 'isSuccess' : True}


@app.route("/api/transaction/deleteRecurringPayment", methods = ['POST'])
@login_required
def deleteRecurringPayment():
    data = request.json
    autoId = int(data.get('autoId', ''))
    recurring_payment = AutomatedTransactions.query.get(autoId)
    db.session.delete(recurring_payment)
    db.session.commit()
    # scheduleTransactions()
    return {'message' : "Automated payment successfully deleted!", 'isSuccess' : True}


@app.route("/api/transaction/transfer", methods = ['POST'])
@login_required
def transfer():
    data = request.json
    fromAccountNumber = int(data.get('fromAccountNumber', ''))
    toAccountNumber = int(data.get('toAccountNumber', ''))
    amount = float(data.get('amount', ''))

    if fromAccountNumber == toAccountNumber:
        return {"message": "Transfer failed: Source and target account cannot be the same"}

    fromAccount = Account.query.filter_by(accountNumber=fromAccountNumber).first()
    toAccount = Account.query.filter_by(accountNumber=toAccountNumber).first()

    if not fromAccount or fromAccount.accountStatus == "Inactive":
        return {"message": "Transfer failed: Invalid source account"}
    
    if amount > fromAccount.balance:
        return {"message": "Transfer failed: Insufficient funds"}
    
    try:
        db.session.begin_nested()
        fromAccount.balance -= amount
        db.session.add(logTransaction(fromAccount, "Transfer-", amount, datetime.now(timezone.utc)))
        if toAccount and toAccount.accountStatus == "Active":
            toAccount.balance += amount
            db.session.add(logTransaction(toAccount, "Transfer+", amount, datetime.now(timezone.utc)))
    except Exception as e:
        db.session.rollback()
        raise e
    else:
        db.session.commit()
        return {"message": "Transfer successful", "isSuccess": True}

@app.route("/api/customer/<accountNumber>/transactionHistory", methods = ['GET'])
@login_required
def getAccountTransactions(accountNumber):
    if accountNumber.isdigit(): 
        accountId = int(accountNumber)
        accounts = current_user.customer.account
        for account in accounts:

            if accountId == account.accountNumber:

                transactions = Transactions.query.filter(Transactions.accountNumber==accountId).order_by(desc(Transactions.date)).all()
                
                res = []
                for trans in transactions:
                    res.append({"transactionId" : trans.transactionId, "transactionType" : trans.transactionType, "amount" : trans.amount, "date" : trans.date})
                
                return res
    return {"message" : "Invalid ID", "isSuccess" : False}

@app.route("/api/customer/getAccountsTransactionHistory", methods = ['GET'])
@login_required
def getAccountsTransactionHistory():
    if not current_user.customer:
        return {"message": "User not authenticated or not a customer", "isSuccess": False}

    accounts = current_user.customer.account
    account_numbers = [account.accountNumber for account in accounts]
    transactions = Transactions.query.filter(Transactions.accountNumber.in_(account_numbers)).order_by(desc(Transactions.date)).all()

    if transactions:
        transactionsDict = [{
            "transactionId": transaction.transactionId,
            "transactionType": transaction.transactionType,
            "amount": transaction.amount,
            "date": transaction.date,
            "recipient": transaction.recipient,
            "accountNumber": transaction.accountNumber
        } for transaction in transactions]
        return {"transactions": transactionsDict, "isSuccess": True}
    else:
        return {"message": "No transactions found for any account", "isSuccess": False}

@app.route("/api/customer/getAccountsPaymentHistory", methods=['GET'])
@login_required
def getAccountsPaymentHistory():
    if not current_user.customer:
        return {"message": "User not authenticated or not a customer", "isSuccess": False}

    # accounts = current_user.customer.account
    # account_numbers = [account.accountNumber for account in accounts]
    # transactions = Transactions.query.filter(Transactions.accountNumber.in_(account_numbers), Transactions.transactionType.like("Payment-%")).order_by(desc(Transactions.date)).all()

    # if transactions:
    #     paymentsDict = [{
    #         "transactionId": transaction.transactionId,
    #         "transactionType": transaction.transactionType,
    #         "amount": transaction.amount,
    #         "date": transaction.date,
    #         "recipient": transaction.recipient,
    #         "accountNumber": transaction.accountNumber
    #     } for transaction in transactions]
    #     return {"payments": paymentsDict, "isSuccess": True}
    # else:
    #     return {"message": "No payment transactions found for any account", "isSuccess": False}
    
    accounts = current_user.customer.account
    paymentsDict = []

    for account in accounts:
        transactions = Transactions.query.filter_by(accountNumber=account.accountNumber, transactionType="Payment-").order_by(desc(Transactions.date)).all()
        for transaction in transactions:
            paymentsDict.append({
                "transactionId": transaction.transactionId,
                "transactionType": transaction.transactionType,
                "amount": transaction.amount,
                "date": transaction.date,
                "recipient": transaction.recipient,
                "accountNumber": transaction.accountNumber,
                "accountType": account.accountType
            })
    if paymentsDict:
        return {"payments": paymentsDict, "isSuccess": True}
    return {"message": "No payment transactions found for any account", "isSuccess": False}         


@app.route("/api/customer/getAccountsAutoPaymentHistory", methods=['GET'])
@login_required
def getAccountsAutoPaymentHistory():
    if not current_user.customer:
        return {"message": "User not authenticated or not a customer", "isSuccess": False}
    
    accounts = current_user.customer.account
    autoPaymentsDict = []
    for account in accounts:
        autoTransactions = AutomatedTransactions.query.filter_by(accountNumber=account.accountNumber).all()
        for autoTransaction in autoTransactions:
            autoPaymentsDict.append({
                "autoId": autoTransaction.autoId,
                "transactionType": autoTransaction.transactionType,
                "amount": autoTransaction.amount,
                "paymentDate": autoTransaction.paymentDate,
                "recipient": autoTransaction.recipient,
                "frequency": autoTransaction.frequency, 
                "accountNumber": autoTransaction.accountNumber,
                "accountType": account.accountType
            })
    if autoPaymentsDict:
        return {"autoPayments": autoPaymentsDict, "isSuccess": True}
    return {"message": "No automated payment transactions found for any account", "isSuccess": False}         

@app.route("/api/customer/getAccounts", methods=['GET'])
@login_required
def getAccounts():
    if not current_user.customer:
        return {"message": "Account retrieval failed", "isSuccess": False}

    accounts = current_user.customer.account

    if not accounts:
        return {"message": "No accounts found", "isSuccess": False}

    accountsDict = [{
        "accountNumber": account.accountNumber,
        "accountType": account.accountType,
        "balance": account.balance,
        "accountStatus": account.accountStatus
    } for account in accounts]

    return {"message": "Accounts successfully retrieved", "accounts": accountsDict, "isSuccess": True}


@app.route("/api/customer/getActiveAccounts", methods=['GET'])
@login_required
def getActiveAccounts():
    if current_user.customer:
        accounts = current_user.customer.account

        accountsDict = []
        for account in accounts:
            if account.accountStatus == "Active":
                accountsDict.append({"accountNumber" : account.accountNumber, "accountType" : account.accountType, "balance" : account.balance, "accountStatus" : account.accountStatus})


        if accounts == None:
            return {"message" : "No active accounts found", "isSuccess": False}
        else:
            return {"message" : "All Active Accounts successfully retrieved", "accounts": accountsDict, "isSuccess": True}

    return {"message" : "Account retrieval failed", "isSuccess" : False}


@app.route("/api/employee/customerAccount", methods = ['POST'])
@login_required
def getCustomerAccount():
    if current_user.employee:
        data = request.json
        accountNumber = data.get('accountNumber')
        account = Account.query.filter_by(accountNumber=accountNumber).first()
        if account == None:
            return {"message" : "Account can not be found", "isSuccess" : False}
        transactions = Transactions.query.filter(Transactions.accountNumber==account.accountNumber).order_by(desc(Transactions.date)).all()
        customer = Customer.query.get(account.customerId)
        person = Person.query.get(customer.personId)
        address = person.address


        transDict = []
        for trans in transactions:
            transDict.append({"transactionId" : trans.transactionId, "transactionType" : trans.transactionType, "amount" : trans.amount, "date" : trans.date})

        addr = {
            "streetNum" : address.streetNum,
            "street" : address.street,
            "city"  : address.city,
            "state" : address.state,
            "country" : address.country,
            "zipcode" : address.zipcode
        }


            
        return {"accountNumber": account.accountNumber, "accountType": account.accountType, "dob": person.dob, "balance" : account.balance, "address" : addr, "name": f"{person.firstname} {person.lastname}", "transactions" : transDict, "isSuccess": True}
    
    return {"message" : "Account is not authorized", "isSuccess" : False}


@app.route("/api/customer/authorization", methods = ['GET'])
@login_required
def customerAuthorization():
    if current_user.is_authenticated and current_user.employee:
        return {'message' : "User is not authorized to access this page", 'isSuccess' : False}
    
    return {'message' : "User is authorized to access this page", 'isSuccess' : True}

@app.route("/api/employee/authorization", methods = ['GET'])
@login_required
def employeeAuthorization():
    if current_user.is_authenticated and current_user.employee:
        return {'message' : "User is authorized to access this page", 'isSuccess' : True}
    

    return {'message' : "User is not authorized to access this page", 'isSuccess' : False}


@app.route('/api/customerSessionData')
@login_required
def getCustomerSessionData():
    firstname = session.get('firstname', '')
    lastname = session.get('lastname', '')
    customerId = session.get('customerId', '')
    return {'firstname': firstname, 'lastname': lastname, 'customerId': customerId}

@app.route('/api/employeeSessionData')
@login_required
def getEmployeeSessionData():
    firstname = session.get('firstname', '')
    lastname = session.get('lastname', '')
    employeeId = session.get('employeeId', '')
    position = session.get('position', '')
    return {'firstname': firstname, 'lastname': lastname, 'employeeId': employeeId, 'position': position}
    
    
@login_manager.unauthorized_handler
def unauthorized_callback():
    return {'message' : "User is not login", 'isSuccess' : False}


if __name__ == '__main__':
    # scheduler.start()
    # scheduleTransactions()
    app.run()