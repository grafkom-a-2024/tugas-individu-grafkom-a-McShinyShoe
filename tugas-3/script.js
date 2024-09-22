function main() {
    const scene = new THREE.Scene();

    // Texture
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('space-bg.jpg', function() {
        scene.background = backgroundTexture;
    });

    // Renddrer
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 30); 
    camera.lookAt(0, 0, 0);

    // Sun
    const sunTexture = textureLoader.load('sun.jpg');
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.castShadow = false;
    sun.receiveShadow = false;
    scene.add(sun);

    // Earth
    const earthTexture = textureLoader.load('earth.jpg');
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Satelite
    const satellitePoints = [
        new THREE.Vector2(0, -0.1),
        new THREE.Vector2(0.1, -0.2),
        new THREE.Vector2(0.1, -0.4),
        new THREE.Vector2(0.06, -0.5), 
        new THREE.Vector2(-0.06, -0.5),
        new THREE.Vector2(-0.1, -0.4),
        new THREE.Vector2(-0.1, -0.2),
        new THREE.Vector2(0, -0.1)
    ];
    const satelliteGeometry = new THREE.LatheGeometry(satellitePoints, 32);
    const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.position.y = 5;
    scene.add(satellite);

    // Lighting
    const sunLight = new THREE.PointLight(0xffdd88, 1.5, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const ambientLight = new THREE.AmbientLight(0x08080b);
    scene.add(ambientLight);

    // Sun Glow
    const glowTexture = textureLoader.load('glow.png');
    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 1
    });
    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(20, 20, 1);
    sun.add(glowSprite);

    const orbitRadius = 20;
    let earthAngle = 0;
    let sateliteAngle = 0;
    const satelliteOrbitRadius = 1.5
    const satelliteInclination = Math.PI / 6;

    function animate() {
        requestAnimationFrame(animate);

        // Sun
        sun.rotation.y -= 0.016;
        
        // Earth
        earthAngle += 0.005;
        earth.rotation.y -= 0.04;
        earth.position.x = Math.cos(earthAngle) * orbitRadius;
        earth.position.z = Math.sin(earthAngle) * orbitRadius;

        sateliteAngle += 0.02; // You can adjust the speed here
        satellite.position.x = earth.position.x + Math.cos(sateliteAngle) * satelliteOrbitRadius;
        satellite.position.z = earth.position.z + Math.sin(sateliteAngle) * satelliteOrbitRadius;
        satellite.position.y = earth.position.y + Math.sin(sateliteAngle) * satelliteOrbitRadius * Math.sin(satelliteInclination);

        renderer.render(scene, camera);
    }

    animate();
}

window.onload = main;
window.onresize = () => {
    const canvas = document.getElementById("glcanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    main();
};

// Window Resize
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});