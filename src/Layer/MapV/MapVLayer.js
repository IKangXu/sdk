import CombineMapV from './CombineMapV';

var GeoMapV = require('./MapV.min')
/**
 * 需要用户创建的类</br>
 *  MapV复合可视化，搭建了球和MapV之间的桥梁，具体MapV应用请参见MapV官网（https://mapv.baidu.com/）</br>
 * @see <a href='../../../examples/gallery/editor.html#honeyComb'>蜂巢网格</a> 
 * @see <a href='../../../examples/gallery/editor.html#migrate'>迁徙图</a> 
 * @see <a href='../../../examples/gallery/editor.html#weiboPoint'>微博点</a> 
 * @see <a href='../../../examples/gallery/editor.html#migrateAll'>数据链路</a> 
 * @see <a href='../../../examples/gallery/editor.html#square'>方形网格</a> 
 */
export class MapVLayer {

    constructor(mapvOpt) {

        this._id = Cesium.createGuid();;
        this._MapV = null;
        this._show = true;
        this._MapVOptions = mapvOpt
    }

    get show() {
        return this._show
    }
    set show(value) {
        if (value) {
            this._MapV.show()
        } else {
            this._MapV.hide()
        }
        this._show = value;
    }
    /**
     * 初始化mapv
     * @param viewer 
     */
    addToMap(viewer) {
        this._viewer = viewer;
        console.log(viewer)
        this._initMapv()
    }
    /**
     * 销毁mapv
     */
    destroyItem() {
        this._MapV.destroy()
    }
    /**
     * 获取mapv参数
     */
    getMapVOpt() {
        return this._MapVOptions;
    }

    /**
     * mpv更新
     * @param mapvOpt 
     */
    update(mapvOpt) {
        this._MapVOptions = mapvOpt;
        if (this._MapV) {
            this.destroyItem()
        }
        this._initMapv()
    }

    /**
     * 通过数据创建Mapv
     * @param options
     */
    create(options) {
        this._MapVOptions = options
        let dataSet = this.createDataSet(this._MapVOptions.data)
        return this._MapV = new CombineMapV(this._viewer, dataSet, this._MapVOptions.options);
    }
    /**
     * 创建数据集
     * @public
     * @param [data] 包含初始数据的可选数组
     */
    createDataSet(data) {
        return new GeoMapV.DataSet(data)
    }

    _initMapv() {
        if (!this._MapVOptions) return;
        this.create(this._MapVOptions)
    }

    _DataSetAdd(data, senderId) {
        return new GeoMapV.DataSet.add(data, senderId)
    }

    _DataSetReset() {
        return new GeoMapV.DataSet.reset()
    }

    _DataSetGet(args) {
        return new GeoMapV.DataSet.get(args)
    }
    _DataSetSet(args) {
        return new GeoMapV.DataSet.set(args)
    }
    _DataSetClear(args) {
        return new GeoMapV.DataSet.clear(args)
    }
    _DataSetRemove(args) {
        return new GeoMapV.DataSet.remove(args)
    }
    _DataSetUpdate(args, condition) {
        return new GeoMapV.DataSet.update(args, condition)
    }
    _DataSetTransferCoordinate(data, transferFn, fromColumn, toColumnName) {
        return new GeoMapV.DataSet.transferCoordinate(data, transferFn, fromColumn, toColumnName)
    }
    _DataSetinitGeometry(transferFn) {
        return new GeoMapV.DataSet.initGeometry(transferFn)
    }
    _DataSetGetMax(columnName) {
        return new GeoMapV.DataSet.getMax(columnName)
    }
    _DataSetGetSum(columnName) {
        return new GeoMapV.DataSet.getSum(columnName)
    }
    _DataSetGetMin(columnName) {
        return new GeoMapV.DataSet.getMin(columnName)
    }
    _DataSetUnique(columnName) {
        return new GeoMapV.DataSet.getUnique(columnName)
    }
    /**
     * 获取   
     * @param data 
     */
    _getDataSet(data) {
        return new GeoMapV.geojson.getDataSet(data)
    }
    /**
     * 根据弧线的坐标节点数组
     * @param data 
     */
    _getCurvePoints(data) {
        return new GeoMapV.utilCurve.getPoints(data)
    }
    /**
     * 获取城市中心坐标点
     * @param name 
     */
    _getCenterByCityName(name) {
        let coordinate = new GeoMapV.utilCityCenter.getCenterByCityName(name)
        if (coordinate.lng === undefined) {
            return undefined
        } else {
            return coordinate
        }
    }
    /**
     * 根据城市名获取省份
     * @param name 
     */
    _getProvinceNameByCityName(name) {
        return new GeoMapV.utilCityCenter.getProvinceNameByCityName(name)
    }

    get utilCurve() {
        return {
            getPoints: this._getCurvePoints
        }
    };
    get utilCityCenter() {
        return {
            getCenterByCityName: this._getCenterByCityName,
            getProvinceNameByCityName: this._getProvinceNameByCityName
        }
    }
    get geojson() {
        return {
            getDataSet: this._getDataSet
        }
    }
    /**
     * 数据集操作方法
     */
    get DataSet() {
        return {
            add: this._DataSetAdd,
            Reset: this._DataSetReset,
            get: this._DataSetGet,
            set: this._DataSetSet,
            clear: this._DataSetClear,
            remove: this._DataSetRemove,
            update: this._DataSetUpdate,
            transferCoordinate: this._DataSetTransferCoordinate,
            initGeometry: this._DataSetinitGeometry,
            getMax: this._DataSetGetMax,
            getSum: this._DataSetGetSum,
            getMin: this._DataSetGetMin,
            getUnique: this._DataSetUnique
        }

    }
}
/**
 * 需要用户创建的类</br>
 * MapV参数类</br>
 * @see <a href='../../../examples/gallery/editor.html#honeyComb'>蜂巢网格</a> 
 * @see <a href='../../../examples/gallery/editor.html#migrate'>迁徙图</a> 
 * @see <a href='../../../examples/gallery/editor.html#weiboPoint'>微博点</a> 
 * @see <a href='../../../examples/gallery/editor.html#migrateAll'>数据链路</a> 
 * @see <a href='../../../examples/gallery/editor.html#square'>方形网格</a> 
 */
export class MapVOpt {

    constructor(data, options) {
        this.data = data
        this.options = options
    }
}