$(document).ready(function () {	
    initPage();
    bindEvents();
});

var aceEditor;
var containExamples = true;

function initPage() {
    initSideBar();
    initEditor();
    screenResize();
}

function initSideBar() {
    var config = exampleConfig;
    var sideBar = $("ul#sidebar-menu");
    for (let item of config) {
        sideBar.append(createSideBarMenuItem(item, containExamples));
    }
    initSelect();
}

function screenResize() {
    window.onresize = function () {
        mapHeight();
    };
}
//初始化编辑器
function initCodeEditor() {
    if (!aceEditor) {
        aceEditor = ace.edit("editor");
        //aceEditor.setTheme("ace/theme/textmate");
       // aceEditor.setTheme("ace/theme/vibrant_ink");
        //aceEditor.setTheme("ace/theme/idle_fingers");
       // aceEditor.setTheme("ace/theme/tomorrow_night_bright");
        aceEditor.setTheme("ace/theme/chaos");
        //aceEditor.getSession().setMode("ace/mode/html");
        aceEditor.getSession().setUseWrapMode(true);
        aceEditor.setShowPrintMargin(false);
        aceEditor.getSession().setMode("ace/mode/javascript");
        aceEditor.getSession().setTabSize(4);
        aceEditor.getSession().setUseSoftTabs(true);
        aceEditor.getSession().setUseWrapMode(true);
        aceEditor.setHighlightActiveLine(false);
        aceEditor.setShowPrintMargin(false);
    }
    aceEditor.setValue($('#editor').val());
    aceEditor.clearSelection();
    aceEditor.moveCursorTo(0, 0);
}
 
function initEditor() {
    loadExampleHtml();
    initCodeEditor();
}

function loadExampleHtml() {
    var locationParam = getLocationParam();
    if (!locationParam) {
        return;
    }
    var href = window.location.toString();
    var mapUrl = href.substr(0, href.lastIndexOf('/') + 1);
    mapUrl = mapUrl + locationParam + ".html";
    if (!mapUrl) {
        return;
    }
    var html = $.ajax({
        url: mapUrl,
        async: false,
        error: function (error) {
            //alert("请在服务器环境下运行示范程序！");
            html = "正在开发,尽请期待......";
        }
    }).responseText;
    if (html && html != "") {
        $('#editor').val(html);
        loadPreview(html);
    }
}

function getLocationParam() {
    var param = window.location.toString();
    if (param.indexOf("#") === -1) {
        return null;
    }
    param = param.split("#");
    if (param && param.length > 0) {
        return param[1];
    }
}

//运行代码
function run() {
    var iframeContent = $("#editor").val();
    if (editor) {
        iframeContent = aceEditor.getValue();
    }
    loadPreview(iframeContent);
}
 
function loadPreview(content) {
    var iFrame = createIFrame(),
        iframeDocument = iFrame.contentWindow.document;

    iframeDocument.open();
    iframeDocument.write(content);
    iframeDocument.close();
    iframeDocument.addEventListener('load', function () {
        mapHeight();
    });
    mapHeight();
}

function createIFrame() {
    var preViewPane = $("#previewPane");
    preViewPane.empty();
    var iframe = document.createElement("iframe");
    $(iframe).attr("id", "innerPage");
    $(iframe).attr("name", "innerPage");
    preViewPane.append(iframe);
    return iframe;
}

//重置编辑器
function refresh() {
    initEditor();
    run();
}

function initSelect() {
    var hash = window.location.hash;
    var id;
    if (hash.indexOf("#") === -1) {
        id = $("section#sidebar .thirdMenu a.link").first().attr('id');
        window.location.hash = (id) ? "#" + id : window.location.hash;
    } else {
        id = hash.split("#")[1];
    }
    selectMenu(id);
}

function mapHeight() {
    var doc = $("#innerPage").contents();
    doc.find("html").height("100%");
    doc.find("body").height("100%");
}

function bindEvents() {
    $("#sidebar ul.third-menu a").click(function (evt) {
        var target = $(evt.target).parent().parent();
        var nodeId = evt.target.id; 
        if (evt.target.localName === "span") {
            nodeId = target.attr('id');
        }

        if (nodeId) { 
            evt.preventDefault();
            window.location.hash = "#" + nodeId;
            initEditor();
            evt.stopPropagation();
        }
    });
    var codePane = $("#codePane");
    var previewPane = $("#previewPane");
    var expand = !!1;
    $("#showCodeBtn").click(function () {
        if (expand) {
            //编辑器和预览宽度5:7
            $(this).text("关闭");
            $(this).addClass("fa-arrows-alt");
            $(this).removeClass(" fa-compress");
            codePane.show(0, function () {
                previewPane.removeClass("col-md-12");
                previewPane.addClass("col-md-8");
                codePane.addClass("col-md-4");
            });
        } else {
            //预览独占一行
            $(this).text("代码");
            $(this).addClass(" fa-compress");
            $(this).removeClass("fa-arrows-alt");
            codePane.hide(0, function () {
                codePane.removeClass("col-md-4");
                previewPane.removeClass("col-md-8");
                previewPane.addClass("col-md-12");
            });
        }
        expand = !expand;
    });

    window.addEventListener("hashchange", function () {
        var hash = window.location.hash;
        if (hash.indexOf("#") !== -1) {
            var id = hash.split("#")[1];
            selectMenu(id);
        }
    });
}