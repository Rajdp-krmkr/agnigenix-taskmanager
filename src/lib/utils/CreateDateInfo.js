 export const createDateInfo = () => {
    const now = new Date();
    const date = now.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes =
      now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();

    return {
      expirationDate: {
        date,
        month: now.getMonth() + 1,
        year,
        hours,
        minutes,
      },
      time: `${hours}:${minutes}     ${date} ${month}, ${year}`,
    };
  };