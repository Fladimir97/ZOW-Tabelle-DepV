
// ============================================================
// Schicht 1 – Datenlesen
// ============================================================

function readFormInputs() {
    // Gibt ein Objekt mit allen Stammdaten zurück - Kapselung
    return {
        toc:               document.getElementById("TOC").value,
        einstRelevZW:      document.getElementById("ZW").value,
        abfallbezeichnung: document.getElementById("Abfallbezeichnung").value,
        abfallmenge:       document.getElementById("Abfallmenge").value,
        probenahme:        document.getElementById("Probenahme").value,
        tocText:           getSelectedText("TOC"),
        zwText:            getSelectedText("ZW"),
    };
}

function getSelectedText(elementId) {
    const el = document.getElementById(elementId);
    return el.options[el.selectedIndex].text;
}

function collectMeasurements(parameter) {
    const measurements = [];
    // currentSamples ist globale Variable - init.js:1
    for (let n = 0; n < currentSamples; n++) {
        const value = document.getElementById(`Inp${parameter.Name}${n}`).value;
        const sampleNameInput = document.getElementById(`SampleName${n}`);
        const sampleName = sampleNameInput.value !== "" ? sampleNameInput.value : `Eingabefeld ${n + 1}`;
        const sampleEnabled = document.getElementById(`SampleNumber${n}`).checked;
        if (value !== "" && sampleEnabled) {
            measurements.push({ inputIndex: n, value, sampleName });
        } // end if
    } // end for n
    // Gibt Array mit Eingabendaten als Objekt zurück
    // [{inputIndex, value, sampleName}, {...}, {...}]
    return measurements;
}


// ============================================================
// Schicht 2 – Berechnungen
// ============================================================

function getGwKey(einstufung) {
    // "DK0" -> "0", "DKIII" -> "III", ">DKIII" -> "III"
    return einstufung.split("DK")[1];
}

function evaluateMeasurements(parameter, rawMeasurements, inputs) {
    const { toc } = inputs;
    return rawMeasurements.map(({ inputIndex, value, sampleName }) => {
        const rounded = value % 1 === 0 ? value : parseFloat(value).toFixed(parameter.Rst);
        const einstufung = parameter.auswertung(rounded, toc);
        const gwKey = getGwKey(einstufung);
        return {
            inputIndex,
            sampleName,
            value,
            rounded,
            einstufung,
            color: colordic[einstufung],
            grenzwert: resolveGrenzwert(parameter, gwKey, inputs),
        };
    });
}

function resolveGrenzwert(parameter, gwKey, inputs) {
    const { toc } = inputs;
    if (parameter instanceof DoubleParameter) {
        const gw = parameter.Gw[gwKey];
        return `${gw[0]} - ${gw[1]}`;
    }
    return getEinstRelZW(parameter, gwKey, toc);
}

function sortByValue(dataList) {
    return [...dataList].sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
}

function addStatistik(dataList, parameter, inputs) {
    if (dataList.length <= 1 || parameter instanceof DoubleParameter) {
        return dataList;
    }
    const { toc } = inputs;
    const rawValues = dataList.map(d => d.value);

    const mw = mittelwert(rawValues);
    const mwRounded = mw.toFixed(parameter.Rst);
    const mwEinstufung = parameter.auswertung(mwRounded, toc);

    const stdAbw = standardabweichung(rawValues, mw);
    const str = streuung(stdAbw, rawValues.length);
    const mwPlusStr = mw + str;
    const mwPlusStrRounded = mwPlusStr.toFixed(parameter.Rst);
    const mwPlusStrEinstufung = parameter.auswertung(mwPlusStrRounded, toc);

    return [
        ...dataList,
        {
            sampleName: "Mittelwert (X̅)",
            value:      mw.toFixed(3),
            rounded:    mwRounded,
            einstufung: mwEinstufung,
            color:      colordic[mwEinstufung],
            grenzwert:  resolveGrenzwert(parameter, getGwKey(mwEinstufung), inputs),
        },
        {
            sampleName: "X̅ + Streuung",
            value:      mwPlusStr.toFixed(3),
            rounded:    mwPlusStrRounded,
            einstufung: mwPlusStrEinstufung,
            color:      colordic[mwPlusStrEinstufung],
            grenzwert:  resolveGrenzwert(parameter, getGwKey(mwPlusStrEinstufung), inputs),
        },
    ];
}


// ============================================================
// Schicht 3 – DOM-Elemente bauen (kein innerHTML für Nutzerdaten)
// ============================================================

function createTh(text) {
    const th = document.createElement("th");
    th.textContent = text;
    return th;
}

function createTd(text, { align, bgColor } = {}) {
    const td = document.createElement("td");
    td.textContent = text;
    if (align) td.setAttribute("align", align);
    if (bgColor) td.style.backgroundColor = bgColor;
    return td;
}

