
const CesiumDir    ="../../thirdParty/Cesium/";
const CesiumJS =CesiumDir+"Cesium.js";
const CesiumCss =CesiumDir+"Widgets/widgets.css";
 
const SandcastleLib ="./js/Sandcastle-header.js";

window.CESIUM_BASE_URL =CesiumDir;

let earthCss = [CesiumCss,"./main.css"];
let jsLib = [CesiumJS,SandcastleLib];

loadResource(earthCss,"css");
loadResource(jsLib,"js");


function loadResource(arr, type) {
    let head = document.getElementsByTagName('head')[0]
    let fragment = document.createDocumentFragment()
    if (type === "js") {
        for (let i = 0; i < arr.length; i++) {
           // Console.log(`${arr[i]}`);
            document.write(`<script src='${arr[i]}'></script>`)
        }
    } else if (type === "css") {
        for (let i = 0; i < arr.length; i++) {
            let link = document.createElement('link')
            link.href = `${arr[i]}`
            link.rel = "stylesheet"
            link.type = "text/css"
            fragment.appendChild(link)
        }
        head.appendChild(fragment)
    }
}
