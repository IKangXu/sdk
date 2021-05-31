 
import LayerType from "../Enums/LayerType"
import baseLayer from "./BaseLayer"

class GroupLayer extends baseLayer{
    constructor(name){
        let data = {
            name:name,
            type:LayerType.Group,
            children:[], 
        };
        super(data) 
    }

    addLayer(){
        
    }
    
}
export default GroupLayer;