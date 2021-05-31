
var MapV = require('./MapV.min')
var baiduMapLayer = MapV ? MapV.baiduMapLayer : null;
var BaseLayer = baiduMapLayer ? baiduMapLayer.__proto__ : Function;
var backAngle = Cesium.Math.toRadians(95);
var divId = 0;

class MapVRenderer extends BaseLayer {
	//========== 构造方法 ========== 
	constructor(t, e, i, n) {
		super(t, e, i)

		if (!BaseLayer) {
			return;
		}

		this.map = t,
			this.scene = t.scene,
			this.dataSet = e;
		i = i || {},
			this.init(i),
			this.argCheck(i),
			this.initDevicePixelRatio(),
			this.canvasLayer = n,
			this.stopAniamation = !1,
			this.animation = i.animation,
			this.clickEvent = this.clickEvent.bind(this),
			this.mousemoveEvent = this.mousemoveEvent.bind(this),
			this.bindEvent()

	}
	//========== 方法 ========== 
	initDevicePixelRatio() {
		this.devicePixelRatio = window.devicePixelRatio || 1
	}
	clickEvent(t) {
		var e = t.point;
		super.clickEvent(e, t)
	}
	mousemoveEvent(t) {
		var e = t.point;
		super.mousemoveEvent(e, t)
	}
	addAnimatorEvent() { }
	animatorMovestartEvent() {
		var t = this.options.animation;
		this.isEnabledTime() && this.animator && (this.steps.step = t.stepsRange.start)
	}
	animatorMoveendEvent() {
		this.isEnabledTime() && this.animator
	}
	bindEvent() {
		this.map;
		this.options.methods && (this.options.methods.click, this.options.methods.mousemove)
	}
	unbindEvent() {
		var t = this.map;
		this.options.methods && (this.options.methods.click && t.off("click", this.clickEvent), this.options.methods.mousemove && t.off("mousemove", this.mousemoveEvent))
	}
	getContext() {
		return this.canvasLayer.canvas.getContext(this.context)
	}
	init(t) {
		this.options = t
		this.initDataRange(t)
		this.context = this.options.context || "2d"

		if (this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex)
			this.canvasLayer.setZIndex(this.options.zIndex)

		this.initAnimator()
	}
	_canvasUpdate(t) {
		this.map;
		var e = this.scene;
		if (this.canvasLayer && !this.stopAniamation) {
			var i = this.options.animation,
				n = this.getContext();
			if (this.isEnabledTime()) {
				if (void 0 === t) return void this.clear(n);
				"2d" === this.context && (n.save(), n.globalCompositeOperation = "destination-out", n.fillStyle = "rgba(0, 0, 0, .1)", n.fillRect(0, 0, n.canvas.width, n.canvas.height), n.restore())
			} else this.clear(n);
			if ("2d" === this.context) for (var o in this.options) n[o] = this.options[o];
			else n.clear(n.COLOR_BUFFER_BIT);
			var canvasLayer = this.canvasLayer;
			var a = {
				transferCoordinate: function (t) {
					var defVal = [99999, 99999];

					//坐标转换
					var position = Cesium.Cartesian3.fromDegrees(t[0], t[1]);
					if (!position) {
						return defVal;
					}
					var px = e.cartesianToCanvasCoordinates(position);
					if (!px) {
						return defVal;
					}

					//判断是否在球的背面  
					if (e.mode === Cesium.SceneMode.SCENE3D) {
						var angle = Cesium.Cartesian3.angleBetween(e.camera.position, position);
						if (angle > backAngle) {
							//canvasLayer.hide();
							return defVal;
						}else{
							//canvasLayer.show();
						}
					}
					//判断是否在球的背面
				
					return [px.x, px.y]
				}
			};
			void 0 !== t && (a.filter = function (e) {
				var n = i.trails || 10;
				return !!(t && e.time > t - n && e.time < t)
			});
			var c = this.dataSet.get(a);
			this.processData(c), "m" == this.options.unit && this.options.size,
				this.options._size = this.options.size;
			var h = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, Cesium.Cartesian3.fromDegrees(0, 0));

			this.drawContext(n, new MapV.DataSet(c), this.options, h), this.options.updateCallback && this.options.updateCallback(t)
		}
	}
	updateData(t, e) {
		var i = t;
		i && i.get && (i = i.get()), void 0 != i && this.dataSet.set(i), super.update({
			options: e
		})
	}
	addData(t, e) {
		var i = t;
		t && t.get && (i = t.get()), this.dataSet.add(i), this.update({
			options: e
		})
	}
	getData() {
		return this.dataSet
	}
	removeData(t) {
		if (this.dataSet) {
			var e = this.dataSet.get({
				filter: function (e) {
					return null == t || "function" != typeof t || !t(e)
				}
			});
			this.dataSet.set(e), this.update({
				options: null
			})
		}
	}
	clearData() {
		this.dataSet && this.dataSet.clear(), this.update({
			options: null
		})
	}
	draw() {
		this.canvasLayer.draw()
	}
	clear(t) {
		t && t.clearRect && t.clearRect(0, 0, t.canvas.width, t.canvas.height)
	}
	/**
	 * @function MapVRenderer.prototype.destroy
	 * @description 释放资源。
	 */
	destroy() {
		this.unbindEvent();
		this.clear(this.getContext())
		this.clearData();
		this.animator && this.animator.stop();
		this.animator = null;
		this.canvasLayer = null;
	}
}

