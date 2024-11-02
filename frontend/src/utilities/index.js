export function classes(classObject, className = "") {
  const str = Object.entries(classObject)
    .filter(([_key, value]) => !!value)
    .map(([key, _value]) => key)
    .join(" ");

  if (className) return str + " " + className;
  return str;
}

export function navigate(to, replace = false) {
  const url = window.location.pathname;
  const params = new URL(window.location.href).search;
  const path = to?.[0] !== "/" ? "/" + to : to;
  const method = !!replace ? "replaceState" : "pushState";

  if (url + params === path) return;
  window.history[method]("", "", path);
}

export const formatTime = (date, today = "") => {
  if (!date) return "No Date";

  const sixDays = 6;
  const oneDayMS = 86400000;
  const now = new Date(Date.now());
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeStamp = new Date(date);
  const pastMS = now - startOfDay;
  const duration = now - timeStamp;
  const options = {
    today: { timeStyle: "short", timeZone: "Asia/Kolkata" },
    yesterday: "Yesterday",
    thisWeek: { weekday: "long" },
  };

  const fDate = (option) =>
    new Intl.DateTimeFormat("en-IN", option).format(timeStamp);

  return duration < pastMS
    ? today || fDate(options.today)
    : duration < oneDayMS + pastMS
    ? options.yesterday
    : duration < oneDayMS * sixDays + pastMS
    ? fDate(options.thisWeek)
    : fDate({});
};
