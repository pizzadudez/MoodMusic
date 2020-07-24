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
 * Generate value binding string of consisting of '?'.
 * @param {number} columnCount
 * @param {number} valuesCount
 * @returns {string} ex: `(?, ?), (?, ?)`
 */
exports.generateValueBindings = (columnCount, valuesCount) => {
  return Array(valuesCount)
    .fill('(' + Array(columnCount).fill('?').join(', ') + ')')
    .join(', ');
};
