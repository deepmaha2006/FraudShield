/**
 * FraudShield Dashboard - Plexus Network Background Animation
 * * This script uses three.js to create a dynamic, interactive plexus network effect 
 * for the dashboard background. It's designed to be subtle yet engaging, fitting the
 * cybersecurity theme of the application.
 */

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#dashboard-bg'),
    alpha: true // Use alpha for transparent background
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

// --- Particle and Line Geometry ---
const particleCount = 200;
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = [];

const linesGeometry = new THREE.BufferGeometry();
const linesPositions = new Float32Array(particleCount * particleCount * 3);
const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
});
const linesMesh = new THREE.Line(linesGeometry, linesMaterial);

// Create particles with random positions and velocities
for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = Math.random() * 100 - 50;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1,
    });
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.3,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5
});
const particleSystem = new THREE.Points(particles, particlesMaterial);

scene.add(particleSystem);
scene.add(linesMesh);

// --- Event Listeners ---
// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse interaction
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    const positions = particleSystem.geometry.attributes.position.array;
    let vertexpos = 0;
    let linepos = 0;

    // Update particle positions and check for connections
    for (let i = 0; i < particleCount; i++) {
        // Update velocities based on mouse position for subtle interaction
        positions[i * 3] += particleVelocities[i].x + (mouseX * 0.01);
        positions[i * 3 + 1] += particleVelocities[i].y + (mouseY * 0.01);
        
        // Bounce off screen edges
        if (positions[i * 3] < -50 || positions[i * 3] > 50) particleVelocities[i].x *= -1;
        if (positions[i * 3 + 1] < -50 || positions[i * 3 + 1] > 50) particleVelocities[i].y *= -1;
        
        // Check distance to other particles to draw lines
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 10) { // Proximity threshold to draw a line
                const alpha = 1.0 - (dist / 10);
                
                // Set line vertices
                linesPositions[linepos++] = positions[i * 3];
                linesPositions[linepos++] = positions[i * 3 + 1];
                linesPositions[linepos++] = positions[i * 3 + 2];
                linesPositions[linepos++] = positions[j * 3];
                linesPositions[linepos++] = positions[j * 3 + 1];
                linesPositions[linepos++] = positions[j * 3 + 2];
            }
        }
    }
    
    // Update line geometry
    linesMesh.geometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
    linesMesh.geometry.attributes.position.needsUpdate = true;
    
    // Update particle geometry
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Animate camera rotation slightly
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();