const squaresContainer = document.querySelector(".container-squares");
const squares = document.querySelectorAll(".squares");

for (let i = 0; i < squaresContainer.children.length; i++) {
  const element = document.querySelector(`.sq${i}`);
  element.addEventListener("click", () => {
    if (!confirmation) return;
    if (listRandom.length < 1) return;
    functioning(listRandom, i);
    element.textContent = listRandom[i];
  });
}

// LIST RANDOM
let listRandom = [];
function randomCreator() {
  listRandom.splice(0, 12);
  let cont = {};
  for (let i = 0; i < 12; i++) {
    const n = Math.floor(Math.random() * 6 + 1);
    if (!cont[n] || cont[n] < 2) {
      listRandom.push(n);
      cont[n] = (cont[n] || 0) + 1;
    } else {
      i--;
    }
  }
  showNum(listRandom);
}

// SHOW LIST
const showNum = (n) => {
  placePoints();
  for (let i = 0; i < n.length; i++) {
    document.querySelector(`.sq${i}`).textContent = n[i];
    setTimeout(() => {
      document.querySelector(`.sq${i}`).textContent = " ";
      confirmation = true;
      if (i == 0 && time == 30 && points.normal == 0) startTemporizer();
    }, 3500);
  }
};

var confirmation = false;

// VAR SHOW POINTS

const txtRound = document.querySelector(".txtRound");
const txtMovements = document.querySelector(".txtMovements");
const txtMaxStreack = document.querySelector(".txtMaxStreack");
const txtStreak = document.querySelector(".txtStreak");
const txtPoints = document.querySelector(".txtPoints");

var points = {
  normal: 0,
  correct: false,
  streak: 0,
  maxStreak: 0,
  movements: 0,
  round: 1,
};

const placePoints = () => {
  txtRound.textContent = points.round.toString().padStart(2, "0");
  txtStreak.textContent = points.streak.toString().padStart(2, "0");
  txtMaxStreack.textContent = points.maxStreak.toString().padStart(2, "0");
  txtMovements.textContent = points.movements.toString().padStart(2, "0");
  txtPoints.textContent = points.normal.toString().padStart(2, "0");
};

// SYSTEM FUNCTION
var compare = [];
const functioning = (listRandom, n) => {
  if (temporizer < 1) return;
  if (!confirmation) return;
  if (!notRegister(compare, n)) return;

  compare.unshift({ [n]: listRandom[n] });

  if (compare.length % 2 == 0) {
    if (Object.keys(compare[0])[0] == Object.keys(compare[1])[0])
      return compare.shift();

    const elements = document.querySelectorAll(
      `.sq${Object.keys(compare[0])}, .sq${Object.keys(compare[1])}`
    );
    points.movements++;

    if (Object.values(compare[0])[0] === Object.values(compare[1])[0]) {
      elements.forEach((element) => {
        element.style.backgroundColor = "#20bb45";
        element.textContent = Object.values(compare[0])[0];
      });

      if (points.streak > 0) points.normal += points.streak;
      else points.normal++;
      if (points.correct) points.streak++;
      if (points.streak > points.maxStreak) points.maxStreak = points.streak;
      points.correct = true;
      settingTime("correct");
    } else {
      points.correct = false;
      points.streak = 0;
      elements.forEach((element) => {
        element.style.backgroundColor = "#FF3D3D";
        setTimeout(() => {
          element.textContent = " ";
          element.style.backgroundColor = "#fff0";
        }, 300);
      });
      settingTime("incorrect");
      compare.splice(0, 2);
    }
  }

  if (compare.length == 12) {
    squares.forEach((square) => {
      square.classList.add("squareCompleted");
    });
    points.round++;
    settingTime("finish");
    confirmation = false;
    setTimeout(() => {
      cleaning();
    }, 1000);
  }
};

const notRegister = (array, k) => {
  for (let i = 0; i < array.length; i++) {
    if (k == Object.keys(array[i])) {
      return false;
    }
  }
  return true;
};

// TEMPORIZER

var time = 30;
let chronometer;
const startTemporizer = () => {
  chronometer = setInterval(() => {
    if (time <= 0) finalize(listRandom);
    temporizer(0);
  }, 1000);
};

const view = document.querySelector(".elapsed");
const temp = document.querySelector(".txtTemp");
const temporizer = (t) => {
  if (!confirmation) return;
  if (t != 0) time += t;
  else time -= 1;

  if (time > 30) time = 30;
  if (time < 0) time = 0;

  temp.textContent = `${time}`;

  const porcentage = Math.floor((time / 30) * 100);
  view.style.width = `${porcentage}%`;
};

// BTN START - CLOSE - FINALIZE

const btnStart = document.querySelector(".btn-start");
const bntFinalize = document.querySelector(".btn-finalize");

btnStart.addEventListener("click", () => {
  if (time == 0) cleaning(30);
  else randomCreator();
  bntFinalize.removeAttribute("hidden");
  btnStart.setAttribute("hidden", "true");
});

bntFinalize.addEventListener("click", () => {
  reset();
  bntFinalize.setAttribute("hidden", "true");
  btnStart.removeAttribute("hidden");
});

const reset = () => {
  clearInterval(chronometer);
  confirmation = false;
  compare = [];
  listRandom = [];
  time = 30;
  cleaning(30, true);
  settingTime("finish");
};

const finalize = (n) => {
  clearInterval(chronometer);
  confirmation = false;
  compare = [];
  for (let i = 0; i < n.length; i++) {
    document.querySelector(`.sq${i}`).textContent = n[i];
  }
};

const cleaning = (t, exit = false) => {
  if (t != undefined) {
    time = t;
    for (const [keys, value] of Object.entries(points)) {
      points[keys] = 0;
    }
    view.style.width = `100%`;
    temp.textContent = `30`;
    placePoints();
  }
  compare = [];
  squares.forEach((square) => {
    square.style.backgroundColor = "#0000";
    square.textContent = " ";
    square.classList.remove("squareCompleted");
  });
  if (!exit) randomCreator();
};

// -- SETTINGS

const settingsPoints = {
  0: {
    correct: +1,
    incorrect: -1,
    finish: +5,
  },
  10: {
    correct: +2,
    incorrect: -2,
    finish: +4,
  },
  20: {
    correct: +1,
    incorrect: -2,
    finish: +3,
  },
  30: {
    timeExtra: {
      round: 30,
      extra: +5,
    },
    color: {
      seconds: 500,
    },
    correct: +1,
    incorrect: -2,
    finish: +3,
    rest: 10000,
  },
};

const settingTime = (type) => {
  round = Math.floor(points.round / 10) * 10;
  t = settingsPoints[round][type];
  // console.log(t);
  temporizer(t);

  if (
    settingsPoints[round].color != undefined &&
    points.round % 10 == 0 &&
    type == "finish"
  )
    setInterval(() => color(), settingsPoints[round].color.seconds);
  if (
    settingsPoints[round].timeExtra != undefined &&
    settingsPoints[round].timeExtra.round == points.round &&
    type == "finish"
  )
    temporizer(settingsPoints[round].timeExtra.extra);
};

// COLORS

function color() {
  let valColor = [1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c"];
  let arrayColor = [];

  const random = (max) => Math.floor(Math.random() * max);

  for (i = 0; i < 6; i++) {
    var n = random(11);
    var selection = valColor[n];
    arrayColor.push(selection);
  }
  let colorRandom = `#${arrayColor.join("")}aa`;
  console.log(colorRandom);

  view.style.backgroundColor = colorRandom;
}
