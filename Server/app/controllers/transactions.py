# -*- coding: utf-8 -*-
from flask import redirect, render_template, request, jsonify
from flask import g, Blueprint, flash, url_for, session
from app.models.transaction import Transaction
from datetime import date

blueprint = Blueprint('transactions', __name__, url_prefix='/transactions')

#===========================================================================
#Get all transactions from transaction table
#===========================================================================
@blueprint.route("/")
def get_all_transactions():
    trans = Transaction.query.all()
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions with category ID {cat_id}
#===========================================================================
@blueprint.route("/get_catID_<int:cat_id>")
def get_catID(cat_id):
    if not(1<=cat_id<=9):
        return jsonify(list())
    trans = Transaction.query.filter_by(category=cat_id).all()
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions with category name {cat}
#===========================================================================
@blueprint.route("/get_cat_<cat>")
def get_cat(cat):
    cats = {
          "grocery": 1,
          "merchandise": 2,
          "other": 3,
          "entertainment":4,
          "dining" : 5,
          "travel" : 6,
          "gas" : 7,
          "insurance" : 8,
          "clothing" : 9
        }
    if not (cat in cats):
        return jsonify(list())
    trans = Transaction.query.filter_by(category = cats[cat.lower()]).all()
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions with all categories given by catVector
    #   catVector should be an integer between 0 and 511, inclusive.
    #   Each of the 9 bits in the vector represent a category
    #   if bit i == 1 (1<=i<=9) then get_cats will return transactions with catID == i
#===========================================================================
@blueprint.route("/get_cats_<int:catVector>")
def get_cats(catVector):
    if not(0<=catVector<512):
        return jsonify(list())
    
    cats = []
    for i in range(9):
        if ((catVector&(2**i)) != 0):
            cats.append(9-i)

    trans = Transaction.query.filter(Transaction.category.in_(cats))
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions for a given date of the form month/day/year  
#===========================================================================
@blueprint.route("/get_date_<int:month>-<int:day>-<int:year>")
def get_date(month, day, year):
    if not(1<=month<=12):
        return jsonify(list())
    if (not(1<=day<=28) and (month == 2)):
        return jsonify(list())
    if (not(1<=day<=30) and (month in {4,6,9,11})):
        return jsonify(list())
    if (not(1<=day<=31) and (month in {1,3,5,7,8,10,12})):
        return jsonify(list())
    if (year<0):
        return jsonify(list())
    _date = date(year=year,month=month,day=day)
    print(_date)
    trans = Transaction.query.filter_by(date=_date).all()
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions that occured bewteen an initial date and a final date
#===========================================================================
@blueprint.route("/get_date_range_<int:month_i>-<int:day_i>-<int:year_i>_to_<int:month_f>-<int:day_f>-<int:year_f>")
def get_date_range(month_i, day_i, year_i, month_f, day_f, year_f):
    start = date(year=year_i,month=month_i,day=day_i)
    end = date(year=year_f,month=month_f,day=day_f)

    trans = Transaction.query.filter(Transaction.date>=start).filter(end>=Transaction.date)
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions from a given month of a year 
#===========================================================================
@blueprint.route("/get_month_<int:month>-<int:year>")
def get_month(month, year):
    if not(1<=month<=12):
        return jsonify(list())
    if (year<0):
        return jsonify(list())

    start = date(year=year,month=month,day=1)
    if (month==2):
        day = 28
    elif (month in {4,6,9,11}):
        day = 30
    else:
        day = 31
    end = date(year=year,month=month,day=day)

    trans = Transaction.query.filter(Transaction.date>=start).filter(end>=Transaction.date)
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions for a given month and year that have catID {cat_id}
#===========================================================================  
@blueprint.route("/get_cat_<int:cat_id>_for_<int:month>-<int:year>")
def get_cat_for_month(cat_id, month, year):
    if not(1<=month<=12 and 1<=cat_id<=9 and year>=0):
        return jsonify(list())

    start = date(year=year,month=month,day=1)
    if (month==2):
        day = 28
    elif (month in {4,6,9,11}):
        day = 30
    else:
        day = 31
    end = date(year=year,month=month,day=day)

    trans = Transaction.query.filter(Transaction.date>=start).filter(end>=Transaction.date).filter(Transaction.category==cat_id)
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Get transactions for a given month and year that have category in catVector
#===========================================================================  
@blueprint.route("/get_cats_<int:catVector>_for_<int:month>-<int:year>")
def get_cats_for_month(catVector, month, year):
    if not(1<=month<=12 and 0<=catVector<=511 and year>=0):
        return jsonify(list())

    cats = []
    for i in range(9):
        if ((catVector&(2**i)) != 0):
            cats.append(9-i)

    start = date(year=year,month=month,day=1)
    if (month==2):
        day = 28
    elif (month in {4,6,9,11}):
        day = 30
    else:
        day = 31
    end = date(year=year,month=month,day=day)

    trans = Transaction.query.filter(Transaction.date>=start).filter(end>=Transaction.date).filter(Transaction.category.in_(cats))
    return jsonify(list(map(Transaction.serialize, trans)))


#===========================================================================
#Prediction Endpoint
#===========================================================================
@blueprint.route("/get_prediction_for_<int:month>-<int:year>")
def get_prediction(month, year):
    pass

