let currentSamples = 12;

function createHelpBoxHeader(node) {
  const helpBox = document.createElement("th");
  helpBox.setAttribute("id", "HelpBox");
  helpBox.setAttribute("style", "cursor:help;");
  helpBox.textContent = "?";
  helpBox.addEventListener("click", () =>
    alert("Die ausgewählten Parameter werden dem Detailbericht zugefügt.")
  );
  node.appendChild(helpBox);
} // end createHelpBoxHeader

function createHeaderInputFields(index, node) {
  let header = document.createElement("th");
  header.setAttribute("colspan", 2);
  header.setAttribute("draggable", "true");

  header.addEventListener("dragstart", (e) => {
    // Textauswahl in der Textarea soll keinen Spalten-Drag auslösen
    if (e.target.tagName === "TEXTAREA") {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
    header.classList.add("th-dragging");
  });

  header.addEventListener("dragend", () => {
    header.classList.remove("th-dragging");
    document.querySelectorAll(".th-drag-over").forEach(el => el.classList.remove("th-drag-over"));
  });

  header.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    header.classList.add("th-drag-over");
  });

  header.addEventListener("dragleave", () => {
    header.classList.remove("th-drag-over");
  });

  header.addEventListener("drop", (e) => {
    e.preventDefault();
    header.classList.remove("th-drag-over");
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (!isNaN(sourceIndex) && sourceIndex !== index) {
      swapColumns(sourceIndex, index);
    }
  });

  // create checkBox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("value", "true");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `SampleNumber${index}`);
  checkbox.setAttribute("checked", "true");
  checkbox.setAttribute("onclick", `hideText(${index})`);
  // Create textField
  let textField = document.createElement("textarea");
  textField.setAttribute("class", "MPHead");
  textField.setAttribute("id", `SampleName${index}`);
  textField.setAttribute("onclick", "ausw()");
  textField.setAttribute("style", "resize:none");
  textField.setAttribute("draggable", "false"); // Textarea-Text nicht mit Spalten-Drag verwechseln
  // Append Elements
  node.appendChild(header);
  header.appendChild(checkbox);
  header.appendChild(textField);
} // end createHeaderInputFields

function createCategoryRow(index, node, tableWidth) {
  // Fügt eine Zwischenzeile mit der Kategorie als Überschrift in die Tabelle ein
  let CurrentCategory = InitParaList[index][0].Cat;
  let categoryRow = document.createElement("tr");
  let categoryRowTD = document.createElement("td");
  categoryRowTD.setAttribute("colspan", tableWidth);
  categoryRowTD.textContent = `${parseInt(index) + 1}. ${CurrentCategory}`;
  categoryRow.appendChild(categoryRowTD);
  node.appendChild(categoryRow);
} // end createCategoryRow

function createTableRow(categoryIndex, parameterIndex, counter, node, samples) {
  let Para = InitParaList[categoryIndex][parameterIndex];
  let PaName = Para.Name;
  let Unit = Para.Unit;

  let tableRow = document.createElement("tr");
  let checkBoxTD = document.createElement("td");
  tableRow.appendChild(checkBoxTD);
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `checkbox${counter}`);
  checkbox.setAttribute("value", "true");
  checkBoxTD.appendChild(checkbox);

  let paraNameLabel = document.createElement("td");
  paraNameLabel.textContent = `${PaName} ${Unit}`;
  tableRow.appendChild(paraNameLabel);

  for (let n = 0; n < samples; n++) {
    let MWEingabeTD = document.createElement("td");
    MWEingabeTD.setAttribute("class", "MWEingabeLabel");

    let MWEingabe = document.createElement("input");
    MWEingabe.setAttribute("class", "MWEingabe");
    MWEingabe.setAttribute("id", `Inp${PaName}${n}`);
    MWEingabe.setAttribute("type", "number");
    MWEingabe.setAttribute("min", "0");
    MWEingabeTD.appendChild(MWEingabe);

    let ErgebnisTD = document.createElement("td");
    ErgebnisTD.setAttribute("class", "ErgLabel");
    ErgebnisTD.setAttribute("id", `Erg${PaName}${n}`);

    tableRow.appendChild(MWEingabeTD);
    tableRow.appendChild(ErgebnisTD);
  } // end for n

  let HomogenLabel = document.createElement("td");
  HomogenLabel.setAttribute("id", `HomogenErgLabel${PaName}`);
  tableRow.appendChild(HomogenLabel);
  node.append(tableRow);
} // end createTableRow

function addOptions(node) {
  ParaList.forEach((para, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = para.Name;
    node.append(option);
  });
}

