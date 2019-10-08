## Database

1. `pip install -r requirements.txt`

1. Install postgres. Instructions [here](https://pgdash.io/blog/postgres-11-getting-started.html)

1. Change user to the postgres user and create a new db owned by a new user
  
  ```
  sudo su - postgres
  createdb -O c1user moneymanagement
  ```
  

4. Change the `.env` file to match your new user and db, i.e.

  ```export DATABASE_URL="postgresql://c1user:password@localhost/moneymanagement"```

5. Run the migration
  ```
  python manage.py db upgrade
  python manage.py db migrate
  ```
