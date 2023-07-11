import React, { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { database, auth } from "./firebase";
import * as tf from "@tensorflow/tfjs";
import "./Predict.css";
function PredictionPage() {
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const userPath = `/${user.uid}`;
        const expensesRef = ref(database, userPath);
        onValue(expensesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const expenseList = Object.values(data);
            setExpenses(expenseList);
          }
        });
      }
    };

    fetchExpenses();
  }, []);

  const handlePrediction = async () => {
    // Prepare and preprocess the fetched expense data
    const trainingData = expenses.map((expense) => ({
      date: new Date(expense.date).getTime(),
      spent: parseFloat(expense.spent),
    }));

    // Convert the data into tensors
    const dates = tf.tensor1d(trainingData.map((data) => data.date));
    const expenseValues = tf.tensor1d(trainingData.map((data) => data.spent)); // Renamed the variable here

    // Create and train the model
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
    await model.fit(dates, expenseValues, { epochs: 100 }); // Use the renamed variable here

    // Predict the upcoming expenses based on user input
    const futureDate = new Date("2023-06-30").getTime();
    const predictedExpenses = model.predict(tf.tensor2d([[futureDate]]));

    // Get the predicted expense value
    const [predictionValue] = predictedExpenses.dataSync();

    // Update the prediction state
    setPrediction(predictionValue);
  };

  return (
    <div>
      <br />
      <br />
      <h1 className="predictTitle">Predict Upcoming Expenses</h1>
      <button className="button-40" onClick={handlePrediction}>
        Predict
      </button>
      {prediction && (
        <div>
          <h1>
            Your Upcoming Expenses are Predicted as Rs.{" "}
            {Math.abs((prediction / 100000000).toFixed(2))}
          </h1>
        </div>
      )}
      <br />
      <div class="simple-shape one"></div>
      <div class="simple-shape two"></div>
      <div class="simple-shape three"></div>
      <div class="simple-shape four"></div>
    </div>
  );
}

export default PredictionPage;
