import sys
from pathlib import Path

import pandas as pd
from sklearn.linear_model import LinearRegression


def main() -> None:
    try:
        if len(sys.argv) < 2:
            print("ERRO:Caminho do arquivo temporário não informado")
            sys.exit(1)

        temp_path = Path(sys.argv[1]).resolve()

        if not temp_path.exists():
            print(f"ERRO:Arquivo não encontrado: {temp_path}")
            sys.exit(1)

        df = pd.read_json(temp_path)

        df_clean = df.dropna(subset=["t_com", "t_amb", "u_amb"])
        if len(df_clean) < 5:
            print("ERRO:Dados insuficientes para treinar")
            sys.exit(1)

        features = ["t_amb", "u_amb"]
        target = "t_com"

        X = df_clean[features]
        y = df_clean[target]

        model = LinearRegression()
        model.fit(X, y)
        coef_T_Amb = model.coef_[0]
        coef_U_Amb = model.coef_[1]
        intercept_ = model.intercept_

        print(f"{coef_T_Amb},{coef_U_Amb},{intercept_}")

    except Exception as exc:
        print(f"ERRO:{exc}")
        sys.exit(1)


if __name__ == "__main__":
    main()