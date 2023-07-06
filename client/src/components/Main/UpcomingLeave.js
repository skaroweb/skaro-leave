import "./TodayEmpLeave.css";

const UpcomingLeave = (props) => {
  return (
    <>
      <article className="leaderboard">
        <header>
          <h1 className="leaderboard__title">
            <span className="leaderboard__title--top">Upcoming</span>
            <span className="leaderboard__title--bottom">Employees Leave</span>
          </h1>
        </header>

        <main className="leaderboard__profiles upcoming">
          {props.list.length > 0 ? (
            <>
              {props.list
                .sort(function (a, b) {
                  return new Date(a.applydate) - new Date(b.applydate);
                })
                .map((employee, index) => (
                  <article key={index} className="leaderboard__profile">
                    <span className="leaderboard__name">{employee.name}</span>
                    <span className="leaderboard__value">
                      {new Date(employee.applydate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </article>
                ))}
            </>
          ) : (
            <p>No matching employees found</p>
          )}
        </main>
      </article>
    </>
  );
};
export default UpcomingLeave;
