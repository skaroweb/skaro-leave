import React, { useEffect, useState } from "react";
import axios from "axios";

function Update_single_profile(props) {
  //console.log(props.user.id);
  const initialValues = {
    email: "",
  };
  const [values, setValues] = useState(initialValues);

  const updateUser = async (event) => {
    try {
      await axios.put(
        "https://leave-monitoring.onrender.com/api/employeeinfo/" +
          props.user.id,
        {
          email: "values.email222",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <form className="form">
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col">
              <div className="form-group">
                {" "}
                <label>Full Name</label>{" "}
                <input
                  className="form-control"
                  type="text"
                  name="email"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex justify-content-end">
          {" "}
          <button className="btn btn-primary" onClick={updateUser}>
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
export default Update_single_profile;
