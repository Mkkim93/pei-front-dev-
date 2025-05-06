import dayjs from "dayjs";

export const formatDate = (date: string | Date, format = "YYYY.MM.DD") => {
  return dayjs(date).format(format);
};

export const formatDateDetail = (date: string | Date, format = "YYYY.MM.DD HH:mm") => {
  if (typeof date !== 'string' ) {
    return '-';
  }
  return dayjs(date).format(format);
}

export const formatDateVeryDetail = (date: string | Date, format = "YYYY.MM.DD'T'HH:mm:ss") => {
  return dayjs(date).format(format);
}

export const formatDateOrgDetail = (date: string | Date, format = "YYYY.MM.DDTHH:mm:ss") => {
  return dayjs(date).format(format);
}

export const beforeFormatDate = (date: string | Date, format = "YYYY.MM.DD HH:mm:ss") => {
  const today = dayjs(); // 현재 시간
  const workDay = dayjs(date); // 전달받은 날짜

  const diffInMilliseconds = today.diff(workDay); // 기본은 ms
  const diffInMinutes = today.diff(workDay, 'minute'); // 분 차이
  const diffInHours = today.diff(workDay, 'hour'); // 시 차이
  const diffInDays = today.diff(workDay, 'day'); // 일 차이

  if (diffInMilliseconds < 60000) {
    return Math.floor(diffInMilliseconds / 1000) + '초전';
  }
  if (diffInMinutes < 60) {
    return Math.floor(diffInMinutes) + '분전';
  }
  if (diffInHours < 24) {
    return Math.floor(diffInHours) + '시간전';
  }
  if (diffInDays >= 1) {
    return Math.floor(diffInDays) + '일전';
  }
};