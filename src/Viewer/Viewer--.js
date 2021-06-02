/*
 * 作者：zhuwz
 * 日期：2018.11.22
 */
//import CesiumNavigation from "cesium-navigation-es6";


class Viewer extends Cesium.Viewer {

    /**
     * @param {Element} container 地球初始化的div元素
     * @param {Object} [options] 地图配置属性
     * @param {String} [options.baseLayerPicker=false] 基础影像
     */
    constructor(container, options) {

        const defaultOptions = {
            shouldAnimate: true,
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            vrButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            navigation: true,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            contextOptions: {
                webgl: {
                    alpha: true,
                    depth: false,
                    stencil: true,
                    antialias: true,
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: true, //通过canvas.toDataURL()实现截图需要将该项设置为true
                    failIfMajorPerformanceCaveat: true
                },
                allowTextureFilterAnisotropic: true
            }
        }

        if (!options) {
            options = defaultOptions;
        } else {
            for (var key in defaultOptions) {
                if (!Cesium.defined(options[key])) {
                    options[key] = defaultOptions[key];
                }
            }
        }
        if (options.globe == false)
            options.imageryProvider = undefined;

        //构造函数
        super(container, options);
    }

}

export default Viewer
