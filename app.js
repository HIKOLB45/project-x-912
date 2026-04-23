let scene, camera, renderer, canopy;

function init() {
    const container = document.getElementById('canvas-container');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 10, 25);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(7, 5, 10);
    camera.lookAt(0, 1, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Світло
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(5, 10, 7);
    sun.castShadow = true;
    scene.add(sun);

    // Побудова навісу
    canopy = new THREE.Group();
    buildModel();
    scene.add(canopy);

    // Земля (Бетон як на фото)
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    animate();
}

function buildModel() {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.3 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });

    // Стовпи (як на фото)
    const positions = [
        [-2.4, 1.25, -2.4, 2.5], [0, 1.25, -2.4, 2.5], [2.4, 1.25, -2.4, 2.5],
        [-2.4, 1.0, 2.4, 2.0], [0, 1.0, 2.4, 2.0], [2.4, 1.0, 2.4, 2.0]
    ];

    positions.forEach(p => {
        const geo = new THREE.BoxGeometry(0.06, p[3], 0.06);
        const mesh = new THREE.Mesh(geo, steelMat);
        mesh.position.set(p[0], p[1], p[2]);
        mesh.castShadow = true;
        canopy.add(mesh);
    });

    // Дах (Профнастил)
    const roofGeo = new THREE.BoxGeometry(5.2, 0.05, 5.2);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 2.3, 0);
    roof.rotation.x = 0.1; // Нахил як на фото
    roof.castShadow = true;
    canopy.add(roof);

    // Балки під дахом
    for(let i = -2; i <= 2; i++) {
        const beamGeo = new THREE.BoxGeometry(0.04, 0.08, 5.0);
        const beam = new THREE.Mesh(beamGeo, steelMat);
        beam.position.set(i, 2.2, 0);
        beam.rotation.x = 0.1;
        canopy.add(beam);
    }
}

function animate() {
    requestAnimationFrame(animate);
    canopy.rotation.y += 0.003; // Плавне обертання
    renderer.render(scene, camera);
}

window.onload = init;
