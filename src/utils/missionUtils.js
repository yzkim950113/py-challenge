export const getKoreanTime = (date = new Date()) => {
  const now = date;
  const koreaTimezoneOffset = 9 * 60;
  const currentOffset = now.getTimezoneOffset();
  const totalOffset = koreaTimezoneOffset + currentOffset;
  return new Date(now.getTime() + totalOffset * 60 * 1000);
};

export const parseMissionDate = (dateString) => {
  return new Date(dateString);
};

// 테스트용 날짜 생성 함수
export const createTestDates = () => {
  const now = getKoreanTime();
  return {
    now,
    inOneMinute: new Date(now.getTime() + 60000),
    inTwoMinutes: new Date(now.getTime() + 120000),
  };
};
