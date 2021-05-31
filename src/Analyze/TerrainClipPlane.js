export default class TerrainClipPlane {
 
    constructor(viewer, opt) {
        this.viewer = viewer;
        this.options = opt || {};
        this._positions = opt.positions;
        this._height = this.options.height || 0;
        this.bottomImg = opt.bottomImg;
        this.wallImg = opt.wallImg;
        this.splitNum = Cesium.defaultValue(opt.splitNum, 50);
        this._positions && this._positions.length > 0 && this.updateData(this._positions);
        this.excavateMinHeight = 99999;
    }

    get show() {
        return this._show
    }
    set show(val) {
        this._show = val;
        if (this.viewer.scene.globe.clippingPlanes) {
            this.viewer.scene.globe.clippingPlanes.enabled = val;
            this._switchExcavate(val);
        }

    }

    get height() {
        return this._height
    }
    set height(val) {
        this._height = val
        this._updateExcavateDepth(val)
    }


    updateData(positions) {
        this.clear();

        var t = [],
            i = positions.length,
            a = new Cesium.Cartesian3,
            n = Cesium.Cartesian3.subtract(positions[0], positions[1], a);
        n = n.x > 0;
        this.excavateMinHeight = 9999;
        for (var r = 0; r < i; ++r) {
            var s = (r + 1) % i,
                l = Cesium.Cartesian3.midpoint(positions[r], positions[s], new Cesium.Cartesian3),
                u = Cesium.Cartographic.fromCartesian(positions[r]),
                c = this.viewer.scene.globe.getHeight(u) || u.height;
            c < this.excavateMinHeight && (this.excavateMinHeight = c);
            var d, h = Cesium.Cartesian3.normalize(l, new Cesium.Cartesian3);
            d = n ? Cesium.Cartesian3.subtract(positions[r], l, new Cesium.Cartesian3) : Cesium.Cartesian3.subtract(positions[s], l, new Cesium.Cartesian3), d = Cesium.Cartesian3.normalize(d, d);
            var f = Cesium.Cartesian3.cross(d, h, new Cesium.Cartesian3);
            f = Cesium.Cartesian3.normalize(f, f);
            var p = new Cesium.Plane(f, 0),
                m = Cesium.Plane.getPointDistance(p, l);
            t.push(new Cesium.ClippingPlane(f, m))
        }
        this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            modelMatrix: Cesium.Matrix4.IDENTITY,
            planes: t,
            edgeWidth: 1,
            edgeColor: Cesium.Color.RED,
            enabled: !0
        });
        this._prepareWell(positions);
        this._createWell(this.wellData)
    }

    _prepareWell(e) {
        var t = this.splitNum,
            i = e.length;
        if (0 != i) {
            for (var a = this.excavateMinHeight - this.height, n = [], r = [], s = [], l = 0; l < i; l++) {
                var u = l == i - 1 ? 0 : l + 1,
                    c = Cesium.Cartographic.fromCartesian(e[l]),
                    d = Cesium.Cartographic.fromCartesian(e[u]),
                    h = [c.longitude, c.latitude],
                    f = [d.longitude, d.latitude];

                0 == l && (
                    s.push(new Cesium.Cartographic(h[0], h[1])),
                    r.push(Cesium.Cartesian3.fromRadians(h[0], h[1], a)),
                    n.push(Cesium.Cartesian3.fromRadians(h[0], h[1], 0)));

                for (var p = 1; p <= t; p++) {
                    var m = Cesium.Math.lerp(h[0], f[0], p / t),
                        g = Cesium.Math.lerp(h[1], f[1], p / t);
                    l == i - 1 && p == t || (
                        s.push(new Cesium.Cartographic(m, g)),
                        r.push(Cesium.Cartesian3.fromRadians(m, g, a)),
                        n.push(Cesium.Cartesian3.fromRadians(m, g, 0)))
                }
            }
            this.wellData = {
                lerp_pos: s,
                bottom_pos: r,
                no_height_top: n
            }
        }
    }

    _createWell(e) {
        if (Boolean(this.viewer.terrainProvider._layers)) {
            var t = this;
            this._createBottomSurface(e.bottom_pos);
            var i = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, e.lerp_pos);
            Cesium.when(i, function (i) {
                for (var a = i.length, n = [], r = 0; r < a; r++) {
                    var s = Cesium.Cartesian3.fromRadians(i[r].longitude, i[r].latitude, i[r].height);
                    n.push(s)
                }
                t._createWellWall(e.bottom_pos, n)
            })
        } else {
            this._createBottomSurface(e.bottom_pos);
            this._createWellWall(e.bottom_pos, e.no_height_top)
        }
    }

    _getMinHeight(e) {
        let minHeight = 5000000;
        let minPoint = null;
        for (let i = 0; i < e.length; i++) {
            let height = e[i]['z'];
            if (height < minHeight) {
                minHeight = height;
                minPoint = this._ellipsoidToLonLat(e[i]);
            }
        }
        return minPoint.altitude;
    }

    _ellipsoidToLonLat(c) {
        let ellipsoid = this.viewer.scene.globe.ellipsoid;
        let cartesian3 = new Cesium.Cartesian3(c.x, c.y, c.z);
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let alt = cartographic.height;
        return {
            longitude: lng,
            latitude: lat,
            altitude: alt
        }
    }

    _createWellWall(e, t) {
        let minHeight = this._getMinHeight(e);
        let maxHeights = [];
        let minHeights = [];
        for (let i = 0; i < t.length; i++) {
            maxHeights.push(this._ellipsoidToLonLat(t[i]).altitude);
            minHeights.push(minHeight);
        }
        let wall = new Cesium.WallGeometry({
            positions: t,
            maximumHeights: maxHeights,
            minimumHeights: minHeights,
        });
        let geometry = Cesium.WallGeometry.createGeometry(wall);
        var a = new Cesium.Material({
                fabric: {
                    type: "Image",
                    uniforms: {
                        image: this.wallImg
                    }
                }
            }),
            n = new Cesium.MaterialAppearance({
                translucent: !1,
                flat: !0,
                material: a
            });
        this.wellWall = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geometry,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY)
                },
                id: "PitWall"
            }),
            appearance: n,
            asynchronous: !1
        }), this.viewer.scene.primitives.add(this.wellWall)
    }

    _createBottomSurface(e) {
        if (e.length) {
            let minHeight = this._getMinHeight(e);
            let positions = [];
            for (let i = 0; i < e.length; i++) {
                let p = this._ellipsoidToLonLat(e[i]);
                positions.push(p.longitude);
                positions.push(p.latitude);
                positions.push(minHeight);
            }

            let polygon = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArrayHeights(positions)
                ),
                perPositionHeight: true
            });
            let geometry = Cesium.PolygonGeometry.createGeometry(polygon);


            var i = new Cesium.Material({
                    fabric: {
                        type: "Image",
                        uniforms: {
                            image: this.bottomImg
                        }
                    }
                }),
                a = new Cesium.MaterialAppearance({
                    translucent: !1,
                    flat: !0,
                    material: i
                });
            this.bottomSurface = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geometry
                }),
                appearance: a,
                asynchronous: !1
            }), this.viewer.scene.primitives.add(this.bottomSurface)
        }
    }

    _switchExcavate(e) {
        e ? (this.viewer.scene.globe.material = Cesium.Material.fromType("WaJue"), this.wellWall.show = !0, this.bottomSurface.show = !0) : (this.viewer.scene.globe.material = null, this.wellWall.show = !1, this.bottomSurface.show = !1)
    }

    _updateExcavateDepth(e) {
        this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
        for (var t = this.wellData.lerp_pos, i = [], a = t.length, n = 0; n < a; n++) i.push(Cesium.Cartesian3.fromRadians(t[n].longitude, t[n].latitude, this.excavateMinHeight - e));
        this.wellData.bottom_pos = i;
        this._createWell(this.wellData);
        this.viewer.scene.primitives.add(this.bottomSurface);
        this.viewer.scene.primitives.add(this.wellWall);
    }



    /**
     * 清除
     */
    clear() {
        if(this.viewer.scene.globe.clippingPlanes){
            this.viewer.scene.globe.clippingPlanes.enabled = false;
            this.viewer.scene.globe.clippingPlanes.removeAll();
            this.viewer.scene.globe.clippingPlanes.isDestroyed() || this.viewer.scene.globe.clippingPlanes.destroy();
            this.viewer.scene.globe.clippingPlanes =null;
            this.viewer.scene.primitives.remove(this.bottomSurface);
            this.viewer.scene.primitives.remove(this.wellWall);
            this.bottomSurface = null;
            this.wellWall= null;
            this.viewer.scene.render();
        }
    }
}