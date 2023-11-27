import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Base
 */

// Debug Importer lil gui et l'instancier ici si besoin


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene Créer la scene ici
const scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);



//Textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('/textures/sunmap.png');
const earthTexture = textureLoader.load('/textures/earthmap.png');
const neptuneTexture = textureLoader.load('/textures/neptunemap.png');
const moonTexture = textureLoader.load('/textures/moonmap.png');
const jupiterTexture = textureLoader.load('/textures/jupitermap.png');
const saturneTexture = textureLoader.load('/textures/saturnmap.png');
const saturnringTexture = textureLoader.load('/textures/saturnringmap.png');

// create geometry for a planete
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);

const earthGeometry = new THREE.SphereGeometry(0.3, 32, 32);

const neptuneGeometry = new THREE.SphereGeometry(0.4, 32, 32);

const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);

const jupiterGeometry = new THREE.SphereGeometry(0.7, 32, 32);

const saturneGeometry = new THREE.SphereGeometry(0.6, 32, 32);

const saturnringGeometry = new THREE.RingGeometry(0.7, 1, 32);

// Galaxy
const parameters = {};
parameters.count = 100000;
parameters.radius = 20;
parameters.size = 0.01;
parameters.branches = 3;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.spin = 0.2;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    // Geometry
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()

    const position = new Float32Array( parameters.count * 3 )
    const colors= new Float32Array(parameters.count * 3)
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count * 3; i++) {
        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        const branchesAngles = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const spinAngle = radius * parameters.spin

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() - 0.5) * parameters.randomness * 4 * parameters.radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() - 0.5) * parameters.randomness * 4 * parameters.radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() - 0.5) * parameters.randomness * 4 * parameters.radius;


        //add randomness to the position of the points
        position[i3] = Math.cos(branchesAngles + spinAngle) * radius + randomX
        position[i3 + 1] = randomY
        position[i3 + 2] = Math.sin(branchesAngles + spinAngle) * radius + randomZ
        // position[i3] = Math.cos(branchesAngles + spinAngle) * radius
        // position[i3 + 1] = 0
        // position[i3 + 2] = Math.sin(branchesAngles + spinAngle) * radius



        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

    }
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(position, 3)
    )
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    // Points
    points = new THREE.Points(geometry, material)

    const galaxyPosition = new THREE.Vector3(5, 20, -25); // Ajustez les coordonnées selon votre besoin
    points.position.copy(galaxyPosition);
    points.rotation.x = 1.5;

    scene.add(points);

}
generateGalaxy()


// Generate comet
const cometGeometry = new THREE.BufferGeometry();
const cometCount = 1000;
const cometPosition = new Float32Array(cometCount * 3);
const cometColor = new Float32Array(cometCount * 3);

for (let i = 0; i < cometCount; i++) {
    const i3 = i * 3;
    cometPosition[i3] = (Math.random() - 0.5) * 100;
    cometPosition[i3 + 1] = (Math.random() - 0.5) * 100;
    cometPosition[i3 + 2] = (Math.random() - 0.5) * 100;

    cometColor[i3] = Math.random();
    cometColor[i3 + 1] = Math.random();
    cometColor[i3 + 2] = Math.random();
}

cometGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(cometPosition, 3)
);

cometGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(cometColor, 3)
);

const cometMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
});

const comet = new THREE.Points(cometGeometry, cometMaterial);

scene.add(comet);

// create material for a planete
const sunmaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    roughness: 0.5,
    metalness: 0.5
});

const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.5,
    metalness: 0.5
});

const neptuneMaterial = new THREE.MeshStandardMaterial({
    map: neptuneTexture,
    roughness: 0.5,
    metalness: 0.5
});

const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 0.5,
    metalness: 0.5
});

const jupiterMaterial = new THREE.MeshStandardMaterial({
    map: jupiterTexture,
    roughness: 0.5,
    metalness: 0.5
});

const saturneMaterial = new THREE.MeshStandardMaterial({
    map: saturneTexture,
    roughness: 0.5,
    metalness: 0.5
});

const saturnringMaterial = new THREE.MeshStandardMaterial({
    map: saturnringTexture,
    roughness: 0.5,
    metalness: 0.5
});


/**
 * Objects 
 */
