export const objectToCliOptions = (params) => {
  return Object.entries(params).reduce((acc, [key, val]) => {
    acc += ` --${[key]}=${val}`;
    return acc;
  }, '');
}
