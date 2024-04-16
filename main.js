const version = 1;

const items = [
	["Já Ruský!",""],
	["Traktoristi sobě","(stačí zmínka pana 🔳)"],
	["Nacítíme",""],
	["Budou tousty",""],
	["Žuan",""],

	["Maruška",""],
	["Patron call",""],
	["Směje se vlastním vtipům",""],
	["Pípá pračka","(nebo sušička)"],
	["Netahám","(včera, dnes, zítra, nebo jindy)"],
	
	["Diesel bez DPF",""],
	["Skleník",""],
	["Bramborový Batalion",""],
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

const lsVersion = localStorage.getItem("version");
if(lsVersion != version) localStorage.clear();

var storageData = JSON.parse(localStorage.getItem("data"));

if(storageData == null) storageData = [];

document.addEventListener("DOMContentLoaded", () => {
	
	const templates = document.getElementsByTagName('template');

	const itemWrapperTemplate = templates[0];
	const itemTemplate = templates[1];
	
	const contentWrapper = document.querySelector('.content-wrapper');
	
	for(let i=0; i<rows; i++) {
	
		let wrapperTemplate = itemWrapperTemplate.content.cloneNode(true);
	
		let wrapper = wrapperTemplate.querySelector("div");
	
		for(let j=0; j<cols; j++) {
			
			let id = i*rows + j;
			let item = items[id];
			let idString = `bingo-${id}`;
	
			let template = itemTemplate.content.cloneNode(true);

			if(storageData.indexOf(id) > -1) {
				let card = template.querySelector('.card');
				card.classList.add('text-bg-warning');
			}
			
		
			let title = template.querySelector('.card-title');
			title.textContent = item[0];
			
			let note = template.querySelector('.card-text');
			note.textContent = item[1];
	
			let input = template.querySelector('input');
			input.id = idString;
			input.name = idString;
			input.setAttribute("item-id",id);
	
			let label = template.querySelector('label');
			label.htmlFor = idString;
	
			wrapper.appendChild(template);
		}
		
		contentWrapper.appendChild(wrapperTemplate);
	}

	const inputs = document.querySelectorAll('input')
	
	for(let i = 0; i<inputs.length; i++) {

		let input = inputs[i];

		input.addEventListener('change', (event) => {
			let _input = document.getElementById(event.target.id);
			let id = _input.getAttribute("item-id");
			let parentEl = _input.closest(".card");

			if (_input.checked) {
				parentEl.classList.add('text-bg-warning');

				if(!storageData.includes(id)) storageData.push(id);
			}
			else {
				parentEl.classList.remove('text-bg-warning');

				let storageIndex = storageData.indexOf(id);
				if(storageIndex > -1) storageData.splice(storageIndex, 1);
			}
			
			localStorage.setItem("data", JSON.stringify(storageData));
		});
	}
});