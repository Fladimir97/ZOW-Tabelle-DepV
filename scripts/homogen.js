function homogen(mwlist, zw){
	let minValue = Math.min.apply(Math, mwlist);
	let maxValue = Math.max.apply(Math, mwlist);

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
