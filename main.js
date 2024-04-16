const version = 3;

const items = [
	[0,"Já Ruský!",""],
	[1,"Traktoristi sobě","(stačí zmínka pana 🔳)"],
	[2,"Nacítíme",""],
	[3,"Budou tousty",""],
	[4,"Žuan",""],

	[5,"Maruška",""],
	[6,"Patron call",""],
	[7,"Směje se vlastním vtipům",""],
	[8,"Pípá pračka","(nebo sušička)"],
	[9,"Netahám","(včera, dnes, zítra, nebo jindy)"],
	
	[10,"Diesel bez DPF",""],
	[11,"Skleník",""],
	[12,"Bramborový Batalion",""],
	[13,"BUY BUY BUY",""],
	[14,"Dáme si Netíka",""],
	
	[15,"Kicom",""],
	[16,"Soused pracuje na zahradě","(sekačka, křoviňák, atd.)"],
	[17,"Hlava, ramena, kolena","(a palce)"],
	[18,"Moskva bude hoře","(nebo třeba Teherán)"],
	[19,"Kájův řev v pozadí",""],

	[20,"Příhoda z Paříže",""],
	[21,"Pošta",""],
	[22,"Maruška",""],
	[23,"Zkusím to najít",""],
	[24,"Založím stranu",""],
];

const rows = 5;
const cols = 5;

const lsVersion = localStorage.getItem("version");
if(lsVersion !== null && lsVersion != version) localStorage.clear();

var storageData = JSON.parse(localStorage.getItem("data"));
if(storageData == null) storageData = [];

var ticketData = JSON.parse(localStorage.getItem("ticketData"));
if(ticketData == null) ticketData = [];
var newTicketData = [];

const expiration = parseInt(localStorage.getItem("expiration")) || 0;
const newExpiration = Math.floor(Date.now() / 1000 + 4*3600);

let shuffledItems = items
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
			
			let item = shuffledItems[i*rows+j];

			if(ticketData.length == rows*cols && newExpiration > expiration ) {
				item = items[ticketData[i*rows+j]];
			} else {
				newTicketData[i*rows+j] = item[0];
			}

			let idString = `bingo-${item[0]}`;
	
			let template = itemTemplate.content.cloneNode(true);
	
			let input = template.querySelector('input');
			input.id = idString;
			input.name = idString;
			input.setAttribute("item-id",item[0]);
		
			let title = template.querySelector('.card-title');
			title.textContent = item[1];
			
			let note = template.querySelector('.card-text');
			note.textContent = item[2];
	
			let label = template.querySelector('label');
			label.htmlFor = idString;

			if(storageData.indexOf(item[0].toString()) > -1) {
				let card = template.querySelector('.card');
				card.classList.add('text-bg-warning');
				input.checked = true;
			}
	
			wrapper.appendChild(template);
		}
		

		contentWrapper.appendChild(wrapperTemplate);
	}

	if(newTicketData.length == rows*cols) {
		localStorage.setItem("ticketData", JSON.stringify(newTicketData));
		localStorage.setItem("expiration", newExpiration);
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
			
			localStorage.setItem("version", version);
			localStorage.setItem("data", JSON.stringify(storageData));
		});
	}

	document.getElementById('reset').addEventListener('click', (event) => {
		localStorage.setItem("version", version);
		localStorage.setItem("data", null);
		storageData = [];

		document.querySelectorAll('.card').forEach((_)=>{
			_.classList.remove('text-bg-warning');
		});
		
		document.querySelectorAll('input').forEach((_)=>{
			_.checked = false;
		});		
	});
});