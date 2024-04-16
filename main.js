const items = [
	["Já Ruský!",""],
	["Traktoristi sobě",""],
	["Nacítíme",""],
	["Budou tousty",""],
	["Žuan",""],

	["Pípá pračka","(nebo sušička)"],
	["Kicom",""],
	["Buy Buy Buy",""],
	["Dáme si Netíka",""],
	["Novej donate alert",""],

	["Bramborový batalion",""],
	["Příhoda z Paříže",""],
	["2Já Ruský!",""],
	["2Traktoristi sobě"],
	["2Nacítíme",""],

	["2Budou tousty",""],
	["2Žuan",""],
	["2Pípá pračka","(nebo sušička)"],
	["2Kicom",""],
	["2Buy Buy Buy",""],

	["2Dáme si Netíka",""],
	["2Novej donate alert",""],
	["2Bramborový batalion",""],
	["2Příhoda z Paříže",""],
	["3Příhoda z Paříže",""]
];

const rows = 5;
const cols = 5;

document.addEventListener("DOMContentLoaded", () => {
	
	const templates = document.getElementsByTagName('template');

	const itemWrapperTemplate = templates[0];
	const itemTemplate = templates[1];
	
	const contentWrapper = document.querySelector('.content-wrapper');
	
	let shuffledItems = items
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
	
	for(let i=0; i<rows; i++) {
	
		let wrapperTemplate = itemWrapperTemplate.content.cloneNode(true);
	
		let wrapper = wrapperTemplate.querySelector("div");
	
		for(let j=0; j<cols; j++) {
			
			let item = items[i*rows + j];
			let id = `bingo-${i}-${j}`;
	
			let template = itemTemplate.content.cloneNode(true);
		
			let title = template.querySelector('.card-title');
			title.textContent = item[0];
			
			let note = template.querySelector('.card-text');
			note.textContent = item[1];
	
			let input = template.querySelector('input');
			input.id = id;
			input.name = id;
	
			let label = template.querySelector('label');
			label.htmlFor = id;
	
			wrapper.appendChild(template);
		}
		
		contentWrapper.appendChild(wrapperTemplate);
	}

	const inputs = document.querySelectorAll('input')
	
	for(let i = 0; i<inputs.length; i++) {

		let input = inputs[i];

		input.addEventListener('change', (event) => {
			let _input = document.getElementById(event.target.id);
			let parentEl = _input.closest(".card");
			
			if (_input.checked) parentEl.classList.add('text-bg-primary');
			else parentEl.classList.remove('text-bg-primary');
		});
	}
});