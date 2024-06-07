function init(){
	const app = document.getElementById("app");
	let inputTable = `<table><thead><th id="HelpBox" style= "cursor:help;">?</th><th>Mischprobe</th>`;
	
	// Überschriften
	
	for (let index = 0; index < 12; index++){
		inputTable += `<th colspan="2"><input class="MPHead" id="SampleName${index}"></input></th>`}
	inputTable += "<th>Homogenität</th></thead>";

	// Messwerte
	let counter = 0

	// Select Labels Grafische Auswertung
	let selectGW = ""

	for (index in InitParaList){
		let CurrentCategory = InitParaList[index][0].Cat
		inputTable += `<tr><td colspan="27">${parseInt(index)+1}. ${CurrentCategory}</td></tr>`
		for(q in InitParaList[index]){
			let Para = InitParaList[index][q]
			let PaName = Para.Name;
			let Unit = Para.Unit
			selectGW += `<option value="${counter}">${PaName}</option>`
			inputTable += `<tr><td><input type="checkbox" id="checkbox${counter}" value="true" onclick="ausw()"></td><td>${PaName} ${Unit}</td>`;
			for (let n = 0; n < 12; n++){
				inputTable += `<td class="MWEingabeLabel"><input class="MWEingabe" id="Inp${PaName}${n}" type="number" min="0" onclick="ausw()"></inptut></td><td class="ErgLabel" id="Erg${PaName}${n}"></td>`
				}
			inputTable += `<td id="HomogenErgLabel${PaName}"></td></tr>`
			counter += 1
			}
		}

	inputTable += "</table>"

	document.getElementById("app").innerHTML = inputTable
	document.getElementById("GO").innerHTML = selectGW 


	};

init();


function initHelpBox(){
	const questionMessage = "Die ausgewählten Parameter werden dem Detailbericht zugefügt."; 
	let helpBox = document.getElementById("HelpBox");
	helpBox.addEventListener("click", 
				 () => alert(questionMessage), 
				false);};


document.addEventListener("DOMContentLoaded", initHelpBox)


let inputs = document.getElementsByTagName("input");

for (let w = 0; w < inputs.length; w++){
    let currentWidget = inputs[w]; 
    currentWidget.addEventListener('keyup',  () => ausw());
}