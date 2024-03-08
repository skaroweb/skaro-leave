import "./EmpReport.css";
const EmpReport = (props) => {
  return (
    <div className="col-md-5">
      <div className="main-leave">
        <div className="sub-leave">
          <div>Name</div>
          <div>No. of WFH Days</div>
        </div>
        {Object.entries(props.leaveCountName).map(([id, { count, name }]) => (
          <div className="sub-leave" key={id}>
            <div>{name}</div>
            <div>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EmpReport;
