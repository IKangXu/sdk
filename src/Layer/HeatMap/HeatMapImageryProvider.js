
import h337 from './BaseHeatMap'
/*global define*/
let Credit = Cesium.Credit;
let defaultValue = Cesium.defaultValue;
let defined = Cesium.defined;
let DeveloperError = Cesium.DeveloperError;

export default class HeatmapImageryProvider {
    constructor(options) {
        this.fun(options);
    }


    /**
     * Provides a single, top-level imagery tile.  The single image is assumed to use a
     * {@link GeographicTilingScheme}.
	 
     *
     * @alias HeatmapImageryProvider
     * @constructor
     *
     * @param {Object} options Object with the following properties:
     * @param {Object} [options.heatmapoptions] Optional heatmap.js options to be used .
     * @param {Object} [options.bounds] The bounding box for the heatmap in WGS84 coordinates.
     * @param {Number} [options.bounds.north] The northernmost point of the heatmap.
     * @param {Number} [options.bounds.south] The southernmost point of the heatmap.
     * @param {Number} [options.bounds.west] The westernmost point of the heatmap.
     * @param {Number} [options.bounds.east] The easternmost point of the heatmap.
     * @param {Object} [options.data] Data to be used for the heatmap.
     * @param {Object} [options.data.min] Minimum allowed point value.
     * @param {Object} [options.data.max] Maximum allowed point value.
     * @param {Array} [options.data.points] The data points for the heatmap containing x=lon, y=lat and value=number.
     *
     */
    fun(options) {
        options = defaultValue(options, {});
        var bounds = options.bounds;
        var data = options.data;

        if (!defined(bounds)) {
            throw new DeveloperError('options.bounds is required.');
        } else if (!defined(bounds.north) || !defined(bounds.south) || !defined(bounds.east) || !defined(bounds.west)) {
            throw new DeveloperError('options.bounds.north, options.bounds.south, options.bounds.east and options.bounds.west are required.');
        }

        if (!defined(data)) {
            throw new DeveloperError('data is required.');
        } else if (!defined(data.min) || !defined(data.max) || !defined(data.points)) {
            throw new DeveloperError('options.bounds.north, bounds.south, bounds.east and bounds.west are required.');
        }

        this._wmp = new Cesium.WebMercatorProjection();
        this._mbounds = this.wgs84ToMercatorBB(bounds);
        this._options = defaultValue(options.heatmapoptions, {});
        this._options.gradient = defaultValue(this._options.gradient, { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" });

        this.setWidthAndHeight(this._mbounds);
        this._options.radius = Math.round(defaultValue(this._options.radius, ((this.width > this.height) ? this.width / 60 : this.height / 60)));

        this._spacing = this._options.radius * 1.5;
        this._xoffset = this._mbounds.west;
        this._yoffset = this._mbounds.south;

        this.width = Math.round(this.width + this._spacing * 2);
        this.height = Math.round(this.height + this._spacing * 2);

        this._mbounds.west -= this._spacing * this._factor;
        this._mbounds.east += this._spacing * this._factor;
        this._mbounds.south -= this._spacing * this._factor;
        this._mbounds.north += this._spacing * this._factor;

        this.bounds = this.mercatorToWgs84BB(this._mbounds);

        this._container = this.getContainer(this.width, this.height);
        this._options.container = this._container;
        this._heatmap = h337.create(this._options);
        this._canvas = this._container.children[0];

        this._tilingScheme = new Cesium.WebMercatorTilingScheme({
            rectangleSouthwestInMeters: new Cesium.Cartesian2(this._mbounds.west, this._mbounds.south),
            rectangleNortheastInMeters: new Cesium.Cartesian2(this._mbounds.east, this._mbounds.north)
        });

        var image = this._image = this._canvas;
        this._originalImage = this._canvas;
        this._texture = undefined;
        this._tileWidth = this.width;
        this._tileHeight = this.height;
        this._ready = false; 
	        
	        

        if (options.data) {
            this._ready = this.setWGS84Data(options.data.min, options.data.max, options.data.points);
        }

        var that = this;
        var error;

        function success(image) {
            if (image instanceof HTMLVideoElement) {
                that._dynamic = true;
                that._dynamicTime = image.currentTime;
            }
            that._ready = true;
            that._readyPromise.resolve(true);
            Cesium.TileProviderError.handleSuccess(that._errorEvent);
        }

        function failure(e) {
            var location = '';
            if (typeof image === 'string') {
                location = ' ' + image;
            }
            var message = 'Failed to load image ' + location + '.';
            error = Cesium.TileProviderError.handleError(error, that, that._errorEvent, message, 0, 0, 0, doRequest, e);
            that._readyPromise.reject(new RuntimeError(message));
        }

        this.getImage(that, image).then(success).otherwise(failure);

    };

    get url() {
        return this._url;
    }

    get tileWidth() {
        if (!this._ready) {
            throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
        }

        return this._tileWidth;
    }

    get tileHeight() {
        if (!this._ready) {
            throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
        }

        return this._tileHeight;
    }
    get maximumLevel() {
        if (!this._ready) {
            throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
        }

        return 0;
    }
    get minimumLevel() {
        if (!this._ready) {
            throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
        }

        return 0;

    }
    get tilingScheme() {
        if (!this._ready) {
            throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
        }

        return this._tilingScheme;

    }

    get rectangle() {
        return this._tilingScheme.rectangle;//TODO: change to custom rectangle?

    }
    get tileDiscardPolicy() {
        if (!this._ready) {
            throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
        }

        return undefined;
    }

    get errorEvent() {
        return this._errorEvent;
    }

    get ready() {
        return this._ready;
    }

    get credit() {
        return this._credit;
    }

    get hasAlphaChannel() {
        return true;
    }


    getImage(that, image) {
        function success(imageObj) {
            that._image = imageObj;
            that._tileWidth = imageObj.width;
            that._tileHeight = imageObj.height;
        }
        success(image);
        return Cesium.when(image);
    }

    setWidthAndHeight(mbb) {
        var maxCanvasSize = 2000;
        var minCanvasSize = 700;
        this.width = ((mbb.east > 0 && mbb.west < 0) ? mbb.east + Math.abs(mbb.west) : Math.abs(mbb.east - mbb.west));
        this.height = ((mbb.north > 0 && mbb.south < 0) ? mbb.north + Math.abs(mbb.south) : Math.abs(mbb.north - mbb.south));
        this._factor = 1;

        if (this.width > this.height && this.width > maxCanvasSize) {
            this._factor = this.width / maxCanvasSize;

            if (this.height / this._factor < minCanvasSize) {
                this._factor = this.height / minCanvasSize;
            }
        } else if (this.height > this.width && this.height > maxCanvasSize) {
            this._factor = this.height / maxCanvasSize;

            if (this.width / this._factor < minCanvasSize) {
                this._factor = this.width / minCanvasSize;
            }
        } else if (this.width < this.height && this.width < minCanvasSize) {
            this._factor = this.width / minCanvasSize;

            if (this.height / this._factor > maxCanvasSize) {
                this._factor = this.height / maxCanvasSize;
            }
        } else if (this.height < this.width && this.height < minCanvasSize) {
            this._factor = this.height / minCanvasSize;

            if (this.width / this._factor > maxCanvasSize) {
                this._factor = this.width / maxCanvasSize;
            }
        }

        this.width = this.width / this._factor;
        this.height = this.height / this._factor;
    };

    getContainer(width, height, id) {
        var c = document.createElement("div");
        if (id) { c.setAttribute("id", id); }
        c.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 0px; display: none;");
        document.body.appendChild(c);
        return c;
    };

    /**
     * Convert a WGS84 location into a Mercator location.
     *
     * @param {Object} point The WGS84 location.
     * @param {Number} [point.x] The longitude of the location.
     * @param {Number} [point.y] The latitude of the location.
     * @returns {Cesium.Cartesian3} The Mercator location.
     */
    wgs84ToMercator(point) {
        return this._wmp.project(Cesium.Cartographic.fromDegrees(point.x, point.y));
    };

    /**
     * Convert a WGS84 bounding box into a Mercator bounding box.
     *
     * @param {Object} bounds The WGS84 bounding box.
     * @param {Number} [bounds.north] The northernmost position.
     * @param {Number} [bounds.south] The southrnmost position.
     * @param {Number} [bounds.east] The easternmost position.
     * @param {Number} [bounds.west] The westernmost position.
     * @returns {Object} The Mercator bounding box containing north, south, east and west properties.
     */
    wgs84ToMercatorBB(bounds) {
        var ne = this._wmp.project(Cesium.Cartographic.fromDegrees(bounds.east, bounds.north));
        var sw = this._wmp.project(Cesium.Cartographic.fromDegrees(bounds.west, bounds.south));
        return {
            north: ne.y,
            south: sw.y,
            east: ne.x,
            west: sw.x
        };
    };

    /**
     * Convert a mercator location into a WGS84 location.
     *
     * @param {Object} point The Mercator lcation.
     * @param {Number} [point.x] The x of the location.
     * @param {Number} [point.y] The y of the location.
     * @returns {Object} The WGS84 location.
     */
    mercatorToWgs84(p) {
        var wp = this._wmp.unproject(new Cesium.Cartesian3(p.x, p.y));
        return {
            x: wp.longitude,
            y: wp.latitude
        };
    };

    /**
     * Convert a Mercator bounding box into a WGS84 bounding box.
     *
     * @param {Object} bounds The Mercator bounding box.
     * @param {Number} [bounds.north] The northernmost position.
     * @param {Number} [bounds.south] The southrnmost position.
     * @param {Number} [bounds.east] The easternmost position.
     * @param {Number} [bounds.west] The westernmost position.
     * @returns {Object} The WGS84 bounding box containing north, south, east and west properties.
     */
    mercatorToWgs84BB(bounds) {
        var sw = this._wmp.unproject(new Cesium.Cartesian3(bounds.west, bounds.south));
        var ne = this._wmp.unproject(new Cesium.Cartesian3(bounds.east, bounds.north));
        return {
            north: this.rad2deg(ne.latitude),
            east: this.rad2deg(ne.longitude),
            south: this.rad2deg(sw.latitude),
            west: this.rad2deg(sw.longitude)
        };
    };

    /**
     * Convert degrees into radians.
     *
     * @param {Number} degrees The degrees to be converted to radians.
     * @returns {Number} The converted radians.
     */
    deg2rad(degrees) {
        return (degrees * (Math.PI / 180.0));
    };

    /**
     * Convert radians into degrees.
     *
     * @param {Number} radians The radians to be converted to degrees.
     * @returns {Number} The converted degrees.
     */
    rad2deg(radians) {
        return (radians / (Math.PI / 180.0));
    };

    /**
     * Convert a WGS84 location to the corresponding heatmap location.
     *
     * @param {Object} point The WGS84 location.
     * @param {Number} [point.x] The longitude of the location.
     * @param {Number} [point.y] The latitude of the location.
     * @returns {Object} The corresponding heatmap location.
     */
    wgs84PointToHeatmapPoint(point) {
        return this.mercatorPointToHeatmapPoint(this.wgs84ToMercator(point));
    };

    /**
     * Convert a mercator location to the corresponding heatmap location.
     *
     * @param {Object} point The Mercator lcation.
     * @param {Number} [point.x] The x of the location.
     * @param {Number} [point.y] The y of the location.
     * @returns {Object} The corresponding heatmap location.
     */
    mercatorPointToHeatmapPoint(point) {
        var pn = {};

        pn.x = Math.round((point.x - this._xoffset) / this._factor + this._spacing);
        pn.y = Math.round((point.y - this._yoffset) / this._factor + this._spacing);
        pn.y = this.height - pn.y;

        return pn;
    };

    /**
     * Set an array of heatmap locations.
     *
     * @param {Number} min The minimum allowed value for the data points.
     * @param {Number} max The maximum allowed value for the data points.
     * @param {Array} data An array of data points with heatmap coordinates(x, y) and value
     * @returns {Boolean} Wheter or not the data was successfully added or failed.
     */
    setData(min, max, data) {
        if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
            this._heatmap.setData({
                min: min,
                max: max,
                data: data
            });

            return true;
        }

        return false;
    };

    /**
     * Set an array of WGS84 locations.
     *
     * @param {Number} min The minimum allowed value for the data points.
     * @param {Number} max The maximum allowed value for the data points.
     * @param {Array} data An array of data points with WGS84 coordinates(x=lon, y=lat) and value
     * @returns {Boolean} Wheter or not the data was successfully added or failed.
     */
    setWGS84Data(min, max, data) {
        if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
            var convdata = [];

            for (var i = 0; i < data.length; i++) {
                var gp = data[i];

                var hp = this.wgs84PointToHeatmapPoint(gp);
                if (gp.value || gp.value === 0) { hp.value = gp.value; }

                convdata.push(hp);
            }
            var result = this.setData(min, max, convdata);
            this.reload();

            return result;
        }

        return false;
    };

