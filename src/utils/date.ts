// Function to format a Date object to 'YYYY-MM-DDTHH:mm' format

export const formatDate = (date: Date) => {
  let month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear(),
    hour = '' + date.getHours(),
    minute = '' + date.getMinutes();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hour.length < 2) hour = '0' + hour;
  if (minute.length < 2) minute = '0' + minute;

  return [year, month, day].join('-') + 'T' + [hour, minute].join(':');
};
