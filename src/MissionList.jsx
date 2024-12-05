import React, { useState, useEffect } from "react";
import { getKoreanTime } from "./utils/missionUtils";

const MissionList = ({ missions }) => {
  const [currentTime, setCurrentTime] = useState(getKoreanTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getKoreanTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeStatus = (releaseDate) => {
    const difference = releaseDate - currentTime;
    // 만료 시간을 releaseDate로부터 2일 후 23:59:59로 설정
    const expirationDate = new Date(
      releaseDate.getTime() +
        2 * 24 * 60 * 60 * 1000 + // 2일
        23 * 60 * 60 * 1000 + // 23시간
        59 * 60 * 1000 + // 59분
        59 * 1000 // 59초
    );

    // 만료됨 (오픈 후 2일 23:59:59 지남)
    if (currentTime > expirationDate) {
      return { status: "expired" };
    }

    // 오픈됨 (카운트다운 끝남)
    if (difference <= 0) {
      return { status: "available" };
    }

    // 대기 중 (카운트다운 진행 중)
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      status: "waiting",
      timeLeft: { days, hours, minutes, seconds },
    };
  };

  const handleMissionClick = (mission) => {
    const timeStatus = calculateTimeStatus(mission.releaseDate);
    if (timeStatus.status === "available") {
      window.open(mission.link, "_blank");
    }
  };

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const MissionCard = ({ mission }) => {
    const timeStatus = calculateTimeStatus(mission.releaseDate);

    const formatDateTime = (date) => {
      return date
        .toLocaleDateString("ko-KR", {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace("24시", "00시");
    };

    const startDate = formatDateTime(mission.releaseDate);
    const endDate = new Date(
      mission.releaseDate.getTime() +
        2 * 24 * 60 * 60 * 1000 +
        23 * 60 * 60 * 1000 +
        59 * 60 * 1000
    );
    const periodText = `${startDate} ~ ${formatDateTime(endDate)}`;

    const cardStyle = {
      waiting: "bg-white/50 border-red-200",
      available:
        "bg-white/50 border-emerald-200 cursor-pointer hover:bg-white/80 hover:shadow-lg hover:-translate-y-0.5",
      expired: "bg-white/50 border-gray-200 opacity-75",
    }[timeStatus.status];

    return (
      <div
        onClick={() => handleMissionClick(mission)}
        className={`mission-card w-full p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${cardStyle}`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-1">{mission.title}</h2>
            <p className="text-xs text-gray-400 mb-0.5">{periodText}</p>
            <p className="text-sm text-gray-500">{mission.subtitle}</p>
          </div>
          {timeStatus.status === "available" && (
            <div className="mission-start font-medium flex items-center gap-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg">
              시작하기
              <span className="transition-transform duration-300">→</span>
            </div>
          )}
          {timeStatus.status === "waiting" && (
            <div className="countdown text-red-600 font-medium tabular-nums text-right bg-red-50 px-4 py-2 rounded-lg">
              {timeStatus.timeLeft.days}일{" "}
              {formatNumber(timeStatus.timeLeft.hours)}:
              {formatNumber(timeStatus.timeLeft.minutes)}:
              {formatNumber(timeStatus.timeLeft.seconds)}
            </div>
          )}
          {timeStatus.status === "expired" && (
            <div className="text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-lg">
              만료됨
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
};

export default MissionList;
