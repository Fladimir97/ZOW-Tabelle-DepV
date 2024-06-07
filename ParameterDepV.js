

class Parameter{
    
    constructor(name, cat ,unit, rst, gw){
	    this.Name = name;
	    this.Cat = cat
	    this.Unit = unit;
	    this.Rst = rst;
	    this.Gw = gw
	    }
	
	auswertung(mw, toc){
	    let out = ""
	    for (let i in this.Gw) {
	    	let Einstufung = i;
		let Grenzwert = this.Gw[Einstufung];
		    
		// console.log(typeof(Grenzwert))

		if (typeof(Grenzwert) == "object" && Grenzwert.length == 2){
    		Grenzwert = Grenzwert[toc]
    		}

		   
	    	if (mw <= Grenzwert){
	        	out += `DK${Einstufung}`;
	        	return out
		    }
		}
		// console.log(this.Gw.length)
		let currentKeys = Object.keys(this.Gw)
		let currentKeyListlength = currentKeys.length
		let fittingKey = currentKeys[currentKeyListlength -1]
		let lastEinstufung = this.Gw[fittingKey]
		out = `>DK${fittingKey}`
		return out	    
	}


	getColorScheme(toc){
		let classNames = []
		let classGWs = []
		let classGwColors = []
		
		for (let i in this.Gw){
			classNames = classNames.concat(i);
			let currentClassGW = (this.Gw[i] instanceof(Object)) ? this.Gw[i][toc] : this.Gw[i];
			classGWs = classGWs.concat(currentClassGW);
			classGwColors = classGwColors.concat(colordic[`DK${i}`]);
			}
	return [classNames, classGWs, classGwColors]
	}

 
}
   

class DoubleParameter extends Parameter{
	auswertung(mw, toc){

		let out = "";
		
		for (let i in this.Gw) {
		    
			let Einstufung = i;
			let GrenzwertMin = this.Gw[Einstufung][0];
			let GrenzwertMax = this.Gw[Einstufung][1];
			if (GrenzwertMin <= mw && mw <= GrenzwertMax){
				out += `DK${Einstufung}`;
				return out}
		    }
		out = `>DKIII`
		return out
        }
    }

   
