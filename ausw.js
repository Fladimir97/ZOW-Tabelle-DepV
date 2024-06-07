function ausw(){

	// 1 )Stammdaten werden erfasst;  Listen werden generiert
	
	// Detailbericht
	let Bericht = ""
	
	// Listen	
	const inhomogeneParameterListe = [];

	// Stammdaten
	const Abfallbezeichnung = document.getElementById("Abfallbezeichnung").value;
	const Abfallmenge = document.getElementById("Abfallmenge").value;
	const Probenahme = document.getElementById("Probenahme").value;
	const toc = document.getElementById("TOC").value;
	const relevZW = document.getElementById("ZW").value;
	
	// Bericht Überschriften, Stammdaten, Probenzahl
	Bericht += (Abfallbezeichnung == "") ? "<h2>Detailbericht</h2>": `<h2>Detailbericht - ${Abfallbezeichnung}</h2>`;
	Bericht += "<h3>Stammdaten</h3>"
	Bericht += `<table style="color:white;">
			   <tr>
				<th>Menge in m³</th>
				<th>Nur natürliche Fremdbestandteile?</th>
				<th>Einstufungsrelevante Zordnungswerte</th>
			   </tr>
			   <tr>
				<td>${Abfallmenge}</td>
				<td>${document.getElementById("TOC").options[toc].text}</td>
				<td>${document.getElementById("ZW").options[document.getElementById("ZW").selectedIndex].text}</td>
			   </tr>
		   </table>`
	if (Probenahme == 0 && Abfallmenge != ""){
		Bericht += pn98(Abfallmenge)
		}
	else if (Probenahme == 1 && Abfallmenge != ""){
		Bericht += din(Abfallmenge)
		}

	if (document.querySelectorAll('input[type="checkbox"]:checked').length > 0){
		Bericht += "<h3>Einzelne Parameter im Überblick</h3>"
		}

	// Hidden stammdaten Tabelle für ZOW-Druck

	document.getElementById("StammdatenHeadline").innerHTML = `<h1>ZOW-Tabelle nach den Vorgaben der Deponieverordnung (DepV)</h1>
					<table class="BerichtTabelle">
					<tr>
						<th>Bezeichnung / Herkunft</th>
						<th>Menge in m³</th>
						<th>Einstufungsrelevante Zordnungswerte</th>
						<th>Nur natürliche Fremdbestandteile?</th>
					</tr>
					<tr>
						<td>${Abfallbezeichnung}</td>
						<td>${Abfallmenge}</td>
						<td>${document.getElementById("ZW").options[document.getElementById("ZW").selectedIndex].text}</td>
						<td>${document.getElementById("TOC").options[toc].text}</td>
					</tr>
				</table><br>`
	
	
	// 2) Die ZOW Tabelle in der GUI wird aktualisiert.
	
	for (index in ParaList){
		let CurrentParameter = ParaList[index];
		let PaName = CurrentParameter.Name;
		
		// Init Lists für den jeweiligen Parameter
		
		let MWList = [];
		let MWRoundedList  = [];
		let ErgList = [];
		let ErgColorList = []
		let MWNameList = [];
		let GWList = [];
		
		
		for (let n = 0; n < 12; n++){
			let CurrentEntry = document.getElementById(`Inp${PaName}${n}`);
			let CurrentMW = CurrentEntry.value;

			let CurrentMWNameEntry = document.getElementById(`SampleName${n}`);
			let CurrentMWName = (CurrentMWNameEntry.value == "")? `Eingabefeld ${n+1}` : CurrentMWNameEntry.value;
			let CurrentErgLabel = document.getElementById(`Erg${PaName}${n}`);
			CurrentErgLabel.style.backgroundColor = ""; // setzt bei leeren Feldern die Hintergrundfarbe 
			CurrentErgLabel.textContent = "";	    // und den Textinhalt des Auswertungsfeldes zurück.
			

			if (CurrentMW != ""){

				MWNameList.push(CurrentMWName);
				MWList.push(CurrentMW);
				
				let CurrentRoundedValue = CurrentMW % 1 === 0 ? CurrentMW : parseFloat(CurrentMW).toFixed(CurrentParameter.Rst);
				MWRoundedList.push(CurrentRoundedValue);
				let Ergebnis = CurrentParameter.auswertung(CurrentRoundedValue, toc);
				//console.log(Ergebnis);
				ErgList.push(Ergebnis);
				

				// Grenzwert Liste akutalisieren


				let CurrentGW = CurrentParameter.Gw[Ergebnis.split("DK")[1]]
				// Sonderfall GV & TOC 
				if ((! (CurrentParameter instanceof DoubleParameter)) && CurrentGW.length > 1){
					CurrentGW = CurrentGW[toc]}
				// Sonderfall PH
				if ((CurrentParameter instanceof DoubleParameter) && CurrentGW.length > 1){
					CurrentGW = `${CurrentGW[0]} - ${CurrentGW[1]}`}
				GWList.push(CurrentGW)
				CurrentErgLabel.textContent = Ergebnis;
				let CurrentColor = colordic[Ergebnis];
				ErgColorList.push(CurrentColor)
				// console.log("Aktuelle Farbe " + CurrentColor  )
				CurrentErgLabel.style.backgroundColor = CurrentColor;
				}
			}
			
			// Homogenitäts Label updaten
			
			if (! (CurrentParameter instanceof DoubleParameter)){
				let homogenLabel = document.getElementById(`HomogenErgLabel${PaName}`);
				homogenLabel.textContent = "";
				homogenLabel.style.backgroundColor = "";
				let zw = CurrentParameter.Gw[relevZW];
				if ( ! (zw == undefined)){
					// console.log(zw)
					if (! (typeof(zw) == "number")){
						if (zw.length == 2){
							zw = zw[toc];
							}
						}
					let homogenErg = homogen(MWList, zw);
					// console.log(PaName + "\tGrnzwert\t" + zw )
					homogenLabel.textContent = homogenErg[0];
					homogenLabel.style.backgroundColor = homogenErg[1];
			
					if (homogenErg[0] == "inhomogen"){
						inhomogeneParameterListe.push(CurrentParameter.Name)}
					}
				}
			// Bericht Update

			let CheckboxValue = document.getElementById(`checkbox${index}`).checked;
			if (MWList.length > 0 && CheckboxValue){
				Bericht += `<h3>${PaName}</h3>`
				Bericht += `<table class="BerichtTabelle">
						<tr>
							<th>Probe</th>
							<th>Messwert</th>
							<th>gerundet</th>
							<th>Einheit</th>
							<th>Einstufung</th>
							<th>Grenzwert</th>
						</tr>`
			
			// Listen sortieren
			
			let AllDataList = [];

			for (u in MWList){
				AllDataList.push({	sp:	MWNameList[u],
							mw:	MWList[u],
							rd: 	MWRoundedList[u],
							es:	ErgColorList[u],
							gw:	GWList[u],
							eg:	ErgList[u]



						});
				};
			// console.log(AllDataList)
			AllDataList.sort((a, b) => ((parseFloat(a.mw) < parseFloat(b.mw)) ? -1 :(parseFloat(a.mw) == parseFloat(b.mw)) ?  0 : 1));
			
			for (let g = 0; g < AllDataList.length; g++){
				MWNameList[g] = AllDataList[g].sp;
				MWList[g] = AllDataList[g].mw;
				MWRoundedList[g] = AllDataList[g].rd;
				ErgColorList[g] = AllDataList[g].es;
				GWList[g] = AllDataList[g].gw;
				ErgList[g] = AllDataList[g].eg}
			console.log(AllDataList)
			
			
			// Mittelwert und Standardabweichung

			if (MWList.length > 1 && (!(CurrentParameter instanceof DoubleParameter))){
				// 4 von 5 Regel - Mittelwert
				let currentMittelWert = mittelwert(MWList);
				MWNameList.push("Mittelwert (X̅)");
				MWList.push(currentMittelWert.toFixed(5));
				let roundedCurrentMittelWert = currentMittelWert.toFixed(CurrentParameter.Rst);
				let currentMittelWertErgebnis = CurrentParameter.auswertung(roundedCurrentMittelWert, toc);
				MWRoundedList.push(roundedCurrentMittelWert);
				ErgColorList.push(colordic[currentMittelWertErgebnis]);
				let CurrentMittelWertGrenzwert = CurrentParameter.Gw[currentMittelWertErgebnis.split("DK")[1]];
				if ((CurrentParameter == GV || CurrentParameter == TOC) && typeof(CurrentParameter.Gw[currentMittelWertErgebnis.split("DK")[1]]) == "object"){
					CurrentMittelWertGrenzwert = CurrentMittelWertGrenzwert[toc]
					}
				GWList.push(CurrentMittelWertGrenzwert);
				ErgList.push(currentMittelWertErgebnis);

				
				//Statistischer Ansatz
				let currentStandardabw = standardabweichung(MWList.slice(0, MWList.length -1), currentMittelWert);
				let currentStreuung = streuung(currentStandardabw, MWList.length -1);
				let currentMwPlusStreuung = currentMittelWert + currentStreuung;
				let roundedCurrentMwPlusStreuung = currentMwPlusStreuung.toFixed(CurrentParameter.Rst);
				let currentMwPlusStreuungErgebnis = CurrentParameter.auswertung(roundedCurrentMwPlusStreuung, toc);
				MWNameList.push("X̅ + Streuung");
				MWList.push(currentMwPlusStreuung.toFixed(5));
				MWRoundedList.push(roundedCurrentMwPlusStreuung);
				ErgColorList.push(colordic[currentMwPlusStreuungErgebnis]);
				let currentMwPlusStreuungErgebnisGrenzwert = CurrentParameter.Gw[currentMwPlusStreuungErgebnis.split("DK")[1]];
				if ((CurrentParameter == GV || CurrentParameter == TOC) && typeof(CurrentParameter.Gw[currentMwPlusStreuungErgebnis.split("DK")[1]]) == "object"){
					currentMwPlusStreuungErgebnisGrenzwert = currentMwPlusStreuungErgebnisGrenzwert[toc];
					};
				GWList.push(currentMwPlusStreuungErgebnisGrenzwert);
				ErgList.push(currentMwPlusStreuungErgebnis );
				
				}


			// Bericht Messwerttabellen einfügen

			for (x in MWList){
				
				Bericht += 	`<tr>
								<td>${MWNameList[x]}</td>
								<td style="text-align:center;">${MWList[x]}</td>
								<td style="text-align:center;">${MWRoundedList[x]}</td>
								<td style="text-align:center;">${CurrentParameter.Unit}</td>
								<td style="background-color:${ErgColorList[x]}; text-align:center;">${ErgList[x]}</td>
								<td style="text-align:center";>${GWList[x]} ${CurrentParameter.Unit}</td>
							</tr>`
				// Eine Reihe mit den Messwerten wird eingefügt


				}
			Bericht += "</table><br>"
			

			

			}


		}
	

	// Inhomogene Parameter
	if (inhomogeneParameterListe.length > 0){
		Bericht += `<h3>Inhomogene Parameter</h3><ul>`
		for (let x = 0; x < inhomogeneParameterListe.length; x++){
			Bericht += `<li>${inhomogeneParameterListe[x]}</li>`
			}
		Bericht += "</ul>"
		}

	document.getElementById("Bericht").innerHTML = Bericht ;
	document.getElementById("Bericht").style.color = "black"; 
	document.getElementById("Bericht").style.background = "white";  
	}




