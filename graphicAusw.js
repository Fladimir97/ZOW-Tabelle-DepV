function getPhShapes(xmin, xmax){
	let legendX = ["Grenzwert", "Grenzwert", "Grenzwert", "Grenzwert", "Grenzwert"]
	let legendY = [2, 4.75, 9.25, 13.5]
	let legendText = [">DKIII", "DKIII", "DK0", ">DKIII"]

	let phShapes = [
			// DKO
		{       type: 'rect',
            		xref: 'x',
            		yref: 'y',
            		x0: xmin,
            		y0: 5.5,
            		x1: "Grenzwert", // xmax,
            		y1: 13,
            		fillcolor: "#3a5e34",
            		opacity: 0.5,
            		line: {
                		width: 1
            			}
        		},
			// DKIII
		{       type: 'rect',
            		xref: 'x',
            		yref: 'y',
            		x0: xmin,
            		y0: 4,
            		x1: "Grenzwert",
            		y1: 5.5,
            		fillcolor: "#723b21",
            		opacity: 0.5,
            		line: {
                		width: 1
            			}
        		},

			// >DKIII - unten
		{       type: 'rect',
            		xref: 'x',
            		yref: 'y',
            		x0: xmin,
            		y0: 0,
            		x1: "Grenzwert",
            		y1: 4,
            		fillcolor: "#782d34",
            		opacity: 0.5,
            		line: {
                		width: 1
            			}
        		},

			// >DKIII - oben
		{       type: 'rect',
            		xref: 'x',
            		yref: 'y',
            		x0: xmin,
            		y0: 13,
            		x1: "Grenzwert",
            		y1: 14,
            		fillcolor: "#782d34",
            		opacity: 0.5,
            		line: {
                		width: 1
            			}
        		},

		]

	return [phShapes, legendX, legendY, legendText] 
	};



function getRowValues(Para, paName){
	let resY = []
	let resX = []
	let ErrorArray = []
	for(let column = 0; column < 12; column++){
		let MW = document.getElementById(`Inp${paName}${column}`).value;
		let roundedMW = parseFloat(MW).toFixed(Para.Rst)
		let SampleName = document.getElementById(`SampleName${column}`).value;
		console.log(MW + " " + SampleName)
		if (SampleName == ""){
			SampleName = `Eingabefeld ${column}`;
			}
		if (! (MW == "")){
			resY = resY.concat(parseFloat(MW));
			resX = resX.concat(SampleName);
			ErrorArray = ErrorArray.concat(roundedMW - MW)
			}
		}

	// Nach der Größe sortieren :-)

	if (resY.length > 1){
		let AllDataList = []
		for (index in resY){
			AllDataList.push({
                        	resx:	resX[index],
                		resy:   resY[index],
				err: 	ErrorArray[index],
                            		});
        		}
	
		AllDataList.sort((a, b) => ((parseFloat(a.resy) < parseFloat(b.resy)) ? -1 :(parseFloat(a.resy) == parseFloat(b.resy)) ?  0 : 1));

		for (n in AllDataList){
			resY[n] = AllDataList[n].resy ;
			resX[n] = AllDataList[n].resx ;
			ErrorArray[n] = AllDataList[n].err ;
			} 

    }

	return [resY, resX, ErrorArray ]
	}



