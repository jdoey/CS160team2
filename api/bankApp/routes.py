
from bankApp.setting import app
from flask import request, session
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime
from sqlalchemy import desc
from bankApp.models import User, Person, Address, Customer, Account, Transactions, AutomatedTransactions, Employee
from bankApp.extention import login_manager, bcrypt, db





# Creates a user loader callback that returns the user object given an id
@login_manager.user_loader
def loader_user(user_id):
    return User.query.get(user_id)


@app.route("/api/python")
def hello_world():
    user = User.query.filter_by(username='dinh123').first()
    person = Person.query.filter_by(personId=1).first()
    emp = user.employee

    return f"{user}"
    return "hello"

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
            session['customerId'] = user.customer.customerId
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

        if user and authenticate(user.password, password):
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
            account.dateClose = datetime.now()
        else:
            account.accountStatus = "Active"
            account.dateClose = None
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
            db.session.add(logTransaction(accountNumber, "Deposit", amount, datetime.now()))
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
                db.session.add(logTransaction(accountNumber, "Withdrawal", amount, datetime.now()))
            except Exception as e:
                db.session.rollback()
                raise e
            else:
                db.session.commit()
                return {"message" : "Withdrawal successful", "isSuccess" : True}
        else:
            return {"message" : "Withdrawal failed: Not enough funds in account", "isSuccess" : False}
    return {"message" : "Withdrawal failed", "isSuccess" : False}

@app.route("/api/transaction/payment", methods = ['POST'])
@login_required
def payment():
    data = request.json
    accountNumber = data.get('accountNumber', '')
    amount = float(data.get('amount', ''))
    recipient = data.get('recipient', '')

    account = Account.query.filter_by(accountNumber=accountNumber).first()

    if account and account.accountStatus == "Active":
        if amount <= account.balance:
            try:
                db.session.begin_nested()
                account.balance -= amount
                db.session.add(logTransaction(accountNumber, "Payment", amount, datetime.now(), recipient))
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
        db.session.add(logTransaction(fromAccount, "Transfer-", amount, datetime.now()))
        if toAccount and toAccount.accountStatus == "Active":
            toAccount.balance += amount
            db.session.add(logTransaction(toAccount, "Transfer+", amount, datetime.now()))
    except Exception as e:
        db.session.rollback()
        raise e
    else:
        db.session.commit()
        return {"message": "Transfer successful", "isSuccess": True}


    # if fromAccount and fromAccount.accountStatus == "Active":
    #     if amount <= fromAccount.balance:
    #         fromAccount.balance -= amount
    #         if toAccount and toAccount.accountStatus == "Active":
    #             toAccount.balance += amount
    #         db.session.commit()
    #     else:
    #         return {"message" : "Transfer failed: Insufficient funds", "isSuccess" : False}
    #     logTransaction(fromAccount, "Transfer-", amount, datetime.now())

    #     if toAccount:
    #         logTransaction(toAccount, "Transfer+", amount, datetime.now())
    #     return {"message" : "Transfer successful", "isSuccess" : True}
    
    # return {"message" : "Transfer failed", "isSuccess" : False}

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
    if current_user.customer:
        accounts = current_user.customer.account
        transactionsDict = []
        for account in accounts:
            transactions = Transactions.query.filter_by(accountNumber=account.accountNumber).order_by(desc(Transactions.date)).all()
            for transaction in transactions: 
                transactionsDict.append({
                    "transactionId": transaction.transactionId,
                    "transactionType": transaction.transactionType,
                    "amount": transaction.amount,
                    "date": transaction.date,
                    "accountNumber": account.accountNumber
                })
        if transactionsDict:
            return {"transactions": transactionsDict, "isSuccess": True}
        else:
            return {"message": "No transactions found for any account", "isSuccess": False}
    return {"message": "User not authenticated or not a customer", "isSucess": False}
        

@app.route("/api/customer/getAccounts", methods=['GET'])
@login_required
def getAccounts():
    if current_user.customer:
        customerId = current_user.customer.customerId
        accounts = current_user.customer.account

        accountsDict = []
        for account in accounts:
            accountsDict.append({"accountNumber" : account.accountNumber, "accountType" : account.accountType, "balance" : account.balance, "accountStatus" : account.accountStatus})


        if accounts == None:
            return {"message" : "No accounts found", "isSuccess": False}
        else:
            return {"message" : "Accounts successfully retrieved", "accounts": accountsDict, "isSuccess": True}

    return {"message" : "Account retrieval failed", "isSuccess" : False}

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
        transactions = Transactions.query.filter(Transactions.accountNumber==account.accountNumber).all()
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


            
        return {"balance" : account.balance, "address" : addr, "name": f"{person.firstname} {person.lastname}", "transactions" : transDict}
    
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


@app.route('/api/sessionData')
@login_required
def getSessionData():
    firstname = session.get('firstname', '')
    lastname = session.get('lastname', '')
    customerId = session.get('customerId', '')
    return {'firstname': firstname, 'lastname': lastname, 'customerId': customerId}
    
    
@login_manager.unauthorized_handler
def unauthorized_callback():
    return {'message' : "User is not login", 'isSuccess' : False}