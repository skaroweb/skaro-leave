import { useEffect, useState } from "react";
import axios from "axios";
import "./EmpReport.css";
const EmpReport = (props) => {
  return (
    <div className="col-md-5">
      <div className="main-leave">
        <div className="sub-leave">
          <div>Name</div>
          <div>No. of Absent Days</div>
          <div>Unused Leave</div>
        </div>
        {Object.entries(props.leaveCountName).map(([id, { count, name }]) => (
          <div className="sub-leave" key={id}>
            <div>{name}</div>
            <div>{count}</div>
            <div>{36 - count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EmpReport;