function homogen(mwlist, zw){
	let minValue = Math.min.apply(Math, mwlist);
	let maxValue = Math.max.apply(Math, mwlist);
	// console.log(zw);
	if (mwlist.length < 1){
		return ["Kein MW", ""]}

	else if (mwlist.length == 1){
		return ["Nur 1 MW", ""]}

	else if (minValue * 2 >= maxValue) {
		return ["homogen", "#348238"]}

	else if (maxValue * 2 <= zw) {
		return ["< 50% ZW", "#348238"]}

	return ["inhomogen", "#722e2e"]
	}


function mittelwert (input){
    if ((typeof(input) == "object") && (input.length > 1)){
        let result = 0;
        for (let i = 0; i < input.length; i++){
            result += parseFloat(input[i]);
            }
        result /= input.length;
        return result}
}

function standardabweichung(Messwerte, Mittelwert){
    let over = 0;
    for (let i = 0; i < Messwerte.length; i++){
        let currentMW = parseFloat(Messwerte[i]);
        let Klammer = currentMW - parseFloat(Mittelwert);
        over += Math.pow(Klammer, 2);
        }
    let ges = Math.pow((over /(Messwerte.length - 1)), 0.5);
    return ges
}

function streuung(standardabweichung, probenzahl) {
    let streuung = 1.65 * (parseFloat(standardabweichung) / Math.pow(probenzahl, 0.5))
    return streuung
}