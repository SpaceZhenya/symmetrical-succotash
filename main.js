// Import Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Set renderer size and add to the document
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a plane (arena)
const arenaGeometry = new THREE.PlaneGeometry(50, 50);
const arenaMaterial = new THREE.MeshBasicMaterial({ color: 0x009900 });
const arena = new THREE.Mesh(arenaGeometry, arenaMaterial);
arena.rotation.x = -Math.PI / 2; // Rotate to lay flat
scene.add(arena);

// Add a player
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

// Add an enemy
const enemyGeometry = new THREE.BoxGeometry(1, 2, 1);
const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(5, 1, 0);
scene.add(enemy);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Position the camera
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Update health HUD
const healthDisplay = document.getElementById("health");
const enemyHealthDisplay = document.getElementById("enemyHealth");
let health = 100;
let enemyHealth = 100;

// Add controls for player movement
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") player.position.z -= 0.5;  // Move forward
    if (event.key === "ArrowDown") player.position.z += 0.5; // Move backward
    if (event.key === "ArrowLeft") player.position.x -= 0.5; // Move left
    if (event.key === "ArrowRight") player.position.x += 0.5; // Move right

    // Simulate attack
    if (event.key === " ") {
        enemyHealth -= 10;
        enemyHealthDisplay.textContent = enemyHealth;
        if (enemyHealth <= 0) alert("You Win!");
    }
});

// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Make the enemy move (basic AI)
    if (enemy.position.x > player.position.x) enemy.position.x -= 0.02;
    if (enemy.position.x < player.position.x) enemy.position.x += 0.02;
    if (enemy.position.z > player.position.z) enemy.position.z -= 0.02;
    if (enemy.position.z < player.position.z) enemy.position.z += 0.02;

    // Simulate enemy attack
    const distance = player.position.distanceTo(enemy.position);
    if (distance < 1) {
        health -= 0.1;
        healthDisplay.textContent = Math.max(0, Math.round(health));
        if (health <= 0) alert("Game Over!");
    }

    renderer.render(scene, camera);
}
animate();