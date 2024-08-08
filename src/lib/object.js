import * as THREE from 'three';
import {callbacks, setDebug, gui} from "./debug.js"
import {scene} from "../index.js"
export var Aobjects = [

]
export var AMeshes = [

]
export var updates = [

]
export class AObject extends THREE.Object3D{
    constructor(name){
        super()
        this.isAMesh = false
        let withNames = Aobjects.filter((aObj) => {aObj.name == name})
        this.name = name + ((withNames.length > 0) ? "("+withNames.length.toString()+")" : '');
        // this.highlight= false

        this.gui = gui.addFolder(this.name)
        this._uuid = this.uuid

        // Position
        this.position_gui = this.gui.addFolder("Position")
        this.position_gui.add(this.position, "x", -10, 10, .1)
        this.position_gui.add(this.position, "y", -10, 10, .1)
        this.position_gui.add(this.position, "z", -10, 10, .1)

        // Scale
        this.scale_gui = this.gui.addFolder("Scale")
        this.scale_gui.add(this.scale, "x", .1, 10, .1)
        this.scale_gui.add(this.scale, "y", .1, 10, .1)
        this.scale_gui.add(this.scale, "z", .1, 10, .1)

        // Rotation
        this.rotation_gui = this.gui.addFolder("Rotation")

        // Quaternion
        this.quaternion_gui = this.rotation_gui.addFolder("Quaternion")
        this.quaternion_gui.add(this.quaternion, "w", -1, 1, .01)
        this.quaternion_gui.add(this.quaternion, "x", -1, 1, .01)
        this.quaternion_gui.add(this.quaternion, "y", -1, 1, .01)
        this.quaternion_gui.add(this.quaternion, "z", -1, 1, .01).onChange(()=>{console.log(this)})
        
        // Euler
        this.euler_gui = this.rotation_gui.addFolder("Euler")
        this.euler_gui.add(this.quaternion, "x", -360, 360, 1)
        this.euler_gui.add(this.quaternion, "y", -360, 360, 1)
        this.euler_gui.add(this.quaternion, "z", -360, 360, 1)

        // Visible
        this.visible_gui = this.gui.add(this, "visible")
        this.visible_gui.setValue(true)

        /*
        // Highlight
        this.gui.add(this, "highlight").onChange((val)=>{
            this.setHighLight(val)
        })
        */

        // UUID Display
        this.uuid_controller = this.gui.add(this, "uuid").onFinishChange((_)=>{
            this.uuid_controller.setValue(this._uuid)
        })

        // Name Display
        this.gui.add(this, "name").onChange((val)=>{this.gui.name=val;this.name=val})

        // Push to AObjects 
        Aobjects.push(this)
        // AMeshes.push(this) -- not a Mesh
        
        /**
         
        // Depercated (Highlight not applicable on Non-Mesh Objects)
        this.highlight_mesh = new THREE.Mesh( new THREE.BoxGeometry( .25, .25, .25 ), new THREE.MeshBasicMaterial( { color: "#39FF14", wireframe: true } ));
        this.highlight_mesh.position.copy(this.position)
        this.highlight_mesh.scale.copy(this.scale)
        this.highlight_mesh.visible = false
        
     
        scene.add( this.highlight_mesh );
        
        this.add(new THREE.AxesHelper(5))
        
        this.add(this.highlight_mesh)
         */

    }


    
   
}


export class AMesh extends THREE.Mesh{ 
    constructor(name, geo, mat, hasAxis){
        super(geo, mat)
        this.isAMesh = true

        let withNames = Aobjects.filter((aObj) => aObj.name == name)
        this.name = name + ((withNames.length > 0) ? "("+withNames.length.toString()+")" : '');
        console.log(withNames)

        // Properties
        this.highlight= false
        this._uuid = this.uuid
        this.hasAxis = hasAxis ?? false

        // Start of GUI Defs
        this.gui = gui.addFolder(this.name)



        // Position
        this.position_gui = this.gui.addFolder("Position")
        this.position_gui.add(this.position, "x", -10, 10, .1)
        this.position_gui.add(this.position, "y", -10, 10, .1)
        this.position_gui.add(this.position, "z", -10, 10, .1)

        // Scale
        this.scale_gui = this.gui.addFolder("Scale")
        this.scale_gui.add(this.scale, "x", .1, 10, .1)
        this.scale_gui.add(this.scale, "y", .1, 10, .1)
        this.scale_gui.add(this.scale, "z", .1, 10, .1)

        // Rotation
        this.rotation_gui = this.gui.addFolder("Rotation")

        // Quaternion
        this.quaternion_gui = this.rotation_gui.addFolder("Quaternion")
        this.quaternion_gui.add(this.quaternion, "w", -1, 1, .01)
        this.quaternion_gui.add(this.quaternion, "x", -1, 1, .01)
        this.quaternion_gui.add(this.quaternion, "y", -1, 1, .01)
        this.quaternion_gui.add(this.quaternion, "z", -1, 1, .01).onChange(()=>{console.log(this)})
        
        // Euler
        this.euler_gui = this.rotation_gui.addFolder("Euler")
        this.euler_gui.add(this.quaternion, "x", -360, 360, 1)
        this.euler_gui.add(this.quaternion, "y", -360, 360, 1)
        this.euler_gui.add(this.quaternion, "z", -360, 360, 1)

        // Visible
        this.visible_gui = this.gui.add(this, "visible")
        this.visible_gui.setValue(true)

        
        // Highlight
        this.highlight_gui = this.gui.add(this, "highlight").onChange((val)=>{
            this.setHighLight(val)
        })
        

        // UUID Display
        this.uuid_controller = this.gui.add(this, "uuid").onFinishChange((_)=>{
            this.uuid_controller.setValue(this._uuid)
        })

        // Name Display
        this.gui.add(this, "name").onChange((val)=>{this.gui.name=val;this.name=val})

        // Push to AObjects 
        Aobjects.push(this)
        AMeshes.push(this) 
        console.log(this)
        
        
         
        // Depercated (Highlight not applicable on Non-Mesh Objects)
        this.highlight_mesh = new THREE.Mesh( new THREE.BoxGeometry( .25, .25, .25 ), new THREE.MeshBasicMaterial( { color: "#39FF14", wireframe: true } ));
        this.highlight_mesh.position.copy(this.position)
        this.highlight_mesh.scale.copy(this.scale)
        this.highlight_mesh.visible = false
        
        
        // Add Axis
        this.axis = new THREE.AxesHelper(5)

        this.axis_gui = this.gui.addFolder("Axis")
        this.axis_gui.add(this.axis, "visible")
        // Add to Scene

        scene.add( this.highlight_mesh );
        
        this.add(this.axis)
        
        this.add(this.highlight_mesh)
        
        scene.add(this)

    }

    setHighLight(val){
        // console.log("Set Hightlight " + String(val))
        this.highlight = val
        this.highlight_mesh.visible = val

    }

    
   
}
