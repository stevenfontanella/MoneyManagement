import pandas as pd
from sys import exit
from collections import namedtuple
import numpy as np

summary = namedtuple("summary", ("mean", "var"))

# TODO: put this into a class
# initialization should create the summaries and possibly category counts to sample from

def sample_from_cat(category, summary):
    mean, var = summary
    return np.random.exponential(mean)

def generate(n, categories, summaries):
    cats = categories.sample(n, replace=True)
    cats.reset_index(inplace=True, drop=True)

    prices = cats.apply(lambda category: sample_from_cat(category, summaries[category]))
    prices.reset_index(inplace=True, drop=True)

    return pd.DataFrame({"Category": cats, "Price": prices})

if __name__ == "__main__":
    data = pd.read_csv("data.csv")
    data = data[data.Price.notna()]

    groups = data.groupby("Category")

    categories = data.Category.unique()
    summaries = {}
    num_per_cat = {}

    for cat, df in groups:
        m = df.Price.mean()
        var = df.Price.var()
        num_per_cat[cat] = len(df)

        summaries[cat] = summary(m, var)

    pd.options.display.float_format = '${:,.2f}'.format
    d = generate(100, data.Category, summaries)
    print(d)
