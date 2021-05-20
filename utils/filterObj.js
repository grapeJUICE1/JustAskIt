const filterObj = (obj, allowedFields) => {
  const newObj = {};
  console.log(allowedFields);
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = filterObj;
