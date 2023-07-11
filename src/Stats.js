import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase";
import { uid } from "uid";
import { onValue, ref, set, remove } from "firebase/database";
import { database } from "./firebase";
import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Stats.css";
function Stats() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [spent, setSpent] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(database, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data != null) {
            const sortedData = Object.values(data).sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });
            setTodos(sortedData);
          }
        });
      }
    });
  }, []);

  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  const filteredData = () => {
    const currentDate = new Date();
    switch (filter) {
      case "monthly":
        return todos.filter((todo) => {
          const todoDate = new Date(todo.date);
          return (
            todoDate.getMonth() === currentDate.getMonth() &&
            todoDate.getFullYear() === currentDate.getFullYear()
          );
        });
      case "yearly":
        return todos.filter((todo) => {
          return (
            new Date(todo.date).getFullYear() === currentDate.getFullYear()
          );
        });
      case "weekly":
        const currentWeekStart = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay())
        );
        const currentWeekEnd = new Date(
          currentDate.setDate(currentDate.getDate() + 6)
        );
        return todos.filter((todo) => {
          const todoDate = new Date(todo.date);
          return todoDate >= currentWeekStart && todoDate <= currentWeekEnd;
        });
      default:
        return todos;
    }
  };

  return (
    <div>
      <br />
      <br />

      <div>
        <button className="button-81" onClick={() => handleFilter("all")}>
          All
        </button>
        <button className="button-81" onClick={() => handleFilter("monthly")}>
          Monthly
        </button>
        <button className="button-81" onClick={() => handleFilter("yearly")}>
          Yearly
        </button>
        <button className="button-81" onClick={() => handleFilter("weekly")}>
          Weekly
        </button>
      </div>

      <LineChart
        width={1250}
        height={650}
        data={filteredData()}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="spent" stroke="#82ca9d" />
        {/* <Line type="monotone" dataKey="date" stroke="#82ca9d" /> */}
      </LineChart>
      <Link
        to="https://buy.stripe.com/test_7sIaFI7M65hc3IIdQS"
        className="button-35">
        Predict
      </Link>
    </div>
  );
}

export default Stats;
