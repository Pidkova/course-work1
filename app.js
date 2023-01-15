//***Виділяємо HTML-елементи, з якими будемо працювати в js***//

//Інпути для введення дат
dateForm = document.getElementById("dateForm");
startDateInput = document.getElementById("startDate");
endDateInput = document.getElementById("endDate");

//Чекбокси
oneWeekPreset = document.getElementById("oneWeekFromDate");
oneMonthPreset = document.getElementById("oneMonthFromDate");

//Селект-інпут
selectInput = document.getElementById("selectOption");
weekendsChoice = document.getElementById("weekends");
workingDaysChoice = document.getElementById("workingDays");
allDays = document.getElementById("allDays");

//Секція з кнопками
resultBtns = document.querySelectorAll(".resultBtn");
btnGroup = document.getElementById("buttonSection");

//h3 - для виведення результату обчислення
resultInput = document.getElementById("result");

//Кнопка для показу нещодавного пошуку
recentSearchesBtn = document.getElementById("recents");

// div-елемент для створення таблиці
tablearea = document.getElementById("table");
tableElement = document.getElementsByClassName("tableExists");

//Слухачі подій
window.addEventListener("load", updatePage);
oneWeekPreset.addEventListener("change", setOneWeekPreset);
oneMonthPreset.addEventListener("change", setOneMonthPreset);
recentSearchesBtn.addEventListener("click", createTable);
btnGroup.addEventListener("click", getUnits);

/*startDateInput.addEventListener("change", validate);

endDateInput.addEventListener("change", validate);*/

//
//функція для автозаповнення фінальної дати (місяць після стартової)
//
function setOneMonthPreset(event) {
  event.preventDefault();
  if (oneMonthPreset.checked) {
    let startDate = startDateInput.value;
    startDate = new Date(startDate);
    endDate = new Date(startDate);
    let end = endDate.setMonth(endDate.getMonth() + 1);
    let result = formatDate(end);
    endDateInput.value = result;
    oneWeekPreset.checked = false;
  } else {
    endDateInput.value = "";
    endDateInput.addEventListener("change", function () {
      endDate = endDateInput.value;
      setEndDat = new Date(endDate);
    });
  }
}

startDateInput.addEventListener("change", validateEnddate);
endDateInput.addEventListener("change", validateStartdate);

function validateEnddate() {
  var startDate = startDateInput.value;
  endDateInput.min = startDate;
}

function validateStartdate() {
  var endDate = endDateInput.value;
  startDateInput.max = endDate;
}

//
//функція для автозаповнення фінальної дати (тиждень після стартової)
//
function setOneWeekPreset(event) {
  event.preventDefault();
  if (oneWeekPreset.checked) {
    let startDate = startDateInput.value;
    startDate = new Date(startDate);

    endDate = new Date(startDate);
    let end = endDate.setDate(endDate.getDate() + 7);
    let result = formatDate(end);
    endDateInput.value = result;

    oneMonthPreset.checked = false;
  } else {
    endDateInput.value = "";
    endDateInput.addEventListener("change", function () {
      endDate = endDateInput.value;
      setEndDat = new Date(endDate);
    });
  }
}
//
//додаємо "0" для чисел 1-9
//
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
//
//форматуємо дату для авто-заповнення в дата-інпут
//
function formatDate(fDate) {
  date = new Date(fDate);
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}

//
//Перевіряємо яка опція була обрана.
//В залежності від вибору, здійснюємо подальше обчислення
//
function checkSelectionInput() {
  let start = startDateInput.value;
  let end = endDateInput.value;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (weekendsChoice.selected === true) {
    result = getWeekendsBetweenDates(startDate, endDate);
  } else if (workingDaysChoice.selected === true) {
    result = getWorkingDaysBetweenDates(startDate, endDate);
  } else {
    result = countDays();
  }
  return result;
}

function countDays() {
  let start = startDateInput.value;
  let end = endDateInput.value;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeGap = Math.abs(endDate - startDate);
  let days = Math.ceil(timeGap / (1000 * 60 * 60 * 24));
  return days;
}

