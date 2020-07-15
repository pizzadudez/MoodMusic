/**
 *
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
