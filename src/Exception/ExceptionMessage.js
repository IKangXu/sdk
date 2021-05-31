/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */

'use strict';

export default {
    show_language: 'zh',

    //错误相关
    ERROR_PARAMS: {
        type: 'error',
        zh: '参数错误',
    },
    ERRAR_PARAMS_ONLY: {
        type: 'error',
        zh: '参数错误,只能是:',
    },
    ERROR_GVML_FILE_PARSE: {
        type: 'error',
        zh: 'Uninpho文件解析失败，请检查是否拼写错误。'
    },
    ERROR_GVML_FILE_READ: {
        type: 'error',
        zh: 'Uninpho文件读取失败，请检查路径是否错误。'
    },
    ERROR_PARAMS_BOOLEAN: {
        type: 'error',
        zh: '参数必须是布尔类型'
    },
    ERROR_PARAMS_FUNCTION: {
        type: 'error',
        zh: '参数不是一个有效的函数类型'
    },
    ERROR_ANIMATE_TYPE: {
        type: 'error',
        zh: '不是一个有效的动画类型'
    },
    UNDEFINED_PARENT_CONTAINER: {
        type: 'error',
        zh: '父容器未定义',
    },
    UNDEFINED_DOM: {
        type: 'error',
        zh: '页面未包含相应元素',
    },
    UNDEFINED_PLUGINPANEL: {
        type: 'error',
        zh: '未定义插件面板',
    },
    UNDEFINED_PLUGIN_TYPE: {
        type: 'error',
        zh: '未定义插件类型,必须指定,类型查看Uninpho.PluginType',
    },
    UNDEFINED_EXCEPTION: {
        type: 'error',
        zh: '未定义(undefined)异常',
    },
    UNDEFINED_PLUGIN: {
        type: 'error',
        zh: '未定义插件，请检查插件参数是否正确，或者提前注册该插件！',
    },
    ERROR_PLUGIN_TYPE: {
        type: 'error',
        zh: '插件类型指定错误,请检查自己的Uninpho数据是否错误',
    },
    ERROR_PLUGIN_URL: {
        type: 'error',
        zh: '错误插件路径，请检查路径是否指向真实插件路径'
    },
    ERROR_IMAGE_SOURCE: {
        type: 'error',
        zh: '未指定图层数据源或者图层数据源指定错误',
    },
    ERROR_BASEIMAGE_DEFINITION: {
        type: 'error',
        zh: '基础图层定义错误',
    },
    ERROR_POLYLINE_LENGTH: {
        type: 'error',
        zh: 'Polyline最少需要2个折点'
    },
    ERROR_POLYGON_LENGTH: {
        type: 'error',
        zh: '多边形最少需要3个折点'
    },
    centerMessage: {
        managerService: {
            error: {
                zh: '获取所有服务列表失败'
            }
        }
    },
    UNDEFINED_CACHE_OPTION_PARAM: {
        type: 'error',
        zh: 'CacheOption的driver设置有误，须为"filesystem"或"leveldb"',
    },

    //警告信息
    WARN_PARAMS_RANGE: {
        type: 'warn',
        zh: '参数范围错误:{0}  取值范围:{1} 单位或枚举:{2}, 使用默认参数 {3}',
    },

    WARN_PARAMS_RANGE_NONE: {
        type: 'warn',
        zh: '参数范围错误---参数:{0} 取值范围:{1}, 使用默认参数 {2}',
    },

    WARN_PARAMS_RANGE_NONEDEFAULT: {
        type: 'warn',
        zh: '参数范围错误---参数:{0} 取值范围:{1}',
    },

    WARN_PARAMS: {
        type: 'warn',
        zh: '参数:{0}--参数类型错误 参数类型:{1}, 使用默认参数 {2}',
    },

    WARN_PARAMS_NONE: {
        type: 'warn',
        zh: '参数类型错误---参数:{0} 参数类型:{1}',
    },
    // 传入参数不为颜色
    WARN_CORLOR: {
        type: 'warn',
        zh: '参数:{0}--参数类型错误,参数应为十六进制颜色#FFFFFFFF或#FFFFFF,使用默认参数:{1}'
    },

    //数组错误
    WARN_ARRAY_ELEMENT_TYPE: {
        type: 'warn',
        zh: '参数类型错误---参数:{0} 数组元素参数类型:{1},{2}元素类型为:{3}',
    },

    WARN_ARRAY_ELEMENT_PARAMS: {
        type: 'warn',
        zh: '参数类型错误---参数:{0} 数组元素取值范围错误',
    },

    WARN_ARRAY_LENGHT: {
        type: 'warn',
        zh: '参数类型错误---参数:{0},数组长度应{1}{2},当前数组长度为{3}',
    },

    WARN_ARRAY_LAYER_EXTENT: {
        type: 'warn',
        zh: '获取图层范围失败!',
        en: 'getExtent failed!'
    },

    //自定义，
    WARN_CUSTOM: {
        type: 'warn',
        zh: ''
    },

    //提醒

    // 插件提醒信息
    ADDED_PLUGIN: {
        type: 'warn',
        zh: '插件已经添加过了, 请不要重复添加o(>﹏<)o',
    },
    USING_WIDGET: {
        type: 'warn',
        zh: '挂件已经在使用中！',
    },
    IS_WIDGET_NOT_TOOL: {
        type: 'warn',
        zh: '该插件为widget，请使用usingWidget方法添加!',
    },
    USING_PLUGIN_FAIL: {
        type: 'warn',
        zh: '添加插件{0}失败!',
    }
}
