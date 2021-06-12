
const CTMapDir ="../../dist/";

require.config({
        baseUrl:'./',
        waitSeconds: 0,
        paths: {
            'CTMap': CTMapDir+'CTMap', 
            'Config': '../exampleConfig' 
        }
    });


if (typeof CTMap !== "undefined") {
    onload(CTMap);
} else if (typeof require === "function") {
    require(["CTMap", "Config"], onload);
}
