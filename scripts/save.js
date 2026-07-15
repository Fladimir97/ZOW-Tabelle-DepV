const CACHE_KEY = "depv_zow_cache";

function reset() {
	if (!confirm("Alle eingegebenen Werte werden unwiderruflich gelöscht.\n\nTrotzdem zurücksetzen?")) {
		return;
	}

	// Stammdaten auf Standardwerte zurücksetzen
	document.getElementById("Abfallbezeichnung").value = "";
	document.getElementById("Abfallmenge").value       = "";
	document.getElementById("Probenahme").value        = "0";
	document.getElementById("TOC").value                = "0";
	document.getElementById("ZW").value                 = "0";
	document.getElementById("DruckOpt").value           = "printBericht.css";

	// Tabelle auf Standardgröße (12 LP) neu aufbauen —
	// init() setzt alle Messwert-Inputs, Probennamen und SampleNumber-Checkboxen zurück
	currentSamples = 12;
	document.getElementById("SampleCount").value = 12;
	init(currentSamples);
	addEvents();

	// Cache leeren
	try {
		localStorage.removeItem(CACHE_KEY);
	} catch (e) {
		console.warn("Cache konnte nicht gelöscht werden:", e);
	}

	ausw();
}

function cacheData() {
	const cache = { currentSamples };

	// Alle Inputs und Textareas
	for (const el of document.querySelectorAll("input, textarea")) {
		if (!el.id) continue;
		if (el.id.includes("checkbox") || el.id.includes("SampleNumber")) {
			cache[el.id] = el.checked;
		} else {
			cache[el.id] = el.value;
		}
	}

	// Select-Elemente werden von querySelectorAll nicht erfasst
	for (const id of ["TOC", "Probenahme", "ZW", "GO", "DruckOpt"]) {
		const el = document.getElementById(id);
		if (el) cache[id] = el.value;
	}

	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
	} catch (e) {
		console.warn("Cache konnte nicht gespeichert werden:", e);
	}
}

function restoreFromCache() {
	let cache;
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return;
		cache = JSON.parse(raw);
	} catch (e) {
		console.warn("Cache konnte nicht geladen werden:", e);
		return;
	}

	// 1. Tabellenbreite zuerst anpassen
	const savedCount = cache.currentSamples ? parseInt(cache.currentSamples) : 12;
	if (savedCount !== currentSamples) {
		currentSamples = savedCount;
		init(currentSamples);
		addEvents();
	}

	// 2. Alle Werte wiederherstellen
	for (const [key, value] of Object.entries(cache)) {
		if (key === "currentSamples") continue;
		const el = document.getElementById(key);
		if (!el) continue;

		if (key.includes("SampleNumber")) {
			el.checked = value;
			const num = parseInt(key.replace("SampleNumber", ""));
			for (const parameter of ParaList) {
				const inputField = document.getElementById(`Inp${parameter.Name}${num}`);
				if (inputField) inputField.disabled = !value;
			}
		} else if (key.includes("checkbox")) {
			el.checked = value;
		} else {
			el.value = value;
		}
	}

	ausw();
}

async function saveData(){
	let inputs = document.querySelectorAll("input, textarea")
	let jsonObj = {}
	for (let i = 0; i < inputs.length; i++){
		let currentInput = inputs[i]
		let value = (currentInput.value);
		let key = (currentInput.id);
		if (key.includes("checkbox") || key.includes("SampleNumber")){
			value = currentInput.checked;
			};
		jsonObj[key] = value};

	let toc = document.getElementById("TOC").value;
	jsonObj["TOC"] = toc

	let Probenahme = document.getElementById("Probenahme").value;
	jsonObj["Probenahme"] = Probenahme

	let ZW = document.getElementById("ZW").value;
	jsonObj["ZW"] = ZW

	let jsonText = JSON.stringify(jsonObj)

	const opts = {
			types: [
	    			{
		      			description: "Json",
		      			accept: {
					        	"json/*": [".json"],
				      			},
	    			},
		  		],
  			excludeAcceptAllOption: true,
  			multiple: false,
			};

	const newHandle = await window.showSaveFilePicker(opts);

	// create a FileSystemWritableFileStream to write to
  	const writableStream = await newHandle.createWritable();

	// write our file
 	 await writableStream.write(jsonText);

	// close the file and write the contents to disk.
  	await writableStream.close();
}
