class Unit {
  constructor() {
    this.attack = 0;
    this.defense = 0;
    this.cost = 0;
  }

  setCost(cost) {
    this.cost = cost;
  }

  setAttack(attack) {
    this.attack = attack;
  }

  setDefense(defense) {
    this.defense = defense;
  }
}

class Player {
  constructor(money) {
    this.money = money;
    this.units = [];
  }

  buyUnit(unit) {
    if (this.money >= unit.cost) {
      this.units.push(unit);
      this.money -= unit.cost;
      return true;
    } else {
      return false;
    }
  }

  attackOpponent(opponent) {
    // Lógica de combate
  }
}

const unit1 = new Unit();

const player1 = new Player(50);
const player2 = new Player(50);

function showUnitInfo(playerId) {
  currentPlayer = playerId;
  const unitInfo = document.getElementById("unit-info");

  unitInfo.innerHTML = `
        <h2>Información de Unidades</h2>
        <div>
            <h3>Unidad</h3>
            <form onsubmit="event.preventDefault(); setUnitStats('player1', unit1)">
              <label>Ataque:</label>
              <input type="number" id="player1-attack" required>
              <label>Defensa:</label>
              <input type="number" id="player1-defense" required>
              <label>Costo:</label>
              <input type="number" id="player1-cost" required>
              <button type="submit">Comprar</button>
            </form>
        </div>
    `;
}

function setUnitStats(playerId, unit) {
  const attackInput = document.getElementById(`${playerId}-attack`);
  const defenseInput = document.getElementById(`${playerId}-defense`);
  const costInput = document.getElementById(`${playerId}-cost`);

  const attackValue = parseInt(attackInput.value, 10);
  const defenseValue = parseInt(defenseInput.value, 10);
  const costValue = parseInt(costInput.value, 10);

  unit.setAttack(attackValue);
  unit.setDefense(defenseValue);
  unit.setCost(costValue);

  // Actualizar la cantidad de unidades compradas
  buyUnits(unit);
}

function buyUnits(unit) {
  if (currentPlayer === "player1") {
    const maxAffordableUnits = Math.floor(player1.money / unit.cost);
    for (let i = 0; i < maxAffordableUnits; i++) {
      if (player1.buyUnit(unit)) {
        updatePlayerUI(player1, "player1");
        displayUnits(player1, "player1-units", unit);
        // Mostrar información de la unidad comprada
        const unitInfoDiv = document.getElementById("player1-unit-info");
        unitInfoDiv.innerHTML = `
           <p>Ataque: ${unit.attack}</p>
           <p>Defensa: ${unit.defense}</p>
           <p>Costo: ${unit.cost}</p>
         `;
      } else {
        alert("¡No tienes suficiente dinero para comprar más unidades!");
        break; // Detener la compra si no hay suficiente dinero
      }
    }
  } else if (currentPlayer === "player2") {
    const maxAffordableUnits = Math.floor(player2.money / unit.cost);
    for (let i = 0; i < maxAffordableUnits; i++) {
      if (player2.buyUnit(unit)) {
        updatePlayerUI(player2, "player2");
        displayUnits(player2, "player2-units", unit);
        // Mostrar información de la unidad comprada
        const unitInfoDiv = document.getElementById("player2-unit-info");
        unitInfoDiv.innerHTML = `
           <p>Ataque: ${unit.attack}</p>
           <p>Defensa: ${unit.defense}</p>
           <p>Costo: ${unit.cost}</p>
         `;
      } else {
        alert("¡No tienes suficiente dinero para comprar más unidades!");
        break; // Detener la compra si no hay suficiente dinero
      }
    }
  }
}

function updatePlayerUI(player, playerId) {
  document.getElementById(playerId + "-money").textContent = player.money;
}

