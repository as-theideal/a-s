import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { useEffect, useState } from "react";
import SignUp from "./components/SignUp";
import Login from "./components/LogIn";
import Home from "./components/home/Home";
import User from "./components/user/User";
import Courses from "./components/course/Course";
import Years from "./components/years/Years";
import Admin from "./components/admin/Admin";
import Success from "./components/success/Success";
import supabase from "./Supabase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const getUserData = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      if (localStorage.getItem("sb-sqbvwnxsbocvrdxbpsfu-auth-token")) {
        setIsLoggedIn(true);
        localStorage.getItem("sb-sqbvwnxsbocvrdxbpsfu-auth-token");
        setUserName(
          JSON.parse(
            localStorage.getItem("sb-sqbvwnxsbocvrdxbpsfu-auth-token")
          ).user.user_metadata.name.split(" ")[0]
        );
      } else {
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) {
            setIsLoggedIn(true);
            setUserName(data.user.user_metadata.name);
          }
        });
      }
    }
  }, [isLoggedIn, setIsLoggedIn]);
  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userName={userName}
      />
      <Routes>
        <Route exact path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<SignUp sendUserData={getUserData} />} />
        <Route path="/login" element={<Login sendUserData={getUserData} />} />
        <Route path="/user" element={<User isLoggedIn={isLoggedIn} />} />
        <Route path="/user/course/*" element={<Courses />} />
        <Route path="/years/*" element={<Years />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/success/*" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
