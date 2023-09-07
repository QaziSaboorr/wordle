// remove this line
// it's just here to shows it works

var height = 4; // number of guesses
var width = 4; // length of the word

let row = 0; // current guess(attempt #)
let col = 0; //current letter for that attempt

var gameOver = false;

var lightbtn = document.getElementById("light");
let startbtn = document.getElementById("startover");
var helpbtn = document.getElementById("hint");
var helpstatus = false;
let dictionary = [];
var word1;
var hint1;
var lightstatus = true;
var menustatus = false;
//-----------Var Inits--------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
  { front: "red", back: "darkred" },
  { front: "green", back: "darkgreen" },
  { front: "blue", back: "darkblue" },
  { front: "yellow", back: "darkyellow" },
  { front: "orange", back: "darkorange" },
  { front: "pink", back: "darkpink" },
  { front: "purple", back: "darkpurple" },
  { front: "turquoise", back: "darkturquoise" },
];

var menubtn = document.getElementById("rules");

resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30),
      },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1,
      },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1,
      },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50),
      },
    });
  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(
      confetto.velocity.y + gravity,
      terminalVelocity
    );
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle =
      confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  // Fire off another round of confetti
  if (confetti.length <= 10) initConfetti();

  window.requestAnimationFrame(render);
};

//---------Execution--------

//----------Resize----------
window.addEventListener("resize", function () {
  resizeCanvas();
});

//------------Click------------
// window.addEventListener('click', function () {
//   initConfetti();
// });

function wordgen() {
  var number = Number.parseInt(Math.random() * dictionary.length);

  var { word, hint } = dictionary[number];

  word = word.toUpperCase();
  word1 = word;
  hint1 = hint;
}

window.onload = async function () {
  startbtn.innerText = "Loading..";

  intialize();
  await getDictionary();
  wordgen();
  startbtn.innerText = "Start Over";
  // after this line you have the dictionary

  //create the game board

  document.addEventListener("keyup", (e) => {
    // so user enters the input once he lifts up his finger

    if (gameOver) return;
    //alert(e.code); //to figure out what key were pressed

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
      if (col < width) {
        //so user doesnt go out of number of cols
        let currTile = document.getElementById(
          row.toString() + "-" + col.toString()
        );
        // let pc = col - 1;
        // let temp = col + 1;

        if (currTile.innerText == "") {
          // to see if its empty or else dont overwrite it
          currTile.innerText = e.code[3]; //KeyA but we just want the letter which is 3rd index
          currTile.classList.add("black");
          col += 1;
          // let pc = col - 1;

          // currTile.classList.add("black");

          // prevTile.classList.remove("black");
        }
      }
    } else if (e.code == "Backspace") {
      if (0 < col && col <= width) {
        col -= 1;
      }
      let currTile = document.getElementById(
        row.toString() + "-" + col.toString()
      );
      currTile.innerText = "";
      currTile.classList.remove("black");
    } else if (e.code == "Enter") {
      if (col == width) {
        update();
        row += 1; //start new row
        col = 0; //start at 0 for new row
      } else {
        alert("You must complete the word before pressing Enter key");
      }
    }
    if (!gameOver && row == height) {
      gameOver = true;
      document.getElementById("answer").style.display = "visible";
      document.getElementById("answer").style.background = "red";
      document.getElementById(
        "answer"
      ).innerHTML = `You missed the word <strong> ${word1} </strong> and lost!`;
    }
  });

  function update() {
    let correct = 0;

    for (let c = 0; c < width; c++) {
      let currTile = document.getElementById(
        row.toString() + "-" + c.toString()
      );
      let letter = currTile.innerText;

      //is it in the correct postion?
      if (word1[c] == letter) {
        currTile.classList.add("correct");
        correct += 1;
      } // is it int word?
      else if (word1.includes(letter)) {
        currTile.classList.add("present");
      }
      //not in the word
      else {
        currTile.classList.add("absent");
      }
      if (correct == width) {
        document.getElementById("board").style.display = "none";
        document.getElementById("answer").innerHTML =
          "Congratulations, you guessed the word " + word1.bold() + " right!";
        document.getElementById("answer").style.background = "green";
        helpbtn.disabled = true;
        initConfetti();
        render();

        document.getElementById("image").style.display = "flex";
        gameOver = true;
      }
    }
  }

  helpbtn.addEventListener("click", () => {
    if (helpstatus == false) {
      let hint = "Hint";

      document.getElementById("answer").style.display = "block";
      console.log("pressed");
      document.getElementById("answer").innerHTML =
        hint.italics() + ": " + hint1;

      document.getElementById("answer").style.background = "yellow";

      helpstatus = true;
    } else {
      document.getElementById("answer").innerText = "";

      helpstatus = false;
    }
  });
  menubtn.addEventListener("click", () => {
    if (menustatus == false) {
      document.getElementById("main").style.flexDirection = "row";
      document.getElementById("menu").style.display = "flex";

      menustatus = true;
      // helpbtn.disabled = true;
    } else {
      document.getElementById("main").style.flexDirection = "column";
      document.getElementById("menu").style.display = "none";

      // document.getElementById("answer").style.background = "yellow";
      menustatus = false;
      // helpbtn.disabled = false;
    }
  });
  lightbtn.addEventListener("click", () => {
    if (lightstatus == true) {
      document.getElementById("body").style.background = "black";
      document.getElementById("body").style.color = "white";
      // document.getElementById("tile").style.color = "white";

      lightstatus = false;
    } else {
      document.getElementById("body").style.background = "white";
      document.getElementById("body").style.color = "black";

      lightstatus = true;
    }
  });

  startbtn.addEventListener("click", async () => {
    helpbtn.disabled = false;
    document.getElementById("answer").innerText = "";
    document.getElementById("answer").style.background = "yellow";
    document.getElementById("image").style.display = "none";
    document.getElementById("board").style.display = "flex";
    // document.getElementById("board").style.display = "visible";
    // if(e.code != "Enter"){

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(
          r.toString() + "-" + c.toString()
        );
        currTile.remove();
        let tile = document.createElement("span");
        tile.id = r.toString() + "-" + c.toString(); //id = "0-0", "0-1" ... etc
        tile.classList.add("tile"); //adding class as tile class  = "tile" with all the styling
        tile.innerText = "";

        document.getElementById("board").appendChild(tile);
      }
    }

    wordgen();

    gameOver = false;
    col = 0;
    row = 0;
  });
};

function intialize() {
  //create the game board
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      //<span id = "0-0" class = "tile">P</span>
      let tile = document.createElement("span");
      tile.id = r.toString() + "-" + c.toString(); //id = "0-0", "0-1" ... etc
      tile.classList.add("tile"); //adding class as tile class  = "tile" with all the styling
      tile.innerText = "";
      document.getElementById("board").appendChild(tile); //adding span element on each iteration
    }
  }
}

var getDictionary = async () => {
  let res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });

  let json = await res.json();
  dictionary = json["dictionary"];
};

const buttons = document.getElementsByTagName("button");
for (const button of buttons) {
  button.addEventListener("keydown", (event) => {
    event.preventDefault();
  });
}

//-----------Functions--------------
