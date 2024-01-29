// Import the WORDS array from words.js
import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
const wasteManagementWords = ["flush", "green", "sweep", "plant", "reuse","solar","ozone","bloom","scrap","decay","trash","renew","steam","waste","light","cycle","fresh","ocean",'grass'];

// Array of waste management-related information
const wasteManagementInfo = [
  "Singapore faces challenges in waste management, with limited land space for disposal. Pulau Semakau remains the only landfill for Singapore as of now",
  "Incineration is a common practice in Singapore, helping to reduce the volume of waste and generate energy. However, it raises environmental concerns.",
  "To address waste issues, Singapore is actively promoting the 3R approach: Reduce, Reuse, and Recycle.",
  "Efforts to achieve zero waste align with Sustainable Development Goal 12 (SDG 12) – Responsible Consumption and Production.",
  "Waste segregation is essential to enhance recycling efficiency and reduce contamination.",
  "NEA (National Environment Agency) oversees waste management, implementing policies and initiatives to drive sustainability.",
  "Singapore has set ambitious targets, aiming to increase recycling rates and reduce overall waste generation.",
  "Public awareness campaigns encourage citizens to adopt eco-friendly practices and contribute to waste reduction.",
  "SDG 11 – Sustainable Cities and Communities is relevant, emphasizing the need for sustainable waste management practices in urban areas.",
];


// Filter the WORDS array to include only waste management-related words
const filteredWords = WORDS.filter(word => wasteManagementWords.includes(word));

// Pick a random word from the filtered list
let rightGuessString = filteredWords[Math.floor(Math.random() * filteredWords.length)];

console.log(rightGuessString);

function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j <5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green" || oldColor === "yellow") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let guessString = "";
  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    toastr.error("Not enough letters!");
    return;
  }

  if (!WORDS.includes(guessString)) {
    toastr.error("Word not in list!");
    return;
  }

  var letterColor = ["gray", "gray", "gray", "gray", "gray"];

  // Check green
  for (let i = 0; i < 5; i++) {
    if (rightGuess[i] == currentGuess[i]) {
      letterColor[i] = "green";
      rightGuess[i] = "#"; // Mark as used
    }
  }

  // Check yellow
  // Checking guess letters
  for (let i = 0; i < 5; i++) {
    if (letterColor[i] == "green") continue;

    // Checking right letters
    for (let j = 0; j < 5; j++) {
      if (rightGuess[j] == currentGuess[i]) {
        letterColor[i] = "yellow";
        rightGuess[j] = "#"; // Mark as used
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      // Flip box
      animateCSS(box, "flipInX");
      // Shade box
      box.style.backgroundColor = letterColor[i];
      if (letterColor[i] === "green" || letterColor[i] === "yellow") {
        shadeKeyBoard(currentGuess[i], letterColor[i]);
      }
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game over!");
    // Redirect to end.html when the correct word is guessed
    window.location.href = "end.html";
    // You can also use window.location.replace("end.html"); if you don't want to keep the current page in the browser's history
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
      // Reload the page only if it's the last guess and it's wrong
      location.reload();
  } else {
      // Automatically show the waste management popup after each attempt
      showWasteManagementPopup();
  }
  
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

// Function to show waste management popup
function showWasteManagementPopup() {
  // Pick a random piece of information from wasteManagementInfo array
  const randomInfo = wasteManagementInfo[Math.floor(Math.random() * wasteManagementInfo.length)];
  toastr.info(randomInfo);
}

initBoard();