/**
 * @class MapVLayer
 * @classdesc MapV 图层。
 * @param {MapV.DataSet} dataSet - MapV 图层数据集。
 * @param {Object} MapVOptions - MapV 图层参数。
 * @param {Object} options - 参数。
 * @param {string} [options.attributionPrefix] - 版权信息前缀。
 * @param {string} [options.attribution='© 2018 百度 MapV'] - 版权信息。
 * @fires MapVLayer#loaded
 */
export default class MapVLayer {
	//========== 构造方法 ========== 
	constructor(t, e, i, n) {
		this.map = t, this.scene = t.scene, this.MapVBaseLayer = new MapVRenderer(t, e, i, this),
			this.MapVOptions = i,
			this.initDevicePixelRatio(),
			this.canvas = this._createCanvas(),
			this.render = this.render.bind(this),
			void 0 != n ? (this.container = n, n.appendChild(this.canvas)) : (this.container = t.container, this.addInnerContainer()),
			this.bindEvent(),
			this._reset()
	}
	//========== 方法 ========== 
	initDevicePixelRatio() {
		this.devicePixelRatio = window.devicePixelRatio || 1
	}
	addInnerContainer() {
		this.container.appendChild(this.canvas)
	}
	bindEvent() {
		//绑定cesium事件与MapV联动
		this.innerMoveStart = this.moveStartEvent.bind(this),
			this.innerMoveEnd = this.moveEndEvent.bind(this);
		this.scene.camera.moveStart.addEventListener(this.innerMoveStart, this);
		this.scene.camera.moveEnd.addEventListener(this.innerMoveEnd, this);
		//解决cesium有时 moveStart 后没有触发 moveEnd
		var handler = new Cesium.ScreenSpaceEventHandler(this.canvas);
		handler.setInputAction(event => {
			this.innerMoveEnd();
		}, Cesium.ScreenSpaceEventType.LEFT_UP);
		handler.setInputAction(event => {
			this.innerMoveEnd();
		}, Cesium.ScreenSpaceEventType.MIDDLE_UP);
		this.handler = handler;
	}
	unbindEvent() {
		this.scene.camera.moveStart.removeEventListener(this.innerMoveStart, this);
		this.scene.camera.moveEnd.removeEventListener(this.innerMoveEnd, this);
		this.scene.postRender.removeEventListener(this._reset, this);
		if (this.handler) {
			this.handler.destroy();
			this.handler = null;
		}
	}
	moveStartEvent() {
		this.MapVBaseLayer && this.MapVBaseLayer.animatorMovestartEvent();
		//this._unvisiable()
		this.scene.postRender.addEventListener(this._reset, this);
		// console.log('MapV moveStartEvent');
	}
	moveEndEvent() {
		this.scene.postRender.removeEventListener(this._reset, this);
		this.MapVBaseLayer && this.MapVBaseLayer.animatorMoveendEvent();
		this._reset();
		//this._visiable() 
		// console.log('MapV moveEndEvent');
	}
	zoomStartEvent() {
		this._unvisiable()
	}
	zoomEndEvent() {
		this._unvisiable()
	}
	addData(t, e) {
		void 0 != this.MapVBaseLayer && this.MapVBaseLayer.addData(t, e)
	}
	updateData(t, e) {
		void 0 != this.MapVBaseLayer && this.MapVBaseLayer.updateData(t, e)
	}
	getData() {
		return this.MapVBaseLayer && (this.dataSet = this.MapVBaseLayer.getData()), this.dataSet
	}
	removeData(t) {
		void 0 != this.MapVBaseLayer && this.MapVBaseLayer && this.MapVBaseLayer.removeData(t)
	}
	removeAllData() {
		void 0 != this.MapVBaseLayer && this.MapVBaseLayer.clearData()
	}
	_visiable() {
		return this.canvas.style.display = "block";
	}
	_unvisiable() {
		return this.canvas.style.display = "none";
	}
	_createCanvas() {
		var t = document.createElement("canvas");
		t.id = this.MapVOptions.layerid || "MapV" + divId++ , t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.pointerEvents = "none", t.style.zIndex = this.MapVOptions.zIndex || 100, t.width = parseInt(this.map.canvas.width), t.height = parseInt(this.map.canvas.height), t.style.width = this.map.canvas.style.width, t.style.height = this.map.canvas.style.height;
		var e = this.devicePixelRatio;
		return "2d" == this.MapVOptions.context && t.getContext(this.MapVOptions.context).scale(e, e), t
	}
	_reset() {
		this.resizeCanvas(), this.fixPosition(), this.onResize(), this.render()
	}
	draw() {
		this._reset()
	}
	show() {
		this._visiable()
	}
	hide() {
		this._unvisiable()
	}
	destroy() {//释放	
		this.unbindEvent();
		this.remove()
	}
	remove() {
		void 0 != this.MapVBaseLayer && (
			this.removeAllData(),
			this.MapVBaseLayer.destroy(),
			this.MapVBaseLayer = void 0,
			this.canvas.parentElement.removeChild(this.canvas))
	}
	update(t) {
		void 0 != t && this.updateData(t.data, t.options)
	}
	resizeCanvas() {
		if (void 0 != this.canvas && null != this.canvas) {
			var t = this.canvas;
			t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.width = parseInt(this.map.canvas.width), t.height = parseInt(this.map.canvas.height), t.style.width = this.map.canvas.style.width, t.style.height = this.map.canvas.style.height
		}
	}
	fixPosition() { }
	onResize() { }
	render() {
		void 0 != this.MapVBaseLayer && this.MapVBaseLayer._canvasUpdate()
	}
}