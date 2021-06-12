$(document).ready(function () {
    //initPage();
    //bindEvents();
});
var exConfig = exampleConfig,
    containExamples = false,
    thumbLocation = getThumbLocation();

//左侧层级不包含例子，只包含分类
function initPage() {
    var sideBar = $("ul#sidebar-menu");
    var chartList = $("#charts-list");
    for (var item of exConfig) {
        sideBar.append(createSideBarMenuItem(item, containExamples));
        chartList.append(createGalleryItem(item));
    }
    setTimeout(()=>{  
        resizeCharts();
        initSelect();
         }, 100); 
    
}

//初始化页面第一次加载
function initSelect() {
    var hash = window.location.hash;
    if (hash.indexOf("#") === -1) {
        var id = $('#sidebar li').first().children('a')[0].hash;

        window.location.hash = (id) ? id : window.location.hash;
    }
    scroll();
}


//初始化示例面板
function createGalleryItem(config) {
    if (!config) {
        return;
    }
    var id = config.id;

    var categoryLi = $("<li class='category' id='" + id + "'></li>");
    if (config.name) {
        createGalleryItemTitle(config, config.name).appendTo(categoryLi);
    }
    if (config.content) {
        createSubGalleryItem(config.content, id).appendTo(categoryLi);
    }
    return categoryLi;
}


function createSubGalleryItem(config, name) {
    var categoryContentDiv = $("<div class='category-content'></div>");
    for (var configItem of config) {      
        var key =   configItem.id; 
        var content = $("<div class='box box-default color-palette-box' id='" + name + '-' + key + "'></div>");
        createSubGalleryItemTitle(key, configItem.name).appendTo(content);
        if (configItem.content) {
            createGalleryCharts(configItem.content).appendTo(content);
        }
        content.appendTo(categoryContentDiv);
    }
    return categoryContentDiv;
}

function createGalleryItemTitle(config, title) {
    //var menuItemIcon = exampleIconConfig[id];
    return $("<h3 class='category-title' id='title_" + config.id + "'>" + "<i class='" + config.icon + "'></i>" + "&nbsp;&nbsp;" + title + "</h3>");
}

function createSubGalleryItemTitle(id, title) {
    return $("<div class='box-header'>" + "<h3 class='box-title' id='category-type-" + id + "'>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + title + "</h4>" + "</h3>" + "</div>");
}


function createGalleryCharts(examples) {
    var chartsDiv = $("<div class='box-body'></div>");
    var len = (examples && examples.length) ? examples.length : 0;
    for (var i = 0; i < len; i++) {
        createGalleryChart(examples[i]).appendTo(chartsDiv);
    }
    return chartsDiv;
}

function createGalleryChart(example) {
    var defaultThumbnail = thumbLocation + "/gallery/developing.jpg";
    var target = "./gallery/editor.html",
        title = example.name,
        href = example.fileName ? example.fileName : "",
        thumbnail = example.thumbnail ? thumbLocation + "/gallery/" + example.thumbnail :defaultThumbnail;
 
    var chartDiv = $("<div class='col-xlg-2 col-lg-3 col-md-4 col-sm-6 col-xs-12'></div>");
    var chart = $("<div class='chart'></div>");
    var link = $("<a class='chart-link' target='_blank' href='" + target + "#" + href + "'></a>");
    var chartTitle = $("<h5 class='chart-title'>" + title + "</h5>");
    var thumbHtml = `<img class='chart-area' src='${thumbnail}' style='display: inline' onerror="this.src='${defaultThumbnail}'" >`;
    var thumb = $(thumbHtml);

    chartTitle.appendTo(link);
    thumb.appendTo(link);
    link.appendTo(chart);
    chart.appendTo(chartDiv);

    return chartDiv;
}

function getThumbLocation() {
    var param = window.location.toString();
    return param.substr(0, param.lastIndexOf('/'));
}

//chart宽高自适应
function resizeCharts() {
    var charts = $("#charts-list .chart .chart-area");
    charts.height(charts[0].offsetWidth * 0.8);
    window.onresize = function () {
        charts.height(charts[0].offsetWidth * 0.8);
    }
}

//根据url滚动到页面相应的位置
function scroll() {
    var hash = window.location.hash;
    var ele;

    if (hash && hash.indexOf("#") !== -1) {
        var param = hash.split("#")[1].split("-");
        if (param.length === 1) {
            ele = $(".category-title#title_" + param[0]);
            selectMenu(param[0], param.length);
        }

        if (param.length == 2) {
            //二级菜单里面的li
            ele = $("#category-type-" + param[1]);
            selectMenu(param[1], param.length);
        }

    }

    if (ele) {
         $("body").animate({scrollTop: ele.offset().top - 50}, 0);
    }
}

//绑定点击事件
function bindEvents() {
	console.log("test");
    var child = $("ul#sidebar-menu>li.treeview>ul>li");
    var parent = $('ul.sidebar-menu>li').parent("ul");
     
    if ($('ul.sidebar-menu>li#firstMenuiManager').find('ul').length == 0) {
        if ($('ul.sidebar-menu>li#firstMenuiManager').click(function () {
                $('ul#sidebar-menu>li>ul').slideUp(500);
            }));
    }
    //一级菜单跳转
    child.parent('ul').siblings('a').click(function (evt) {
        if ($(this).siblings('ul').is(':visible') && $(this).siblings('ul').children('li').hasClass('active')) {
            evt.stopPropagation();//阻止点击事件触发折叠的冒泡
        }
        window.location = evt.currentTarget.href;
    });

    window.addEventListener("hashchange", function () {
        scroll();
    });
}

var openTimer; 
var animationSpeed = 500;
$(window).on('scroll', function () {
    if ($('ul.sidebar-menu>li').hasClass('active')) {
        var parent = $('ul.sidebar-menu>li').parent("ul");

        if (openTimer) {
            clearTimeout(openTimer);
        }
        openTimer = setTimeout(function () {
            parent.children('li.active').children('ul').slideDown(animationSpeed, function () {
                parent.children('li.active').children('ul').css('display', 'block');
            })
        }, 100);
    }
    $('ul.sidebar-menu>li').not("li.active").children('ul').css('display', 'none');
});






