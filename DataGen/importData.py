import csv
import psycopg2


def readFile(file):
     cats = {
          "Grocery": 1,
          "Merchandise": 2,
          "Other": 3,
          "Entertainment":4,
          "Dining" : 5,
          "Travel" : 6,
          "Gas/Automotive" : 7,
          "Insurance" : 8,
          "Clothing" : 9
      

        }
    
     conn = None
     vendor_id = None
     try:
        
        # connect to the PostgreSQL database
        conn = psycopg2.connect("host=localhost dbname=moneymanagement user=c1user password=c1user")
        # create a new cursor
        cur = conn.cursor()
        readCSV = csv.reader(file, delimiter=',')
        next(readCSV)
	id = None
        cur.execute("INSERT INTO users VALUES (%s, %s, %s, %s, %s) RETURNING id",(1,"Test","person","12345","test@test.com"))
	for key in cats: 	
		cur.execute("INSERT INTO categories VALUES (%s,%s)",(cats[key],key))
        
	for row in readCSV:
           
           tid = row[0] 
           category = cats[row[1]]
           amount = row[2]
           date = row[3]
           userID = 1
           name = "placeholder"
           location = "placeholder"
           item = (tid,userID,category,amount,date,name,location)
           
           cur.execute("INSERT INTO transactions VALUES (%s, %s, %s, %s, %s, %s, %s)",item)
           
        conn.commit()     
        
        
     except (Exception, psycopg2.DatabaseError) as error:
       print(error)
     finally:
        if conn is not None:
            conn.close()

readFrom = 'sample_output.csv'
csvFile = open(readFrom)
readFile(csvFile)
