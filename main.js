import "./style.css";
import rectangles from "./data.json";

// const rrr = screen.width;
// console.log('rrr: ', rrr);
// const containerWidth = Math.min(450, screen.width);

const container = { width: Math.min(450, screen.width), height: 500 };
Object.freeze(container);

const refs = {
  containerWrapper: document.querySelector(".container"),
  fullnessValue: document.querySelector(".fullness"),
  shuffleBtn: document.querySelector(".shuffle-btn"),
};

// відмальовую контейнер
refs.containerWrapper.style.maxWidth = `${container.width}px`;
refs.containerWrapper.style.height = `${container.height}px`;

//дописуємо в масив блоків вихідний номер блока і його вихідну орієнтацію
rectangles.forEach((rectangle, index) => {
  rectangle.index = index + 1;
  rectangle.orientation = rectangle.width > rectangle.height ? "h" : "v";
});

refs.shuffleBtn.addEventListener("click", shuffledRectangles);

// перемішування блоків в контейнері
function shuffledRectangles() {
  //перевірка граничних розмірів блоків
  const maxContainerSideLength = Math.max(container.width, container.height);

  let isContainerOversizing = null;
  let sumAreasOfAllBlocks = 0;

  rectangles.forEach((rectangle) => {
    //перевірка на перевищення габаритів контейнера кожним із блоків
    if (
      rectangle.width > maxContainerSideLength ||
      rectangle.height > maxContainerSideLength
    ) {
      isContainerOversizing = "Один з блоків перевищує габарити контейнера";
    }

    // вираховуємо суму площ всіх блоків в контейнері
    sumAreasOfAllBlocks += rectangle.width * rectangle.height;
  });

  if (isContainerOversizing) {
    alert(isContainerOversizing);
    return isContainerOversizing;
  }

  if (sumAreasOfAllBlocks > container.width * container.height) {
    alert("Сума площ блоків перевищує площу контейнера");
    return "Сума площ блоків перевищує площу контейнера";
  }

  const shuffledRectanglesArray = rectangles.sort(() => Math.random() - 0.5);
  const result = packRectangles(container, shuffledRectanglesArray);
  console.log(result);
}
shuffledRectangles();

function packRectangles(container, rectangles) {
  // Сортуємо прямокутники за їхньою площею в порядку спадання
  // rectangles.sort(function (a, b) {
  //   return b.width * b.height - a.width * a.height;
  // });

  // Створюємо об'єкт для збереження координат розташованих блоків
  const blockCoordinates = [];

  // Коефіцієнт корисного використання простору
  let fullness = 0;

  // Проходимося по кожному прямокутнику
  rectangles.forEach(function (rectangle, index) {
    let bestFit = { x: 0, y: 0, rotated: false };

    // Проходимося по кожній можливій позиції для блоку
    for (let rotated = 0; rotated < 2; rotated++) {
      let tempWidth = rotated ? rectangle.height : rectangle.width;
      let tempHeight = rotated ? rectangle.width : rectangle.height;

      // Пошук підходящого місця для розташування прямокутника
      for (let y = 0; y <= container.height - tempHeight; y++) {
        for (let x = 0; x <= container.width - tempWidth; x++) {
          let overlapping = false;

          // Перевірка перекриття з іншими блоками
          for (const placedBlock of blockCoordinates) {
            if (
              x < placedBlock.right &&
              x + tempWidth > placedBlock.left &&
              y < placedBlock.bottom &&
              y + tempHeight > placedBlock.top
            ) {
              overlapping = true;
              break;
            }
          }

          // Якщо не виявлено перекриття, розміщуємо блок
          if (!overlapping) {
            if (!bestFit.area || tempWidth * tempHeight < bestFit.area) {
              bestFit = {
                x,
                y,
                rotated,
                area: tempWidth * tempHeight,
              };
            }
          }
        }
      }
    }

    // Додаємо розташований блок в список координат
    const x = bestFit.x;
    const y = bestFit.y;
    const width = bestFit.rotated ? rectangle.height : rectangle.width;
    const height = bestFit.rotated ? rectangle.width : rectangle.height;

    blockCoordinates.push({
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      initialOrder: rectangle.index,
      initialOrientation: rectangle.orientation,
    });

    // Оновлюємо коефіцієнт корисного використання простору
    fullness =
      1 -
      blockCoordinates.reduce((area, block) => {
        return area + (block.right - block.left) * (block.bottom - block.top);
      }, 0) /
        (container.width * container.height);
  });

  // виводжу значення fullness
  refs.fullnessValue.textContent = `Fullness: ${fullness}`;

  //відмальовую блоки по їх координатам:
  drawBlocksByBoordinates(blockCoordinates);

  return {
    fullness,
    blockCoordinates,
  };
}

function drawBlocksByBoordinates(blockCoordinates) {
  let blocksArray = [];

  blockCoordinates.forEach((coords) => {
    const block = document.createElement("span");
    block.className = "item";
    block.style.width = `${coords.right - coords.left}px`;
    block.style.height = `${coords.bottom - coords.top}px`;
    block.style.bottom = `${coords.top}px`;
    block.style.left = `${coords.left}px`;
    // block.textContent = coords.initialOrder + ' ' + coords.initialOrientation;
    // block.innerHTML = `<span class = "blockNumber">${coords.initialOrder} ${coords.initialOrientation}</span>`;
    block.innerHTML = `<span class="blockNumber">${coords.initialOrder}</span>`;
    block.style.backgroundColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, 0)}`;

    blocksArray.push(block);
  });

  refs.containerWrapper.innerHTML = "";
  refs.containerWrapper.append(...blocksArray);
}
