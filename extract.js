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

