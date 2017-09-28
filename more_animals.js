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

function findAnimals(animals, letter) {
  return animals
            .split('\n')
            .filter( animal => animal.startsWith(letter) )
            // .filter( animal => animal[0] == animalLetter )
            .join('\n');
}

// function writeToFile(letter, data) {
//   fs.writeFile(`${letter.toLowerCase()}_animals.txt`, data, err => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("File successfully written!");
//     }
//   });
// }

const server = http.createServer((req, res) => {
  // res.write('hello world');
  // res.end();
  const query = req.url.split('?')[1];
  // console.log(req.url);
  // console.log(query);
  if (query !== undefined) {
    let animalLetter = qs.parse(query).letter;
    // console.log(animalLetter);

    if (cache[animalLetter] !== undefined) {
      res.end(cache[animalLetter]);
    }

    if (animalLetter !== undefined) {
      fs.readFile('./animals.txt', 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          res.end('error');
          return;
        }
        console.log(data);
        console.log(animalLetter);
        let animalData = findAnimals(data, animalLetter.toUpperCase());

        cache[animalLetter] = animalData;
        res.end(animalData);
      });
    }
    // res.end(animalLetter);

  } else {
    if (cache['animals'] !== undefined) {
      console.log("here");
      res.end(cache['animals']);
      return;
    }

    fs.readFile('./animals.txt', 'utf-8', (err, data) => {
      console.log("and here");
      if (err) {
        console.log(err);
        res.end('error');
        return;
      }
      // animalData = findAnimals(data, animalLetter);
      // if (animalLetter) {
      //   writeToFile(animalLetter, animalData);
      // }
      cache['animals'] = data;
      res.end(data);
    });
  }
});

server.listen(8000, () => console.log("I'm listening on port 8000!"));
