import { useEffect, useState } from "react";
import "./Completed_Task.css";
import Task_Card from "../../Components/Task_Card/Task_Card";
import Searched_Tasks from "../Searched_Task/Searched_Tasks";
import axios from "axios";

const Completed_Task = () => {
  const [allTask, setAlltask] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setloading] = useState(true);

  useEffect(() => {
    axios
      .get("https://advance-toodoo.onrender.com/user/completed")
      .then((response) => {
        setAlltask(response.data)
        const completedTasks = allTask.filter((task) => task.Status === "Completed");
        setCompleted(completedTasks);
        setloading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [allTask]);

  const searchTasks = () => {
    return completed.filter((task) =>
      task.Title.toLowerCase().includes(inputVal.toLowerCase())
    );
  };

  const searchedTasks = searchTasks();

  return (
    <>
      {!loading ?
        (<div className="completed-cnt">
          <div className="top-cont">
            <div className="top-title">
              <p>Completed Task</p>
            </div>
          </div>

          <div className="complt-sort-task">
            <div className="priority">
              <select type="text" name="Priority" defaultValue="default" className="sorting" id="by-priority">
                <option value="default" disabled>
                  By Priority
                </option>
                <option value="Very Important">Very Important</option>
                <option value="Important">Important</option>
                <option value="Less Important">Less Important</option>
              </select>
            </div>
            <div className="search" id="search-bar">
              <input
                type="text"
                placeholder="Search"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <img src="/Images/Search.png" alt="Icon" />
            </div>
          </div>
          <div className="serched-task-data">
            {inputVal ? <div className="search-task"><Searched_Tasks data={searchedTasks} /></div> : ""}
          </div>
          <div className="datacard-cnt">
            {!inputVal && completed.map((item, i) => {
              const startDate = new Date(item.StartDate);
              const endDate = new Date(item.EndDate);

              // Format the dates as "dd/mm/yyyy"
              const formattedStartDate = startDate.toLocaleDateString("en-GB");
              const formattedEndDate = endDate.toLocaleDateString("en-GB");
              return (
                <Task_Card
                  key={i}
                  id={item._id}
                  Start={formattedStartDate}
                  Title={item.Title}
                  End={formattedEndDate}
                  Status={item.Status}
                />
              );
            })}
          </div>
        </div>) : (<h2 className='home-cnt'>Loading...</h2>)
      }
    </>
  );
};

export default Completed_Task;
