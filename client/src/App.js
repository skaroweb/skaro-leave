import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Route, Routes, Navigate, Router } from "react-router-dom";

import Main2 from "./components/Main/index2";
import Signup from "./components/Signup";
import Login from "./components/Login";

import OverallReport from "./components/OverallReport";
import Profile from "./components/Profile";

import ViewUserDetails from "./components/Singleprofile";
import EmpLeaves from "./components/Singleprofile/empLeaves";
import My404Component from "./components/404";
import Contact from "./components/contact";
import "./app.css";
import { useDispatch, useSelector } from "react-redux";
import { setAdminProfile } from "./store/adminProfileSlice";
import { setEmpProfile } from "./store/empProfileSlice";

function App() {
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const dispatch = useDispatch();
  const adminProfile = useSelector((state) => state.adminProfile);

  // const [boxes, setBoxes] = useState([]);
  // const user = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const admin = "mithu@skarosoft.com";

  useEffect(() => {
    // Your logic to get the token
    const token = localStorage.getItem("token"); // Replace with your actual logic to retrieve the token
    setToken(token);

    // Decode the JWT token
    if (token) {
      const decodedToken = jwt_decode(token);
      setCurrentUserId(decodedToken._id);
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        if (currentUserId) {
          const response = await axios.get(
            `https://leave-monitoring.onrender.com/api/employeeinfo/${currentUserId}`
          );
          const EmpAll = await axios.get(
            `https://leave-monitoring.onrender.com/api/employeeinfo/`
          );

          const profile = response.data;

          dispatch(setAdminProfile(profile));
          dispatch(setEmpProfile(EmpAll.data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUserProfile();
  }, [currentUserId, dispatch]);
  //console.log(adminProfile.isAdmin === true);
  return (
    <div className="App">
      <Routes>
        {email && <Route path="/" exact element={<Main2 />} />}

        {/* {user && <Route path="/" exact element={<Main />} />} */}
        {!email && (
          <Route path="/" element={<Navigate replace to="/login" />} />
        )}
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/login" exact element={<Login />} />
        {/* {email === admin && <Route path="/update" exact element={<Update />} />} */}

        {email === adminProfile?.email && (
          <Route exact path="/overall-report" element={<OverallReport />} />
        )}
        <Route path="/profile" exact element={<Profile />} />
        {email && (
          <Route exact path="/profile/:id" element={<ViewUserDetails />} />
        )}
        <Route exact path="/profile/:id/:id" element={<EmpLeaves />} />
        <Route exact path="/contact" element={<Contact />} />

        <Route path="*" element={<My404Component />} />
      </Routes>
    </div>
  );
}

export default App;
