import streamlit as st
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

# --- Authentication Section ---
if 'logged_in' not in st.session_state:
    st.session_state['logged_in'] = False

if not st.session_state['logged_in']:
    st.title("🔒 Login")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    
    if st.button("Login"):
        if email == "admin@example.com" and password == "password123":
            st.session_state['logged_in'] = True
            st.rerun()
        else:
            st.error("Invalid email or password")
    
    st.stop()
# ------------------------------

# Load model
model = tf.keras.models.load_model("student_model.h5")

st.title("🎓 AI Student Performance Prediction")

st.subheader("Enter Student Details")

grades = st.slider("Academic Grade", 0, 100)
attendance = st.slider("Attendance (%)", 0, 100)
research = st.selectbox("Research Participation", [0, 1])
internship = st.selectbox("Internship", [0, 1])
scholarship = st.selectbox("Scholarship", [0, 1])

if st.button("Predict"):

    input_data = np.array([[grades, attendance, research, internship, scholarship]])

    scaler = StandardScaler()
    input_data = scaler.fit_transform(input_data)

    prediction = model.predict(input_data)
    risk_class = np.argmax(prediction)

    if risk_class == 0:
        st.success("Low Risk Student ✅")
    elif risk_class == 1:
        st.warning("Medium Risk Student ⚠️")
    else:
        st.error("High Risk Student ❌")

    st.write("Prediction Probabilities:", prediction)