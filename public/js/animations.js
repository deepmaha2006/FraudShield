// --- ================================================== ---
// --- UNIFIED 3D SCROLLING ANIMATION (THREE.JS + GSAP) ---
// --- ================================================== ---

if (typeof THREE !== 'undefined' && window.gsap) {
    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        alpha: true, // Make canvas background transparent
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(15); // Start closer to the shield

    // --- 2. LIGHTING ---
    const pointLight = new THREE.PointLight(0x00BFFF, 150, 100);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(pointLight, ambientLight);

    // --- 3. 3D OBJECTS ---

    // The central FraudShield (Icosahedron)
    const shieldGeometry = new THREE.IcosahedronGeometry(5, 1);
    const shieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x00BFFF,
        wireframe: true,
        emissive: 0x0077FF,
        emissiveIntensity: 0.5
    });
    const fraudShield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    scene.add(fraudShield);

    // Data Particles (Points)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 7000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.07,
        color: 0x00BFFF
    });
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);
    
    // --- 4. ANIMATION LOOP ---
      
    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
      
    // Render Loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Animate Shield
        fraudShield.rotation.y += 0.001;
        fraudShield.rotation.x += 0.0005;

        // Animate Particles
        particleMesh.rotation.y = elapsedTime * 0.02;
      
        // Mouse parallax effect on camera
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // --- 5. SCROLL-BASED ANIMATIONS (GSAP) ---
    function setupScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: 'main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5, // Smooth scrubbing
            }
        });

        // Define the camera and shield animation "journey"
        tl.to(fraudShield.rotation, { x: Math.PI * 1.5, y: Math.PI * 2 }, 0)
          .to(camera.position, { z: 40, y: -10 }, 0) // Pull back from hero
          .to(camera.position, { z: 80, y: 20, x: -30 }, 1) // Move for "Scam Threats"
          .to(fraudShield.position, { x: 20 }, 1)
          .to(camera.rotation, { y: -Math.PI / 8 }, 1)
          .to(camera.position, { z: 25, y: -15, x: 10 }, 2) // Move for "Technology"
          .to(fraudShield.position, { x: -10 }, 2)
          .to(camera.rotation, { y: Math.PI / 8 }, 2);
    }
    setupScrollAnimations();

    // --- 6. RESPONSIVENESS ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}