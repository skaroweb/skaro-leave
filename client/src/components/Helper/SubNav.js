import { useEffect, useState } from "react";
import axios from "axios";
import "./SubNav.css";
import { useDispatch } from "react-redux";
import { setName } from "../../store/nameSlice";

const SubNav = () => {
  const [profilepic, setProfilePic] = useState([]);
  const dispatch = useDispatch();

  const email = localStorage.getItem("email");
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/employeeinfo/")
      .then((res) => {
        let profile = res.data.filter((user) => {
          return user.email === email;
        });
        setProfilePic(profile);
        dispatch(setName(profile[0]?.name));
      })
      .catch((err) => console.log(err, "it has an error"));
  }, []);

  return (
    <>
      <nav className="subnav pt-3 pb-3 pe-3 navbar navbar-expand navbar-dark">
        <div className="px-0 container-fluid">
          <div className="d-flex justify-content-end w-100">
            {/* <div className="d-flex align-items-center">
              <button
                id="sidebar-toggle"
                type="button"
                className="sidebar-toggle d-none d-lg-inline-block align-items-center justify-content-center me-3 btn btn-icon-only btn-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="toggle-icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div> */}
            <div className="align-items-center navbar-nav">
              {profilepic.map((user, index) => {
                return (
                  <div key={index} className="media d-flex align-items-center">
                    <div className="media-body">
                      <span className="mb-0 font-small fw-bold">
                        {user.name}
                      </span>
                      <span className="mb-0 font-small ">skarosoft</span>
                    </div>
                    <img
                      src={user.uploaded_file}
                      className="user-avatar md-avatar rounded-circle"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default SubNav;