const sun = new THREE.Mesh(sunGeometry, sunmaterial);
scene.add(sun);

const distanceScale = 1e6;

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// change position of the earth
earth.position.x = 0;
earth.position.y = 0;
earth.position.z = 5;

scene.add(earth);

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// change position of the moon
moon.position.x = 0;
moon.position.y = 0;
moon.position.z = 1;
earth.add(moon);

const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
// change position of the neptune
neptune.position.x = 0;
neptune.position.y = 0;
neptune.position.z = 150;
scene.add(neptune);

const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
// change position of the jupiter
jupiter.position.x = 0;
jupiter.position.y = 0;
jupiter.position.z = 25;
scene.add(jupiter);

const saturne = new THREE.Mesh(saturneGeometry, saturneMaterial);
// change position of the saturne
saturne.position.x = 0;
saturne.position.y = 0;
saturne.position.z = 45;
scene.add(saturne);

const saturnring = new THREE.Mesh(saturnringGeometry, saturnringMaterial);
// change position of the saturnring
saturnring.position.x = 0;
saturnring.position.y = 0;
saturnring.position.z = 10;
saturnring.rotation.x = 1.5;
saturne.add(saturnring);


// Create a point light to simulate sunlight
const sunlight = new THREE.PointLight(0xffffff, 200);
sunlight.position.copy(sun.position);
scene.add(sunlight);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera  Ajouter une camera ici
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */
const earthRotationSpeed = 2;
const neptuneRotationSpeed = 0.01;
const moonRotationSpeed = 0.1;
const jupiterRotationSpeed = 0.5;

const earthOrbitRadius = 15;
const neptuneOrbitRadius = 30;
const earthOrbitSpeed = 0.2;
const neptuneOrbitSpeed = 0.1;
const moonOrbitSpeed = 0.05;
const jupiterOrbitRadius = 20;
const jupiterOrbitSpeed = 0.05;

const saturnRotationSpeed = 0.3;
const saturnOrbitRadius = 35;
const saturnOrbitSpeed = 0.02;

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    earth.rotation.y = elapsedTime * earthRotationSpeed;

    // Move Earth in its orbit around the Sun
    earth.position.x = Math.cos(elapsedTime * earthOrbitSpeed) * earthOrbitRadius;
    earth.position.z = Math.sin(elapsedTime * earthOrbitSpeed) * earthOrbitRadius;

    //moon rotation
    moon.rotation.y = elapsedTime * moonRotationSpeed;
    moon.rotation.x = Math.sin(elapsedTime * moonRotationSpeed) * 0.2; // Ajoute une inclinaison à l'axe de rotation
    
    moon.position.x = Math.cos(elapsedTime * moonOrbitSpeed) * 1;
    moon.position.z = Math.sin(elapsedTime * moonOrbitSpeed) * 1;

    // Rotate Neptune around the Sun
    neptune.rotation.y = elapsedTime * neptuneRotationSpeed;

    // Move Neptune in its orbit around the Sun
    neptune.position.x = Math.cos(elapsedTime * neptuneOrbitSpeed) * neptuneOrbitRadius;
    neptune.position.z = Math.sin(elapsedTime * neptuneOrbitSpeed) * neptuneOrbitRadius;

    // Rotate Jupiter around the Sun
    jupiter.rotation.y = elapsedTime * jupiterRotationSpeed;

    // Move Jupiter in its orbit around the Sun
    jupiter.position.x = Math.cos(elapsedTime * jupiterOrbitSpeed) * jupiterOrbitRadius;
    jupiter.position.z = Math.sin(elapsedTime * jupiterOrbitSpeed) * jupiterOrbitRadius;

    saturne.rotation.y += elapsedTime * saturnRotationSpeed;

    // Move Saturn in its orbit around the Sun
    saturne.position.x = Math.cos(elapsedTime * saturnOrbitSpeed) * saturnOrbitRadius;
    saturne.position.z = Math.sin(elapsedTime * saturnOrbitSpeed) * saturnOrbitRadius;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    //animate points to make them move like a spin galaxy
    points.rotation.y = elapsedTime * 0.1

    //animate comet
    comet.rotation.x = elapsedTime * 0.1


    sunlight.position.copy(sun.position);


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()