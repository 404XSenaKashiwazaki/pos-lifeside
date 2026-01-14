import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
export const formatDateID = (
  dateString: string | Date,
  formatDate: string = "MMMM do, yyyy"
) => {
  const date = new Date(dateString);
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return format(utcDate, formatDate);
};

export const formatDateIDForm = (dateSring: string | Date) => {
  const date = new Date(dateSring);
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );
  return utcDate;
};

export function toLocalDBFormat(dateSring: Date) {
  const now = new Date();

  const combinedDate = new Date(
    dateSring.getFullYear(),
    dateSring.getMonth(),
    dateSring.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );
  return combinedDate
}
