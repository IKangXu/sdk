class ViewshedAnalyze {

  /**
   * 通视分析构造函数
   * @method constructor
   * @param viewer Cesium.Viewer 对象
   * 
   */
  constructor(viewer) {
    this._viewer = viewer;
    this._scene = viewer.scene;
    this._camera = this._scene.camera;
    this.context = this._scene.context;


    this._visibleColor = Cesium.Color.LIME;
    this._inVisibleColor = Cesium.Color.RED;
    this._offsetDist = 0.2;
    this._viewPoint= null;
    this.timeId;
    //视点位置
    this.cameraPosition = null;
    //标识符
    this.startAnalyze = false;
    //阴影参数
    this.shadowOptions;
    this.handler;
    //聚光灯光源
    this.spotLightCamera;
    //光源参数
    this.radii;
    this.heading;
    this.roll;
    this.pitch;
    this.tempFrustum;
    this.normalShaderFun = null;
    this.normalShader;
    this.lightSwitch = false;
    this.testOn = false;

    this.entities = [];
    this.activeShapePoints = [];
    this._showDistance = true;
    this._showDome = true;

    this.defaultOption = {
      terrainShadows: this._viewer.terrainShadows,
      depthTestAgainstTerrain: this._scene.globe.depthTestAgainstTerrain,
      shadowMap :this._scene.shadowMap
    };

  }

  /**
   * 获取或设置可视部分的颜色
   * @method visibleColor 
   * 
   */
  get visibleColor() {
    return this._visibleColor;
  }

  set visibleColor(color) {
    if (color instanceof Cesium.Color) {
      this._visibleColor = color;
    }

  }
  /**
   * 获取或设置不可视部分的颜色
   * @method visibleColor 
   * 
   */
  get inVisibleColor() {
    return this._inVisibleColor;
  }
  set inVisibleColor(color) {
    if (color instanceof Cesium.Color) {
      this._inVisibleColor = color;
    }

  }


  /**
   * 是否显示视距 
   * 
   */
  get showDistance() {
    return this._showDistance;
  }
  set showDistance(val) {
    this._showDistance = val;

  }

  /**
   * 高度偏移
   * 
   */
  get offsetDist() {
    return this._offsetDist;
  }
  set offsetDist(val) {
    this._offsetDist = val;

  }
 
  /**
   * 开始视域分析
   * @method open 
   * 
   */
  open() {
    if (this.startAnalyze)
      return;
    this.close();
    this._viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
    this.testOn = this._scene.globe.depthTestAgainstTerrain;
    if (!this.testOn) {
      this._scene.globe.depthTestAgainstTerrain = true;
    }

    this._initialiseHandlers();
    this.startAnalyze = true;
  }
  /**
   * 结束视域分析
   * @method close 
   * 
   */
  close() {
    this.startAnalyze = false;
    this.cameraPosition = null;

    if (this.tempFrustum)
      this._scene.primitives.remove(this.tempFrustum);

    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }

    if (this._scene.shadowMap)
      this._scene.shadowMap.enabled = false;

    //移除entity对象
    for (let item of this.entities) {
      this._viewer.entities.remove(item);
    }
    this.entities = [];
    this.activeShapePoints = [];

    this._viewer.terrainShadows = this.defaultOption.terrainShadows;
    this._scene.globe.depthTestAgainstTerrain = this.defaultOption.depthTestAgainstTerrain;
    this._scene.shadowMap =  this.defaultOption.shadowMap;
    this.spotLightCamera = null; 

  }

  
  /**
   * 设置相机位置
   * @method setPosition 
   * 
   */
  setPosition(p1, p2) {

     //移除entity对象
     for (let item of this.entities) {
      this._viewer.entities.remove(item);
    }

    this._updateCamera(p1);
    this._updateTarget(p2);
  }


  
   /**
   * 设置相机hpr参数
   * @method hpr 
   * 
   */
  get hpr() {
    return new Cesium.HeadingPitchRoll(this.spotLightCamera.heading, this.spotLightCamera.pitch, this.spotLightCamera.roll);  
  }
  set hpr(val) {
    let camera =  this.spotLightCamera;
    camera.setView({
         destination : camera.position,
         orientation: {
             heading :val.heading, 
             pitch : val.pitch,    
             roll : val.roll 
         }
     }); 
  }
 
  /**
   * 获取设置相机视场角fov
   * @method fov 
   * 
   */
  get fov() {
    let frustum =  this.spotLightCamera.frustum;
    return Cesium.Math.toDegrees(frustum.fov) ;
     
  }
 /**
   * 获取设置相机视场角fov
   * @method fov 
   * 
   */
  set fov(val) {
    let frustum =  this.spotLightCamera.frustum;
    frustum.fov =  Cesium.Math.toRadians(val);
    this.spotLightCamera.frustum = frustum;
     
  }

  
  /**
   * 获取设置相机near裁剪值
   * @method near 
   * 
   */
  get near() {
    return this.spotLightCamera.frustum.near;
     
  }
 /**
   * 获取设置相机near裁剪值
   * @method near 
   * 
   */
  set near(val) {
    this.spotLightCamera.frustum.near = val;
     
  }


   /**
   * 获取设置相机far裁剪值
   * @method far 
   * 
   */
  get far() {
    return this.spotLightCamera.frustum.far;
     
  }
 /**
   * 获取设置相机far裁剪值
   * @method far 
   * 
   */
  set far(val) {
    this.spotLightCamera.frustum.far = val;
     
  }

    /**
   * 是否显示包围盒 
     * 
   */
  get showDome(){
    return  this._showDome;
  }
  set showDome(val){
    this._showDome= val;
    if(this.tempFrustum)
      this.tempFrustum.show = this._showDome;

  }


    /**
   * 设置相机位置
   * @method setPosition 
   * 
   */
  _updateTarget(p2) {  
    if(p2){
      this._calculatePose(p2);
      if( this.cameraPosition){
        this.activeShapePoints=[];
        this.activeShapePoints.push(this.cameraPosition);
        this.activeShapePoints.push(p2);
      }
     
    }     
    this._updateLightDirection();
    this._creatFrustum();

  }

  /**
   * 设置相机位置
   * @method setPosition 
   * 
   */
  _updateCamera(newPos) {  
    if(newPos){
      this.cameraPosition = newPos; 
      this._viewPoint = newPos
      this._createViewShad(newPos);
      if( this.entities.length==0)
          this._addEntity();
        this.activeShapePoints.push(newPos);
      
       
    }      
  }


  //鼠标事件
  _initialiseHandlers() {
    var self = this;
    this.handler = new Cesium.ScreenSpaceEventHandler(this._scene.canvas);
    this.handler.setInputAction((movement)=> {
      if (!self.startAnalyze)
        return;
      if (self.cameraPosition == null)
        return;

      var newPos = self._pickPosition(movement.endPosition);
      this._updateTarget(newPos);
      // self._calculatePose(newPos);
      // self._updateLightDirection();
      // self._creatFrustum();
      //更新位置
      // if (Cesium.defined(newPos)) {
      //   if (self.activeShapePoints.length != 1)
      //     self.activeShapePoints.pop();
      //   self.activeShapePoints.push(newPos);
      // }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((movement) =>{
      if (self.startAnalyze && self.cameraPosition == null) {
        var pos = self._pickPosition(movement.position);
        if (pos) {
          //移除entity对象
          for (let item of self.entities) {
            self._viewer.entities.remove(item);
          }
          self.entities = [];
          self.activeShapePoints = [];
          var ellipsoid= self._viewer.scene.globe.ellipsoid;
          
          var cartographic=ellipsoid.cartesianToCartographic(pos);
          var lat=Cesium.Math.toDegrees(cartographic.latitude);
          var lng=Cesium.Math.toDegrees(cartographic.longitude);
          var alt=cartographic.height + this._offsetDist;
          var newPos = Cesium.Cartesian3.fromDegrees(lng,lat,alt);
          this._updateCamera(newPos);
          // self.cameraPosition = newPos; 
          // self._createViewShad(newPos);
          // self._addEntity(newPos);
          // self.activeShapePoints.push(newPos);


        }
      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((movement) =>{
      this.startAnalyze = false;
      this.cameraPosition = null;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  }

  _addEntity(pos) {
    let self = this;

    var viewPoint = new Cesium.CallbackProperty(function () {
      return self.viewPoint;
    }, false);

    var dynamicPositions = new Cesium.CallbackProperty(function () {
      return self.activeShapePoints;
    }, false);

    var endPoint = new Cesium.CallbackProperty(function () {
      return self.activeShapePoints[self.activeShapePoints.length - 1];
    }, false);

    var distanceLabel = new Cesium.CallbackProperty(function () {
      let distance = "";
      if (self.activeShapePoints.length > 1) {
        let dist = Cesium.Cartesian3.distance(self.activeShapePoints[0], self.activeShapePoints[1]);
        distance = "距离:" + dist.toFixed(2) + "米";
      }
      return distance;

    }, false);

    var showDist = new Cesium.CallbackProperty(function () {
      return self._showDistance;
    }, false);

    //视点Entity
    this.entities.push(this._viewer.entities.add({
      position: viewPoint,
      point: {
        pixelSize: 12,
        color: Cesium.Color.YELLOW,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    }))
    //视距线entity
    this.entities.push(this._viewer.entities.add({
      polyline: {
        positions: dynamicPositions,
        show: showDist,
        width: 2.0,
        clampToGround: false,
        material: Cesium.Color.LIME,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        classificationType: Cesium.ClassificationType.NONE
      },

    }));

    //距离label entity
    this.entities.push(this._viewer.entities.add({
      position: endPoint,
      label: {
        show: showDist,
        text: distanceLabel,
        pixelOffset: new Cesium.Cartesian2(30, -50),
        scale: 0.5,
        font: '32px 微软雅黑',
        fillColor: Cesium.Color.DEEPSKYBLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1.0,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.9),
        backgroundPadding: new Cesium.Cartesian2(10, 6),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },

    }));

  }

  //计算姿态
  _calculatePose(pickingPos) {
    var vectorR = new Cesium.Cartesian3;
    Cesium.Cartesian3.subtract(pickingPos, this.cameraPosition, vectorR);
    this.radii = Cesium.Cartesian3.magnitude(vectorR);
    Cesium.Cartesian3.normalize(vectorR, vectorR);
    var currentView = this._scene.frameState.camera;
    var _heading = currentView.heading;
    var _pitch = currentView.pitch;
    var _roll = currentView.roll;
    var cposition = new Cesium.Cartesian3;
    Cesium.Cartesian3.clone(currentView.position, cposition);
    var vectorr = vectorR.clone();
    var vPoint = this.cameraPosition.clone();
    var vPoint = Cesium.Cartesian3.normalize(vPoint, vPoint);
    if (Math.abs(Cesium.Cartesian3.dot(vPoint, vectorr)) >= 1) {
      if (Math.abs(Cesium.Cartesian3.dot(vectorr, Cesium.Cartesian3.UNIT_Y)) < 1) {
        vPoint = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y, vPoint);
      } else {
        vPoint = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Z, vPoint);
      }
    };
    var vrCross = new Cesium.Cartesian3;
    Cesium.Cartesian3.cross(vPoint, vectorr, vrCross);
    vrCross = Cesium.Cartesian3.normalize(vrCross, vrCross);
    Cesium.Cartesian3.cross(vectorr, vrCross, vPoint);
    vPoint = Cesium.Cartesian3.normalize(vPoint, vPoint);
    currentView.setView({
      destination: this.cameraPosition,
      orientation: {
        direction: vectorr,
        up: vPoint
      }
    });
    this.heading = currentView.heading;
    this.roll = currentView.roll;
    this.pitch = currentView.pitch;
    currentView.setView({
      destination: cposition,
      orientation: {
        heading: _heading,
        pitch: _pitch,
        roll: _roll
      }
    });
  }

  //创建shadowmap
  _createViewShad(pos) {
    if (!this.spotLightCamera) {
      this.spotLightCamera = new Cesium.Camera(this._scene);
      this.spotLightCamera.position = pos;
      this.spotLightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE;
      this.spotLightCamera.frustum.aspectRatio = 1.0;
      this.spotLightCamera.frustum.near = 1.0;
      this.spotLightCamera.frustum.far = 2.0;

      this.shadowOptions = {
        context: this.context,
        enabled: true,
        lightCamera: this.spotLightCamera,
        maximumDistance: 500.0,
        cascadesEnabled: false
      };

      var self = this;
      this._scene.shadowMap = new Cesium.ShadowMap(this.shadowOptions);
      if (this.normalShaderFun == null)
        this.normalShaderFun = Cesium.ShadowMapShader.createShadowReceiveFragmentShader;
      Cesium.ShadowMapShader.createShadowReceiveFragmentShader = function (fs, shadowMap, castShadows, isTerrain, hasTerrainNormal) {
        return self._getUIShader(self, fs, shadowMap, castShadows, isTerrain, hasTerrainNormal);
      }

    }
    this.spotLightCamera.position = pos; 

  }

  //更新shader
  _getUIShader(self, fs, shadowMap, castShadows, isTerrain, hasTerrainNormal) {

    var shader = self.normalShaderFun(fs, shadowMap, castShadows, isTerrain, hasTerrainNormal);
    var red1 = self.visibleColor.red;
    var green1 = self.visibleColor.green;
    var blue1 = self.visibleColor.blue;

    var red2 = self.inVisibleColor.red;
    var green2 = self.inVisibleColor.green;
    var blue2 = self.inVisibleColor.blue;



    // var colorFs = ' if(visibility == 1.0){ \n' +
    //   '  gl_FragColor.rgb *= vec3(0.0, 1, 0.0); \n' + 
    //   '  } else { \n' +
    //   '  gl_FragColor.rgb *= vec3(1, 0.1, 0.1); \n' +
    //   '  } \n'


    var colorFs = ` if(visibility == 1.0){ 
          gl_FragColor.rgb *= vec3(${red1},${green1},${blue1});  
        } else { 
          gl_FragColor.rgb *= vec3(${red2},${green2},${blue2}); 
        }
        `
    shader.sources[shader.sources.length - 1] = shader.sources[shader.sources.length - 1].replace('gl_FragColor.rgb *= visibility;', colorFs);
    return shader;
  }

  //更新shadowmap
  _updateLightDirection() {
    if (this.radii <= 1) return;
    this.spotLightCamera.frustum.far = this.radii;
    this.shadowOptions.maximumDistance = this.radii;
    this.spotLightCamera.setView({
      orientation: {
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll
      }
    });
  }

  //更新视锥体
  _creatFrustum() {
    var qHeading = this.heading - (70 + 60 / 2) / 57.29578;
    //adapt before V1.31
    //var Qua = Cesium.Quaternion.fromHeadingPitchRoll(qHeading, this.pitch, this.roll);
    var hpr = new Cesium.HeadingPitchRoll(qHeading, this.pitch, this.roll);
    var Qua = Cesium.Quaternion.fromHeadingPitchRoll(hpr);
    var rotMatrix = Cesium.Matrix3.fromQuaternion(Qua);
    var modelMatrix = Cesium.Matrix4.multiply(
      Cesium.Transforms.eastNorthUpToFixedFrame(this.cameraPosition),
      Cesium.Matrix4.fromRotationTranslation(rotMatrix, new Cesium.Cartesian3(0.0, 0.0, 0.0)),
      new Cesium.Matrix4()
    );

    var frustum = this._getViewShadGeometry({
      dist: this.radii
    });

    var instance = new Cesium.GeometryInstance({
      geometry: frustum,
      modelMatrix: modelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
      }
    });

    var vsGeometry = new Cesium.Primitive({
      geometryInstances: instance,
      asynchronous: false,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false
      })
    });

    if (this.tempFrustum) this._scene.primitives.remove(this.tempFrustum);
    this._scene.primitives.add(vsGeometry);
    this.tempFrustum = vsGeometry;
    this.tempFrustum.show = this._showDome;
  }

  //拾取坐标
  _pickPosition(winPosition) {
    return this._scene.pickPosition(winPosition);
  }

  //创建视锥体对象
  _getViewShadGeometry(frustumGeometry) {
    frustumGeometry = Cesium.defaultValue(frustumGeometry, Cesium.defaultValue.EMPTY_OBJECT);
    var dist = Cesium.defaultValue(frustumGeometry.dist, 200);
    var phiStart = Cesium.defaultValue(frustumGeometry.phiStart, 75);
    var phiLength = Cesium.defaultValue(frustumGeometry.phiLength, 30);
    var thetaLength = Cesium.defaultValue(frustumGeometry.thetaLength, 60);
    var thetaStart = Cesium.defaultValue(frustumGeometry.thetaStart, 320);

    //BoundingSphere
    var radii = new Cesium.Cartesian3(dist, dist, dist);
    var ellipsoid = Cesium.Ellipsoid.fromCartesian3(radii);
    //角度转弧度
    var pStart = Cesium.Math.toRadians(phiStart);
    var pLength = Cesium.Math.toRadians(phiLength);
    var tStart = Cesium.Math.toRadians(thetaStart);
    var tLength = Cesium.Math.toRadians(thetaLength);
    //顶点缓存
    var positions = new Float64Array(5 * 3);
    //索引
    var indices = Cesium.IndexDatatype.createTypedArray(5, 4 * 5);
    var index = 0;

    var distR = dist * 1.1547005;
    positions[index++] = distR * Math.cos(tStart) * Math.sin(pStart);
    positions[index++] = distR * Math.sin(tStart) * Math.sin(pStart);
    positions[index++] = distR * Math.cos(pStart);

    positions[index++] = distR * Math.cos(tStart + tLength) * Math.sin(pStart);
    positions[index++] = distR * Math.sin(tStart + tLength) * Math.sin(pStart);
    positions[index++] = distR * Math.cos(pStart);

    positions[index++] = distR * Math.cos(tStart) * Math.sin(pStart + pLength);
    positions[index++] = distR * Math.sin(tStart) * Math.sin(pStart + pLength);
    positions[index++] = distR * Math.cos(pStart + pLength);

    positions[index++] = distR * Math.cos(tStart + tLength) * Math.sin(pStart + pLength);
    positions[index++] = distR * Math.sin(tStart + tLength) * Math.sin(pStart + pLength);
    positions[index++] = distR * Math.cos(pStart + pLength);

    //球心
    positions[index++] = 0;
    positions[index++] = 0;
    positions[index++] = 0;


    //索引
    index = 0;
    indices[index++] = 4;
    indices[index++] = 0;
    indices[index++] = 4;
    indices[index++] = 1;
    indices[index++] = 4;
    indices[index++] = 2;
    indices[index++] = 4;
    indices[index++] = 3;

    indices[index++] = 0;
    indices[index++] = 1;
    indices[index++] = 0;
    indices[index++] = 2;
    indices[index++] = 2;
    indices[index++] = 3;
    indices[index++] = 3;
    indices[index++] = 1;

    var attributes = new Cesium.GeometryAttributes({
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: positions
      })
    });

    return new Cesium.Geometry({
      attributes: attributes,
      indices: indices,
      primitiveType: Cesium.PrimitiveType.LINES,
      boundingSphere: Cesium.BoundingSphere.fromEllipsoid(ellipsoid)
    });

  }


}


export default ViewshedAnalyze;