function graphicAusw(){

	let ParaIndex = document.getElementById("GO").value
	let Para = ParaList[ParaIndex]
	let XY = getRowValues(Para, Para.Name)
	let x = XY[1]
	let y = XY[0]
	let ErrorArray = XY[2]
	//console.log(XY)

	if ((x.length > 1)&& (!(Para instanceof(DoubleParameter)))){
		x = x.concat(["Mittelwert (X̅)", "X̅ + Streuung"])
		
		let mittelw = mittelwert(y);
		let standardabweich = standardabweichung(y, mittelw);
		let streu = streuung(standardabweich, y.length);
		let mwStreu = mittelw + streu;
		y = y.concat([mittelw, mwStreu]);
		ErrorArray = ErrorArray.concat((parseFloat(mittelw).toFixed(Para.Rst)) - mittelw);
		ErrorArray = ErrorArray.concat((parseFloat(mwStreu).toFixed(Para.Rst)) - mwStreu);
		}
	
	


	if (x.length > 0){
	let NGC = Para.getColorScheme(document.getElementById("TOC").value)
	//console.log(NGC)
	// DATA

	var data = [
  		{
    		x: x,
    		y: y,
    		error_y: {
      			type: 'data',
			symmetric: false,
      			array: ErrorArray,
      			visible: true
    			},
    		//type: 'scatter',
    		mode: "markers"
  		},
		   ];
	


	// LAYOUT	
	
	let schadstoffKlassen = NGC[0];
	let grenzwerte = NGC[1];
	let classColor = NGC[2];
	let shapesArray = []
	let legendX = []
	let legendY = []
	let legendText = []
	
	if (! (Para instanceof DoubleParameter)){
		for (let q = 0; q < schadstoffKlassen.length; q++){
			if (q == 0){
				let currentShape = {
            				type: 'rect',
            				xref: 'x',
            				yref: 'y',
            				x0: x[0],
            				y0: 0,
            				x1: "Grenzwert" , //x[x.length - 1]
            				y1: grenzwerte[q],
            				fillcolor: classColor[q],
            				opacity: 0.5,
            				line: {
                				width: 1
            					},
        				};
				legendX = legendX.concat("Grenzwert") // x[0]
				legendY = legendY.concat(grenzwerte[q])
				legendText = legendText.concat(`DK${schadstoffKlassen[q]}`)
				shapesArray = shapesArray.concat(currentShape)
				}

			else if ((q != 0) && (grenzwerte[q] > grenzwerte[q -1]) && (grenzwerte[q] > grenzwerte[0])){
				let currentShape = {
            			type: 'rect',
            			xref: 'x',
            			yref: 'y',
            			x0: x[0],
            			y0: (grenzwerte[q-1] < grenzwerte[0]) ? grenzwerte[0]: grenzwerte[q-1], // (grenzwerte[q-1] < grenzwerte[0]) ? grenzwerte[0]: grenzwerte[q-1]
            			x1: "Grenzwert" , //x[x.length - 1]
				
            			y1: (grenzwerte[q] < grenzwerte[0])? grenzwerte[0]: (grenzwerte[q] < grenzwerte[q-1]) ? grenzwerte[q-1]: grenzwerte[q],
            			fillcolor: classColor[q],
            			opacity: 0.5,
            			line: {
                			width: 1
            				}
        			}
				legendX = legendX.concat("Grenzwert")// x[0]
				legendY = legendY.concat(grenzwerte[q])
				legendText = legendText.concat(`DK${schadstoffKlassen[q]}`) 
				shapesArray = shapesArray.concat(currentShape)
				}
			
			}
		let currentShape = {
            		type: 'rect',
            		xref: 'x',
            		yref: 'y',
            		x0: x[0],
            		y0: grenzwerte[grenzwerte.length - 1],
            		x1: "Grenzwert", //x[x.length - 1],
			
            		y1: grenzwerte[grenzwerte.length - 1] * 2,

            		fillcolor: colordic[`>DK${schadstoffKlassen[schadstoffKlassen.length - 1]}`], // BUG!!!!
            		opacity: 0.5,
            		line: {
                		width: 1
            			}
        		}
			legendX = legendX.concat("Grenzwert") //
			legendY = legendY.concat(grenzwerte[grenzwerte.length - 1] *1.2)
			legendText = legendText.concat(`>DK${schadstoffKlassen[schadstoffKlassen.length - 1]}`) // BUG ???
			shapesArray = shapesArray.concat(currentShape)
		}

		else if (Para instanceof DoubleParameter){
			//x = x.concat(["Grenzwert"])
			let phData = getPhShapes(x[0], x[x.length - 1]); //getPhShapes(x[0], x[x.length - 1], document.getElementById("Bodenklasse").value)
			shapesArray = shapesArray.concat(phData[0]);
			legendX = legendX.concat(phData[1]);
			legendY = legendY.concat(phData[2]);
			legendText = legendText.concat(phData[3]);
			}
	
	//console.log(legendText);
	//console.log(legendX);
	//console.log(legendY);
	let maxyVal = ((Math.max(...y)))
	let yRange = ((maxyVal * 1.25) >= (grenzwerte[0]* 1.25)) ? (maxyVal *1.25) : (grenzwerte[0]* 1.25);

	var traceLegend = {
  		x: legendX,
  		y: legendY,
  		text: legendText,
  		mode: 'text'
		};
	
	var layout = 
		{
  		title:`${document.getElementById("Abfallbezeichnung").value}<br>Parameter: ${Para.Name}`,
  		xaxis: {
 	   		showgrid: false,
    			zeroline: true,
    			//tickangle: 60,
    			showticklabels: true,
			title: "Proben"
  			},
  		yaxis: {showgrid: true,
    			zeroline: false,
    			gridcolor: 'black',
			tick0: 0,
			autorange: false,
			range: (Para instanceof(DoubleParameter)) ? [0, 14] : [0, yRange],
			autorangeoptions: {
				minallowed: 0,
				maxallowed: legendY[legendY.length -2] * 1.25,
				},
			title: Para.Unit,
  			},

  		showlegend:false,
    		// Hier werden die Hintergrundfarben erstellt
    		shapes: shapesArray,
		};
	
	let dataFertig = data.concat(traceLegend)

	Plotly.newPlot('myDiv', dataFertig, layout);}

	else {
	alert(`Beim Parameter ${Para.Name} sind keine Messwerte hinterlegt.\nEine grafische Auswertung kann nicht durchgeführt werden.`)
	}
}
	
	
	