    reload() {
        if (defined(this._reload)) {
            if (this._dynamic) {
                var currentTime = this._image.currentTime;
                if (Math.abs(this._dynamicTime - currentTime) < frameDiff) {
                    return;
                }
                this._dynamicTime = currentTime;
            }

            this.getImage(this, this._originalImage).then(this._reload);
        }
    }
    /**
     * Gets the credits to be displayed when a given tile is displayed.
     *
     * @param {Number} x The tile X coordinate.
     * @param {Number} y The tile Y coordinate.
     * @param {Number} level The tile level;
     * @returns {Credit[]} The credits to be displayed when the tile is displayed.
     *
     * @exception {DeveloperError} <code>getTileCredits</code> must not be called before the imagery provider is ready.
     */
    getTileCredits(x, y, level) {
        return undefined;
    };

    /**
     * Requests the image for a given tile.  This function should
     * not be called before {@link HeatmapImageryProvider#ready} returns true.
     *
     * @param {Number} x The tile X coordinate.
     * @param {Number} y The tile Y coordinate.
     * @param {Number} level The tile level.
     * @returns {Promise} A promise for the image that will resolve when the image is available, or
     *          undefined if there are too many active requests to the server, and the request
     *          should be retried later.  The resolved image may be either an
     *          Image or a Canvas DOM object.
     *
     * @exception {DeveloperError} <code>requestImage</code> must not be called before the imagery provider is ready.
     */
    requestImage(x, y, level) {
        if (!this._ready) {
            throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
        }

        return this._image;
    };

    /**
     * Picking features is not currently supported by this imagery provider, so this function simply returns
     * undefined.
     *
     * @param {Number} x The tile X coordinate.
     * @param {Number} y The tile Y coordinate.
     * @param {Number} level The tile level.
     * @param {Number} longitude The longitude at which to pick features.
     * @param {Number} latitude  The latitude at which to pick features.
     * @return {Promise} A promise for the picked features that will resolve when the asynchronous
     *                   picking completes.  The resolved value is an array of {@link ImageryLayerFeatureInfo}
     *                   instances.  The array may be empty if no features are found at the given location.
     *                   It may also be undefined if picking is not supported.
     */
    pickFeatures() {
        return undefined;
    };

    
}

