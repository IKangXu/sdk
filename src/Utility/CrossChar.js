 import Config from "../Utility/Config"

class CrossChar {

    /**
     * 三维视图导航类
     *
     * @alias CrossChar
     * @constructor
     *
     * @param {Object} viewer viewer对象
     * 
     *
     */

    constructor(container) {
        this.container = container;
        this._show = false;
        this._crossChairDiv = null;
        this._init();
        
    }
    _init(){
        this._crossChairDiv = document.createElement('div');
        let style = this._crossChairDiv.style;
        style.height = '25px';
        style.width='25px';
        style.textAlign='center';
        style.float='left';
        style.position='absolute';
        style.top='49%';
        style.left='49%';
        style.display="none";
        style.pointerEvents = "none";
        var span = document.createElement('SPAN');
        this._crossChairDiv.appendChild(span);
        var image = document.createElement('IMG');
        image.src = Config.getResource('Assets/Images/crosschair.png');
        image.style.height = '30px';
        image.style.width='30px';
        image.style.textAlign='center';
        span.appendChild(image);
      
        this.container.appendChild(this._crossChairDiv);
    }
    get show(){
        return this._show;
    }
    set show(val){
        this._show = val;
        this._crossChairDiv.style.display=val?"block":"none"; 
    }
}
export default CrossChar;