function buildStammdatenTable(inputs, withBezeichnung = false) {
    const { abfallbezeichnung, abfallmenge, tocText, zwText } = inputs;

    const table = document.createElement("table");
    table.className = "BerichtTabelle";

    const headerRow = document.createElement("tr");
    const headers = withBezeichnung
        ? ["Bezeichnung / Herkunft", "Menge in m³", "Nur natürliche Fremdbestandteile?", "Einstufungsrelevanter Zuordnungswert"]
        : ["Menge in m³", "Nur natürliche Fremdbestandteile?", "Einstufungsrelevanter Zuordnungswert"];
    headers.forEach(h => headerRow.appendChild(createTh(h)));
    table.appendChild(headerRow);

    const dataRow = document.createElement("tr");
    if (withBezeichnung) {
        dataRow.appendChild(createTd(abfallbezeichnung));
    }
    [abfallmenge, tocText, zwText].forEach(text =>
        dataRow.appendChild(createTd(String(text), { align: "center" }))
    );
    table.appendChild(dataRow);

    return table;
}

function buildParameterTable(parameter, dataList) {
    const table = document.createElement("table");
    table.className = "BerichtTabelle";

    const headerRow = document.createElement("tr");
    ["Probe", "Messwert", "gerundet", "Einheit", "Einstufung", "Grenzwert"].forEach(h =>
        headerRow.appendChild(createTh(h))
    );
    table.appendChild(headerRow);

    for (const entry of dataList) {
        const row = document.createElement("tr");
        row.appendChild(createTd(entry.sampleName));
        row.appendChild(createTd(String(entry.value),   { align: "center" }));
        row.appendChild(createTd(String(entry.rounded), { align: "center" }));
        row.appendChild(createTd(parameter.Unit,        { align: "center" }));
        row.appendChild(createTd(entry.einstufung,      { align: "center", bgColor: entry.color }));
        row.appendChild(createTd(`${entry.grenzwert} ${parameter.Unit}`, { align: "center" }));
        table.appendChild(row);
    }
    return table;
}

function buildInhomogeneList(parameterNamen) {
    const fragment = document.createDocumentFragment();
    const h3 = document.createElement("h3");
    h3.textContent = "Inhomogene Parameter";
    fragment.appendChild(h3);
    const ul = document.createElement("ul");
    for (const name of parameterNamen) {
        const li = document.createElement("li");
        li.textContent = name;
        ul.appendChild(li);
    }
    fragment.appendChild(ul);
    return fragment;
}


// ============================================================
// Schicht 4 – DOM-Updates (Seiteneffekte)
// ============================================================

function updateErgLabels(parameter, evaluatedData) {
    for (let n = 0; n < currentSamples; n++) {
        const label = document.getElementById(`Erg${parameter.Name}${n}`);
        label.style.backgroundColor = "";
        label.textContent = "";
    }
    for (const entry of evaluatedData) {
        const label = document.getElementById(`Erg${parameter.Name}${entry.inputIndex}`);
        label.textContent = entry.einstufung;
        label.style.backgroundColor = entry.color;
    }
}

function updateHomogenLabel(parameter, rawValues, inputs) {
    const { einstRelevZW, toc } = inputs;
    const label = document.getElementById(`HomogenErgLabel${parameter.Name}`);
    label.style.backgroundColor = "";
    label.textContent = "";
    if (parameter instanceof DoubleParameter || !isGwDefined(parameter, einstRelevZW)) {
        return null;
    }
    const zw = getEinstRelZW(parameter, einstRelevZW, toc);
    const [text, color] = homogen(rawValues, zw);
    label.textContent = text;
    label.style.backgroundColor = color;
    return text;
}

function updateStammdatenHeader(inputs) {
    const header = document.getElementById("StammdatenHeadline");
    header.replaceChildren();
    const h1 = document.createElement("h1");
    h1.textContent = "ZOW-Tabelle nach den Vorgaben der Deponieverordnung (DepV)";
    header.appendChild(h1);
    header.appendChild(buildStammdatenTable(inputs, true));
    header.appendChild(document.createElement("br"));
}


// ============================================================
// Schicht 5 – Orchestrierung
// ============================================================

