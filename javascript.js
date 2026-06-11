// Modernized game supporting grid sizes, difficulties, and custom mode.
document.addEventListener('DOMContentLoaded', function(){
	const table = document.getElementById('table');
	const counter = document.getElementById('counter');
	const message = document.getElementById('message');
	const resetBtn = document.getElementById('reset');
	const customToggle = document.getElementById('customToggle');
	const customDiv = document.getElementById('custom');
	const startCustom = document.getElementById('startCustom');
	const customRows = document.getElementById('customRows');
	const customCols = document.getElementById('customCols');
	const customShips = document.getElementById('customShips');
	const modeButtons = Array.from(document.querySelectorAll('.mode'));

	let rows = 6, cols = 6, shipCount = 1, guessesRemaining = 0;
	let ships = []; // array of ship cell indexes
	let hits = new Set();
	let misses = new Set();
	let kaboom = new Audio('sounds/kaboom.mp3');
	let sploosh = new Audio('sounds/sploosh.mp3');

	function updateCounter(){ counter.textContent = guessesRemaining; }

	function setMessage(txt){ message.textContent = txt; }

	function buildGrid(){
		table.innerHTML = '';
		table.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
		for(let r=0;r<rows;r++){
			for(let c=0;c<cols;c++){
				const idx = r*cols + c;
				const cell = document.createElement('button');
				cell.className = 'tile btn-tile';
				cell.dataset.index = idx;
				cell.addEventListener('click', onCellClick);
				table.appendChild(cell);
			}
		}
	}

	function placeShips(){
		ships = [];
		const maxAttempts = 5000;
		const shipLen = 3;
		const occupied = new Set();

		for(let s=0;s<shipCount;s++){
			let placed = false;
			let attempts = 0;
			while(!placed && attempts++ < maxAttempts){
				const orientation = Math.random() < 0.5 ? 'h' : 'v';
				const r = Math.floor(Math.random()*rows);
				const c = Math.floor(Math.random()*cols);
				const coords = [];
				for(let k=0;k<shipLen;k++){
					const rr = orientation==='h' ? r : r + k;
					const cc = orientation==='h' ? c + k : c;
					if(rr<0||rr>=rows||cc<0||cc>=cols){ coords.length=0; break; }
					coords.push(rr*cols + cc);
				}
				if(coords.length===0) continue;
				// ensure no overlap
				if(coords.some(i=>occupied.has(i))) continue;
				coords.forEach(i=>occupied.add(i));
				ships.push(coords);
				placed = true;
			}
			if(!placed) console.warn('Could not place all ships');
		}
	}

	function startGame(r, c, s){
		rows = Math.min(20, Math.max(1, r));
		cols = Math.min(20, Math.max(1, c));
		shipCount = Math.max(1, Math.min(s, Math.floor((rows*cols)/3)));
		guessesRemaining = Math.max(5, Math.ceil((rows*cols)/4));
		hits.clear(); misses.clear(); ships = [];
		buildGrid();
		placeShips();
		updateCounter();
		setMessage(`Sink ${shipCount} ship(s). Good luck cap'n!`);
	}

	function revealShips(){
		const all = document.querySelectorAll('.btn-tile');
		ships.flat().forEach(i=>{
			const cell = all[i];
			if(cell) cell.classList.add('ship');
		});
	}

	function onCellClick(e){
		if(guessesRemaining<=0) return;
		const idx = Number(e.currentTarget.dataset.index);
		const already = hits.has(idx) || misses.has(idx);
		if(already) { setMessage('You already tried that cell.'); return; }
		guessesRemaining--;
		// check hit
		let hitShip = null;
		for(const ship of ships){ if(ship.includes(idx)){ hitShip = ship; break; } }
		const cell = e.currentTarget;
		if(hitShip){
			hits.add(idx);
			cell.classList.add('hit');
			cell.textContent = '✹';
			kaboom.play();
			setMessage("Ka-BEWMM! Direct hit cap'n!!");
			// check if this ship is fully sunk
			const sunk = hitShip.every(i=>hits.has(i));
			if(sunk){ setMessage('You sunk a ship!'); }
		} else {
			misses.add(idx);
			cell.classList.add('miss');
			cell.textContent = 'X';
			sploosh.play();
			setMessage('SPLOOOSH!! That\'s a miss!');
		}
		updateCounter();
		checkWinLose();
	}

	function checkWinLose(){
		// count sunk ships
		let sunkCount = 0;
		for(const ship of ships){ if(ship.every(i=>hits.has(i))) sunkCount++; }
		if(sunkCount >= shipCount){
			setMessage("Congrats cap'n! You sunk all enemy ships!");
			revealShips();
			guessesRemaining = 0; updateCounter();
		} else if(guessesRemaining<=0){
			setMessage('Ze enemy has escaped. We have failed...');
			revealShips();
		}
	}

	function setSelectedMode(selectedBtn){
		modeButtons.forEach(btn=>btn.classList.toggle('selected', btn===selectedBtn));
	}

	// UI handlers
	modeButtons.forEach(btn=>{
		btn.addEventListener('click', ()=>{
			const r = Number(btn.dataset.rows);
			const c = Number(btn.dataset.cols);
			const s = Number(btn.dataset.ships);
			setSelectedMode(btn);
			startGame(r,c,s);
		});
	});
	customToggle.addEventListener('click', ()=>{ customDiv.style.display = customDiv.style.display==='none'? 'block':'none'; });
	startCustom.addEventListener('click', ()=>{
		const r = Number(customRows.value)||10;
		const c = Number(customCols.value)||10;
		const s = Number(customShips.value)||1;
		if(r>20||c>20){ alert('Maximum grid size is 20x20'); return; }
		startGame(r,c,s);
	});
	resetBtn.addEventListener('click', ()=>{ location.reload(); });

	// start default
	startGame(rows, cols, shipCount);
});
