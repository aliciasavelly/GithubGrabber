const fs = require('fs');
const http = require('http');
const cache = {};
const qs = require('querystring');

// let animalLetter = process.argv[2];
// if (animalLetter) {
//   animalLetter = animalLetter.toUpperCase();
// }

// fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     animalData = findAnimals(data, animalLetter);
//     if (animalLetter) {
//       writeToFile(animalLetter, animalData);
//     }
//   }
// });

// function writeToFile(letter, data) {
//   fs.writeFile(`${letter.toLowerCase()}_animals.txt`, data, err => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("File successfully written!");
//     }
//   });
// }

function findAnimals(animals, letter) {
  return animals
  .split('\n')
  .filter( animal => animal.startsWith(letter) )
  // .filter( animal => animal[0] == animalLetter )
  .join('\n');
}

const server = http.createServer((req, res) => {
  const query = req.url.split('?')[1];

  // this is when we have something like '/?letter=b' in our url
  if (query !== undefined) {
    let animalLetter = qs.parse(query).letter;

    // we'll only look up the information for the letter if it hasn't been found yet
    if (cache[animalLetter] !== undefined) {
      res.end(cache[animalLetter]);
      return;
    }
    if (animalLetter !== undefined) {
      fs.readFile('./animals.txt', 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          res.end('error');
          return;
        }
        let animalData = findAnimals(data, animalLetter.toUpperCase());

        cache[animalLetter] = animalData;
        res.end(animalData);
      });
    }

    res.end(cache['animals']);
  } else {
    if (cache['animals'] !== undefined) {
      res.end(cache['animals']);
      return;
    }

    fs.readFile('./animals.txt', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        res.end('error');
        return;
      }

      cache['animals'] = data;
      res.end(data);
    });
  }
});

server.listen(8000, () => console.log("I'm listening on port 8000!"));
