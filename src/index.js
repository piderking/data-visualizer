import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module'

import {gui, setDebug, debug_tools} from "./lib/debug.js"
import {AObject, AMesh,  Aobjects, AMeshes } from './lib/object.js'
import { BarGraph } from './lib/chart.js';
const stats = Stats()

export var scene;
var  camera, renderer, controls;
var light, orbitControls;
var geometry, material, mesh;
var points, point_mat;
var pointerHasMove = false

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let all_highlighted = []

var palette = {
  color1: '#FF0000', // CSS string
  color2: [ 0, 128, 255 ], // RGB array
  color3: [ 0, 128, 255, 0.3 ], // RGB with alpha
  color4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};
var props = {
  eq: 2,
  points: 200,
  visible: true,
}
init().then(animate);


// For Highlight CHanger
var hightlighted;
//var obj = new AObject("sdfsdf")

var outline_gui = gui.add(debug_tools, "outline", AMeshes.map(aob => aob.uuid)).onFinishChange((val)=>{
  
  hightlighted?.setHighLight(false)

  hightlighted = AMeshes.find((hit)=> hit.uuid == val)
  
  hightlighted.setHighLight(true)

})

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  pointerHasMove = true

}
async function createGUI(){
  console.log(mesh)
  
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'z', 0, 10, .1)
  
  
  const PointsFOlder = gui.addFolder("Points")
  PointsFOlder.add(props, "visible", 0, 1, 1).onFinishChange((val)=>{
    points.visible = val
  })
  const MaterialFolder = PointsFOlder.addFolder("Material")
  MaterialFolder.add(points.material, "size", 0.01, 1.01, 0.1)

  const DataFolder = PointsFOlder.addFolder("Data")
  const DataFolderScale = DataFolder.addFolder("Scale")
  DataFolderScale.add(points.scale, "x", .1, 10, .1)
  DataFolderScale.add(points.scale, "y", .1, 10, .1)
  DataFolderScale.add(points.scale, "z", .1, 10, .1)

  const DataFolderPosition = DataFolder.addFolder("Position")
  DataFolderPosition.add(points.position, "x", -10, 10, .1)
  DataFolderPosition.add(points.position, "y", -10, 10, .1)
  DataFolderPosition.add(points.position, "z", -10, 10, .1)

  const DataFolderManu = DataFolder.addFolder("Manu")
  DataFolderManu.add(props, "eq", 1, 4, .01).onChange((val)=>{
    props.eq = val
    points.geometry.setFromPoints(  Array(props.points).fill(1).map((y, n) => (y+n)/10).map(x => new THREE.Vector3((0 + Math.cos(x) * 1), (x ** val)/75, (0 + Math.sin(x) * 1))))
  })
  DataFolderManu.add(props, "points", 10, 400, 1).onChange((val)=>{
    props.points = val
    points.geometry.setFromPoints(  Array(val).fill(1).map((y, n) => (y+n)/10).map(x => new THREE.Vector3((0 + Math.cos(x) * 1), (x ** props.eq)/75, (0 + Math.sin(x) * 1))))
  })



  MaterialFolder.addColor(palette, 'color2').onChange(
    (val) => {
      console.log(points.material)
      points.material.color.copy(new THREE.Color(val))
    }
  );


  
 
  
}
async function createMesh(){
  
    new BarGraph("Bar Graph", [
      [1, 1, 1],
      [2, 2, 2],


      
    ], 1
  )

    point_mat = new THREE.PointsMaterial({
      color: palette.color2,
      size: .1
    })


    // Points
    //new AMesh("sdfsdf", new THREE.BoxGeometry(.24, .24, .24), new THREE.MeshBasicMaterial({color: "#9A2B68"}))

    var g = 2
    var c = 0
    points = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(Array(props.points).fill(1).map((y, n) => (y+n)/10).map(x => new THREE.Vector3((0 + Math.cos(x) * 1), (x ** props.eq)/75, (0 + Math.sin(x) * 1)))),
      point_mat,
    )
    //points.geometry.setFromPoints()
    //scene.add(points)

}
async function init() {
    // Renderer
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer( { canvas } );
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize, false)
    window.addEventListener( 'pointermove', onPointerMove );

    
    // Add Stats
    document.body.appendChild(stats.dom)

    // Camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );

    // Scene
    scene = new THREE.Scene();
    // Controls
    controls = new OrbitControls( camera, renderer.domElement );




    camera.position.z = 5;
    controls.update();

    createMesh().then(createGUI)

  /* 
  
    const materialLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const [ texture, obj ] = await Promise.all( [
      materialLoader.loadAsync( 'models/wood/materials.mtl' ),
      objLoader.loadAsync( 'models/wood/model.obj' ),
    ] );

    obj.traverse( function ( child ) {

      if ( child.isMesh ) {

        child.material.map = texture;
        child.geometry.computeVertexNormals();

      }

    } );

    scene.add( obj );
    */



}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.render( scene, camera );

}

function animate() {

    requestAnimationFrame( animate );

	  controls.update();

    if (pointerHasMove){
      
      // update the picking ray with the camera and pointer position
      raycaster.setFromCamera( pointer, camera );

      all_highlighted.forEach((item)=>{
        item.setHighLight(false)
      })
      // calculate objects intersecting the picking ray
      let intersects = raycaster.intersectObjects( scene.children ).filter(el => el.object.type != "AxesHelper").filter(ael => ael.object.isAMesh)


      for ( let i = 0; i < intersects.length; i ++ ) {
        intersects[ i ].object.setHighLight(true)

      }
      all_highlighted = intersects.map(el => el.object)
      if (all_highlighted.length > 0 ) {outline_gui.setValue(all_highlighted[0].uuid)}
    }



    renderer.render( scene, camera );
    stats.update()

}
