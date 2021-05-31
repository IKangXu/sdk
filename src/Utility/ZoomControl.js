 
 

class ZoomControl {
    /**
     * 视角信息类
     *
     * @alias ViewPort
     * @constructor
     *
     * @param {Object} viewer viewer对象
     *
     */
    constructor(viewer) {
        this.viewer = viewer; 
        this.relativeAmount = 2;
        this.cartesian3Scratch = new Cesium.Cartesian3();
    }

    zoomIn(){
        this._zoomFun2(0.5);
    }
    zoomOut(){
        this._zoomFun2(1.5);
    }
    resetView () {
  
        var scene = this.viewer.scene;
        var camera = scene.camera;
  
        var windowPosition = new Cesium.Cartesian2();
        var centerScratch = new Cesium.Cartesian3();
        windowPosition.x = scene.canvas.clientWidth / 2;
        windowPosition.y = scene.canvas.clientHeight / 2;
        var center = camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid, centerScratch);
        if (Cesium.defined(center)) {
          var rotateFrame = Cesium.Transforms.eastNorthUpToFixedFrame(center, scene.globe.ellipsoid);
          var cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(camera.positionCartographic, new Cesium.Cartesian3());
          var lookVector = Cesium.Cartesian3.subtract(center, cameraPosition, new Cesium.Cartesian3());
          var destination = Cesium.Matrix4.multiplyByPoint(rotateFrame, new Cesium.Cartesian3(0, 0, Cesium.Cartesian3.magnitude(lookVector)), new Cesium.Cartesian3());
          camera.flyTo({
            destination : destination,
            duration : 1
          });
        }
  
      }
    
      _zoomFun2(relativeAmount) {

        var scene = this.viewer.scene;

            var sscc = scene.screenSpaceCameraController;           
            if (!sscc.enableInputs || !sscc.enableZoom) {
                return;
            }           

            var camera = scene.camera;
            var orientation;

            switch (scene.mode) {
                case Cesium.SceneMode.MORPHING:
                    break;
                case Cesium.SceneMode.SCENE2D:
                    camera.zoomIn(camera.positionCartographic.height * (1 - this.relativeAmount));
                    break;
                default:
                    var focus;

                    if(Cesium.defined(this.viewer.trackedEntity)) {
                        focus = new Cesium.Cartesian3();
                    } else {
                        focus = this.getCameraFocus(this.viewer, false);
                    }

                    if (!Cesium.defined(focus)) {
                        // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
                        // the focal point.
                        var ray = new Cesium.Ray(camera.worldToCameraCoordinatesPoint(scene.globe.ellipsoid.cartographicToCartesian(camera.positionCartographic)), camera.directionWC);
                        focus = Cesium.IntersectionTests.grazingAltitudeLocation(ray, scene.globe.ellipsoid);

                        orientation = {
                            heading: camera.heading,
                            pitch: camera.pitch,
                            roll: camera.roll
                        };
                    } else {
                        orientation = {
                            direction: camera.direction,
                            up: camera.up
                        };
                    }

                    var direction = Cesium.Cartesian3.subtract(camera.position, focus, this.cartesian3Scratch );
                    var movementVector = Cesium.Cartesian3.multiplyByScalar(direction, relativeAmount, direction);
                    var endPosition = Cesium.Cartesian3.add(focus, movementVector, focus);

                    if (Cesium.defined(this.viewer.trackedEntity) || scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                        // sometimes flyTo does not work (jumps to wrong position) so just set the position without any animation
                        // do not use flyTo when tracking an entity because during animatiuon the position of the entity may change
                        camera.position = endPosition;
                    } else {
                        camera.flyTo({
                            destination: endPosition,
                            orientation: orientation,
                            duration: 1,
                            convert: false
                        });
                    }
            }
        
      }
      getCameraFocus(terria,inWorldCoordinates, result){

        var scene = terria.scene;
        var camera = scene.camera;

        var unprojectedScratch = new Cesium.Cartographic();
        var rayScratch = new Cesium.Ray();

        if(scene.mode == Cesium.SceneMode.MORPHING) {
            return undefined;
        }

        if(!Cesium.defined(result)) {
            result = new Cesium.Cartesian3();
        }

        // TODO bug when tracking: if entity moves the current position should be used and not only the one when starting orbiting/rotating
        // TODO bug when tracking: reset should reset to default view of tracked entity

        if(Cesium.defined(terria.trackedEntity)) {
            result = terria.trackedEntity.position.getValue(terria.clock.currentTime, result);
        } else {
            rayScratch.origin = camera.positionWC;
            rayScratch.direction = camera.directionWC;
            result = scene.globe.pick(rayScratch, scene, result);
        }

        if (!Cesium.defined(result)) {
            return undefined;
        }

        if(scene.mode == Cesium.SceneMode.SCENE2D || scene.mode ==Cesium.SceneMode.COLUMBUS_VIEW) {
            result = camera.worldToCameraCoordinatesPoint(result, result);

            if(inWorldCoordinates) {
                result = scene.globe.ellipsoid.cartographicToCartesian(scene.mapProjection.unproject(result, unprojectedScratch), result);
            }
        } else {
            if(!inWorldCoordinates) {
                result = camera.worldToCameraCoordinatesPoint(result, result);
            }
        }

        return result;

      }
  
    
}

export default  ZoomControl;
