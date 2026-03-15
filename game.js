// Baba Is You - Puzzle Game
class BabaIsYou {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 32;
        this.tileSize = 32;
        
        // Game state
        this.objects = [];
        this.rules = [];
        this.selectedObject = null;
        this.level = 1;
        this.won = false;
        
        this.initLevel();
        this.setupControls();
        this.gameLoop();
    }
    
    initLevel() {
        this.objects = [];
        this.rules = [];
        this.won = false;
        
        if (this.level === 1) {
            // Create tiles and objects for level 1
            this.createBaba(5, 5);
            this.createWall(7, 5);
            this.createFlag(9, 5);
            
            // Rules: Baba IS You, Wall IS Stop, Flag IS Win
            this.rules = [
                { subject: 'Baba', verb: 'IS', object: 'You' },
                { subject: 'Wall', verb: 'IS', object: 'Stop' },
                { subject: 'Flag', verb: 'IS', object: 'Win' }
            ];
        }
    }
    
    createBaba(x, y) {
        this.objects.push({
            x, y,
            type: 'Baba',
            properties: ['You'],
            color: '#e74c3c',
            width: 24,
            height: 24
        });
    }
    
    createWall(x, y) {
        this.objects.push({
            x, y,
            type: 'Wall',
            properties: ['Stop'],
            color: '#95a5a6',
            width: 32,
            height: 32,
            solid: true
        });
    }
    
    createFlag(x, y) {
        this.objects.push({
            x, y,
            type: 'Flag',
            properties: ['Win'],
            color: '#f1c40f',
            width: 24,
            height: 24
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            const playerObj = this.objects.find(obj => obj.properties.includes('You'));
            if (!playerObj) return;
            
            let newX = playerObj.x;
            let newY = playerObj.y;
            
            switch(e.key) {
                case 'ArrowUp':
                    newY -= 1;
                    break;
                case 'ArrowDown':
                    newY += 1;
                    break;
                case 'ArrowLeft':
                    newX -= 1;
                    break;
                case 'ArrowRight':
                    newX += 1;
                    break;
            }
            
            this.moveObject(playerObj, newX, newY);
        });
    }
    
    moveObject(obj, newX, newY) {
        // Check boundaries
        if (newX < 0 || newX >= 20 || newY < 0 || newY >= 15) return;
        
        // Check collisions with solid objects
        const collision = this.objects.find(o => o.x === newX && o.y === newY && o.solid);
        if (collision) return;
        
        // Move object
        obj.x = newX;
        obj.y = newY;
        
        // Check win condition
        this.checkWinCondition();
    }
    
    checkWinCondition() {
        const player = this.objects.find(obj => obj.properties.includes('You'));
        const winObj = this.objects.find(obj => obj.properties.includes('Win'));
        
        if (player && winObj && player.x === winObj.x && player.y === winObj.y) {
            this.won = true;
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= 20; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.tileSize, 0);
            this.ctx.lineTo(x * this.tileSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= 15; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.tileSize);
            this.ctx.lineTo(this.canvas.width, y * this.tileSize);
            this.ctx.stroke();
        }
        
        // Draw objects
        this.objects.forEach(obj => {
            const x = obj.x * this.tileSize + (this.tileSize - obj.width) / 2;
            const y = obj.y * this.tileSize + (this.tileSize - obj.height) / 2;
            
            this.ctx.fillStyle = obj.color;
            this.ctx.fillRect(x, y, obj.width, obj.height);
            
            // Draw text label
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(obj.type, obj.x * this.tileSize + this.tileSize / 2, obj.y * this.tileSize + 12);
            
            // Draw properties
            this.ctx.font = '8px Arial';
            this.ctx.fillText(obj.properties.join(', '), obj.x * this.tileSize + this.tileSize / 2, obj.y * this.tileSize + 22);
        });
        
        // Draw win message
        if (this.won) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('YOU WIN!', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    gameLoop() {
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new BabaIsYou();
});