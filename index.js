const getParams = new URLSearchParams(window.location.search);
var kapd;
var max = getParams.get("max") || 100; // number will show between 0 ~ max
if (!isNumeric(max)) max = 10;
var sign = getParams.get("type");
if (!["plus", "minus"].includes(sign)) sign = "random";


function isNumeric(value) {
  return /^\d{1,4}$/.test(value);
}

window._cnt = 0;

document.addEventListener("DOMContentLoaded", e => {
  // initialize kpad
  initKpad();

  // get the number of rows in db
  window._getCount();

  // set question
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
    window._getData();
  })

  // delete db
  document.querySelector(".deletedb-btn").addEventListener("click", e => {
    let pass = prompt("Enter password for Deletion?");
    if (pass != "1234") return _showToast("Password is incorrect!!");

    window._cnt = 0;
    _deleteDb();
    location.reload();
  });

  // M.updateTextFields();
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {});

  elems = document.querySelectorAll('select');
  instances = M.FormSelect.init(elems, {});
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

  createQuestion();

  setTimeout(() => {
    window._cnt++;
    document.getElementById("status").textContent = window._cnt;
  }, 100);
}

function createQuestion() {
  document.getElementById("num1").textContent = getRandomNumber();
  document.getElementById("sign").textContent = getCommand();
  document.getElementById("num2").textContent = getRandomNumber();
}

/**
 * 
 * @returns random number between 0 and max
 */
function getRandomNumber() {
  return Math.floor(Math.random() * max);
}

/**
 * 
 * @returns sign for calculation +/-
 */
function getCommand() {
  switch (sign) {
    case "plus":
      return "+";
      break;
    case "minus":
      return "-";
      break;
    case "multiply":
      return "*";
      break;
    case "random":
      return ["+", "-"].sample();
      break;
    default:
      break;
  }
}

/**
 * symbol(+, -) changed
 * 
 * @param {*} e 
 */
function typeChanged(e) {
  if (e.value === "1") {
    sign = "plus";
  } else if (e.value === "2") {
    sign = "minus";
  } else {
    sign = "random";
  }
  createQuestion();
}

function maxChanged(e) {
  max = e.value;
  createQuestion();
}