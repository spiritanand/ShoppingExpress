exports.removeSpaces = (inputs) => {
  Object.entries(inputs).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // eslint-disable-next-line no-param-reassign
      inputs[key] = value.replace(/^\s+/, '');
      // eslint-disable-next-line no-param-reassign
      inputs[key] = inputs[key].trim();
    }
  });
};
