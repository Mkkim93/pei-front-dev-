import dayjs from "dayjs";

// today
export const formatToday = (format: string = "YYYY-MM-DD"): string => {
  return dayjs().format(format);
};

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

export function toLocalDateTimeStringFromString(str: string): string {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}