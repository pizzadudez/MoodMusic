const db = require('./db').conn();

// exports.newAlbums = albums => {
//   const sql = `INSERT OR IGNORE INTO albums (
//                id, name, small, medium, large)
//                VALUES(?, ?, ?, ?, ?)`;
//   const resolutions = {
//     64: 'small',
//     300: 'medium',
//     640: 'large'
//   };
//   return new Promise((resolve, reject) => {
//     db.serialize(() => {
//       db.run('BEGIN TRANSACTION');
//       for (const a of Object.values(albums)) {
//         let images = {};
//         a.images.forEach(img => {
//           const size = resolutions[img.height];
//           images[size] = img.url;
//         });
//         const values = [a.id, a.name, images.small, images.medium, images.large];
//         db.run(sql, values, err => {
//           if (err) reject(err);
//         });
//       }
//       db.run('COMMIT TRANSACTION', err => err ? reject(err) : resolve());
//     });
//   });
// };