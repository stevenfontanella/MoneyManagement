import pandas as pd
from sys import exit
from collections import namedtuple
import numpy as np

from keras.layers import LSTM, Dense
from keras.optimizers import Adam
from sklearn.preprocessing import OneHotEncoder

NUM_PEOPLE = 3

# frequency - average days per transaction of this type
summary = namedtuple("summary", ("mean", "var", "frequency"))

# TODO: put this into a class
# initialization should create the summaries and possibly category counts to sample from

def sample_from_cat(category, summary):
    mean, var, freq = summary
    to_wait = round(np.random.exponential(freq))
    return pd.Series({"Price": np.random.exponential(mean), "Date": to_wait})

def generate(n, categories, summaries):
    cats = categories.sample(n, replace=True)
    cats.reset_index(inplace=True, drop=True)

    df = pd.DataFrame({"Category": cats})
    newcols = df.Category.apply(lambda category: sample_from_cat(category, summaries[category]))
    df = pd.concat((df, newcols), axis=1)

    return df

def try2(data):
    # encoder = OneHotEncoder(handle_unknown='ignore')
    encoder = OneHotEncoder()
    print(encoder.fit_transform(data["Category"]))


if __name__ == "__main__":
    data = pd.read_csv("data.csv")

    # remove missing
    data = data[data.Price.notna()]
    # remove outlier
    data = data[data["Other"] != "extreme outlier"]
    data = data[["Category", "Price"]]

    data = data.join(pd.get_dummies(data.Category))
    data.drop("Category", 1, inplace=True)
    print(data.head())
    # print(pd.get_dummies(data.Category))
    exit()

    print(data.head())

    try2(data)
    exit()

    groups = data.groupby("Category")

    categories = data.Category.unique()
    summaries = {}

    for cat, df in groups:
        m = df.Price.mean()
        var = df.Price.var()
        freq = 30/len(df)/NUM_PEOPLE

        summaries[cat] = summary(m, var, freq)

    pd.options.display.float_format = '${:,.2f}'.format
    d = generate(100, data.Category, summaries)
    print(d)
    # d.to_csv("sample_data.csv")
