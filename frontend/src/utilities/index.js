export function classes(classObject) {
  return Object.entries(classObject)
    .filter(([_key, value]) => !!value)
    .map(([key, _value]) => key)
    .join(" ");
}