//
//Розраховуємо скільки вихідних днів сумарно між обраними датами
//
function getWeekendsBetweenDates(startDate, endDate) {
  var weekends = 0;
  for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    if (i.getDay() === 0 || i.getDay() === 6) weekends++;
  }
  return weekends;
}
//
//Розраховуємо скільки будніх днів сумарно між обраними датами
//
function getWorkingDaysBetweenDates(startDate, endDate) {
  var workingDays = 0;
  for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    if (i.getDay() !== 0 && i.getDay() !== 6) workingDays++;
  }
  return workingDays;
}
//
//Ідентифікуємо яка з кнопок була нажата.
//Конвертуємо фінальний результат в бажані одиниці часу.
//
function getUnits(event) {
  enableSubmit();

  let units = event.target.innerHTML;
  let final;
  let result;
  let hours = 24;
  let minutes = 24 * 60;
  let sekonds = 24 * 60 * 60;
  let days = checkSelectionInput();
  let lastData;
  let start = startDateInput.value;
  let end = endDateInput.value;
  let formatedStart = formatDate(start);
  let formatedEnd = formatDate(end);

  if (days !== undefined && !isNaN(days) && days !== "") {
    if (units === "DAYS") {
      result = days;
      final = `${result} ${units}`;
    } else if (units === "HOURS") {
      result = days * hours;
      final = `${result}  ${units}`;
    } else if (units === "MINUTES") {
      result = days * minutes;
      final = `${result} ${units}`;
    } else if (units === "SEKONDS") {
      result = days * sekonds;
      final = `${result} ${units}`;
    }
    resultInput.innerHTML = final;
    lastData = {
      start: formatedStart,
      end: formatedEnd,
      result: final,
    };
    storeDataInLocalStorage(lastData);
    clearInputs();
  } else {
    resultInput.innerHTML = "You have to fill out the inputs first";
  }
}
//
// очищуємо всі інпути
//
function clearInputs() {
  if (startDateInput.value !== "") {
    startDateInput.value = "";
  }
  if (endDateInput.value !== "") {
    endDateInput.value = "";
  }
  if (oneMonthPreset.checked === true) {
    oneMonthPreset.checked = false;
  }
  if (oneWeekPreset.checked === true) {
    oneWeekPreset.checked = false;
  }
  if (tableElement !== undefined && tableElement !== null) {
    let i;
    for (i = tableElement.length; i--; ) {
      tableElement[i].parentNode.removeChild(tableElement[i]);
    }
  }
  if (tablearea.classList.contains("hidden")) {
    return null;
  } else {
    tablearea.classList.remove("shown");
    tablearea.classList.add("hidden");
    recentSearchesBtn.innerHTML = "Show recent searches";
    recentSearchesBtn.innerHTML += '<i class="fa-solid fa-angle-down"></i>';
  }
}

function updatePage() {
  let data;
  if (localStorage.getItem("data") !== null) {
    data = localStorage.getItem("data");
  } else {
    data = [];
  }
}
//
//зберігаємо до 10 результатів в локал стреджі
//
function storeDataInLocalStorage(lastData) {
  let data;
  if (localStorage.getItem("data") !== null) {
    data = JSON.parse(localStorage.getItem("data"));
    let length = data.length;
    if (length > 9) {
      data.splice(0, 1);
    }
  } else {
    data = [];
  }
  data.push(lastData);
  localStorage.setItem("data", JSON.stringify(data));
}
//
// створюємо талицю яка буде висвічуватись на сторінці з нажаттям кнопки
//
function createTable(event) {
  event.preventDefault();

  if (tablearea.classList.contains("hidden")) {
    tablearea.classList.remove("hidden");
    tablearea.classList.add("shown");
    recentSearchesBtn.innerHTML = "Hide recent searches";
    recentSearchesBtn.innerHTML += '<i class="fa-solid fa-angle-up"></i>';
  } else {
    tablearea.classList.remove("shown");
    tablearea.classList.add("hidden");
    recentSearchesBtn.innerHTML = "Show recent searches";
    recentSearchesBtn.innerHTML += '<i class="fa-solid fa-angle-down"></i>';
  }
  let searchInfo = JSON.parse(localStorage.getItem("data"));
  if (tableElement !== undefined && tableElement !== null) {
    let i;
    for (i = tableElement.length; i--; ) {
      tableElement[i].parentNode.removeChild(tableElement[i]);
    }
  }
  let table;
  if (searchInfo === undefined || searchInfo === null || searchInfo === "") {
    table = document.createElement("p");
    table.innerHTML = "Unfortuately, there's no previous results";
  } else {
    table = document.createElement("table");
    generateTableHead(table, searchInfo);
    searchInfo.forEach((oneSearch) => {
      var tr = document.createElement("tr");
      tr.appendChild(document.createElement("td"));
      tr.appendChild(document.createElement("td"));
      tr.appendChild(document.createElement("td"));

      tr.cells[0].appendChild(document.createTextNode(oneSearch.start));
      tr.cells[1].appendChild(document.createTextNode(oneSearch.end));
      tr.cells[2].appendChild(document.createTextNode(oneSearch.result));

      table.appendChild(tr);
    });
  }
  tablearea.appendChild(table);
  table.classList.add("tableExists");
}
//
// створюємо підгазоловки для колонок в таблиці із ключів одного з об'єкту масиву
// (оскіьлки всі об'єкти мають однакові ключі, нам достатньо лише одного)
//
function generateTableHead(table, data) {
  let searchInfo = data;
  let headers;
  if (searchInfo.length > 0) {
    headers = Object.keys(searchInfo[0]);
  } else {
    headers = Object.keys(searchInfo);
  }
  let row = table.insertRow();
  for (let i = 0; i < headers.length; i++) {
    let thead = row.appendChild(document.createElement("th"));
    thead.innerHTML = headers[i];
    row.appendChild(thead);
  }
}
//
// Валідуємо або скасовужмо валідність кнопок для показу результатів
// в залежності від того, чи були заповнені всі обов'язкові інпути
//
function enableSubmit() {
  let inputs = document.getElementsByClassName("required");
  let btns = document.querySelectorAll('button[type="submit"]');
  let isValid = true;
  for (var i = 0; i < inputs.length; i++) {
    let changedInput = inputs[i];
    if (changedInput.value.trim() === "" || changedInput.value === null) {
      isValid = false;
      changedInput.focus({ focusVisible: true });

      break;
    }
    btns.forEach((el) => (el.disabled = !isValid));
  }
}
