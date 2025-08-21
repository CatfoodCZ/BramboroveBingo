const version = 18;

const winConfigs = [
	// Křížové kombinace (každý řádek s každým sloupcem)
	[0, 1, 2, 3, 4, 8, 12],   // řádek 1 + sloupec 1
	[0, 1, 2, 3, 5, 9, 13],   // řádek 1 + sloupec 2
	[0, 1, 2, 3, 6, 10, 14],  // řádek 1 + sloupec 3
	[0, 1, 2, 3, 7, 11, 15],  // řádek 1 + sloupec 4
	[4, 5, 6, 7, 0, 8, 12],   // řádek 2 + sloupec 1
	[4, 5, 6, 7, 1, 9, 13],   // řádek 2 + sloupec 2
	[4, 5, 6, 7, 2, 10, 14],  // řádek 2 + sloupec 3
	[4, 5, 6, 7, 3, 11, 15],  // řádek 2 + sloupec 4
	[8, 9, 10, 11, 0, 4, 12],  // řádek 3 + sloupec 1
	[8, 9, 10, 11, 1, 5, 13],  // řádek 3 + sloupc 2
	[8, 9, 10, 11, 2, 6, 14],  // řádek 3 + sloupec 3
	[8, 9, 10, 11, 3, 7, 15],  // řádek 3 + sloupec 4
	[12, 13, 14, 15, 0, 4, 8],  // řádek 4 + sloupec 1
	[12, 13, 14, 15, 1, 5, 9],  // řádek 4 + sloupec 2
	[12, 13, 14, 15, 2, 6, 10], // řádek 4 + sloupec 3
	[12, 13, 14, 15, 3, 7, 11],  // řádek 4 + sloupec 4

	[0, 1, 2, 3],  // řádek 1
	[4, 5, 6, 7],  // řádek 2
	[8, 9, 10, 11], // řádek 3
	[12, 13, 14, 15], // řádek 4

	[0, 4, 8, 12],  // sloupec 1
	[1, 5, 9, 13],  // sloupec 2
	[2, 6, 10, 14], // sloupec 3
	[3, 7, 11, 15], // sloupec 4

	[0, 5, 10, 15], // diagonála 1
	[3, 6, 9, 12],   // diagonála 2
];

const items = [
	[0, "Byla to bratrská pomoc", ""],
	[1, "Dnes je to horší", ""],
	[2, "Pávek je komouš", ""],
	[3, "Byli to hlavně Ukrajinci", ""],
	[4, "Přijeli na pozvání Ukrajince", ""],
	[5, "A teď sem zvou Amíky", ""],
	[6, "Tehdy byl svět ještě v pořádku", ""],
	[7, "Nebyla to invaze", ""],
	[8, "Kdoví, jak by to dopadlo, kdyby tu nebyli", ""],
	[9, "Rusové byli proti", ""],
	[10, "V USA bijou černochy", ""],
	[11, "Snad přijedou brzo zase", ""],
	[12, "Díky nim jsem měl/měla super dětství", ""],
	[13, "Zachránili nás", ""],
	[14, "Kdoví jak to bylo", ""],
	[15, "Fyjala je kokot", ""]
];

const rows = 4;
const cols = 4;

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
				item = items.find(_=>_[0] == [ticketData[i*rows+j]]);
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
	let item = items.find(_=>_[0] == id);

	if (_input.checked) {
		parentEl.classList.add('text-bg-warning');

		if(!storageData.includes(id)) storageData.push(id);
		
		gtag('event','item_selected', {
			'item_id' : item[0],
			'item_string' : item[1]
		});
	}
	else {
		parentEl.classList.remove('text-bg-warning');

		let storageIndex = storageData.indexOf(id);
		if(storageIndex > -1) storageData.splice(storageIndex, 1);
		
		gtag('event','item_deselected', {
			'item_id' : item[0],
			'item_string' : item[1]
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
				bingoPhrases.push(items.find(__=>__[0] == inputs[_].getAttribute("item-id"))[1]);
			});

			break;
		}
	}

	if(bingo) {
		FillSquares(squares);
		FillPhrases(bingoPhrases);
		modal.show();

		gtag('event','bingo');
	}
}

function FillSquares(squares) {
	
	let string = "";

	for(let i=0; i<squares.length; i++) {
		string += squares[i] === 2 ? "🟨" : squares[i] === 1 ? "🥔" : "⬛";
		string += (i + 1) % cols === 0 ? "<br>" : "";
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
