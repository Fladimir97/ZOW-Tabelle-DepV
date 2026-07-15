function changeprintSheet(){
	let stylesheet = document.getElementById("DruckOpt").value;
	let stylesheetTag = document.getElementById("printsheet");
	stylesheetTag.setAttribute("href", `${stylesheet}`);
	ausw();
	
	}