function init(samples) {
  // Bestehende Tabelle und Grafik-Optionen leeren (ermöglicht Neuaufbau)
  document.getElementById("app").replaceChildren();
  document.getElementById("GO").replaceChildren();

  let tableWidth = 3 + samples * 2;
  const app = document.getElementById("app");

  // Table Header
  let inputTable = document.createElement("table");
  let tableHead = document.createElement("thead");
  inputTable.appendChild(tableHead);
  createHelpBoxHeader(tableHead);
  let thElement = document.createElement("th");
  thElement.textContent = "Mischprobe";
  tableHead.appendChild(thElement);
  // Header Input Fields
  for (let index = 0; index < samples; index++) {
    createHeaderInputFields(index, tableHead);
  } // end for
  let homogenHeader = document.createElement("th");
  homogenHeader.textContent = "Homogenität";
  tableHead.appendChild(homogenHeader);

  let counter = 0;
  for (categoryIndex in InitParaList) {
    createCategoryRow(categoryIndex, inputTable, tableWidth);
    for (parameterIndex in InitParaList[categoryIndex]) {
      createTableRow(
        categoryIndex,
        parameterIndex,
        counter,
        inputTable,
        samples,
      );
      counter += 1;
    } // end for parameterIndex
  } // end for categoryIndex

  // Die Input Tabelle wird in den DOM eingefügt
  app.appendChild(inputTable);
  // Die Optionen für die grafische Auswertung werden hinzugefügt.
  addOptions(document.getElementById("GO"));
  // Zoom nach dem Aufbau anpassen (requestAnimationFrame wartet auf erstes Layout)
  updateTableZoom();
} // end init

function addEvents() {
  let inputs = document.querySelectorAll("input, textarea");

  for (let w = 0; w < inputs.length; w++) {
    let currentWidget = inputs[w];
    currentWidget.addEventListener("keyup", () => ausw());
    currentWidget.addEventListener("change", () => ausw());
  } // end for
} // end addEvents

// ============================================================
// Tabellen-Zoom
// ============================================================

function updateTableZoom() {
  requestAnimationFrame(() => {
    const app = document.getElementById("app");
    if (!app) return;
    // Zoom auf 1 zurücksetzen, damit scrollWidth die natürliche Breite liefert
    app.style.zoom = 1;
    const naturalWidth = app.scrollWidth;
    const availableWidth = app.parentElement
      ? app.parentElement.clientWidth
      : window.innerWidth;
    // Nur verkleinern (≤ 1), nie vergrößern
    const zoom = Math.min(1, availableWidth / naturalWidth);
    app.style.zoom = zoom;
  });
}

// ============================================================
// Dynamische Tabellengrößenänderung
// ============================================================

function saveCurrentValues() {
  const saved = {};
  for (const el of document.querySelectorAll("input, textarea")) {
    if (!el.id) continue;
    if (el.id.includes("checkbox") || el.id.includes("SampleNumber")) {
      saved[el.id] = el.checked;
    } else {
      saved[el.id] = el.value;
    }
  }
  return saved;
}

function checkColumnsHaveData(fromIndex, toIndex) {
  for (let n = fromIndex; n <= toIndex; n++) {
    for (const parameter of ParaList) {
      const input = document.getElementById(`Inp${parameter.Name}${n}`);
      if (input && input.value !== "") return true;
    }
    const nameInput = document.getElementById(`SampleName${n}`);
    if (nameInput && nameInput.value !== "") return true;
  }
  return false;
}

function restoreValues(savedValues) {
  for (const [key, value] of Object.entries(savedValues)) {
    const el = document.getElementById(key);
    if (!el) continue; // Spalte existiert nach Verkleinerung nicht mehr
    if (el.id.includes("SampleNumber")) {
      el.checked = value;
      // Sichtbarkeit der Eingabefelder wiederherstellen
      const num = parseInt(key.replace("SampleNumber", ""));
      for (const parameter of ParaList) {
        const inputField = document.getElementById(`Inp${parameter.Name}${num}`);
        if (inputField) inputField.disabled = !value;
      }
    } else if (el.id.includes("checkbox")) {
      el.checked = value;
    } else {
      el.value = value;
    }
  }
}

function swapColumns(indexA, indexB) {
  // Probennamen tauschen
  const nameA = document.getElementById(`SampleName${indexA}`);
  const nameB = document.getElementById(`SampleName${indexB}`);
  [nameA.value, nameB.value] = [nameB.value, nameA.value];

  // Aktivierungs-Checkboxen tauschen
  const cbA = document.getElementById(`SampleNumber${indexA}`);
  const cbB = document.getElementById(`SampleNumber${indexB}`);
  [cbA.checked, cbB.checked] = [cbB.checked, cbA.checked];

  // Messwerte aller Parameter tauschen
  for (const parameter of ParaList) {
    const inpA = document.getElementById(`Inp${parameter.Name}${indexA}`);
    const inpB = document.getElementById(`Inp${parameter.Name}${indexB}`);
    [inpA.value, inpB.value] = [inpB.value, inpA.value];
    inpA.disabled = !cbA.checked;
    inpB.disabled = !cbB.checked;
  }

  ausw();
}

function resizeTable(newCount) {
  newCount = Math.max(1, Math.min(15, newCount));

  // SampleCount-Feld auf gültigen Wert korrigieren
  document.getElementById("SampleCount").value = newCount;

  // Warnung bei Datenverlust durch Verkleinerung
  if (newCount < currentSamples) {
    const dataWillBeLost = checkColumnsHaveData(newCount, currentSamples - 1);
    if (dataWillBeLost) {
      const confirmed = confirm(
        `Die Spalten ${newCount + 1} bis ${currentSamples} enthalten Messdaten.\n` +
        `Diese gehen beim Verkleinern verloren.\n\nTrotzdem verkleinern?`
      );
      if (!confirmed) {
        document.getElementById("SampleCount").value = currentSamples;
        return;
      }
    }
  }

  const savedValues = saveCurrentValues();
  currentSamples = newCount;
  init(currentSamples);
  addEvents();
  restoreValues(savedValues);
  ausw();
}

window.addEventListener("resize", updateTableZoom);
init(currentSamples);
addEvents();
