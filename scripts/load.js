async function loadData() {
	const pickerOpts = {
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

	const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
	const file = await fileHandle.getFile();
	const text = await file.text();
	const obj = JSON.parse(text);

	// 1. Tabellengröße aus Datei lesen und ggf. neu aufbauen
	//    Alte Speicherdateien ohne SampleCount erhalten den Standardwert 12.
	const savedCount = obj["SampleCount"] !== undefined ? parseInt(obj["SampleCount"]) : 12;
	if (savedCount !== currentSamples) {
		currentSamples = savedCount;
		init(currentSamples);
		addEvents();
	}

	// 2. Alle Werte wiederherstellen
	for (const [key, data] of Object.entries(obj)) {
		const el = document.getElementById(key);
		if (!el) continue;

		if (key.includes("checkbox") || key.includes("SampleNumber")) {
			el.checked = data;
			if (key.includes("SampleNumber")) {
				const num = key.replace("SampleNumber", "");
				// Sichtbarkeit der Zeile wiederherstellen ohne ausw() aufzurufen
				for (const parameter of ParaList) {
					const inputField = document.getElementById(`Inp${parameter.Name}${num}`);
					if (inputField) inputField.disabled = !data;
				}
			}
		} else {
			el.value = String(data).replace("<", "");
		}
	}

	ausw();
}
