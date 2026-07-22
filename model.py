import tensorflow as tf
from tensorflow.keras import layers, models

def build_model(input_dim):

    inputs = layers.Input(shape=(input_dim,))

    # Graph-like transformation (RMBN concept simulation)
    x = layers.Dense(64, activation='relu')(inputs)

    # Attention-like layer
    attention = layers.Dense(64, activation='tanh')(x)
    attention = layers.Dense(64, activation='softmax')(attention)
    x = layers.Multiply()([x, attention])

    x = layers.Dense(32, activation='relu')(x)

    outputs = layers.Dense(3, activation='softmax')(x)

    model = models.Model(inputs, outputs)
    return model