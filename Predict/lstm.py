import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from sklearn.model_selection import train_test_split

data = pd.read_csv("sample_data.csv")
prices = data.Price

SEQ_LEN = 30

max_ = prices.max()
print(max_)

def n_grams(xs, n):
    for start in range(len(xs) - n):
        yield xs[start:start+n]

def make_model():
    model = Sequential((
        LSTM(1, batch_input_shape=(1, SEQ_LEN, 1)),
    ))

    optim = Adam()
    model.compile(optim, loss=mean_squared_error, metrics=[mean_squared_error])

    return model

if __name__ == "__main__":
    obs = list(n_grams(prices, SEQ_LEN+1))
    X = np.array([ob[:-1] for ob in obs])
    y = np.array([ob.tail(1).item() for ob in obs])

    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=.2)
    del X; del y;

    m = make_model()
    m.fit(np.expand_dims(x_train, 2), y_train)
    m.evaluate(np.expand_dims(x_test, 2), y_test)
    y_hat = m.predict(np.expand_dims(x_test, 2))

    pd.DataFrame({"y_hat": y_hat.squeeze()*max_, "y": y_test}).plot()
    plt.show()
