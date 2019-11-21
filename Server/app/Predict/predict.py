from statsmodels.tsa.seasonal import seasonal_decompose
import matplotlib.pyplot as plt
import pandas as pd

path = "../DataGen/sample_data.csv"

def predict(month: pd.datetime, past: pd.DataFrame):
    pass

if __name__ == "__main__":
    df = pd.read_csv(path, index_col="Unnamed: 0", parse_dates=["Date"])\
            .set_index("Date")
    df.index.rename("date", inplace=True)

    print(df.index.inferred_freq)
    print(df.head())

    mul = seasonal_decompose(df.Price, model="multiplicative", extrapolate_trend='freq', freq=30)
    mul.plot()
    plt.show()
