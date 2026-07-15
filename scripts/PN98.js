function pn98(amount) {

	let samples = sample_calc(amount);

	let ep = samples[0];
	let mp = samples[1];
	let sp = Number(samples[2]);
	let lp = (Number(amount) <= 600) ? mp : (10 + sp);
	let rp = reduction_samples(amount);
	
	let out = ""
	out += `<h3 style="color:black">Erforderliche Probenzahl nach den Vorgaben der LAGA PN98</h3><div style="color:black">Für die abfallrechtliche Deklaration eines Haufwerks mit <b>${amount} m³</b> werden nach den Vorgaben der LAGA PN98<ul>`;
	out += 	`<li><b>${ep} Einzelproben</b></li>`;
	out += `<li><b>${mp} Mischproben</b></li>`;

	if (sp > 0) {
		out += (sp <= 1) ? `<li><b>${sp} Sammelprobe</b></li>` : `<li><b>${sp} Sammelproben</b></li>`} 
	out += `<li><b>${lp} Laborproben</b></li>`;

	out += "</ul>benötigt.";
	if (sp > 0) {out +=  " Die in Klammer stehenden Mischproben werden zu Sammelproben zusammengefasst."};
	out += `<p>Bei homogener Schadstoffverteilung kann die Zahl der zu analysierenden Laborproben auf <b>${rp}</b> reduziert werden.</p></div>`;
	return out
}

function sample_calc(amount) {
	amount = Number(amount);
	const sample_dic = {
    30  : 8,
    60  : 12,
    100 : 16,
    150 : 20,
    200 : 24,
    300 : 28,
    400 : 32,
    500 : 36,
    600 : 40
};
	if (amount <= 600) {
		for (value in sample_dic) {
			let ep = sample_dic[value];
			// console.log(`${amount} Menge in m³ <= ${value} Grenzwert?`);
			// console.log(amount <= value)

			if (amount <= value) {
				let mp = ep/4;
				let sp = 0;
				return [ep, mp, sp]}
		}
			}
    
    else {
        let add_ep = (Math.floor((amount - 501) / 100) * 4) ;
        ep = add_ep + 40;
        let mp = ep/4;
	let mp_str = `10 + (${(mp - 10)})`
        let sp = (Math.floor((amount - 601) / 300 ) + 1);
        return [ep, mp_str, sp]
    }
}

function reduction_samples(amount) {
	amount  = Number(amount);
	if (amount <= 500) {
		return 2} else {
		additional_samples = Math.ceil((amount - 500) / 300);
		return (additional_samples + 2)}

}