/**
 * FraudShield Index Page - Enhanced Galaxy, Constellations, and Central Object
 *
 * This script creates a rich Three.js background for index.html, combining:
 * 1. A detailed galaxy background mimicking Image 1's nebulous starfield.
 * 2. Clearly overlaid constellation patterns (lines and brighter stars).
 * 3. A central, rotating wireframe geometric object (inspired by Image 2).
 * All elements interact with a subtle parallax effect responsive to mouse movement.
 */

// --- Three.js Setup Variables ---
let scene, camera, renderer;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock(); // For time-based animations
let centralObject; // To hold the rotating geometric object
let galaxyParticles; // To hold the galaxy particle system

// --- Constellation Data (Simplified for background visuals) ---
const constellationsData = {
    UrsaMajor: {
        points: [[-4, 0], [-2, 1], [0, 0], [2, 1], [3, 3], [5, 4], [6, 2]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    UrsaMinor: {
        points: [[-2, 0], [0, 0], [1, 1], [0, 2], [-1, 1.5], [-2, 3], [-3, 2.5]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    Cassiopeia: {
        points: [[-3, 0], [-1, 2], [0, 0], [1, 2], [3, 0]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    Cepheus: {
        points: [[0, 0], [2, 0], [3, 2], [1, 3], [-1, 2]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]
    },
    Draco: {
        points: [[-5, 0], [-3, 1], [-1, 0], [1, 1], [3, 0], [4, 2], [5, 4], [6, 3], [7, 5]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]]
    },
    Auriga: {
        points: [[0, 0], [2, -2], [4, 0], [3, 3], [1, 4]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]
    },
    Bootes: {
        points: [[0, 0], [1, 3], [3, 4], [4, 2], [3, 0]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    Hercules: {
        points: [[0, 0], [2, -2], [4, 0], [5, 3], [3, 5], [1, 3], [2, 1]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2]]
    },
    Lyra: {
        points: [[0, 0], [2, 1], [1, 3], [-1, 2]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
    },
    CoronaBorealis: {
        points: [[-2, 0], [-1, 1], [0, 1.5], [1, 1], [2, 0], [1, -1], [0, -1.5], [-1, -1]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]]
    },
    Perseus: {
        points: [[0, 0], [2, 1], [3, 3], [1, 4], [-1, 3], [-2, 1], [-4, 2]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6]]
    },
    Camelopardalis: {
        points: [[-3, 0], [-1, 1], [1, 0], [3, 1], [2, 3], [0, 2]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
    },
    Lynx: {
        points: [[-2, 0], [0, 1], [2, 0], [3, 2], [1, 3]],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    CanesVenatici: {
        points: [[0, 0], [2, 0], [1, 2]],
        connections: [[0, 1], [1, 2], [2, 0]]
    }
};

function init() {
    // --- Scene, Camera, Renderer Setup ---
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    const canvas = document.querySelector('#main-bg'); // Make sure this ID matches your index.html canvas
    if (!canvas) {
        console.error('Canvas element #main-bg not found. Animation will not run.');
        return;
    }
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    onWindowResize(); // Set initial size

    // --- Create Galaxy Background (Mimicking Image 1) ---
    const galaxyParticleCount = 30000; // More particles for dense galaxy
    const galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyParticleCount * 3);
    const sizes = new Float32Array(galaxyParticleCount); // For varying particle sizes

    for (let i = 0; i < galaxyParticleCount; i++) {
        const i3 = i * 3;

        // More clustered distribution for nebula effect
        const radius = Math.random() * 250; // Spread out more
        const angle = Math.random() * Math.PI * 2;
        const zSpread = (Math.random() - 0.5) * 200; // Spread in Z
        
        positions[i3] = radius * Math.cos(angle);
        positions[i3 + 1] = radius * Math.sin(angle);
        positions[i3 + 2] = zSpread; // Can adjust to make flatter or more spherical

        sizes[i] = (Math.random() * 0.7 + 0.3) * 0.5; // Smaller, varied sizes for galaxy dust
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Custom size attribute

    const galaxyMaterial = new THREE.PointsMaterial({
        color: 0x8888ff, // Slightly purplish blue for galaxy
        size: 1.5, // Base size
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.2 // Lower opacity for general galaxy particles
    });

    galaxyParticles = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyParticles);

    // --- Create Central Geometric Object (Inspired by Image 2) ---
    const objectGeometry = new THREE.IcosahedronGeometry(20, 1); // Radius 20, 1 subdivision for wireframe
    const objectMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    centralObject = new THREE.Mesh(objectGeometry, objectMaterial);
    centralObject.position.set(0, 0, -20); // Slightly behind center to not block hero text entirely
    scene.add(centralObject);

    // --- Create Constellation Patterns ---
    const constellationScale = 8;
    const constellationDepthSpread = 60; // How much constellations are spread in Z-axis

    const allConstellationNames = Object.keys(constellationsData);
    const numConstellations = allConstellationNames.length;
    const gridCols = 5;
    const gridRows = Math.ceil(numConstellations / gridCols);
    
    // Calculate spacing to fill the visible area
    const horizontalCoverage = window.innerWidth / 10;
    const verticalCoverage = window.innerHeight / 10;

    const xSpacing = horizontalCoverage / gridCols * 2.5;
    const ySpacing = verticalCoverage / gridRows * 2.5;

    // Constellation stars are brighter to stand out against the galaxy
    const starMaterialConstellation = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending });
    const lineMaterialConstellation = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, linewidth: 2 });

    const constellationGroup = new THREE.Group(); // Group to hold all constellation elements
    for (let i = 0; i < numConstellations; i++) {
        const name = allConstellationNames[i];
        const data = constellationsData[name];

        const col = i % gridCols;
        const row = Math.floor(i / gridCols);

        const constellationCenter = new THREE.Vector3(
            (col - gridCols / 2 + 0.5) * xSpacing,
            (row - gridRows / 2 + 0.5) * ySpacing,
            (Math.random() - 0.5) * constellationDepthSpread // Vary depth to integrate with galaxy
        );

        const constellationStars = [];
        data.points.forEach(p => {
            const starSize = 0.3 + Math.random() * 0.4;
            const starGeometry = new THREE.SphereGeometry(starSize, 16, 16);
            const star = new THREE.Mesh(starGeometry, starMaterialConstellation.clone());
            star.position.set(
                constellationCenter.x + p[0] * constellationScale,
                constellationCenter.y + p[1] * constellationScale,
                constellationCenter.z + (Math.random() - 0.5) * 10
            );
            constellationStars.push(star);
            constellationGroup.add(star);
        });

        data.connections.forEach(c => {
            const startStar = constellationStars[c[0]];
            const endStar = constellationStars[c[1]];
            const points = [startStar.position, endStar.position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterialConstellation.clone());
            constellationGroup.add(line);
        });
    }
    scene.add(constellationGroup);

    // --- Event Listeners ---
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);

    // --- Start Animation ---
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate central object
    if (centralObject) {
        centralObject.rotation.x = elapsedTime * 0.05;
        centralObject.rotation.y = elapsedTime * 0.03;
    }

    // Example: Subtle movement for galaxy particles if desired
    if (galaxyParticles) {
        // galaxyParticles.rotation.y = elapsedTime * 0.005;
    }
    
    // --- Parallax effect ---
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Ensure Three.js is loaded before initializing
if (typeof THREE !== 'undefined') {
    init();
} else {
    console.error("THREE.js not loaded. Cannot initialize background animation.");
}