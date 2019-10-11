const cheerio = require('cheerio');
const $ = cheerio.load('<div><h2 class="title">Hello world</h2><p>check</p><p>check2</p><div>');

$('h2.title').text('Hello there!');
$('h2').addClass('welcome');

$.html();
var p = $('p');
console.log(p.length);
console.log(p.text());

p.each((i, item) => {
    console.log(i, $(item).text());
});
// p.each((i, item) => console.log(i, item));
// console.log(p.text());

// for (let item of p) {
//     console.log(item.text());
// }