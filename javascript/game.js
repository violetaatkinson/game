class Game {
	constructor(ctx) {
		this.ctx = ctx;
		this.intervalId = null;
		this.background = new Background(this.ctx);
		this.trashes = [];
		this.healths = [];
		this.obstacles = [];
		this.submarine = new Submarine(this.ctx);
		this.tickObstacle = 0;
		this.tickTrash = 0;
		this.tickHealth = 0;

		this.sound = new Audio();
		this.sound.src = '/audio/01. Yellow Submarine (Original Uk Mono Mix).mp3';

	}

	start() {
		this.intervalId = setInterval(() => {
			this.clear();
			this.draw();
			this.checkCollisions();
			this.sound.play();
			this.move();
			this.tickObstacle++;
			this.tickTrash++;
			this.tickHealth++;

			if (this.tickObstacle % 400 === 0) {
				this.tickObstacle = 0;
				this.addObstacle();
			}

			if (this.tickTrash % 180 === 0) {
				this.tickTrash = 0;
				this.addTrash();
			}

			if (this.tickHealth % 450 === 0) {
				this.tickHealth = 0;
				this.modifyHealth();
			}
		}, 1000 / 60);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	move() {
		this.background.move();
		this.submarine.move();
		this.obstacles.forEach((obs) => obs.move());
		this.trashes.forEach((trs) => trs.move());
		this.healths.forEach((hs) => hs.move());
	}

	draw() {
		this.background.draw();
		this.submarine.draw();
		this.obstacles.forEach((obs) => obs.draw());
		this.trashes.forEach((trs) => trs.draw());
		this.healths.forEach((hs) => hs.draw());
	}

	addObstacle() {
		this.obstacles.push(new Obstacle(this.ctx));
	}

	addTrash() {
		const trasharr = ["mask", "can", "water", "coke", "bag", "garbage"];

		this.trashes.push(
			new Trash(this.ctx, trasharr[Math.floor(Math.random() * trasharr.length)])
		);
	}

	clearTrashes() {
		this.trashes = this.trashes.filter((trs) => trs.isVisible());
	}

	modifyHealth() {
		const healtharr = ["life", "hazard"];

		this.healths.push(
			new Health(
				this.ctx,
				healtharr[Math.floor(Math.random() * healtharr.length)]
			)
		);
	}

	checkCollisions() {
		this.trashes.forEach((trs, index) => {
			const prevTorpedosLength = this.submarine.weapon.torpedos.length;

			this.submarine.weapon.torpedos = this.submarine.weapon.torpedos.filter(
				(torpedo) => {
					return !trs.collideWidth(torpedo);
				}
			);

			if (prevTorpedosLength !== this.submarine.weapon.torpedos.length) {
				this.trashes.splice(index, 1);
			}
		});


		this.obstacles.forEach(obs => {
			if (obs.collide(this.submarine)) {
				console.log(obs.collide(this.submarine))
				this.submarine.receiveDamage(1)
			} if(this.submarine.health <= 0) {
				this.endGame()
				this.gameOver()
			  }
		})
	}
	
	endGame() {
        clearInterval(this.intervalId);
        this.intervalId = null;

        this.ctx.beginPath();
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.closePath();
    } 

	gameOver() {
		clearInterval(this.intervalId);
		this.intervalId = null;
		this.ctx.font = "30px Arial";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "center";
		this.ctx.fillText("GAME OVER", this.ctx.canvas.width / 2, this.ctx.canvas.height /3);
	}
}