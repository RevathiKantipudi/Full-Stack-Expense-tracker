import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import "./Signin.css";
import { Link } from "react-router-dom";
function CreateACC() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [accountCreated, setAccountCreated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const user = userCredential.user;
      setAccountCreated(true);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <div>
        <h1 className="reguser">Register User</h1>
        <input
          placeholder="Email"
          className="signIN"
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <br />
        <input
          placeholder="Username"
          className="signIN"
          onChange={(event) => {
            setRegisterUsername(event.target.value);
          }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          className="signIN"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <br />
        <button className="button-37" onClick={register}>
          Create User
        </button>
        {accountCreated && (
          <>
            <br />
            <br />

            <Link to="/login" className="button-38">
              Click Here
            </Link>
            <h1>Account Created!</h1>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateACC;
