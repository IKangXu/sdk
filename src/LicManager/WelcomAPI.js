 export default class WelcomAPI {

     static greeting() {
         var e = "%c";
         var format1 = "color:#00a1ff;font-weight:bolder;font-size:22px;font-family:'Microsoft YaHei',微软雅黑,'MicrosoftJhengHei',华文细黑,STHeiti,MingLiu ";

         var format2 = "color:#00a1ff;font-size:8px;font-family:'Microsoft YaHei',微软雅黑,'MicrosoftJhengHei',华文细黑,STHeiti,MingLiu ";

        var welCom = "欢迎使用CTMap SDK";
        var versionInfo = "版本号：1.1.0414" ;
        var buildInfo ="编译日期：2020-4-14 16:39:53";
        var authInfo="授权信息：授权-永久使用此软件当前版本。"

        console.info(e + welCom, format1);

        console.info(e + versionInfo, format2);
        console.info(e + buildInfo, format2);
        console.info(e + authInfo, format2); 
     } 
 }