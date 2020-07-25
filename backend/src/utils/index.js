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
 *
 * @param {object} obj
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

  const map = Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, pgDataType(val)])
  );
  return map;
};
