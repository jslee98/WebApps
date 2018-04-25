/*

  In this assignmenmt you are given a list of student names. The challenge
  is to pair students by how similar their names are in edit distance.
  The pairing algorithm  pseudocode is:

  sort the students by last name (A to Z)
  while there is > 1 unpaired student
    X = the first unpaired student
    if X's first name begins with a vowel
      compute the Hamming distance to all other unpaired students

    if X's first name begins with a consonant
      compute the Levenshtein distance to all other unpaired students

    pair X with the most similar name, Y (ie shortest edit distance). If there
    is a tie in edit distance, sort the results by last name (A...Z) and
    take the first.

    remove X and Y from the list of unpaired students.


  to help you, you are provided with the scripts:
    levenshtein.js and hamming.js

  **THERE IS CURRENTLY A NAMING CONFLICT, solve this by wrapping each
    provided distance funciton the JavaScirpt namespace-like construct of your choice.

    YOU CANNOT SIMPLY RENAME the distance functions!
    YOU CANNOT MODIFY THE distance functions IN ANY WAY other than
    to implement your namespace construct!

    I suggest putting each in it's own unique object so in your main
    code you can write:
     hamming.distance(a,b)
      or
     levenshtein.distance(a,b)
 */

var names = ["Jordan Voves", "Keller Chambers", "Stefano Cobelli",
"Jenna Slusar", "Jason Corriveau", "Cole Whitley", "Dylan Zucker",
"Danny Toback", "Eric Marshall", "Allan La", "Natalie Altman",
"Evan Harrington", "Jack Napor", "Jingya Wu", "Christian Ouellette",
"Junjie Jiang", "Morgan Muller", "Sarah Xu", "Aleksandar Antonov",
"Parker Watson", "Haipu Sun", "Ryan Pencak", "Dan Kershner",
"John Venditti", "Jacob Mendelowitz", "Dunni Adenuga", "Jeff Lee",
"Uttam Kumaran", "Jack Hall-Tipping"]


/* STEP 1: SORT NAMES by LAST NAME! */
console.log(names);

names.sort(function(a, b) {
  var x = a.split(" ")[1];
  var y = b.split(" ")[1];
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
});

console.log(names);
/* WHILE > 1 students are UNPAIRED
     take 1st student, compute distance to all others,
      pair with lowest score.
*/
var vowels = ['a','e','i','o','u'];
while (names.length > 1) {
  var unpaired = names[0];
  var min_distance = 20; // longest name in class is < 20 length
  var pair_index;
  if (vowels.includes(unpaired[0].toLowerCase())) {
    for (let i = 1; i < names.length; i++) {
      let tempd = hamming.distance(unpaired, names[i].toLowerCase());
      if (tempd < min_distance ){
        min_distance = tempd;
        pair_index = i;
      }
    }
  } else {
    for (let i = 1; i < names.length; i++) {
      let tempd = levenshtein.distance(unpaired, names[i].toLowerCase());
      if (tempd < min_distance ){
        min_distance = tempd;
        pair_index = i;
      }
    }

  }
  console.log("Found pair: " + unpaired + " and " + names[pair_index]);
  console.log("Distance: " + min_distance);
  names.splice(0, 1);
  names.splice(pair_index-1, 1);
}
