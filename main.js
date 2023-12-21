import "./style.css";
import rectangles from "./data.json";

function packRectangles(container, rectangles) {
  //перевірка граничних розмірів

  const maxContainerSideLength = Math.max(container.width, container.height);
  // console.log('maxContainerSideLength: ', maxContainerSideLength);

  let isContainerOversizing = null;
  let sumAreasOfAllBlocks = 0;

  // for (let rectangle of rectangles) {
  rectangles.forEach((rectangle, index) => {
    //дописуємо вихідний номер блока і його вихідну орієнтацію
    rectangle.index = index + 1;
    rectangle.orientation = rectangle.width > rectangle.height ? "h" : "v";

    //перевірка на перевищення габаритів контейнера кожним з вихідних блоків
    if (
      rectangle.width > maxContainerSideLength ||
      rectangle.height > maxContainerSideLength
    ) {
      // console.log(rectangle.width, rectangle.height, maxContainerSideLength);
      // alert('Один з блоків перевищує габаорити контецнера');
      isContainerOversizing = "Один з блоків перевищує габаорити контецнера";
      // break;
    }

    // вираховуємо суму прощ всіх блоків в контейнері
    sumAreasOfAllBlocks += rectangle.width * rectangle.height;
    // console.log('sumAreasOfAllBlocks: ', sumAreasOfAllBlocks);
    // return;
  });

  if (isContainerOversizing) {
    alert(isContainerOversizing);
    return isContainerOversizing;
  }

  if (sumAreasOfAllBlocks > container.width * container.height) {
    alert("Сума площ блоків перевищує площу контецнера");
    return "Сума площ блоків перевищує площу контецнера";
  }

  // Сортуємо прямокутники за їхньою площею в порядку спадання
  // rectangles.sort(function (a, b) {
  //   return b.width * b.height - a.width * a.height;
  // });

  // console.log(rectangles.Object.keys);

  // Створюємо об'єкт для збереження координат розташованих блоків
  const blockCoordinates = [];

  // Коефіцієнт корисного використання простору
  let fullness = 0;

  // Проходимося по кожному прямокутнику
  rectangles.forEach(function (rectangle, index) {
    //дописуємо в об'єкт кожного прямокутника необхідні поля
    // rectangle.index = index + 1;
    // rectangle.orientation = rectangle.width > rectangle.height ? 'h' : 'v';

    let bestFit = { x: 0, y: 0, rotated: false };

    // Проходимося по кожній можливій позиції для блоку
    for (let rotated = 0; rotated < 2; rotated++) {
      const tempWidth = rotated ? rectangle.height : rectangle.width;
      const tempHeight = rotated ? rectangle.width : rectangle.height;

      // Пошук підходящого місця для розташування прямокутника
      for (let y = 0; y <= container.height - tempHeight; y++) {
        for (let x = 0; x <= container.width - tempWidth; x++) {
          let overlapping = false;

          // console.log('blockCoordinates: ', blockCoordinates);

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

    // console.log(blockCoordinates);

    // Оновлюємо коефіцієнт корисного використання простору
    fullness =
      1 -
      blockCoordinates.reduce((area, block) => {
        return area + (block.right - block.left) * (block.bottom - block.top);
      }, 0) /
        (container.width * container.height);
  });
  // малюю контейнер
  const containerWrapper = document.querySelector(".container");
  containerWrapper.style.width = `${container.width}px`;
  // console.log('container.width: ', container.width);
  containerWrapper.style.height = `${container.height}px`;

  const fullnessValue = document.querySelector(".fullness");
  fullnessValue.textContent = `Fullness: ${fullness}`;

  let blocksArray = [];

  //малюємо блоки по координатам:
  blockCoordinates.forEach((coords) => {
    const block = document.createElement("div");
    block.className = "item";
    block.style.width = `${coords.right - coords.left}px`;
    block.style.height = `${coords.bottom - coords.top}px`;
    block.style.bottom = `${coords.top}px`;
    block.style.left = `${coords.left}px`;
    // block.textContent = coords.initialOrder + ' ' + coords.initialOrientation;
    // block.innerHTML = `<span class = "blockNumber">${coords.initialOrder} ${coords.initialOrientation}</span>`;
    block.innerHTML = `<span class = "blockNumber">${coords.initialOrder}</span>`;
    block.style.backgroundColor = `#${Math.floor(
      Math.random() * 16777215
    ).toString(16)}`;
    // console.log('block: ', block);
    blocksArray.push(block);
  });

  containerWrapper.innerHTML = "";

  containerWrapper.append(...blocksArray);

  return {
    fullness,
    blockCoordinates,
  };
}

// Приклад використання
const container = { width: 450, height: 500 };

// const response = await fetch('data.json');
// const rectangles = await response.json();
// const rectangles = data;

// const rectangles = [
//   { width: 40, height: 100 },
//   { width: 80, height: 110 },
//   { width: 100, height: 50 },
//   { width: 150, height: 80 },
//   { width: 90, height: 120 },
//   { width: 120, height: 50 },
//   { width: 400, height: 120 },
//   { width: 50, height: 100 },
//   { width: 140, height: 80 },
//   { width: 80, height: 120 },
//   { width: 200, height: 100 },
//   { width: 50, height: 250 },
//   { width: 130, height: 100 },
//   { width: 460, height: 100 },
// ];
// const rectangles = rectanglesArray;

// const result = packRectangles(container, rectangles);

// Результат
// console.log(result);

const shuffleBtn = document.querySelector(".shuffle-btn");

shuffleBtn.addEventListener("click", () => {
  // console.log("мішаємо");
  // console.log("rectangles: ", rectangles);
  const shuffleRectanglesArray = rectangles.sort(() => Math.random() - 0.5);

  // console.log("shuffleRectanglesArray: ", shuffleRectanglesArray);
  const result = packRectangles(container, shuffleRectanglesArray);
  console.log(result);
});

