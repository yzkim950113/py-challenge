// App.jsx
import React from "react";
import MissionList from "./MissionList";
import missionsData from "./data/missions.json";
import { parseMissionDate } from "./utils/missionUtils";
import "./App.css";

const App = () => {
  const missions = missionsData.missions.map((mission) => ({
    ...mission,
    releaseDate: parseMissionDate(mission.releaseDate),
  }));

  return (
    <div className="w-screen flex justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="min-h-screen flex flex-col items-center">
        <div className="w-[400px] py-12">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            파이썬 작심삼일 챌린지 1기
          </h1>
          <MissionList missions={missions} />
        </div>
      </div>
    </div>
  );
};

export default App;
