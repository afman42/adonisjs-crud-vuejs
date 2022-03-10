export const mapErrors = (errors) => {
  return errors.reduce((prev, err) => {
    prev[err.field] = err.message;
    return prev;
  }, {});
};
