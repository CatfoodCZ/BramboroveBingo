const items = [
	["Já Ruský!",""],
	["Traktoristi sobě","(stačí zmínka pana 🔲)"],
	["Nacítíme",""],
	["Budou tousty",""],
	["Žuan",""],

	["Maruška",""],
	["Patron call",""],
	["Směje se vlastním vtipům",""],
	["Pípá pračka","(nebo sušička)"],
	["Netahám","(včera, dnes, zítra, nebo jindy)"],
	
	["Bramborový Batalion",""],
	["Skleník",""],
	["Diesel bez DPF",""],
	["BUY BUY BUY",""],
	["Dáme si Netíka",""],
	
	["Kicom",""],
	["Soused pracuje na zahradě","(sekačka, křoviňák, atd.)"],
	["Hlava, ramena, kolena","(a palce)"],
	["Moskva bude hoře","(nebo třeba Teherán)"],
	["Kájův řev v pozadí",""],

	["Příhoda z Paříže",""],
	["Pošta",""],
	["Maruška",""],
	["Zkusím to najít",""],
	["Založím stranu",""],
];

const rows = 5;
const cols = 5;
	
const shuffledItems = items
	.map(value => ({ value, sort: Math.random() }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value);

document.addEventListener("DOMContentLoaded", () => {
	
	const templates = document.getElementsByTagName('template');

	const itemWrapperTemplate = templates[0];
	const itemTemplate = templates[1];
	
	const contentWrapper = document.querySelector('.content-wrapper');
	
	for(let i=0; i<rows; i++) {
	
		let wrapperTemplate = itemWrapperTemplate.content.cloneNode(true);
	
		let wrapper = wrapperTemplate.querySelector("div");
	
		for(let j=0; j<cols; j++) {
			
			let item = shuffledItems[i*rows + j];
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

			if (_input.checked) parentEl.classList.add('text-bg-warning');
			else parentEl.classList.remove('text-bg-warning');
		});
	}
});