function displayUnits(player, containerId, unit) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  player.units.forEach((unit) => {
    // Agrega una clase adicional si la unidad es la unidad 2
    const unitClass = unit === unit1 ? "unit2" : "null";
    const unitElement = document.createElement("div");
    unitElement.classList.add("unit-soldier");
    unitElement.classList.add(player === player1 ? "player1" : "player2");
    unitElement.classList.add(`${unitClass}`);
    unitElement.textContent = "";
    container.appendChild(unitElement);
  });
}

// Función para calcular el porcentaje de un valor en un array
function calculatePercentage(value, array) {
  const count = array.filter((element) => element === value).length;
  const total = array.length;

  if (total === 0) {
    return 0; // Evitar división por cero
  }

  return (count / total) * 100;
}

// función para posicionar unidades de forma aleatoria en el tablero
function positionUnitsRandomly(units, combatGrid) {
  const upperHalfCells = Array.from(
    combatGrid.getElementsByClassName("combat-cell")
  ).slice(0, 18);

  units.forEach((unit) => {
    // Obtener una celda de la mitad superior de forma aleatoria
    const randomCell =
      upperHalfCells[Math.floor(Math.random() * upperHalfCells.length)];

    // Crear un elemento visual para la unidad y añadirlo a la celda
    const unitElement = document.createElement("div");
    unitElement.classList.add("unit-soldier");
    unitElement.classList.add("player1");
    unitElement.textContent = "";
    randomCell.appendChild(unitElement);
  });
}

let moveUnitsInterval1; // variable para el setInterval, al iniciar cada combate la variable es limpiada
let moveUnitsInterval2; // variable para el setInterval, al iniciar cada combate la variable es limpiada
let combatResults = []; // muestra en consola
let combatRoundCount = 0; // para actualizar en que numero de ronda vamos
let player1Rounds = 0; //para actualizar las partidas que va ganando el jugador
let player2Rounds = 0; //para actualizar las partidas que va ganando el jugador
let combatButtonClicked = false; // para desabilitar el button de iniciar combate mientras se desarrolla los combates
let combatStarted = false; // chequear si ha iniciado el combate

// función para iniciar el combate
function startCombat() {
  // deshabilita los botones de comprar
  document.getElementById("player1-buyBtn").disabled = true; //deshabilitar button hasta que se haga reset
  document.getElementById("player2-buyBtn").disabled = true; //deshabilitar button hasta que se haga reset
  document.getElementById("player1-buyBtn").style.cursor = "not-allowed"; //cursor not-allowed hasta que se haga reset
  document.getElementById("player2-buyBtn").style.cursor = "not-allowed"; //cursor not-allowed hasta que se haga reset

  const unitInfo = document.getElementById("unit-info");
  unitInfo.innerHTML = "";

  combatStarted = true;

  clearInterval(moveUnitsInterval1); //limpiar el setInterval en cada combate nuevo
  clearInterval(moveUnitsInterval2); //limpiar el setInterval en cada combate nuevo

  const combatGrid = document.getElementById("combat-grid");
  combatGrid.innerHTML = ""; // limpia la cuadrícula antes de cada combate

  console.log("count:", combatRoundCount);

  // este if se ejecutará luego de 6 rondas, y con el return finalizará la funcion.
  if (combatRoundCount >= 6) {
    const porcentaje1 = calculatePercentage("1", combatResults);
    const porcentaje2 = calculatePercentage("2", combatResults);

    const porcentaje = document.getElementById("porcentaje");
    porcentaje.innerHTML = `
    <h2>Partidas ganadas</h2>
    <p>Jugador 1: ${porcentaje1}%</p>
    <p>Jugador 2: ${porcentaje2}%</p>
    `;

    // Determinar el resultado del balance al final del combate
    const balanceResult = determineBalance(porcentaje1);

    // Mostrar el mensaje correspondiente
    porcentaje.innerHTML += `<p class="balance">${balanceResult}</p>`;

    return;
  }

  // para crear la cuadrícula
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement("div");
      cell.classList.add("combat-cell");

      // Asignar color #a48f8f a las celdas de la mitad superior
      if (i < 4) {
        cell.style.backgroundColor = "#a48f8f";
      }

      combatGrid.appendChild(cell);
    }
  }

  // unidades escogidas por el jugador 1 de forma aleatoria en la mitad superior
  positionUnitsRandomly(player1.units, combatGrid, true);

  // unidades escogidas por el jugador 2 de forma aleatoria en la mitad inferior
  positionUnitsRandomly(player2.units, combatGrid, false);

  // desplazamiento vertical de unidades del jugador 1 cada 500 ms
  moveUnitsInterval1 = setInterval(movePlayer2Units, 1000);

  // desplazamiento vertical de unidades del jugador 2 cada 500 ms
  moveUnitsInterval2 = setInterval(movePlayer1Units, 1000);

  // Mostrar información de la ronda actual
  updateRoundInfo();
}

