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
  const path = to[0] !== "/" ? "/" + to : to;
  const method = !!replace ? "replaceState" : "pushState";

  if (url + params === path) return;
  window.history[method]("", "", path);
}
