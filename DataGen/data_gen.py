import pandas as pd
from sys import exit
from collections import namedtuple
import numpy as np
from math import ceil, sin, pi
import matplotlib.pyplot as plt
import random

#from keras.layers import LSTM, Dense
#from keras.optimizers import Adam
#from sklearn.preprocessing import OneHotEncoder

# day of the year -> spending multiplier
season = lambda x: 1 + .1 * sin(2*pi*x/365)

# number of people who entered data into the csv
NUM_PEOPLE = 3

# frequency - average days per transaction of this type
summary = namedtuple("summary", ("mean", "var", "frequency"))

myDict = {
          "Grocery": ["Weis","Wegmans","Target","Walmart"],
          "Merchandise": ["Walmart","Target","Amazon"],
          "Other": ["Walmart","Amazon","Target","Bookstore"],
          "Entertainment":["Amazon","Steam","Walmart","TicketMaster","Stubhub"],
          "Dining" : ["McDonalds","UberEats","Taco Bell"],
          "Travel" : ["Southwest","Enterprise"],
          "Gas/Automotive" : ["Exxon","Sheetz"],
          "Insurance" : ["AAA","Allstate"],
          "Clothing" : ["Mclanahan's"]
        }
locations = {
        "Walmart": ["North Atherton","Benner Pike"],
        "Target": ["Colonnade Blvd","Beaver Ave"],
        "Weis": ["Westerly Pkwy","Martin St","Rolling Ridge"],
        "Wegmans": ["Colonnade Blvd"],
        "Amazon": ["Internet"],
        "Bookstore": ["College Ave"],
        "TicketMaster": ["Internet"],
        "Steam": ["Internet"],
        "Stubhub": ["Internet"],
        "McDonalds": ["College Ave","N Atherton","S Atherton"],
        "Taco Bell": ["College Ave","Rolling Ridge Dr"],
        "Southwest": ["Internet"],
        "Enterprise": ["Blue Course Dr"],
        "Exxon": ["N Atherton","S Allen St","W Aaron Drive","W College Ave"],
        "Sheetz": ["S Pugh St","N Atherton","Southridge Plaza","Colonnade Blvd"],
        "UberEats": ["Internet"],
        "AAA": ["Internet"],
        "Allstate": ["Internet"],
        "Mclanahan's": ["College Ave"]        
        }
# TODO: put this into a class
# initialization should create the summaries and possibly category counts to sample from

def sample_from_cat(category, summary):
    mean, var, freq = summary
    to_wait = ceil(np.random.exponential(freq))
    name = random.choice(myDict[category])
    return pd.Series({"Price": np.random.exponential(mean), "Date": to_wait,"Name": name, "Location": random.choice(locations[name])})

def generate(n, categories, summaries, start_date):
    cats = categories.sample(n, replace=True)
    cats.reset_index(inplace=True, drop=True)

    df = pd.DataFrame({"Category": cats})
    newcols = df.Category.apply(lambda category: sample_from_cat(category, summaries[category]))
    df = pd.concat((df, newcols), axis=1)

    datecol = start_date + pd.to_timedelta(df.Date.cumsum(), unit='d')
    print(datecol)
    df.Date = datecol

    return df

def try2(data):
    # encoder = OneHotEncoder(handle_unknown='ignore')
    encoder = OneHotEncoder()
    print(encoder.fit_transform(data["Category"]))


if __name__ == "__main__":
    np.random.seed(10)
    data = pd.read_csv("data.csv")

    # remove missing
    data = data[data.Price.notna()]
    # remove outlier
    data = data[data["Other"] != "extreme outlier"]
    data = data[["Category", "Price"]]

    groups = data.groupby("Category")

    categories = data.Category.unique()
    summaries = {}

    for cat, df in groups:
        m = df.Price.mean()
        var = df.Price.var()
        freq = 30/len(df)/NUM_PEOPLE

        summaries[cat] = summary(m, var, freq)

    d = generate(1000, data.Category, summaries, pd.to_datetime("9/12/2019"))
    mults = d.Date.apply(lambda d: season(d.dayofyear), 1)
    print(mults)
    d.Price *= d.Date.apply(lambda d: season(d.dayofyear), 1)

    s = d.to_string(formatters={"Price": "${:,.2f}".format})
    print(s)
    d.plot(x="Date", y="Price")
    plt.show()
    d.to_csv("sample_data.csv")
