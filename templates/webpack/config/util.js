function isFunction(obj) {
  return typeof obj === 'function';
};

function result(object, property, args) {
  if (object == null) return null;
  var value = object[property];
  return isFunction(value) ? value.apply(object, args) : value;
}

module.exports = {
  result,
  isFunction
}
