const getParams = new URLSearchParams(window.location.search);
var kapd;
var max = getParams.get("max") || 10; // number will show between 0 ~ max
if (!isNumeric(max)) max = 10;

function isNumeric(value) {
  return /^\d{1,4}$/.test(value);
}

var cnt = 0;

document.addEventListener("DOMContentLoaded", e => {
  initKpad();
  setNewQuestion(true);

  // on next button click
  document.querySelector(".next").addEventListener("click", () => {
    if (kpad.isEmpty()) {
      alert("Write Anser");
      return;
    }
    setNewQuestion();
  });

  // on clear button click
  document.querySelector(".clear").addEventListener("click", () => kpad.clear());

  // on check result text clicked
  document.getElementById("result").addEventListener("click", e => {
    // make empty
    document.querySelector(".result-box").innerHTML = "";
    // fill data
    _getData();
  })

  // delete db
  document.querySelector(".deletedb-btn").addEventListener("click", e => {
    let pass = prompt("Enter password for Deletion?");
    if (pass != "1234") return;

    cnt = 0;
    _deleteDb();
    location.reload();
  });
})

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
}

/**
 * init kpad
 */
function initKpad() {
  const options = {
    backgroundColor: "black",
    penColor: "black",
    brushSize: 7
  };

  var parentElement = document.querySelector(".pad");
  kpad = new kpad(parentElement, options);
}


/**
 * Set new question
 */
function setNewQuestion(isInit = false) {
  // save the current status
  if (!isInit) {
    var question = document.querySelector(".question").innerText;
    var answer = kpad._can.toDataURL();
    _savaData(question, answer);
    kpad.clear();
  }

  document.getElementById("num1").textContent = getRandomNumber();
  document.getElementById("sign").textContent = ["+", "-"].sample();
  document.getElementById("num2").textContent = getRandomNumber();
  cnt++;
  document.getElementById("status").textContent = cnt;
}


/**
 * 
 * @returns random number between 0 and max
 */
function getRandomNumber() {
  return Math.floor(Math.random() * max);
}