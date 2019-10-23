# -*- coding: utf-8 -*-
from flask import redirect, render_template, request, jsonify
from flask import g, Blueprint, flash, url_for, session
from app.models.transaction import Transaction
from datetime import date

blueprint = Blueprint('transactions', __name__, url_prefix='/transactions')

@blueprint.route("/")
def get_all_transactions():
    trans = Transaction.query.all()
    return jsonify(list(map(Transaction.serialize, trans)))

@blueprint.route("/get_cat_<int:cat_id>")
def get_cat(cat_id):
    if not(1<=cat_id<=9):
        return
    trans = Transaction.query.filter_by(category=cat_id).all()
    return jsonify(list(map(Transaction.serialize, trans)))

@blueprint.route("/get_date_<int:month>-<int:day>-<int:year>")
def get_date(month, day, year):
    if not(1<=month<=12):
        return
    if (not(1<=day<=28) and (month == 2)):
        return
    if (not(1<=day<=30) and (month in {4,6,9,11})):
        return
    if (not(1<=day<=31) and (month in {1,3,5,7,8,10,12})):
        return
    if (year<0):
        return
    _date = date(year=year,month=month,day=day)
    print(_date)
    trans = Transaction.query.filter_by(date=_date).all()
    return jsonify(list(map(Transaction.serialize, trans)))

@blueprint.route("/get_date_range_<int:month_i>-<int:day_i>-<int:year_i>_to_<int:month_f>-<int:day_f>-<int:year_f>")
def get_date_range(month_i, day_i, year_i, month_f, day_f, year_f):
    start = date(year=year_i,month=month_i,day=day_i)
    end = date(year=year_f,month=month_f,day=day_f)

    trans = Transaction.query.filter(Transaction.date>=start).filter(end>=Transaction.date)
    return jsonify(list(map(Transaction.serialize, trans)))


@blueprint.route("/get_month_<int:month>-<int:year>")
def get_month(month, year):
    if not(1<=month<=12):
        return
    if (year<0):
        return

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
