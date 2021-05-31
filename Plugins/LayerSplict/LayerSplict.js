class LayerSplict extends CTMap.Tool {
    reference() {
        this.html = "./layerSplict.html";
    }
    init() {
        this.layerSplict = {};
        let _update = this._update;
        this.earth.imageryLayers.layerAdded.addEventListener(_update, this);
        this.earth.imageryLayers.layerRemoved.addEventListener(_update, this);
        this.earth.imageryLayers.layerMoved.addEventListener(_update, this);
        this._add();
    }
    _add() {
        let earth = this.earth;
        let camera = earth.camera;
        camera.moveEnd.addEventListener(this._judgeMethod, this);
        this._judgeMethod();
        let slider = document.getElementById("slider");
        slider.onmouseover = function () {
            slider.style.cursor = "ew-resize";
        };
        slider.onmouseout = function () {
            slider.style.cursor = "auto";
        };
        let sliderHeight = this.earth.container.clientHeight;
        slider.style =
            "position: absolute;left: 50%;top: 0px;background-color: #4091ff;width: 5px;z-index: 0;";
        slider.style.height = sliderHeight + "px";
        this.earth.scene.imagerySplitPosition =
            slider.offsetLeft / slider.parentElement.offsetWidth;
        let handler = new CTMap.ScreenSpaceEventHandler(slider);

        let moveActive = false;
        let that = this;

        let move = (movement) => {
            if (!moveActive) {
                return;
            }

            let relativeOffset = movement.endPosition.x;
            let splitPosition =
                (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
            slider.style.left = 100.0 * splitPosition + "%";
            that.earth.scene.imagerySplitPosition = splitPosition;
        }

        handler.setInputAction(function () {
            moveActive = true;
        }, CTMap.ScreenSpaceEventType.LEFT_DOWN);
        handler.setInputAction(function () {
            moveActive = true;
        }, CTMap.ScreenSpaceEventType.PINCH_START);

        handler.setInputAction(move, CTMap.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(move, CTMap.ScreenSpaceEventType.PINCH_MOVE);

        handler.setInputAction(function () {
            moveActive = false;
        }, CTMap.ScreenSpaceEventType.LEFT_UP);
        handler.setInputAction(function () {
            moveActive = false;
        }, CTMap.ScreenSpaceEventType.PINCH_END);
        this.layerSplict.slider = slider;
        this.layerSplict.handler = handler;
    }
    remove() {
        let layerSplict = this.layerSplict;
        // this.earth.imageryLayers.remove(this.earth.imageryLayers._layers[1])
        if (layerSplict.handler) {
            layerSplict.handler.destroy();
        }
        let _update = this._update;
        this.earth.imageryLayers.layerAdded.removeEventListener(_update, this);
        this.earth.imageryLayers.layerRemoved.removeEventListener(_update, this);
        this.earth.imageryLayers.layerMoved.removeEventListener(_update, this);
        if (layerSplict.selectLayer) {
            layerSplict.selectLayer.splitDirection = CTMap.ImagerySplitDirection.NONE;
        }
        this.earth.camera.moveEnd.removeEventListener(this._judgeMethod, this)
    }
    _judgeMethod() {
        let earth = this.earth;
        let width = earth.canvas.width;
        let height = earth.canvas.height;
        let pick1 = new CTMap.Cartesian2(width / 2, height / 2);
        let cartesian = earth.scene.globe.pick(
            earth.camera.getPickRay(pick1),
            earth.scene
        );
        let layerLength = earth.imageryLayers._layers.length;
        if (!cartesian) {
            let layers = earth.imageryLayers._layers;
            for (let layer of layers) {
                layer.splitDirection = CTMap.ImagerySplitDirection.NONE;
            }
            this.layerSplict.selectLayer =
                earth.imageryLayers._layers[layerLength - 1];
        } else {
            let ellipsoid = earth.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian);
            let lon = cartographic.longitude;
            let lat = cartographic.latitude;
            let layers = earth.imageryLayers._layers;
            this.layerSplict.selectLayer = null;
            for (let layer of layers) {
                if (layer.imageryProvider.name == 'Graticule') {
                    let layerLength = layers.length;
                    if (layer._layerIndex == layerLength - 1) {
                        this.layerSplict.selectLayer = earth.imageryLayers._layers[layerLength - 2];
                    } else {
                        this.layerSplict.selectLayer = earth.imageryLayers._layers[layerLength - 1];
                    }
                    this.layerSplict.selectLayer.splitDirection = CTMap.ImagerySplitDirection.LEFT;
                    return 1;
                }
                try {
                    layer.getViewableRectangle().then(rectangle => {
                        if (
                            lon > rectangle.west &&
                            lon < rectangle.east &&
                            lat > rectangle.south &&
                            lat < rectangle.north
                        ) {
                            this.layerSplict.selectLayer = layer;
                        }
                    })
                } catch (err) {
                    console.error(err)
                }

            }
            for (let layer of layers) {
                layer.splitDirection = CTMap.ImagerySplitDirection.NONE;
            }
        }
        if (!this.layerSplict.selectLayer) {
            let layerLength = earth.imageryLayers._layers.length;
            this.layerSplict.selectLayer = earth.imageryLayers._layers[layerLength - 1];
        }
        this.layerSplict.selectLayer.splitDirection = CTMap.ImagerySplitDirection.LEFT;
    }
    _update() {
        if (!this._judgeMethod()) {
            let layerLength = earth.imageryLayers._layers.length;
            this.layerSplict.selectLayer =
                earth.imageryLayers._layers[layerLength - 1];
            return;
        }
        this._judgeMethod();
    }
}

//# sourceURL=LyaerSplict.js
