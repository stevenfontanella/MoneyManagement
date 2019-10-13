# -*- coding: utf-8 -*-
from flask import redirect, render_template, request, jsonify
from flask import g, Blueprint, flash, url_for, session
from app.models.transaction import Transaction

blueprint = Blueprint('transactions', __name__, url_prefix='/transactions')

@blueprint.route("/")
def get_all_transactions():
    trans = Transaction.query.all()
    return jsonify(list(map(Transaction.serialize, trans)))
