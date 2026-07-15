async function loadData(){
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
	let text = await file.text()
	let obj = JSON.parse(text)
	for (let [key, data] of Object.entries(obj)) {
  		let CurrentEntry = document.getElementById(key);

		if (key.includes("checkbox") || key.includes("SampleNumber")){
			CurrentEntry.checked = data;
			if (key.includes("SampleNumber")){
				let num = key.replace("SampleNumber", "");
				hideText(num);
			}
			} else{CurrentEntry.value  = data.replace("<", "")};
		ausw()
		}

}
