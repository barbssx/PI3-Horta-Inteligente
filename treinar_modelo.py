import pandas as pd
from sklearn.linear_model import LinearRegression
import sys
import json

try:
    df = pd.read_json('temp_data.json')

    df_clean = df.dropna(subset=['t_com', 't_amb', 'u_amb'])
    if len(df_clean) < 5:
        print("ERRO:Dados insuficientes para treinar")
        sys.exit(1)

    features = ['t_amb', 'u_amb']
    target = 't_com'

    X = df_clean[features]
    y = df_clean[target]

    model = LinearRegression()
    model.fit(X, y)
    coef_T_Amb = model.coef_[0]
    coef_U_Amb = model.coef_[1]
    intercept_ = model.intercept_

    print(f"{coef_T_Amb},{coef_U_Amb},{intercept_}")

except Exception as e:
    print(f"ERRO:{e}")
    sys.exit(1)