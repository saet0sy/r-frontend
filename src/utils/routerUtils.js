const paramsToObject = (params) => {
  if(params.size === 0) return null;
  const obj = {};
  for (let [key, value] of params) {
    obj[key] = value;
  }
  return obj;
};

export { paramsToObject };