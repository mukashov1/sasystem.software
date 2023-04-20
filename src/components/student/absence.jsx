import React, { useState } from 'react';
import WeeklySchedule from '../student/weeklySchedule';

const subjects = [
  { name: 'History', absence: '13%', group: '05-N', room: 'F312', status: 'Accepted' },
  { name: 'Math', absence: '5%', group: '02-P', room: 'B125', status: 'Registrate' },
  { name: 'Science', absence: '10%', group: '01-N', room: 'C301', status: 'Not active' },
  { name: 'English', absence: '8%', group: '03-N', room: 'A210', status: 'Not active' },
];
const statusClassNames = {
  "Registrate": 'active',
  "Accepted": 'accepted',
  'Not active': 'not_active',
};

export default function Absence() {
  const [showSchedule, setShowSchedule] = useState(false);

  const toggleSchedule = () => {
    setShowSchedule(true);
  };

  return (
    <div className="main">
      <h2>Dashboard</h2>
      {!showSchedule && (
        <>
          <table>
            <thead>
              <tr>
                <th>SUBJECT</th>
                <th>ABSENCE</th>
                <th>GROUP</th>
                <th>ROOM</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.name} className={statusClassNames[subject.status]}>
                  <td>{subject.name}</td>
                  <td>{subject.absence}</td>
                  <td>{subject.group}</td>
                  <td>{subject.room}</td>
                  <td><a href="">{subject.status}</a></td>
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
    </div>
  );
}
