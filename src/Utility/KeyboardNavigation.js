 
let f = {
    ENLARGE: 0,
    NARROW: 1,
    LEFT_ROTATE: 2,
    RIGHT_ROTATE: 3,
    TOP_ROTATE: 4,
    BOTTOM_ROTATE: 5
};


 class KeyboardNavigation {

     constructor(viewer) {
         this.viewer = viewer;
         this.flags = {
             moveForward: !1,
             moveBackward: !1,
             moveUp: !1,
             moveDown: !1,
             moveLeft: !1,
             moveRight: !1
         };
         this._enable = false;

          this.l = this.speedRatio = 150
          this.u = this.dirStep = 25
          this.c = this.rotateStep = 1
          this.h = this.minPitch = .1
          this.d = this.maxPitch = .95

         var canvas = viewer.scene.canvas;
         canvas.setAttribute("tabindex", "0"),
             canvas.onclick = function () {
                 canvas.focus()
             };
      
         document.addEventListener("keydown",  (e) =>{
                 if (this._enable) {
                     var t = this.getFlagForKeyCode(e.keyCode);
                     void 0 !== t && (this.flags[t] = !0)
                 }
             }, !1),
             document.addEventListener("keyup", (e)=> {
                 if (this._enable) {
                     var t = this.getFlagForKeyCode(e.keyCode);
                     void 0 !== t && (this.flags[t] = !1)
                 }
             }, !1),
             this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas),

             this.handler.setInputAction( (e)=> {
                 this._enable && (e > 0 ? (this.speedRatio = l *= .9,
                     this.rotateStep = this.c *= 1.1,
                     this.dirStep = this.u *= .9) : (this.speedRatio = this.l *= 1.1,
                     this.rotateStep = this.c *= .9,
                     this.dirStep = this.u *= 1.1))
             }, Cesium.ScreenSpaceEventType.WHEEL)
     }

     bind(e) {
         this._enable || (this._enable = !0,
             Cesium.defined(e) && (t.speedRatio = l = e.speedRatio || l,
                 t.dirStep = u = e.dirStep || u,
                 t.rotateStep = c = e.rotateStep || c,
                 t.minPitch = h = e.minPitch || h,
                 t.maxPitch = d = e.maxPitch || d),
             this.viewer.clock.onTick.addEventListener(this.cameraFunc, this))

     }

     unbind() {
         this._enable && (this._enable = !1,
             this.viewer.clock.onTick.removeEventListener(this.cameraFunc, this))

     }

     destroy() {
         this.unbind(),
             this.handler.destroy()
     }

     getFlagForKeyCode(e) {
         switch (e) {
             case "W".charCodeAt(0):
                 return "moveForward";
             case "S".charCodeAt(0):
                 return "moveBackward";
             case "D".charCodeAt(0):
                 return "moveRight";
             case "A".charCodeAt(0):
                 return "moveLeft";
             case "Q".charCodeAt(0):
                 return "moveUp";
             case "E".charCodeAt(0):
                 return "moveDown";
             case 38:
                 this.rotateCamera(f.TOP_ROTATE);
                 break;
             case 37:
                 this.rotateCamera(f.LEFT_ROTATE);
                 break;
             case 39:
                 this.rotateCamera(f.RIGHT_ROTATE);
                 break;
             case 40:
                 this.rotateCamera(f.BOTTOM_ROTATE);
                 break;
             case "I".charCodeAt(0):
             case 104:
                 this.moveCamera(f.ENLARGE);
                 break;
             case "K".charCodeAt(0):
             case 101:
                 this.moveCamera(f.NARROW);
                 break;
             case "J".charCodeAt(0):
             case 100:
                 this.moveCamera(f.LEFT_ROTATE);
                 break;
             case "L".charCodeAt(0):
             case 102:
                 this.moveCamera(f.RIGHT_ROTATE);
                 break;
             case "U".charCodeAt(0):
             case 103:
                 this.moveCamera(f.TOP_ROTATE);
                 break;
             case "O".charCodeAt(0):
             case 105:
                 this.moveCamera(f.BOTTOM_ROTATE)
         }

     }

     moveForward(e) {
        //  var t = this.viewer.camera,
        //      i = t.direction,
        //      r = Cesium.Cartesian3.normalize(t.position, new Cesium.Cartesian3),
        //      n = Cesium.Cartesian3.cross(i, r, new Cesium.Cartesian3);
        //  i = Cesium.Cartesian3.cross(r, n, new Cesium.Cartesian3),
        //      i = Cesium.Cartesian3.normalize(i, i),
        //      i = Cesium.Cartesian3.multiplyByScalar(i, e, i),
        //      t.position = Cesium.Cartesian3.add(t.position, i, t.position)
        this.viewer.camera.moveForward(e)
     }

     cameraFunc(e) {
         var t = this.viewer.camera,
             i = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(t.position).height,
             r =Math.abs(i / this.l);
         this.flags.moveForward && this.moveForward(r),
             this.flags.moveBackward && this.moveForward(-r),
             this.flags.moveUp && t.moveUp(r),
             this.flags.moveDown && t.moveDown(r),
             this.flags.moveLeft && t.moveLeft(r),
             this.flags.moveRight && t.moveRight(r)
     }

     resetCameraPos(e) {
         e && (this.viewer.scene.camera.position = e.position,
             this.viewer.scene.camera.direction = e.direction,
             this.viewer.scene.camera.right = e.right,
             this.viewer.scene.camera.up = e.up)
     }

     limitAngle(e, t, i) {
         var r = Cesium.Cartesian3.dot(e, Cesium.Cartesian3.normalize(t, new Cesium.Cartesian3));
         return !("up" == i && r < this.h) && !("down" == i && r > this.d)
     }

     getCenter1(){
         let scene = this.viewer.scene;
         let camera = this.viewer.camera;
        var windowPosition = new Cesium.Cartesian2();
        var centerScratch = new Cesium.Cartesian3();
        windowPosition.x = scene.canvas.clientWidth / 2;
        windowPosition.y = scene.canvas.clientHeight / 2;
        var center = camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid, centerScratch);
        return center;

     }


     getCenter(e, t) {
        var i = e.scene
          , r = this.m(i)
          , n = r;
        if (!Cesium.defined(n)) {
            var a = i.globe
              , s = i.camera.positionCartographic.clone()
              , l = a.getHeight(s);
            s.height = l || 0,
            n = Cesium.Ellipsoid.WGS84.cartographicToCartesian(s)
        }
        var u = this.o(n);       
        return u ;
    }

    m(e) {
        var t = e.canvas
          , i = new Cesium.Cartesian2(t.clientWidth / 2,t.clientHeight / 2)
          , r = e.camera.getPickRay(i);
        return e.globe.pick(r, e) || e.camera.pickEllipsoid(i)
    }

     o(e) {
        var t = Cesium.Cartographic.fromCartesian(e)
          , i = {};
        return i.y = this.n(Cesium.Math.toDegrees(t.latitude), 6),
        i.x = this.n(Cesium.Math.toDegrees(t.longitude), 6),
        i.z = this.n(t.height, 2),
        i
    }

    n(e, t) {
        return Number(e.toFixed(t || 0))
    }

     computedNewPos(e, t, i) {
         var r = e.position,
             n = this.getCenter(this.viewer);
         if (n) {
             var o = Cesium.Cartesian3.fromDegrees(n.x, n.y, n.z);
           
             if (o) {
                 var l = Cesium.Cartesian3.distance(o, r),
                     u = l / 100;
                 u = i ? u * this.c : u;
                 var h = {},
                     d = new Cesium.Ray(r, t);
                 if (h.position = Cesium.Ray.getPoint(d, u),
                     h.direction = e.direction,
                     h.right = e.right,
                     h.up = e.up,
                     i) {
                     var f = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(h.position, o, new Cesium.Cartesian3), new Cesium.Cartesian3);
                     d = new Cesium.Ray(o, f),
                         h.position = Cesium.Ray.getPoint(d, l),
                         h.direction = Cesium.Cartesian3.negate(f, new Cesium.Cartesian3),
                         h.up = Cesium.Cartesian3.normalize(h.position, new Cesium.Cartesian3),
                         h.right = Cesium.Cartesian3.cross(h.direction, h.up, new Cesium.Cartesian3)
                 }
                 return h
             }
         }
     }

     moveCamera(e) {
         var t, i = this.viewer.scene.camera;
         switch (e) {
             case f.ENLARGE:
                 t = this.computedNewPos(i, i.direction);
                 break;
             case f.NARROW:
                 t = this.computedNewPos(i, Cesium.Cartesian3.negate(i.direction, new Cesium.Cartesian3));
                 break;
             case f.LEFT_ROTATE:
                 t = this.computedNewPos(i, Cesium.Cartesian3.negate(i.right, new Cesium.Cartesian3), !0);
                 break;
             case f.RIGHT_ROTATE:
                 t = this.computedNewPos(i, i.right, !0);
                 break;
             case f.TOP_ROTATE:
                 var r = this.limitAngle(Cesium.clone(i.up), Cesium.clone(i.position), "up");
                 if (!r)
                     return;
                 t = this.computedNewPos(i, Cesium.clone(i.up), !0);
                 break;
             case f.BOTTOM_ROTATE:
                 var r = this.limitAngle(Cesium.clone(i.up), Cesium.clone(i.position), "down");
                 if (!r)
                     return;
                 t = this.computedNewPos(i, Cesium.Cartesian3.negate(i.up, new Cesium.Cartesian3), !0)
         }
         t && this.resetCameraPos(t)
     }

     rotateCamera(e) {
         var t = [0, 0],
             i = this.viewer.scene.canvas.clientWidth,
             r = this.viewer.scene.canvas.clientHeight,
             n = (i + r) / this.u;
         switch (e) {
             case f.LEFT_ROTATE:
                 t = [-n * i / r, 0];
                 break;
             case f.RIGHT_ROTATE:
                 t = [n * i / r, 0];
                 break;
             case f.TOP_ROTATE:
                 t = [0, n];
                 break;
             case f.BOTTOM_ROTATE:
                 t = [0, -n];
                 break;
             default:
                 return
         }
         var o = t[0] / i,
             s = t[1] / r,
             l = this.viewer.camera;
         l.lookRight(.05 * o),
             l.lookUp(.05 * s);
         var c = l.direction,
             h = Cesium.Cartesian3.normalize(l.position, new Cesium.Cartesian3),
             d = Cesium.Cartesian3.cross(c, h, new Cesium.Cartesian3);
         h = Cesium.Cartesian3.cross(d, c, new Cesium.Cartesian3),
             l.up = h,
             l.right = d
     }

     get enable() {
         return this._enable
     }
     set enable(e) {
         e ? this.bind(): this.unbind() ;
     }


 }
 export default KeyboardNavigation;