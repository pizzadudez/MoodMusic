/**
 * Splits an array into chunks of set size.
 * @param {*[]} arr
 * @param {number} size
 * @returns {*[][]}
 */
exports.chunkArray = (arr, size = 1) => {
  const chunks = [];
  if (size <= 0) return [];
  while (arr.length) chunks.push(arr.splice(0, size));
  return chunks;
};
/**
 * Generate dynamic 'VALUES (?, ?), (?, ?)' string for raw Knex binding.
 * @param {number} columnCount
 * @param {number} valuesCount
 * @returns {string} ex: `(?, ?), (?, ?)`
 */
exports.generateValueBindings = (columnCount, valuesCount) => {
  return Array(valuesCount)
    .fill('(' + Array(columnCount).fill('?').join(', ') + ')')
    .join(', ');
};
/**
 * Generate a map of Postgres data types for an object's properties.
 * {<key, value>} => {<key, PGDataType>}
 * @param {object} obj
 * @returns {Object<string, string>}
 */
exports.getPGDataTypes = obj => {
  const pgDataType = variable => {
    switch (typeof variable) {
      case 'number':
        return 'integer';
      case 'string':
        return 'text';
      case 'boolean':
        return 'boolean';
    }
  };

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, pgDataType(val)])
  );
};
