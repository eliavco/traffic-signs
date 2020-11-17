const fs = require("fs");
const { join } = require("path");
const PATH = require("path");

const dbRaw = fs.readFileSync("database.json");
const db = JSON.parse(dbRaw);
// const bPath = "/Users/eliavcohen/Downloads";
const bPath = "/Users/eliavcohen/Documents/Development/traffic-signs-android/app/src/main/assets/signs";

// const images = db.map(obj => obj.image);
// console.log(images.length);
// images.forEach(image => {
// 	writePhoto(image, bPath);
// });

// function writePhoto(image, path) {
//   const { name, file } = image;
//   const newPath = PATH.resolve(path, name);
//   const newFile = Buffer.from(file);

// 	try {
//     fs.writeFileSync(newPath, newFile);
// 		// console.log(`${name}: DONE`);
//   } catch (err) {
//     console.log(name);
//     console.log(err);
//   }
// }

function formatString(st) {
	st = st.replace(/(\r\n|\n|\r)/gm, "\n");
	st = st.replace(/'/g, "''");
	return st;
}

const signs = db
  .map(
    (s) =>
      `('${formatString(s.image.name.substring(
        0,
        s.image.name.indexOf('.')
      ))}', '${formatString(s.category)}', '${formatString(s.details.group)}', '${formatString(s.details.meaning)}', '${formatString(s.details.deepMeaning)}', '${formatString(s.details.hisPowerIsBeautiful)}', '${formatString(s.image.name)}')`
  )
  .join(",\n");
const sql = `INSERT INTO signs (id, category, sGroup, meaning, purpose, power, image)
VALUES ${signs};`;
fs.writeFileSync('sql.txt', sql);