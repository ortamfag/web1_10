class TTT {
	constructor({ canvas, firstCounter, secondCounter, btnNewRound, btnReset, currentMove }) {
		this.canvasEl = document.querySelector(canvas);
		this.firstCounterEl = document.querySelector(firstCounter);
		this.secondCounterEl = document.querySelector(secondCounter);
		this.btnNewRoundEl = document.querySelector(btnNewRound);
		this.btnResetEl = document.querySelector(btnReset);
		this.currentMoveEl = document.querySelector(currentMove);

		this.init();
	}

	init() {
		this.currentMove = 'X';

		this.firstCounter = 0;
		this.secondCounter = 0;

		this.ctx = this.canvasEl.getContext('2d');
		this.cellSize = this.canvasEl.width / 3;

		this.initBoard();
	
		this.canvasEl.addEventListener('click', e => this.handleClick(e));
		this.btnNewRoundEl.addEventListener('click', () => this.initBoard());
		this.btnResetEl.addEventListener('click', () => this.reset());
	}

	handleClick(e) {
		if (this.winner != null) return;

		const targetRow = Math.floor(e.offsetY / this.cellSize),
			  targetCol = Math.floor(e.offsetX / this.cellSize);

		const targetCell = this.cells[targetRow][targetCol];

		if (targetCell.value != null) return;

		this.draw(targetCell);
		targetCell.value = this.currentMove;
		this.changeMove();
		this.currentMoveEl.innerHTML = this.currentMove;	

		this.handleWinner();			
	}

	draw({ x, y }) {
		this.ctx.fillStyle = '#222';
		this.ctx.font = '80px Arial';
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = 'middle'

		this.ctx.fillText(this.currentMove, x, y, 200);
	}

	changeMove() {
		this.currentMove === 'X'
		? this.currentMove = 'O'
		: this.currentMove = 'X';
	}

	initBoard() {
		this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
		this.winner = null;

		this.cells = [
			[{x: 100, y: 100, value: null}, {x: 300, y: 100, value: null}, {x: 500, y: 100, value: null}],
			[{x: 100, y: 300, value: null}, {x: 300, y: 300, value: null}, {x: 500, y: 300, value: null}],
			[{x: 100, y: 500, value: null}, {x: 300, y: 500, value: null}, {x: 500, y: 500, value: null}],
		]

		this.ctx.lineWidth = 4;
		this.ctx.fillStyle = '#222222';

		for (let x = 200; x <= 400; x += 200) {
			this.ctx.beginPath();
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, this.canvasEl.height);
			this.ctx.stroke();
		}

		for (let y = 200; y <= 400; y += 200) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(this.canvasEl.height, y);
			this.ctx.stroke();
		}
	}

	reset() {
		location.reload();
	}

	handleWinner() {
		this.winner = TTT.calculateWinner(this.cells);

		const drawWinner = text => {
			this.ctx.fillStyle = '#fff';
			this.ctx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);

			this.ctx.font = '70px Segoe UI';
			this.ctx.fillStyle = '#222';
			this.ctx.textAlign = 'center';
			this.ctx.fillText(text, this.canvasEl.width / 2, this.canvasEl.height / 2);
		}

		switch (this.winner) {
			case 'X':
				this.firstCounter++;
				this.firstCounterEl.innerHTML = this.firstCounter;
				this.currentMoveEl.innerHTML = 'X';
				this.currentMove = 'X';

				drawWinner('Победил "X"');
				break;
			case 'O':
				this.secondCounter++;
				this.secondCounterEl.innerHTML = this.secondCounter;
				this.currentMoveEl.innerHTML = 'O';
				this.currentMove = 'O';

				drawWinner('Победил "O"');
				break;
			case 'Н':
				drawWinner('Ничья');
				break;
		}
	}

	static calculateWinner(cells) {
		const flatCells = cells.flat();
		const squares = [].map.call(flatCells, item => item.value);

		const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) return squares[a];
		}
	
		if (squares.every(item => item != null))
			return 'Н';

		return null;
	}
}