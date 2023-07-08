import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SubNav from "../Helper/SubNav";
import Header from "../Header";
import ReactPaginate from "react-paginate";
import styles from "../OverallReport/DataTable.module.css";
import { useSelector } from "react-redux";
function EmpLeaves() {
  const [report, setReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); //Pagination
  const [filteredList, setFilteredList] = useState(report);

  // Selected Month filter
  const [selectedMonth, setSelectedMonth] = useState("");
  // Selected Year filter
  const [selectedYear, setSelectedYear] = useState();

  const [selectedStatus, setSelectedStatus] = useState("");

  //const [countLeave, setCountLeave] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, ascending: true });
  const [selectedDate, setSelectedDate] = useState({
    fromdate: "",
    todate: "",
  });
  const adminProfile = useSelector((state) => state.adminProfile);

  const location = useLocation();

  // Pagination
  const PER_PAGE = 5;
  const pageCount = Math.ceil(filteredList.length / PER_PAGE);
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  const offset = currentPage * PER_PAGE;

  // Function to handle sorting when the button is clicked
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.ascending) {
      direction = "descending";
    }
    const sorted = [...filteredList].sort((a, b) => {
      if (key === "name") {
        return direction === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (key === "date") {
        return direction === "ascending"
          ? new Date(a.applydate) - new Date(b.applydate)
          : new Date(b.applydate) - new Date(a.applydate);
      }
      return 0;
    });

    setFilteredList(sorted);
    setSortConfig({ key, ascending: direction === "ascending" });
  };

  useEffect(() => {
    axios
      .get("https://leave-monitoring.onrender.com/getusers")
      .then((response) => {
        let filteredArray = response.data.filter(function (obj) {
          return obj.status !== "pending";
        });
        let filteredArray2 = filteredArray.filter(function (obj) {
          return obj.currentuserid === location.state.user._id;
        });

        setReport(filteredArray2.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state.user._id]);

  const filterByStatus = (filteredData) => {
    // Avoid filter for empty string
    if (!selectedStatus) {
      return filteredData;
    }

    const filteredCars = filteredData.filter(
      (car) => car.status.split(" ").indexOf(selectedStatus) !== -1
    );
    return filteredCars;
  };

  const filterByDate = (filteredData) => {
    if (selectedDate.fromdate === "" || selectedDate.todate === "") {
      return filteredData;
    }

    const filteredCars = filteredData
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(
        (car) =>
          `${new Date(car.applydate).getFullYear()}-${(
            new Date(car.applydate).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(car.applydate)
            .getDate()
            .toString()
            .padStart(2, "0")}` >= selectedDate.fromdate &&
          `${new Date(car.applydate).getFullYear()}-${(
            new Date(car.applydate).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(car.applydate)
            .getDate()
            .toString()
            .padStart(2, "0")}` <= selectedDate.todate
      );

    return filteredCars;
  };

  const filterByYear = (filteredData) => {
    // Avoid filter for null value
    if (!selectedYear) {
      return filteredData;
    }

    const filteredCars = filteredData.filter(
      (car) => new Date(car.applydate).getFullYear() === selectedYear
    );
    //console.log(filteredCars);
    return filteredCars;
  };

  const filterByMonth = (filteredData) => {
    // Avoid filter for null value
    if (!selectedMonth) {
      return filteredData;
    }

    const filteredCars = filteredData.filter(
      (car) =>
        new Date(car.applydate)
          .toLocaleString("default", {
            month: "long",
          })
          .split(" ")
          .indexOf(selectedMonth) !== -1
    );
    return filteredCars;
  };

  // Toggle seletedMonth state
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setSelectedDate({
      ...selectedDate,
      [name]: value,
    });
  };

  // Toggle seletedYear state
  const handleYearChange = (event) => {
    const inputYear = Number(event.target.value);

    if (inputYear === selectedYear) {
      setSelectedYear("");
    } else {
      setSelectedYear(inputYear);
    }
  };

  const DeselectAll = (event) => {
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedStatus("");
    setSelectedDate({
      fromdate: "",
      todate: "",
    });
  };

  useEffect(() => {
    var filteredData = filterByYear(report);
    filteredData = filterByMonth(filteredData);
    filteredData = filterByDate(filteredData);
    filteredData = filterByStatus(filteredData);
    setFilteredList(filteredData);
  }, [selectedYear, selectedMonth, selectedDate, selectedStatus, report]);

  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const year = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => index + year);
  return (
    <>
      <div className="sidebar">{adminProfile && <Header />}</div>
      <SubNav />
      <div className="content">
        <h4>Employee Leave List</h4>
        <div className="overall">
          <div className="overall-filter">
            <div className="filter-status">
              <label>Filter by status :</label>
              <select
                className="fmxw-200 d-md-inline form-select"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="">All</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>
            <div className="filter-year">
              <label>Filter by year :</label>
              <select
                className="fmxw-200 d-md-inline form-select"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <option value="">All</option>
                {years.map((key, index) => (
                  <option key={index} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-month">
              <label>Filter by Month :</label>
              <select
                className="fmxw-200 d-md-inline form-select"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                <option value="">All</option>
                {monthNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-from-date">
              <label>Filter by from date:</label>
              <input
                className="form-control"
                type="date"
                value={selectedDate.fromdate}
                name="fromdate"
                onChange={handleDateChange}
              />
            </div>

            <div className="filter-to-date">
              <label>Filter by to date:</label>
              <input
                className="form-control"
                type="date"
                value={selectedDate.todate}
                name="todate"
                onChange={handleDateChange}
              />
            </div>
            <button className="btn btn-dark mt-3" onClick={DeselectAll}>
              Deselect All
            </button>
          </div>

          <table className="user-table align-items-center table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  applydate
                  <i
                    className="fa fa-sort"
                    aria-hidden="true"
                    onClick={() => handleSort("date")}
                  ></i>
                </th>
                <th>status</th>
                <th>Absence type </th>
              </tr>
            </thead>
            <tbody>
              {filteredList

                .slice(offset, offset + PER_PAGE)
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>

                    <td>
                      {new Date(item.applydate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td>{item.absencetype}</td>
                    <td
                      className={`${
                        item.status === "reject" ? "text-danger" : ""
                      } ${item.status === "approve" ? "text-success" : ""}`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center pag_head">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={styles.pagination_ul}
              previousLinkClassName={styles.paginationLink}
              nextLinkClassName={styles.paginationLink}
              disabledClassName={styles.paginationDisabled}
              activeClassName={styles.paginationActive}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
            />
            <div className="total_leave">
              Total result count: <span>{filteredList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default EmpLeaves;
