const version = 6;

const winConfigs = [
	[ 0, 1, 2, 3, 4],  //--
	[ 5, 6, 7, 8, 9],  //--
	[10,11,12,13,14],  //--
	[15,16,17,18,19],  //--
	[20,21,22,23,24],  //--

	[0,5,10,15,20],  //||
	[1,6,11,16,21],  //||
	[2,7,12,17,22],  //||
	[3,8,13,18,23],  //||
	[4,9,14,19,24],  //||

	[ 0, 6,12,18,24],  // x
	[ 4, 8,12,16,20]   // x
];

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
	[22,"Trochu ponzi",""],
	[23,"Zkusím to najít",""],
	[24,"Založím stranu",""],

	[25,"Investiční Tatarka",""],
	[26,"Nebinární Dostálko",""],
	[27,"AFUERA",""],
	[28,"Toto není investiční doporučení",""],
];

const rows = 5;
const cols = 5;

var lsVersion;
var storageData = [];
var ticketData = [];
var newTicketData = [];

var modal;

document.addEventListener("DOMContentLoaded", () => {

	modal = new bootstrap.Modal('#bingo-modal');

	BuildBingo();
	UpdateEvents();
	
	ValidateWin();
});

function ResetBingo() {
	document.querySelector('.content-wrapper').innerHTML = "";
}

function BuildBingo() {

	ReadLocalStorage();

	let shuffledItems = items
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	const templates = document.getElementsByTagName('template');

	const itemWrapperTemplate = templates[0];
	const itemTemplate = templates[1];
	
	const contentWrapper = document.querySelector('.content-wrapper');
	
	for(let i=0; i<rows; i++) {
	
		let wrapperTemplate = itemWrapperTemplate.content.cloneNode(true);
	
		let wrapper = wrapperTemplate.querySelector("div");
	
		for(let j=0; j<cols; j++) {
			
			let item = shuffledItems[i*rows+j];

			if(ticketData.length == rows*cols) {
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
		newTicketData = [];
	}
}

function UpdateEvents() {
	document.getElementById('play').addEventListener('click', HandlePlayEvent);	
	document.getElementById('reset').addEventListener('click', HandleResetEvent);
	document.querySelectorAll('input').forEach((el)=>el.addEventListener('change', HandleItemClickEvent));
}

function HandleItemClickEvent(event) {
	let _input = document.getElementById(event.target.id);
	let id = _input.getAttribute("item-id");
	let parentEl = _input.closest(".card");

	if (_input.checked) {
		parentEl.classList.add('text-bg-warning');

		if(!storageData.includes(id)) storageData.push(id);
		
		gtag('event','item_selected', {
			'item_id' : items[id][1],
			'item_string' : items[id][2]
		});
	}
	else {
		parentEl.classList.remove('text-bg-warning');

		let storageIndex = storageData.indexOf(id);
		if(storageIndex > -1) storageData.splice(storageIndex, 1);
		
		gtag('event','item_deselected', {
			'item_id' : items[id][1],
			'item_string' : items[id][2]
		});
	}
	
	localStorage.setItem("version", version);
	localStorage.setItem("data", JSON.stringify(storageData));

	ValidateWin();
}

function HandleResetEvent(event) {
	localStorage.setItem("version", version);
	localStorage.setItem("data", null);
	storageData = [];

	document.querySelectorAll('.card').forEach((_)=>_.classList.remove('text-bg-warning'));
	document.querySelectorAll('input').forEach((_)=>_.checked = false);
	
	gtag('event','reset_game');
}

function HandlePlayEvent(event) {
	localStorage.setItem("version", version);
	localStorage.setItem("data", null);
	localStorage.setItem("ticketData", null);
	storageData = [];
	ticketData = [];

	document.querySelectorAll('.card').forEach((_)=> _.classList.remove('text-bg-warning'));
	document.querySelectorAll('input').forEach((_)=>_.checked = false);

	ResetBingo();
	BuildBingo();

	UpdateEvents();

	gtag('event','new_game');
}

function ReadLocalStorage() {	
	lsVersion = localStorage.getItem("version");
	if(lsVersion !== null && lsVersion != version) localStorage.clear();

	storageData = JSON.parse(localStorage.getItem("data"));
	if(storageData == null) storageData = [];

	ticketData = JSON.parse(localStorage.getItem("ticketData"));
	if(ticketData == null) ticketData = [];
}

function ValidateWin() {

	let inputs = document.querySelectorAll('input');
	let checkedInputs = [];
	let squares = [];
	let bingoPhrases = [];

	for(let i=0;i<inputs.length;i++) {
		if(inputs[i].checked) {
			checkedInputs.push(i);
			squares.push(1);
		}
		else squares.push(0);
	}

	let bingo = false;

	for(let i=0;i<winConfigs.length;i++){
		let intersetion = winConfigs[i].filter(value => checkedInputs.indexOf(value)!==-1);

		if(intersetion.length == winConfigs[i].length) {
			bingo = true;

			winConfigs[i].forEach(_=> {
				squares[_] = 2;
				bingoPhrases.push(items[inputs[_].getAttribute("item-id")][1]);
			});

			break;
		}
	}

	if(bingo) {
		FillSquares(squares);
		FillPhrases(bingoPhrases);
		modal.show();
	}
}

function FillSquares(squares) {
	
	let string = "";

	for(let i=0; i<squares.length; i++) {
		string += squares[i] === 2 ? "🟨" : squares[i] === 1 ? "🥔" : "⬛";
		string += (i+1) % 5 === 0 ? "<br>" : "";
	}

	document.getElementById('squares-wrapper').innerHTML = string;
}

function FillPhrases(phrases) {
	
	let string = "";

	for(let i=0; i<phrases.length; i++) {
		string += `<kbd class="text-nowrap">${phrases[i]}</kbd>`;
		if(i<phrases.length - 1) string += ' ';
	}

	document.getElementById('bingo-phrase-wrapper').innerHTML = string;
}