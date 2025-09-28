/**
 * FraudShield Profile - Clean Geometric Drift Background Animation (Full Page)
 *
 * This script uses three.js to create a scene with a variety of simple and clean
 * wireframe shapes. It has been updated to ensure the animation covers the entire
 * viewport by making the spawn area responsive to the screen size.
 */

// --- Basic Three.js Setup ---
let scene, camera, renderer, shapes = [];
let visibleWidth, visibleHeight;

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    // Renderer
    const canvas = document.querySelector('#profile-bg');
    if (!canvas) {
        console.error('Canvas element #profile-bg not found.');
        return;
    }
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Calculate initial visible area and set renderer size ---
    onWindowResize(); // This will set initial size and visible dimensions

    // --- Create an array of simple, clean geometries as requested ---
    const geometries = [
        new THREE.BoxGeometry(5, 5, 5),           // Cube
        new THREE.BoxGeometry(8, 4, 3),           // Rectangle
        new THREE.IcosahedronGeometry(4, 0),      // Sphere
        new THREE.TetrahedronGeometry(5),         // Triangle Pyramid
        new THREE.ConeGeometry(4, 6, 4)           // Square Pyramid
    ];

    // --- Create the Shapes ---
    const numberOfShapes = 30;
    
    for (let i = 0; i < numberOfShapes; i++) {
        // Randomly pick a geometry from the array
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];

        // Create a wireframe for the chosen shape
        const wireframeGeometry = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.1 + Math.random() * 0.15, // Random opacity for depth
            blending: THREE.AdditiveBlending,
        });

        const shape = new THREE.LineSegments(wireframeGeometry, material);

        // Assign random position across the entire visible area
        shape.position.x = (Math.random() - 0.5) * visibleWidth;
        shape.position.y = (Math.random() - 0.5) * visibleHeight;
        shape.position.z = (Math.random() - 0.5) * 100;

        // Assign random rotation and drift speeds
        shape.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
        };
        shape.userData.driftSpeed = {
            y: 0.02 + Math.random() * 0.05
        };
        
        shapes.push(shape);
        scene.add(shape);
    }
    
    // --- Start Animation ---
    animate();
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Set boundaries with a small buffer to ensure shapes are off-screen before reset
    const boundaryY = visibleHeight / 2 + 10;
    const boundaryX = visibleWidth / 2;

    // Animate each shape
    shapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;

        // Drift upwards and reset when out of view
        shape.position.y += shape.userData.driftSpeed.y;
        if (shape.position.y > boundaryY) {
            shape.position.y = -boundaryY; // Reset to the bottom
            shape.position.x = (Math.random() - 0.5) * visibleWidth; // Give a new x position across the full width
        }
    });

    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
function onWindowResize() {
    // Update camera and renderer
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Calculate the visible plane size at the camera's distance
    const fovInRadians = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fovInRadians / 2) * camera.position.z;
    const width = height * camera.aspect;
    
    visibleHeight = height;
    visibleWidth = width;
}

// --- Run ---
init();
window.addEventListener('resize', onWindowResize, false);