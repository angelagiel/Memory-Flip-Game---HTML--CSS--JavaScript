const moves = document.getElementById("moves");
const time = document.getElementById("time");
const start__btn = document.getElementById("start");
const stop__btn = document.getElementById("stop");
const game__container = document.querySelector(".game__container");
const result = document.getElementById("result");
const commands = document.querySelector(".commands__container");
let boxes;
let interval;
let firstBox = false;
let secondBox = false;

//Items array
const items = [
  { name: "vice", image: "./assets/vice.png" },
  { name: "vhong", image: "./assets/vhong.png" },
  { name: "anne", image: "./assets/anne.png" },
  { name: "jhong", image: "./assets/jhong.png" },
  { name: "ion", image: "./assets/ion.png" },
  { name: "kim", image: "./assets/kim.png" },
  { name: "karylle", image: "./assets/karylle.png" },
  { name: "ogie", image: "./assets/ogie.png" },
  { name: "amy", image: "./assets/amy.png" },
  { name: "anne", image: "./assets/anne.png" },
  { name: "jhong", image: "./assets/jhong.png" },
  { name: "vice", image: "./assets/vice.png" }
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  time.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes boxValues array
  let boxValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    boxValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return boxValues;
};

const matrixGenerator = (boxValues, size = 4) => {
  game__container.innerHTML = "";
  boxValues = [...boxValues, ...boxValues];
  //simple shuffle
  boxValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create boxes
        before => front side (contains question mark)
        after => back side (contains actual image);
        box__card--values is a custom attribute which stores the names of the boxes to match later
      */
    game__container.innerHTML += `
     <div class="box__container" box__card--value="${boxValues[i].name}">
        <div class="box__before">
            <img src="./assets/st_logo.jpg" alt="">
        </div>
        <div class="box__after">
        <img src="${boxValues[i].image}" class="image"/>
        </div>
     </div>
     `;
  }
  //Grid
  game__container.style.gridTemplateColumns = `repeat(${size},auto)`;

  //boxes
  boxes = document.querySelectorAll(".box__container");
  boxes.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstBox (!firstBox since firstBox is initially false)
        if (!firstBox) {
          //so current card will become firstBox
          firstBox = card;
          //current boxes value becomes firstBoxValue
          firstBoxValue = card.getAttribute("box__card--value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondBox and value
          secondBox = card;
          let secondBoxValue = card.getAttribute("box__card--value");
          if (firstBoxValue == secondBoxValue) {
            //if both boxes match add matched class so these boxes would beignored next time
            firstBox.classList.add("matched");
            secondBox.classList.add("matched");
            //set firstBox to false since next card would be first now
            firstBox = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of boxValues
            if (winCount == Math.floor(boxValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //if the boxes dont match
            //flip the boxes back to normal
            let [tempFirst, tempSecond] = [firstBox, secondBox];
            firstBox = false;
            secondBox = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
start__btn.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //commands amd buttons visibility
  commands.classList.add("hide");
  stop__btn.classList.remove("hide");
  start__btn.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stop__btn.addEventListener(
  "click",
  (stopGame = () => {
    commands.classList.remove("hide");
    stop__btn.classList.add("hide");
    start__btn.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let boxValues = generateRandom();
  console.log(boxValues);
  matrixGenerator(boxValues);
};