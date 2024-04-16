const items = [

	["Já Ruský!",""],
	["Traktoristi sobě"],
	["Nacítíme",""],
	["Budou tousty",""],
	["Žuan",""],

	["Pípí pračka/sušička",""],
	["Kicom",""],
	["Buy Buy, Buy",""],
	["Dáme si Netíka",""],
	["Novej donate alert",""],

	["Bramborový batalion",""],
	["Příhoda z Paříže",""],
	["2Já Ruský!",""],
	["2Traktoristi sobě"],
	["2Nacítíme",""],

	["2Budou tousty",""],
	["2Žuan",""],
	["2Pípí pračka/sušička",""],
	["2Kicom",""],
	["2Buy Buy, Buy",""],

	["2Dáme si Netíka",""],
	["2Novej donate alert",""],
	["2Bramborový batalion",""],
	["2Příhoda z Paříže",""],
	["3Příhoda z Paříže",""],

];

const rows = 5;
const cols = 5;

let shuffledItems = items
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

for(let i=0; i<rows; i++) {

	for(let j=0; j<cols; j++) {
		console.log( shuffledItems[i * rows + j][0]);
	}
}