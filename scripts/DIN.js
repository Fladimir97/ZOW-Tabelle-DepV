function din(amount) {

	
	let mi = (2 * Math.sqrt(amount / 30)).toFixed(3);
	let erg = Math.ceil(mi)
	let reduced = amount <= 500 ?  2 : Math.ceil(amount / 250)
	out = `<div style="color:black"><h3>Erforderliche Probenzahl nach DIN 19698-6</h3>

		<math style="font-size: 20pt">
	<mrow>
		
		<mi>2 Mischproben</mi>
		<mo>×</mo>
		<msqrt>
			<mfrac><mrow>
				<mi>${amount} m³</mi>
					</mrow>
				<mrow>
					<mi>30 m³</mi>
				</mrow>
			</mfrac>
		</msqrt>
		<mo>≤</mo>
		<mi>${mi} Mischproben</mi>

	</mrow>
	</math>`;
			
	out += `<br>Für die abfallrechtliche Deklartion von <b>${amount} m³</b> werden nach den Vorgaben der <b>DIN 19698-6</b> mindestens <b>${erg} Mischproben</b> benötigt.<br>`;
	out += `Bei homogener Schadstoffverteilung kann die Zahl der zu analysierenden Misch / Laborproben auf <b>${reduced}</b> reduziert werden.</div>`
	return out


}