import React, { useState } from 'react';
import WeeklySchedule from '../student/weeklySchedule';

const statusClassNames = {
  "Entry": 'active',
  "Exit": 'active',
  "Accepted": 'accepted',
  "Absent": 'absent',
  'Not active': 'not_active',
  "In Class": 'active',
};

const holidays = {
  '01-01': "New Year's Day",
  '07-04': 'Independence Day',
  '12-25': 'Christmas Day',
  '10-31': 'Halloween',
  '11-26': 'Thanksgiving',
  '12-31': "New Year's Eve",
  // '05-10': "Victory Day"
};

const date = new Date();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const monthDay = `${month}-${day}`;
const holidayDescription = holidays[monthDay];

export default function Absence() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [timers, setTimers] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);
  const [subjects, setSubjects] = useState(JSON.parse(localStorage.getItem('lessons')))
  console.log("LOCAL: " + Object.values(subjects))
  const toggleSchedule = () => {
    setShowSchedule(true);
  };

  const handleStatusClick = (subject) => {
    if (subject.status === "Entry" && !subject.timerRunning) {
      const updatedSubjects = subjects.map(s => {
        if (s.name === subject.name) {
          return { ...s, timerRunning: true, status: "In Class" };
        }
        return s;
      });
      setSubjects(updatedSubjects);

      setTimeout(() => {
        setSubjects(prevSubjects => {
          const updatedSubjects = prevSubjects.map(s => {
            if (s.name === subject.name) {
              return { ...s, status: "Exit", timerRunning: false };
            }
            return s;
          });
          const exitTimer = setTimeout(() => {
            setSubjects(prevSubjects => {
              const updatedSubjects = prevSubjects.map(s => {
                if (s.name === subject.name) {
                  return { ...s, status: "Absent" };
                }
                return s;
              });
              localStorage.setItem('lessons', JSON.stringify(updatedSubjects.map(({ timerRunning, ...rest }) => rest)));
              return updatedSubjects;
            });
          }, 5 * 1000);
          const subjectsWithTimer = updatedSubjects.map(s => {
            if (s.name === subject.name) {
              return { ...s, exitTimer };
            }
            return s;
          });
          return subjectsWithTimer;
        });
      }, 10 * 1000);
    } else if (subject.status === "Exit") {
      clearTimeout(subject.exitTimer);

      const updatedSubjects = subjects.map(s => {
        if (s.name === subject.name) {
          return { ...s, status: "Accepted" };
        }
        return s;
      });
      setSubjects(updatedSubjects);
      localStorage.setItem('lessons', JSON.stringify(updatedSubjects.map(({ timerRunning, ...rest }) => rest)));
    }
  };
  const handleButtonClick = (subject) => {
    setButtonClicked(true);

    clearTimeout(timers[subject.name]);

    const updatedSubjects = subjects.map(s => {
      if (s.name === subject.name) {
        return { ...s, status: "Accepted" };
      }
      return s;
    });
    setSubjects(updatedSubjects);
  };

  return (
    <div className="main">
      {holidayDescription ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', height: '40%' }}><h1>{holidayDescription}</h1></div> : <>
        <h2>Dashboard</h2>
        {!showSchedule && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>SUBJECT</th>
                  <th>GROUP</th>
                  <th>ROOM</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => (
                  <tr key={subject.name} className={statusClassNames[subject.status]}>
                    <td>{subject.courseId}</td>
                    <td>{subject.name}</td>
                    <td>{subject.group}</td>
                    <td>{subject.room}</td>
                    <td><button onClick={() => handleStatusClick(subject)}>{subject.status}</button></td>
                  </tr>
                ))}
              </tbody>

            </table>
            <button onClick={toggleSchedule}>Show Week Schedule</button>
          </>
        )}
        {showSchedule && (
          <div>
            <button onClick={() => setShowSchedule(false)}>Back to Subjects</button>
            <WeeklySchedule />
          </div>
        )}
      </>
      }
    </div>
  );
}