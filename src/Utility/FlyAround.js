
 

class FlyAround{

    /**
     * 飞行浏览类
     *
     * @alias FlyAround
     * @constructor
     *
     * @param {Object} viewer viewer对象
     * 
     *
     */
    constructor(viewer){

        this.viewer = viewer;
        this._shouldAnimate = this.viewer.clock.shouldAnimate;         
        this.isStart =false;
        this.isFlyCenter = false;
        this.viewer.clock.shouldAnimate = false;
        
    }

    clock_onTickHandler(t){
        var timeDiff = Cesium.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time);
        var  cheading =Cesium.Math.toRadians(timeDiff * this.angle) + this.heading;
    
      if(this.isFlyCenter){
        this.viewer.scene.camera.setView({
            destination: this.position,
            orientation: {
                heading: cheading,
                pitch: this.pitch
            }
        });
        this.viewer.scene.camera.moveBackward(this.distance);
      }else{
        this.viewer.scene.camera.setView({
            orientation: {
                heading: cheading,
                pitch: this.pitch
            }
        });
      }
           
    }

    _setPosition(position){        
        this.position =position;
        this.distance =  Cesium.Cartesian3.distance(this.position, this.viewer.camera.positionWC);
        this.angle = 360 / 60;
        this.time = this.viewer.clock.currentTime.clone();
        this.heading = this.viewer.camera.heading;
        this.pitch = this.viewer.camera.pitch;   
    }

    _startFly(position){
        if(this.isStart)
            return;
        this._setPosition(position);
        this.viewer.clock.shouldAnimate = true;
        this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this);
        this.isStart = true;

    }

    /**
     * 开始环视
     * @param  {Cartesian3} position  中心点位置
     */
    startFlyAround(position){
        this._startFly(position);        
        this.isFlyCenter = false;
        }

   /**
     * 固定中心点浏览
     * @param  {Cartesian3} position  中心点位置
     */
    startFlyCenter(position){
        this._startFly(position);        
        this.isFlyCenter = true;        
    }

    /**
     * 停止浏览
     */
    stopFly(){
        this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this),
        this.isStart = false;
        this.viewer.clock.shouldAnimate = this._shouldAnimate;
    } 
 

    lookAt(){     

        var init = false;
        var center = Cesium.Cartesian3.fromDegrees(101.9915, 24.069534, 30);
        var initpitch = Cesium.Math.toRadians(-28.0);
        var initRange = 220.0;
        var initHeading = 0;

        var offsetPitch = 0.0005;
        var offsetHeading = 0.02;

        function initPos() {
            viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(initHeading), initpitch, initRange));
        }
        function viewICRF() {
            var heading = viewer.camera.heading + offsetHeading*Math.PI/180;
            heading = heading > 180 ? (heading - 360) : heading;
            var currentPitch = viewer.camera.pitch < initpitch ? viewer.camera.pitch+ offsetPitch: viewer.camera.pitch;
            var currentRange = viewer.camera.getMagnitude();
            viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, currentPitch, currentRange));

        }
        viewer.clock.onTick .addEventListener(viewICRF);
    }

}
export default FlyAround;