// función para posicionar unidades de forma aleatoria en el tablero
function positionUnitsRandomly(units, combatGrid, upperHalf) {
  const targetCells = Array.from(
    combatGrid.getElementsByClassName("combat-cell")
  );

  // filtro de celdas según la mitad del tablero
  const filteredCells = upperHalf
    ? targetCells.slice(0, 32)
    : targetCells.slice(32, 64);

  units.forEach((unit) => {
    // clase adicional si la unidad es la unidad 2 (para diferenciar la unidad 1 y la unidad 2)
    const unitClass = unit === unit1 ? "unit2" : "null";
    // celda de la mitad correspondiente de forma aleatoria
    const randomCell =
      filteredCells[Math.floor(Math.random() * filteredCells.length)];

    // elemento visual para la unidad y añadirlo a la celda
    const unitElement = document.createElement("div");
    unitElement.classList.add("unit-soldier");
    unitElement.classList.add(upperHalf ? "player1" : "player2");
    unitElement.classList.add(`${unitClass}`);
    unitElement.textContent = "";
    randomCell.appendChild(unitElement);
  });
}

// función para desplazar unidades del jugador 1 hacia la parte inferior
/* function movePlayer1Units() {
  const player1Units = document.getElementsByClassName("player1");

  // mover cada unidad hacia la parte inferior
  for (let i = 0; i < player1Units.length; i++) {
    const unit = player1Units[i];
    const currentCell = unit.parentElement;
    const targetCell = getEigthNextElementSibling(currentCell);

    // mover la unidad solo si hay una celda inferior disponible
    if (targetCell && !targetCell.hasChildNodes()) {
      targetCell.appendChild(unit);

      // verificar si hay un sexto elemento nextElementSibling
      if (!getEigthNextElementSibling(targetCell)) {
        console.log("¡Unidad del jugador 1 llegó a la parte inferior!");
        clearInterval(moveUnitsInterval1);
        clearInterval(moveUnitsInterval2);
        setTimeout(startCombat, 2500); // volver a llamar a startCombat
        combatResults.push("1");
        console.log(combatResults);
        combatRoundCount++;
        // Incrementar las rondas ganadas por el jugador 1
        player1Rounds++;
        // Actualizar la información de la ronda
        updateRoundInfo();
      }
    }
  }
} */

