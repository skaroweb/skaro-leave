import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Route, Routes, Navigate } from "react-router-dom";

import Main2 from "./components/Main/index2";

import Login from "./components/Login";

import OverallReport from "./components/OverallReport";
import Profile from "./components/Profile";

import ViewUserDetails from "./components/Singleprofile";
import EmpLeaves from "./components/Singleprofile/empLeaves";
import My404Component from "./components/404";

import "./app.css";
import { useDispatch, useSelector } from "react-redux";
import { setAdminProfile } from "./store/adminProfileSlice";
import { setEmpProfile } from "./store/empProfileSlice";
import WFH from "./components/WFH";

function App() {
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [adminMain, setAdminMain] = useState([]);

  const dispatch = useDispatch();
  const adminProfile = useSelector((state) => state.adminProfile);
  const serverURL = process.env.REACT_APP_SERVER_URL;

  // const [boxes, setBoxes] = useState([]);
  // const user = localStorage.getItem("token");
  const email = localStorage.getItem("email");

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
            `${serverURL}/api/employeeinfo/${currentUserId}`
          );
          const EmpAll = await axios.get(`${serverURL}/api/employeeinfo/`);
          const Admin = EmpAll.data
            .filter((currentValue) => {
              return currentValue.isAdmin === true;
            })
            .map((currentValue) => {
              return currentValue.email;
            });
          setAdminMain(Admin.join(", "));
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

        <Route path="/login" exact element={<Login />} />
        {/* {email === admin && <Route path="/update" exact element={<Update />} />} */}

        {email === adminProfile?.email && (
          <Route exact path="/overall-report" element={<OverallReport />} />
        )}
        {email === adminProfile?.email && (
          <Route exact path="/wfh" element={<WFH />} />
        )}
        <Route path="/profile" exact element={<Profile />} />
        {email && (
          <Route exact path="/profile/:id" element={<ViewUserDetails />} />
        )}
        <Route exact path="/profile/:id/:id" element={<EmpLeaves />} />

        <Route path="*" element={<My404Component />} />
      </Routes>
    </div>
  );
}

export default App;
