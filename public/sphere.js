import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 0 );
document.body.appendChild( renderer.domElement );

camera.position.z = 50;

const geometry = new THREE.SphereGeometry(25, 4, 4);
const wireframe = new THREE.WireframeGeometry(geometry);

const line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.05;
line.material.transparent = true;

scene.add(line);

const idAssigns = {
    "7": "#thing-status",
    "10": "#thing-twitter",
    "11": "#thing-mpc",
    "12": "#thing-tetrio",
    "13": "#thing-itch",
    "15": "#thing-community",
    "3": "#thing-gallary",
}

const outerStarsGeometry = new THREE.SphereGeometry(45, 7, 8);

const wireframeStart = new THREE.WireframeGeometry(outerStarsGeometry);

const lineStar = new THREE.LineSegments(wireframeStart);
lineStar.material.depthTest = false;
lineStar.material.opacity = 0.02;
lineStar.material.transparent = true;

scene.add(lineStar);

const vertexObjs = []
const starVertexObjs = []

function updateVertexPos() {
    let countI = 0
    for (let i = 0; i < geometry.index.count; i++) {
        const positionAttribute = geometry.getAttribute('position');

        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);

        if (vertex.x == undefined) {
            break
        }

        let containerThing;

        if (!vertexObjs[i]) {
            containerThing = new THREE.Group()


            scene.add(containerThing)


            const debugDiv = document.createElement('div');
            debugDiv.className = 'debug-label';
            debugDiv.textContent = i;
            debugDiv.style.backgroundColor = 'transparent';
            debugDiv.style.color = "white"

            const daLabel = new CSS2DObject(debugDiv);
            containerThing.add(daLabel);

            const a = idAssigns[i.toString()]

            if (a) {
                const element = document.querySelector(a)

                if (element) {

                    element.style.setProperty("--anim-delay", `${countI * 50}ms`)
                    countI++

                    const daLabel = new CSS2DObject(element);
                    containerThing.add(daLabel);

                }
            }

            vertexObjs[i] = containerThing
        } else {
            containerThing = vertexObjs[i]
        }

        containerThing.position.x = vertex.x
        containerThing.position.y = vertex.y
        containerThing.position.z = vertex.z

        if (vertex.z < 0) {
            containerThing.renderOrder = -1
        }
    }
}

function drawStarVertex() {
    for (let i = 0; i < outerStarsGeometry.index.count; i++) {
        const positionAttribute = outerStarsGeometry.getAttribute('position');

        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);

        if (vertex.x == undefined) {
            break
        }

        let containerThing;

        if (!starVertexObjs[i]) {
            containerThing = new THREE.Group()


            scene.add(containerThing)


            const debugDiv = document.createElement('div');
            debugDiv.className = 'star-label';
            debugDiv.textContent = "."
            
            debugDiv.style.setProperty("--opa", Math.random() / 2)
            debugDiv.style.setProperty("--delay", `${i * 10}ms`)
            debugDiv.style.backgroundColor = 'transparent';
            debugDiv.style.color = "white"

            const daLabel = new CSS2DObject(debugDiv);
            containerThing.add(daLabel);

            starVertexObjs[i] = containerThing
        } else {
            containerThing = starVertexObjs[i]
        }

        containerThing.position.x = vertex.x
        containerThing.position.y = vertex.y
        containerThing.position.z = vertex.z
    }
}

updateVertexPos()

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.querySelector("#targetDiv").appendChild(labelRenderer.domElement);

let mousePast = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
let currentRotation = new THREE.Vector3(0, 0, 0)
let setRotation = new THREE.Vector3(0, 0, 0)
let dragging = false
let dragSense = window.innerWidth * 80
let circleSpeed = 20

document.addEventListener("mousemove", (e) => {
    const dX = (mousePast.x - e.clientX) / dragSense
    const dY = (mousePast.y - e.clientY) / dragSense

    const v = new THREE.Vector3(0, dX, dY)
    setRotation = v
})

const clock = new THREE.Clock()


function animate() {
    requestAnimationFrame(animate);
    drawStarVertex()
    updateVertexPos()
    /*
    geometry.rotateX(0.0002)
    geometry.rotateZ(0.0002)
    */
    
    const v = currentRotation.lerp(setRotation, clock.getDelta() * circleSpeed)

    const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(v.x, v.y, v.z))
    const quat2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(v.x / 2, v.y / 2, v.z / 2))

    geometry.applyQuaternion(quat)
    outerStarsGeometry.applyQuaternion(quat2)
    lineStar.applyQuaternion(quat2)

    line.applyQuaternion(quat)

    for (const selector of Object.values(idAssigns)) {
        const element = document.querySelector(selector)

        if (element) {
            element.style.setProperty("--layer", element.style.zIndex)
        }
    }

    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
}
animate();