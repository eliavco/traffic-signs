const fs = require("fs");
const fetch = require("node-fetch");
const slugify = require("slugify");
const FileType = require("file-type");
const { JSDOM } = require("jsdom");

const baseURL = "http://l4me.org.il/he/signs/";

fetch(baseURL).then(res => res.text()).then(data => fetchCategories(data)).then(res => {
	fs.writeFileSync('database.json', res);
});

async function fetchCategories(data) {
  const cats = getCategories(data);
  const categories = [];
  for (catg of cats) {
    let res = await fetch(catg.link);
    res = await res.text();
    const category = await getCategory(res);
    for (item of category) {
      item.category = catg.title;
      item.details = await fetchTamrour(item);
      categories.push(item);
    }
  }
  return JSON.stringify(categories);
}

function getCategories(data) {
  const dom = new JSDOM(data);
  const document = dom.window.document;
  const categories = document.querySelector(".jm-module .jm-module-content ul");
  const categoriesList = Array.from(categories.children);
  const categoriesFinal = [];
  categoriesList.forEach((category) => {
    const link = category.querySelector("a");
    categoriesFinal.push({ link: link.href, title: link.innerHTML });
  });
  return categoriesFinal;
}

async function getCategory(data) {
  const items = await getTamrourim(data);
  return items;
}

async function getTamrourim(data) {
  const dom = new JSDOM(data);
  const document = dom.window.document;
  const rows = Array.from(document.querySelectorAll(".blog .items-row"));
  const items = [];
  for (row of rows) {
    const is = Array.from(row.children);
    for (item of is) {
      const link = item.querySelector("a");
      const img = link.querySelector("img");
      const file = await getImage(img.src, img.title);
      file.source = img.src;
      const tamrour = {
        link: link.href,
        image: file,
        title: img.title,
      };
      items.push(tamrour);
    }
  }
  return items;
}

async function getImage(link, title) {
  let data = await fetch(link);
  data = await data.buffer();
  const type = await FileType.fromBuffer(data);
  const image = { name: `${slugify(title)}.${type.ext}`, file: data };
//   const image = link;
  return image;
}

// const tamrours = [
//   { link: "http://l4me.org.il/he/signs/special-regulations/601" },
//   { link: "http://l4me.org.il/he/signs/warning/107" },
//   { link: "http://l4me.org.il/he/signs/mandatory/202" },
//   { link: "http://l4me.org.il/he/signs/mandatory/231" },
//   { link: "http://l4me.org.il/he/signs/public-transport/511" },
//   { link: "http://l4me.org.il/he/signs/symbols/s-36" },
//   { link: "http://l4me.org.il/he/signs/signals/702" },
//   { link: "http://l4me.org.il/he/signs/construction/909" },
//   { link: "http://l4me.org.il/he/signs/road-markings/812" },
// ];

// tamrours.forEach((tamrour) => {
//   fetchTamrour(tamrour).then((details) => {
//     console.log(details);
//   });
// });

async function fetchTamrour(tamrour) {
  const res = await fetch(tamrour.link);
  const data = await res.text();
  return getTamrour(data);
}

function getTamrour(data) {
  const dom = new JSDOM(data);
  const document = dom.window.document;
  const group = getGroup(document);
  const meaning = getMeaning(document);
  const deepMeaning = getDeepMeaning(document);
  const hisPowerIsBeautiful = getHisPowerIsBeautiful(document);
  return { group, meaning, deepMeaning, hisPowerIsBeautiful };
}

function getGroup(document) {
  const group = document.querySelector(".jmbadge");
  const title = group.querySelector("strong");
  const brk = group.querySelector("br");
  group.removeChild(title);
  group.removeChild(brk);
  return group.textContent.replace(/\r?\n|\r/g, "");
}

function getMeaning(document) {
  const meaning = document.querySelector(".jminfo");
  const title = meaning.querySelector("strong");
  const brk = meaning.querySelector("br");
  meaning.removeChild(title);
	meaning.removeChild(brk);
	
	const add = document.querySelector(".jminfo + div .moduletable p");
	if (add) {
		return `${meaning.textContent.replace(/\r?\n|\r/g, "")}\n${add.textContent}`;
	}
  return meaning.textContent.replace(/\r?\n|\r/g, "");
}

function getHisPowerIsBeautiful(document) {
	const power = document.querySelector(".jmcheck");
	if (power) {
		const title = power.querySelector("strong");
		const brk = power.querySelector("br");
		power.removeChild(title);
		power.removeChild(brk);
		return power.textContent.replace(/\r?\n|\r/g, "");
	}

	return 'על פי החוקים';
}

function getDeepMeaning(document) {
	const deep = document.querySelector(".jmdirection");
	if (deep) {
		const title = deep.querySelector("strong");
		const brk = deep.querySelector("br");
		deep.removeChild(title);
		deep.removeChild(brk);
		const add = getAddDeep(document);
		if (add) {
			return `${deep.textContent.replace(/\r?\n|\r/g, "")}\n${add}`;
		}
		return deep.textContent.replace(/\r?\n|\r/g, "");
	}

	return 'לך עם הלב';
}

function getAddDeep(document) {
	const deepAdd = Array.from(document.querySelectorAll(".jmdirection + div .moduletable p"));
	let str = '';
	deepAdd.forEach(deepAddSingle => {
		if (deepAddSingle.querySelector('.jm')) {
			const index = deepAddSingle.querySelector(".jm");
			const indexTxt = index.textContent.replace(/\r?\n|\r/g, "");
			deepAddSingle.removeChild(index);
			str += `${indexTxt}: ${deepAddSingle.textContent.replace(
        /\r?\n|\r/g,
        ""
      )}\n`;
		} else {
			str += deepAddSingle.textContent.replace(/\r?\n|\r/g, "");
		}
	});
	return str;
}
