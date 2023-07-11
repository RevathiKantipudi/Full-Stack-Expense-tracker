import React from "react";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GetStarted from "./GetStarted";
import Login from "./Login";
import SignIn from "./SignIn";
import Main from "./Main";
import Stats from "./Stats";
import Predict from "./Predict";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/main" element={<Main />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
