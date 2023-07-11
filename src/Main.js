import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { uid } from "uid";
import { onValue, ref, set, remove } from "firebase/database";
import { database } from "./firebase";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [spent, setSpent] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(database, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data != null) {
            const todosArray = Object.values(data).sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            setTodos(todosArray);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const writeToDB = () => {
    const uidd = uid();
    set(ref(database, `/${auth.currentUser.uid}/${uidd}`), {
      title: title,
      date: date,
      spent: spent,
      uidd: uidd,
    });
    setTitle("");
    setDate("");
    setSpent("");
  };

  const deleteFromDB = (uidd) => {
    remove(ref(database, `/${auth.currentUser.uid}/${uidd}`));
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="App">
      <br />
      <h1 className="welcomeTitle">Welcome: {user?.email}</h1>
      <br />
      <br />
      <br />
      <br />
      <br />
      <button className="sgnoutbtn button-85" onClick={logout}>
        Sign Out
      </button>
      <br />
      <br />
      <br />
      <br />

      <input
        className="inp"
        type="text"
        placeholder="Title"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <br />
      <br />
      <br />
      <br />

      <input
        className="inp"
        type="date"
        placeholder="Date"
        onChange={(event) => setDate(event.target.value)}
        value={date}
      />
      <br />
      <br />
      <br />
      <br />

      <input
        className="inp"
        type="number"
        placeholder="Spent"
        onChange={(event) => setSpent(event.target.value)}
        value={spent}
      />
      <br />
      <br />
      <br />
      <br />
      <button onClick={writeToDB} className="sgnoutbtn button-85">
        Add
      </button>
      <br />
      <br />
      <br />
      <br />
      <br />

      <Link to="/stats" className="button-59">
        STATISTICS
      </Link>
      <br />
      <br />
      <br />
      <br />
      {todos.map((todo) => (
        <div key={todo.uidd} className="booxx">
          <h1>Title: {todo.title}</h1>
          <h1>Date: {todo.date}</h1>
          <h1>Spent: {todo.spent}</h1>
          <button
            className="button-57"
            onClick={() => deleteFromDB(todo.uidd)}
            role="button">
            <span className="text">Delete</span>
            <span>Bye</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Main;
