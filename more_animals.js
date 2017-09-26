const fs = require('fs');

const animalLetter = process.argv[2].toUpperCase();

fs.readFile('./animals.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    animalData = findAnimals(data, animalLetter);
    writeToFile(animalLetter, animalData);
  }
});

function findAnimals(animals, letter) {
  return animals
            .split('\n')
            .filter( animal => animal.startsWith(letter) )
            // .filter( animal => animal[0] == animalLetter )
            .join('\n');
}

function writeToFile(letter, data) {
  fs.writeFile(`${letter.toLowerCase()}_animals.txt`, data, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("File successfully written!");
    }
  });
}
