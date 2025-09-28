/**
 * FraudShield Analyzer - Slow Glowing Binary Grid
 *
 * This script uses the HTML5 2D Canvas API to create a static grid of binary
 * characters. The animation consists of many random characters slowly pulsing
 * in and out, creating a more visible and decent glowing effect.
 */

const canvas = document.querySelector('#analyzer-bg');
const ctx = canvas.getContext('2d');

let grid = [];
const fontSize = 14;
const baseOpacity = 0.15; // Dimmer base for more contrast
const maxOpacity = 1.0;
const glowSpeed = 0.03; // Controls how fast characters fade in and out

// Function to set up the grid of characters
function setupGrid() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    grid = [];
    const columns = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            grid.push({
                x: x * fontSize,
                y: y * fontSize,
                char: Math.random() > 0.5 ? '0' : '1',
                opacity: baseOpacity,
                isGlowing: false,
                fadeDirection: 1 // 1 for fading in, -1 for fading out
            });
        }
    }
}

// Function to randomly trigger a batch of characters to start glowing
function triggerGlows() {
    // Activate a small percentage of non-glowing characters at a time
    const triggerCount = Math.floor(grid.length / 100); 
    
    for (let i = 0; i < triggerCount; i++) {
        const randomIndex = Math.floor(Math.random() * grid.length);
        if (grid[randomIndex] && !grid[randomIndex].isGlowing) {
            grid[randomIndex].isGlowing = true;
            grid[randomIndex].fadeDirection = 1; // Start fading in
        }
    }
}

// The animation loop function
function animate() {
    // Clear the entire canvas on each frame for a clean render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    // Update and draw each character in the grid
    grid.forEach(cell => {
        // If the cell is part of a glow cycle, update its opacity
        if (cell.isGlowing) {
            cell.opacity += glowSpeed * cell.fadeDirection;

            // If it reaches full brightness, start fading out
            if (cell.opacity >= maxOpacity) {
                cell.opacity = maxOpacity;
                cell.fadeDirection = -1;
            }
            
            // If it fades back to base, the glow cycle is over
            if (cell.opacity <= baseOpacity) {
                cell.opacity = baseOpacity;
                cell.isGlowing = false;
            }
        }
        
        // Set the color based on the current opacity and draw the character
        const color = cell.opacity > 0.7 ? '200, 255, 255' : '0, 255, 255'; // Whiter when brighter
        ctx.fillStyle = `rgba(${color}, ${cell.opacity})`;
        ctx.fillText(cell.char, cell.x, cell.y);
    });

    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', setupGrid);

// Initial setup and start the animation
setupGrid();
animate();

// Periodically trigger new characters to start their glow cycle
setInterval(triggerGlows, 100); // Every 100ms, a new batch starts glowing