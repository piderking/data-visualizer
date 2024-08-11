import { mx_bilerp_0 } from "three/src/nodes/materialx/lib/mx_noise.js";
import { AMesh } from "./object";
import * as THREE from "three";
class Chart {
    constructor(name,data, scale){
        this.name = name;
        this.data = data;
        this.scale = scale;
    }
}

export class BarGraph extends Chart {
    constructor(name,data, scale){
        super(name,data, scale);
        this.mats = [ 
        "#9A2B68",     
        "#FFAAAA",
        "#550000" 
        ].map((val)=>new THREE.MeshBasicMaterial({
            color: val
        }))
        this.objects = [];
        this.data.forEach((element, idx) => {
            console.log(element, idx)
            this.objects[this.objects.length] = element.map( // Element at end gets turned into an array
                (val, index) => {
                    let ogj = new AMesh(
                    name+"_"+idx.toString()+"_"+index.toString(),
                    new THREE.BoxGeometry(
                        this.scale,
                        val * scale,
                        this.scale
                    ),
                    this.mats[index],
                    false
                )
                console.log(scale, val)
                ogj.position.set(index, scale-(val*scale), idx)
                console.log(ogj.position.y)

                return ogj
            }
            )
            
        });
    }
}