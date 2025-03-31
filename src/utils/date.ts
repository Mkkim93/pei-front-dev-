import dayjs from "dayjs";

export const formatDate = (date: string | Date, format = "YYYY.MM.DD") => {
    return dayjs(date).format(format);
  };


export const formatDateDetail = (date: string | Date, format = "YYYY.MM.DD HH:mm") => {
  return dayjs(date).format(format);
}