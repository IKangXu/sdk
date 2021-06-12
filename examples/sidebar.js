//左侧层级是否包含示例
var containExample = false;
var sideBarIconConfig = sideBarIconConfig || {};

function initSideBar() {
    var sideBar = $("ul#sidebar-menu");
    for (var item of exampleConfig) {
        sideBar.append(createSideBarMenuItem(item, false));
    }
}

//创建菜单项
function createSideBarMenuItem(config, containAll) {
    if (!config) {
        return;
    }
    var id = config.id;
    containExample = containAll;
    var li = $("<li id='iclient_" + id + "' class='treeview '></li>");

    if (config.content) {
        let allCount = 0;
            for(let item1 of config.content){               
                if(item1.content){
                    allCount+=item1.content.length;
                }
            }
        createSideBarMenuTitle(config, true,allCount).appendTo(li);
        createSideBarSecondMenu(config.content, id).appendTo(li);
    } else {
        createSideBarMenuTitle(config, false).appendTo(li);
    }
    return li;
}
function createSideBarMenuTitle(config, collapse,count) {
    var id = config.id || "";
    var iconName = config.icon|| "";
    var icon="";
    if (iconName) {
        icon = "<i class='" + iconName + " icon-class'></i>"
    }else{
        icon = "<i class='iconfont icon-wenjianjia icon-class'></i>"
    }
    var tag = "<span class = 'badgeTag'> "+count+"</span>";

    var div = $("<a  href='#" + id + "' >" +tag+ icon + "<span class='firstMenuTitle'>" + config.name + "</span></a>");
    if (collapse) {
        div.append(createCollapsedIcon());
    }
    return div;
}



//创建二级菜单
function createSideBarSecondMenu(config, name) {
    var ul = $("<ul class='treeview-menu second-menu '></ul>");
    for (var item of config) {
        var li = $("<li class='menuTitle ' id='" + item.id + "' ></li>");
        li.appendTo(ul);        
        if (containExample && item.content) {
            createSideBarMenuSecondTitle(name + '-' + item.id, item.name, true).appendTo(li);
            createSideBarThirdMenu(item.content).appendTo(li);
        } else {
            createSideBarMenuSecondTitle(name + '-' + item.id, item.name, false).appendTo(li);
        }
    }
    return ul;
}

//创建三级菜单
function createSideBarThirdMenu(examples) {
    var ul = $("<ul class='treeview-menu third-menu'></ul>");
    var len = (examples && examples.length) ? examples.length : 0;
    for (var i = 0; i < len; i++) {
        var example = examples[i];
        var li = $("<li class='menuTitle' id='" + example.fileName + "' ></li>");
        li.appendTo(ul);
        if (example.fileName && example.name) {
            createSideBarMenuThirdTitle(example.fileName, example.name, false).appendTo(li);
        }
    }
    return ul;
}




function createSideBarMenuSecondTitle(id, title, collapse) {
    id = id || "";
    var icon = "";
    var  iconName = "";//sideBarIconConfig[id];
    if (iconName) {
        icon = "<i class='" + iconName + "'></i>"
    }

    var div = $("<a href='#" + id + "' id='" + id + '-' + id + "'>" + icon + "<span class='secondMenuTitle'>" + title + "</span></a>");

    if (collapse) {
        div.append(createCollapsedIcon());
    }
    return div;
}

function createSideBarMenuThirdTitle(id, title, collapse) {
    id = id || "";
    var icon = "", iconName = sideBarIconConfig[id];
    if (iconName) {
        icon = "<i class='iconfont " + iconName + "'></i>"
    }

    var div = $("<a href='#' id='" + id + "'>" + icon + "<span class='thirdMenuTitle'>" + title + "</span></a>");
    if (collapse) {
        div.append(createCollapsedIcon());
    }
    return div;
}

//创建右侧折叠菜单
function createCollapsedIcon() {
    return $("<span class='pull-right-container'> <i class='fa fa-angle-left pull-right'></i> </span>");
}

//只处理三层节点,后续可优化
function selectMenu(id, length) {
    var target = _getTarget(id, length);
    if (length !== 1) {
        //控制editor页面左侧导航栏一级菜单高亮
        _selectTarget(target.parent().parent().parent().parent());
        //控制示例页面左侧导航栏一级菜单高亮
        _selectTarget(target.parent().parent());
        //控制左侧导航栏最低级菜单高亮
        _selectTarget(target.parent());
        _selectTarget(target.find("ul"));
    }
}

function _getTarget(id, length) {
    var target;
    if (length) {
        if (length === 1) {
            $("section#sidebar li.active").removeClass("active");
            target = $("section#sidebar li#iclient_" + id);
            target.children('ul').show();
        }
        if (length === 2) {
            $("section#sidebar li.active ul.active li").removeClass("active");
            target = $("section#sidebar li.treeview").children('ul').children('li#' + id);
        }
    } else {
        $("section#sidebar #ul").addClass("active");
        $("section#sidebar li.active").removeClass("active");
        target = $("section#sidebar li#" + id);
    }
    target && target.addClass('active');
    return target;
}

function _selectTarget(target) {
    if (!target || target.length < 1) {
        return;
    }
    var className = target.attr("class");
    if (className && className.indexOf("treeview-menu") > -1 && className.indexOf("menu-open") === -1) {
        target.addClass("menu-open");
        target.css("display", "block");
    }
    if (className && className.indexOf("treeview") > -1) {
        target.addClass('active');
    }
}