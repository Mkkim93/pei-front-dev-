import dayjs from "dayjs";

export const formatDate = (date: string | Date, format = "YYYY.MM.DD") => {
    return dayjs(date).format(format);
};

export const formatDateDetail = (date: string | Date, format = "YYYY.MM.DD HH:mm") => {
  return dayjs(date).format(format);
}

// TODO 알림이 최소: 몇분전, 몇시간전, 최대: 몇일전에 도착했는지 포맷 후 컴포넌트로 전달
export const beforeFormatDate = (date: string | Date, format = "mm") => {
  return dayjs(date).format(format);
}