function ausw() {
    const inputs = readFormInputs();
    const { abfallbezeichnung, abfallmenge, probenahme } = inputs;
    const bericht = document.getElementById("Bericht");
    const inhomogeneParameterNamen = [];

    updateStammdatenHeader(inputs);

    bericht.replaceChildren();
    bericht.style.color = "black";
    bericht.style.background = "white";

    // Berichtstitel
    const h2 = document.createElement("h2");
    h2.style.color = "black";
    h2.textContent = abfallbezeichnung === "" ? "Detailbericht" : `Detailbericht - ${abfallbezeichnung}`;
    bericht.appendChild(h2);

    // Stammdatentabelle
    const stammdatenH3 = document.createElement("h3");
    stammdatenH3.textContent = "Stammdaten";
    bericht.appendChild(stammdatenH3);
    bericht.appendChild(buildStammdatenTable(inputs, false));

    // Probenahme-Abschnitt (pn98/din sind interne Funktionen mit reinen Zahleneingaben)
    if (abfallmenge !== "" && probenahme == 0) {
        const div = document.createElement("div");
        div.innerHTML = pn98(abfallmenge);
        bericht.appendChild(div);
    } else if (abfallmenge !== "" && probenahme == 1) {
        const div = document.createElement("div");
        div.innerHTML = din(abfallmenge);
        bericht.appendChild(div);
    }

    // Überschrift "Einzelne Parameter im Überblick"
    const hasCheckedParams = document.querySelectorAll('input[type="checkbox"]:checked').length > 0;
    if (hasCheckedParams) {
        const h3 = document.createElement("h3");
        h3.textContent = "Einzelne Parameter im Überblick";
        bericht.appendChild(h3);
    }

    // Jeden Parameter auswerten
    for (const [index, parameter] of ParaList.entries()) {
        const isChecked = document.getElementById(`checkbox${index}`).checked;

        const rawMeasurements = collectMeasurements(parameter);
        const evaluatedData = evaluateMeasurements(parameter, rawMeasurements, inputs);

        updateErgLabels(parameter, evaluatedData);

        const rawValues = rawMeasurements.map(m => m.value);
        const homogenResult = updateHomogenLabel(parameter, rawValues, inputs);
        if (homogenResult === "inhomogen") {
            inhomogeneParameterNamen.push(parameter.Name);
        }

        const sortedData = sortByValue(evaluatedData);
        const fullData = addStatistik(sortedData, parameter, inputs);

        if (fullData.length > 0 && isChecked) {
            const paramH3 = document.createElement("h3");
            paramH3.style.color = "black";
            paramH3.textContent = parameter.Name;
            bericht.appendChild(paramH3);
            bericht.appendChild(buildParameterTable(parameter, fullData));
            bericht.appendChild(document.createElement("br"));
        }
    }

    // Liste inhomogener Parameter
    if (inhomogeneParameterNamen.length > 0) {
        bericht.appendChild(buildInhomogeneList(inhomogeneParameterNamen));
    }

    updateCanvas();
    cacheData();
}


// ============================================================
// Hilfsfunktionen
// ============================================================

function isGwDefined(para, grenzW) {
    if (para instanceof DoubleParameter) {
        return false;
    }
    return para.Gw[grenzW] !== undefined;
}

function getEinstRelZW(parameter, grenzW, toc) {
    let relevZW = parameter.Gw[grenzW];
    if (typeof relevZW === "object") {
        relevZW = relevZW[toc];
    }
    return relevZW;
}

function mittelwert(input) {
    if (typeof input !== "object" || input.length <= 1) {
        return undefined;
    }
    let result = 0;
    for (let i = 0; i < input.length; i++) {
        result += parseFloat(input[i]);
    }
    return result / input.length;
}

function standardabweichung(messwerte, mittelwertWert) {
    let summe = 0;
    for (let i = 0; i < messwerte.length; i++) {
        const diff = parseFloat(messwerte[i]) - parseFloat(mittelwertWert);
        summe += Math.pow(diff, 2);
    }
    return Math.pow(summe / (messwerte.length - 1), 0.5);
}

function streuung(stdAbw, probenzahl) {
    return 1.65 * (parseFloat(stdAbw) / Math.pow(probenzahl, 0.5));
}


// ============================================================
// Weitere UI-Funktionen
// ============================================================

function hideText(row) {
    const checked = document.getElementById(`SampleNumber${row}`).checked;
    for (const parameter of ParaList) {
        const inputField = document.getElementById(`Inp${parameter.Name}${row}`);
        inputField.disabled = !checked;
    }
    ausw();
}

function updateCanvas() {
    currentCanvasParameter = document.getElementById("GO").value;
    const valueList = [];
    for (let i = 0; i < currentSamples; i++) {
        const value = document.getElementById(`Inp${ParaList[currentCanvasParameter].Name}${i}`).value;
        if (value !== "") {
            valueList.push(value);
        }
    }
    if (valueList.length > 0) {
        graphicAusw();
    }
}

// Beim Seitenstart gespeicherten Zustand wiederherstellen.
// Aufruf hier, weil save.js (mit restoreFromCache) vor ausw.js geladen wird
// und erst hier alle abhängigen Funktionen (ausw, init, ...) verfügbar sind.
restoreFromCache();