// función para desplazar unidades del jugador 1 hacia la parte inferior
function movePlayer1Units() {
  const player1Units = document.getElementsByClassName("player1");
  const player2Units = document.getElementsByClassName("player2");

  // mover cada unidad hacia la parte inferior
  for (let i = 0; i < player1Units.length; i++) {
    const unit = player1Units[i];
    const currentCell = unit.parentElement;
    const targetCell = getEigthNextElementSibling(currentCell);

    // verificar si la celda a la que se va a mover ya está ocupada por una unidad del jugador 2
    const unit2InTargetCell =
      targetCell && targetCell.querySelector(".player2");
    if (unit2InTargetCell) {
      // Eliminar la unidad del jugador 2
      unit2InTargetCell.remove();
    }

    // mover la unidad solo si hay una celda inferior disponible
    if (targetCell && !targetCell.hasChildNodes()) {
      targetCell.appendChild(unit);

      // verificar si hay un sexto elemento nextElementSibling
      if (!getEigthNextElementSibling(targetCell)) {
        console.log("¡Unidad del jugador 1 llegó a la parte inferior!");
        clearInterval(moveUnitsInterval1);
        clearInterval(moveUnitsInterval2);
        setTimeout(startCombat, 2500); // volver a llamar a startCombat
        combatResults.push("1");
        console.log(combatResults);
        combatRoundCount++;
        // Incrementar las rondas ganadas por el jugador 1
        player1Rounds++;
        // Actualizar la información de la ronda
        updateRoundInfo();
      }
    }
  }
}

// función para obtener el sexto elemento nextElementSibling
function getEigthNextElementSibling(element) {
  let count = 0;
  let currentElement = element;

  while (count < 8 && currentElement) {
    currentElement = currentElement.nextElementSibling;
    count++;
  }

  return currentElement;
}

// función para desplazar unidades del jugador 2 hacia la parte superior
function movePlayer2Units() {
  const player2Units = document.getElementsByClassName("player2");

  // mover cada unidad hacia la parte superior
  for (let i = 0; i < player2Units.length; i++) {
    const unit = player2Units[i];
    const currentCell = unit.parentElement;
    const targetCell = getSixthPreviousElementSibling(currentCell);
    // mover la unidad solo si hay una celda superior disponible
    if (targetCell && !targetCell.hasChildNodes()) {
      targetCell.appendChild(unit);
      // verificar si hay un sexto elemento previousElementSibling
      if (!getSixthPreviousElementSibling(targetCell)) {
        console.log("¡Unidad del jugador 2 llegó a la parte superior!");
        clearInterval(moveUnitsInterval1);
        clearInterval(moveUnitsInterval2);
        setTimeout(startCombat, 2500); // volver a llamar a startCombat
        combatResults.push("2");
        console.log(combatResults);
        combatRoundCount++;

        // Incrementar las rondas ganadas por el jugador 2
        player2Rounds++;
        // Actualizar la información de la ronda
        updateRoundInfo();
      }
    }
  }
}

// función para obtener el sexto elemento previousElementSibling
function getSixthPreviousElementSibling(element) {
  let count = 0;
  let currentElement = element;

  while (count < 8 && currentElement) {
    currentElement = currentElement.previousElementSibling;
    count++;
  }

  return currentElement;
}

//reset
function reset() {
  location.reload(); //recarga la pagina
}

//funcion actualizar en la UI quien va ganando
function updateRoundInfo() {
  const roundInfo = document.getElementById("round-info");
  const player1RoundsElement = document.getElementById("player1-rounds");
  const player2RoundsElement = document.getElementById("player2-rounds");

  roundInfo.innerHTML = `<h2>6 Rondas</h2>
                         <div id="player1-round" class="round-info-player">
                           <h3>Jugador 1</h3>
                           <p>Rondas ganadas: <span id="player1-rounds">${player1Rounds}</span></p>
                         </div>
                         <div id="player2-round" class="round-info-player">
                           <h3>Jugador 2</h3>
                           <p>Rondas ganadas: <span id="player2-rounds">${player2Rounds}</span></p>
                         </div>`;
}

//funcion para determinar balanceo
function determineBalance(percentage) {
  if (percentage === 50) {
    return "Hay balanceo";
  } else if (percentage > 40 && percentage < 60) {
    return "No hay mucho desbalanceo";
  } else if (percentage >= 60) {
    return "Hay mucho desbalanceo a favor del jugador 1";
  } else if (percentage < 40) {
    return "Hay mucho desbalanceo a favor del jugador 2";
  }
}
