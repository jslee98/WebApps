
  document.getElementById("sayItButton")
     .addEventListener('click', handleButtonClick)

function handleButtonClick (event) {
  console.log(event)
  // get the value of the input box
  var name =
   document.getElementById("name").value;

  if (name === ""){
    document.getElementById("content")
      .textContent = "Click the button!"
  }else{
    var message = "<h2>Hello " + name + "!</h2>";
    document
      .getElementById("content")
      .innerHTML = message;
  }
}
