var DEBUG = true
import { GUI, GUIController } from 'dat.gui'


export var debug_tools = {
    outline: true
}
export const gui = new GUI({
    name: "Debug",
  })


export function setDebug(state){
    DEBUG = state

    callbacks.forEach((fn) => {
        fn(state) // Call each call back with the new state
    })
} 


export var callbacks = [
    (nState)=>{
        if (nState){gui.open()} else {gui.close()}
    }
]