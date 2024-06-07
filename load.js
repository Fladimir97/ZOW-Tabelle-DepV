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

		if (key.includes("checkbox")){
			CurrentEntry.checked = data;
			} else{CurrentEntry.value  = data.replace("<", "")};
		ausw()
		}

}