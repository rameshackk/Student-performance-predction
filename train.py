import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.utils import to_categorical
from model import build_model

# Load data
df = pd.read_csv("data.csv")

X = df.drop("risk", axis=1)
y = df["risk"]

# Normalize
scaler = StandardScaler()
X = scaler.fit_transform(X)

# One-hot encode labels
y = to_categorical(y, 3)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = build_model(input_dim=X.shape[1])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train, y_train, epochs=50, verbose=1)

model.save("student_model.h5")