
class EventHelper {
 
    /**
     * 视角信息类
     *
     * @alias EventHelper
     * @constructor
     *
     * @param {Object} viewer viewer对象
     *
     */
    constructor(viewer) {
        this.viewer = viewer;
        viewer.showRenderLoopErrors=false;
		//三维场景导航快捷键修改
        viewer.scene.screenSpaceCameraController.zoomEventTypes =[Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
        viewer.scene.screenSpaceCameraController.tiltEventTypes =[Cesium.CameraEventType.RIGHT_DRAG , Cesium.CameraEventType.PINCH];
		//视野控制
		viewer.scene.screenSpaceCameraController.minimumZoomDistance = 5;
		viewer.scene.screenSpaceCameraController.maximumZoomDistance  = 50000000;
		viewer.scene.minimumDisableDepthTestDistance = 0;
		viewer.scene.fxaa = false;
    }

    doKeyDown(e){       
			var keyID = e.keyCode ? e.keyCode :e.which;
			if(keyID === 38 || keyID === 87)  { // up arrow and W
				clearCanvas();
				y = y - 10;
				tempContext.fillRect(x, y, 80, 40);
				e.preventDefault();
			}
			if(keyID === 39 || keyID === 68)  { // right arrow and D
				clearCanvas();
				x = x + 10;
				tempContext.fillRect(x, y, 80, 40);
				e.preventDefault();
			}
			if(keyID === 40 || keyID === 83)  { // down arrow and S
				clearCanvas();
				y = y + 10;
				tempContext.fillRect(x, y, 80, 40);
				e.preventDefault();
			}
			if(keyID === 37 || keyID === 65)  { // left arrow and A
				clearCanvas();
				x = x - 10;
				tempContext.fillRect(x, y, 80, 40);
				e.preventDefault();
			}
		
    }

    registHotKey(){
        let self = this;
          document.addEventListener('keyup', function(e) {
            //console.log(e.keyCode);
            if(e.code== "Space"){
                //恢复视图

                return;
            }
            switch(e.key){
                case 'p':{
                    self.viewer.FPS = ! self.viewer.FPS ;
                    break;
                }
                case 'r':{

                    break;
                }
                case 'P':{

                    break;
                }
                case 'P':{

                    break;
                }
                case 'P':{

                    break;
                }
            }
          
        }, false);

   }


    　

}

export default  EventHelper;
