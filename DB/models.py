from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(64), nullable=False)
    lastName = db.Column(db.String(64), nullable=False)
    cardNum = db.Column(db.String(16), unique=True, nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)
    transaction = db.relationship('Transaction', backref='users', lazy=True)

    def __init__(self, firstName, lastName, cardNum, email):
        self.firstName = firstName
        self.lastName = lastName
        self.cardNum = cardNum
        self.email = email

    def __repr__(self):
        return '<id {}>'.format(self.id)
    
    def serialize(self):
        return {
            'id': self.id, 
            'firstName': self.firstName,
            'lastName': self.lastName,
            'cardNum':self.cardNum,
            'email':self.email
		}
		
		
class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    vendorName = db.Column(db.String(64), nullable=False)
    vendorLocation = db.Column(db.String(64), nullable=False)

    def __init__(self, userID, category, amount, date, vendorName, vendorLocation):
        self.userID = userID
        self.category = category
        self.amount = amount
        self.date = date
        self.vendorName = vendorName
        self.vendorLocation = vendorLocation

    def __repr__(self):
        return '<id {}>'.format(self.id)
    
    def serialize(self):
        return {
            'id': self.id, 
            'userID': self.userID,
            'category': self.category,
            'amount':self.amount,
            'date':self.date,
            'vendorName':self.vendorName,
            'vendorLocation':self.vendorLocation
		}
		

class Category(db.Model):
	__tablename__ = 'categories'
	
	id = db.Column(db.Integer, primary_key=True)
	category = db.Column(db.String(32))
	transactions = db.relationship('Transaction', backref='categories', lazy=True)
	
	def __init__(self, id, category):
		self.id = id
		self.category = category

