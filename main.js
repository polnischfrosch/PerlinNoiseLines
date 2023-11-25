import "./style.css";
import * as THREE from 'three';
import { Scene, OrthographicCamera, WebGLRenderer, Color, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();
const clock = new THREE.Clock();
var myLines = [];
var myLine = null;
var materialArray = [];
var speed = 0.2;

const scene = new Scene();
const res = 800;
// const camera = new OrthographicCamera(0, w, h, 0, 0, 1000);
const camera = new OrthographicCamera(
  -res * 0.5,
  res * 0.5,
  res * 0.5,
  -res * 0.5,
  0,
  1000
);
camera.position.z = 0;

// Create a renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(res, res);
document.body.appendChild(renderer.domElement);

let hasRedLine = false;

// Fill material Array
for (let r = -20; r < 20; r++){
  if (r==0){
  materialArray.push(
  new LineMaterial({
    color: "rgb(255, 70, 70)", // Red color
    linewidth: 3, // Thickestline
    resolution: new Vector2(res, res),
    dashed: false,
    dashScale: 1,
    dashSize: 1,
    gapSize: 1,
    })
  )
  }
  materialArray.push(createRandomDashedMaterial());
}

scene.background = new Color("rgb(34, 30, 27)");


function animate() {
    requestAnimationFrame(animate);
    removeLines();
    createLines();
    renderer.render(scene, camera);

}

function createLines() {
  const elapsedTime = clock.getElapsedTime();
  var index = 0
  for (let r = -20; r < 20; r++) {
    let vertices = [];

    let wnoise = noise3D(0, r * 0.125,0.01) * 1.0;
    let lwidth = 0.25 + Math.pow(wnoise * 0.5 + 1, 2);

    for (let i = 0; i < 100; i++) {
      let height = 0;
      height += noise3D(i * 0.0189 * 1, r * 0.125,0+elapsedTime*speed) * 2.0;
      height += noise3D(i * 0.0189 * 2, r * 0.125,0+elapsedTime*speed) * 1.0;
      height += noise3D(i * 0.0189 * 4, r * 0.125,0+elapsedTime*speed) * 0.5;
      height += noise3D(i * 0.0189 * 8, r * 0.125,0+elapsedTime*speed) * 0.25;
      height += noise3D(i * 0.0189 * 16, r * 0.125,0+elapsedTime*speed) * 0.125;
      
      vertices.push(
        -330 + 660 * (i / 100), 
        height * 20 + r * 16, 
        0
      );
    }

    const geometry = new LineGeometry();
    geometry.setPositions(vertices);

    const myLine = new Line2(geometry, materialArray[index]);
    myLines.push(myLine);
    myLine.computeLineDistances();

    scene.add(myLine);
    index ++;
  }
}

function removeLines() {
  while (myLines.length > 0) {
      let line = myLines.pop();

      // Remove the line from the scene
      scene.remove(line);

      // Dispose of geometry and material
      if (line.geometry) {
          line.geometry.dispose();
      }

      if (line.material) {
          line.material.dispose();
      }
  }
  myLines = [];
  myLine = null;
  hasRedLine = false;
}

// Function to create a new material with random dashed properties
function createRandomDashedMaterial() {
  let dashed = Math.random() > 0.5;
  let dashScale = 1;
  let dashSize = Math.pow(Math.random(), 2) * 15 + 4;
  let gapSize = dashSize * (0.5 + Math.random() * 1);

  return new LineMaterial({
      color: "rgb(205,187,170)", // Default color, can be changed later
      linewidth: 0.2 + Math.random()*3, // Default linewidth, can be changed later
      resolution: new Vector2(res, res),
      dashed: dashed,
      dashScale: dashScale,
      dashSize: dashSize,
      gapSize: gapSize,
  });
}

animate()
