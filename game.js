// Top-down food collection game with goblin enemies
let player, cursors, score = 0, scoreText, gameOver = false;
let foods, goblins, wasd;

function preload() {
    // Load pixel art sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('goblin', 'assets/goblin.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('pineapple', 'assets/pineapple.png');
}

function create() {
    // World setup
    this.cameras.main.setBackgroundColor('#2c2137');
    this.physics.world.setBounds(0, 0, 800, 600);

    // Create food group
    foods = this.physics.add.group();

    // Create goblin enemies group
    goblins = this.physics.add.group();

    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(2); // pixel art style

    // Spawn initial food
    for (let i = 0; i < 8; i++) {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        const foodTypes = ['banana', 'apple', 'pineapple'];
        const type = Phaser.Utils.Array.GetRandom(foodTypes);
        const food = foods.create(x, y, type);
        food.setScale(2);
        food.setTint(0xffffff);
    }

    // Spawn goblins
    for (let i = 0; i < 4; i++) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        const goblin = goblins.create(x, y, 'goblin');
        goblin.setScale(2);
        goblin.setBounce(1);
        goblin.setCollideWorldBounds(true);
        goblin.setVelocity(Phaser.Math.Between(-80, 80), Phaser.Math.Between(-80, 80));
    }

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#f0f0f0',
        fontFamily: 'monospace'
    });

    // Collisions
    this.physics.add.overlap(player, foods, collectFood, null, this);
    this.physics.add.overlap(player, goblins, hitGoblin, null, this);

    // Instructions
    this.add.text(16, 560, 'WASD or arrows to move. Collect fruit, avoid goblins!', {
        fontSize: '16px',
        fill: '#cccccc',
        fontFamily: 'monospace'
    });
}

function update() {
    if (gameOver) return;

    // Player movement
    let velX = 0;
    let velY = 0;
    const speed = 160;

    if (cursors.left.isDown || wasd.A.isDown) velX = -speed;
    if (cursors.right.isDown || wasd.D.isDown) velX = speed;
    if (cursors.up.isDown || wasd.W.isDown) velY = -speed;
    if (cursors.down.isDown || wasd.S.isDown) velY = speed;

    player.setVelocity(velX, velY);

    // Randomize goblin directions occasionally
    goblins.children.entries.forEach(goblin => {
        if (Math.random() < 0.01) {
            goblin.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(-100, 100)
            );
        }
    });
}

function collectFood(player, food) {
    food.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);

    // Spawn new food
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);
    const foodTypes = ['banana', 'apple', 'pineapple'];
    const type = Phaser.Utils.Array.GetRandom(foodTypes);
    const newFood = foods.create(x, y, type);
    newFood.setScale(2);
}

function hitGoblin(player, goblin) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    this.add.text(400, 300, 'GAME OVER', {
        fontSize: '48px',
        fill: '#ff0000',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c2137',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

// Initialize game
const game = new Phaser.Game(config);