import datetime
from datetime import datetime as dt
from fbprophet import Prophet
import pandas as pd

def days_in_month(month):
    last_month = month.replace(month=month.month-1)
    return (month.date() - last_month.date()).days

class ProphetModel():
    def __init__(self, df):
        '''
        df - DataFrame with columns named 'y' and 'ds'
        '''

        self.prophet = Prophet()
        self.prophet.fit(df)
        self.df = df

    def predict(self, month):
        '''
        month - datetime of the first of the month to predict
        return - predicted spending for that month
        '''
        num_days = days_in_month(month)
        latest = pd.to_datetime(self.df.ds.tail(1).item())
        num_future = (month - latest).days + num_days

        future = self.prophet.make_future_dataframe(periods=num_future)
        future['cap'] = 8.5
        fcst = self.prophet.predict(future)

        return sum(fcst.yhat.tail(num_days))

if __name__ == "__main__":
    data = pd.read_csv("sample_data.csv")\
             .rename({"Price":"y", "Date":"ds"}, axis=1)
    data.ds = data.ds.apply(lambda d: dt.strptime(d, "%Y-%m-%d"))
    print(data.tail())
    p = ProphetModel(data)

    # predicted = p.predict(dt.strptime("2030-12-01", "%Y-%m-%d"))
    predicted = p.predict(dt.combine(datetime.date(2022, 12, 1), dt.min.time()))
    print(predicted)
