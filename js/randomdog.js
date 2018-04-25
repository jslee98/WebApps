
document.getElementById("dogButton")
.addEventListener('click', handleButtonClick)

function handleButtonClick (event) {
  var threeDogs = {};
  Promise.all([fetch("https://dog.ceo/api/breeds/image/random"),
  fetch("https://dog.ceo/api/breeds/image/random"),
  fetch("https://dog.ceo/api/breeds/image/random")])
  .then(function(values) {
    Promise.all([values[0].json(), values[1].json(), values[2].json()])
    .then(function(jsonvals) {
      console.log(jsonvals[2].status);
      Promise.all([jsonvals[0].message, jsonvals[1].message, jsonvals[2].message])
      .then(function(paths) {
        var dogImg1 = "<img src=" + paths[0] + "> ";
        var dogImg2 = "<img src=" + paths[1] + "> ";
        var dogImg3 = "<img src=" + paths[2] + "> ";
        document.getElementById("dogpic1").innerHTML = dogImg1;
        document.getElementById("dogpic2").innerHTML = dogImg2;
        document.getElementById("dogpic3").innerHTML = dogImg3;
        return [paths[0].split("/")[4].replace("-", " "),
        paths[1].split("/")[4].replace("-", " "),
        paths[2].split("/")[4].replace("-", " ")];
      }).then(function(dogNames){
        for(let i = 0; i< 3; i++) {
          if (dogNames[i].indexOf(" ") > 0) {
            let temp = dogNames[i].split(" ");
            dogNames[i] = temp[1] + " " + temp[0];
          }
          dogNames[i] =  dogNames[i].charAt(0).toUpperCase() + dogNames[i].slice(1);
        }
        return dogNames;
      }).then(function(dogNames) {
        if(dogNames[0] == dogNames[1] && dogNames[0] == dogNames[2]) {
          var matchmsg = "<h3>You win!</h3>";
        } else {
          var matchmsg = "<h3>Try again</h3>";
        }
        var dogName1 = "<h2>" + dogNames[0] + "</h2>";
        var dogName2 = "<h2>" + dogNames[1] + "</h2>";
        var dogName3 = "<h2>" + dogNames[2] + "</h2>";
        document.getElementById("dogname1").innerHTML = dogName1;
        document.getElementById("dogname2").innerHTML = dogName2;
        document.getElementById("dogname3").innerHTML = dogName3;
        document.getElementById("winner").innerHTML = matchmsg;
      })
    })
  })
}
