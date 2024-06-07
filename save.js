async function saveData(){
	let inputs = document.getElementsByTagName("input") // Gibt eine Liste aller Input-Felder incl. Checkboxen wieder
	let jsonObj = {}				    // Erzeugt ein JSON-Objekt
	for (let i = 0; i < inputs.length; i++){	    // Iteriert alle Input Felder in o.g. Liste
		let currentInput = inputs[i]	 	    // Gibt das aktuelle Input Feld zurück
		let value = (currentInput.value);	    // Gibt den eingetragenen Input zurück
		let key = (currentInput.id);		    // Gibt die ID des Input feldes zurück 
		if (key.includes("checkbox")){		    // Sonderfall Checkbox
			value = currentInput.checked};	    // true wenn Checkbox angekreuzt wurde
		jsonObj[key] = value};			    // JSON OBJ - KEY = ID; VALUE = USER INPUT
	//console.log(jsonObj)

	let toc = document.getElementById("TOC").value;	    // DROPDOWN Auswahlmenüs
	jsonObj["TOC"] = toc 

	let Probenahme = document.getElementById("Probenahme").value;
	jsonObj["Probenahme"] = Probenahme 

	let ZW = document.getElementById("ZW").value;
	jsonObj["ZW"] = ZW 

	let jsonText = JSON.stringify(jsonObj)		   // JSON Objekt wird zu String konvertiert
	//console.log(jsonText)
	
	const opts = {					   // Objekt für Speicherdialog (Nur JSON-Format zulässig)	
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