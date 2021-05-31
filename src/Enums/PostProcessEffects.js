export default class PostProcessEffects {

    static get FS_RAIN() {
        return "uniform sampler2D colorTexture;\n\
        varying vec2 v_textureCoordinates;\n\
    \n\
        float hash(float x){\n\
            return fract(sin(x*133.3)*13.13);\n\
    }\n\
    \n\
    void main(void){\n\
    \n\
        float time = czm_frameNumber / 60.0;\n\
    vec2 resolution = czm_viewport.zw;\n\
    \n\
    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
    vec3 c=vec3(.6,.7,.8);\n\
    \n\
    float a=-.4;\n\
    float si=sin(a),co=cos(a);\n\
    uv*=mat2(co,-si,si,co);\n\
    uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
    \n\
    float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
    c*=v*b; \n\
    \n\
    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
    }\n\
    ";
    }

    static get FS_SNOW() {
        return "uniform sampler2D colorTexture;\n\
        varying vec2 v_textureCoordinates;\n\
    \n\
        float snow(vec2 uv,float scale)\n\
        {\n\
            float time = czm_frameNumber / 60.0;\n\
            float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
            uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
            uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
            p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
            k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
            return k*w;\n\
        }\n\
    \n\
        void main(void){\n\
            vec2 resolution = czm_viewport.zw;\n\
            vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
            vec3 finalColor=vec3(0);\n\
            float c = 0.0;\n\
            c+=snow(uv,30.)*.0;\n\
            c+=snow(uv,20.)*.0;\n\
            c+=snow(uv,15.)*.0;\n\
            c+=snow(uv,10.);\n\
            c+=snow(uv,8.);\n\
            c+=snow(uv,6.);\n\
            c+=snow(uv,5.);\n\
            finalColor=(vec3(c)); \n\
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
    \n\
        }\n\
    ";
    }

    static get FS_SCAN() {
        return "uniform sampler2D colorTexture;\n" +
            "uniform sampler2D depthTexture;\n" +
            "varying vec2 v_textureCoordinates;\n" +
            "uniform vec4 u_scanCenterEC;\n" +
            "uniform vec3 u_scanPlaneNormalEC;\n" +
            "uniform float u_radius;\n" +
            "uniform vec4 u_scanColor;\n" +

            "vec4 toEye(in vec2 uv, in float depth)\n" +
            " {\n" +
            " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
            " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
            " posInCamera =posInCamera / posInCamera.w;\n" +
            " return posInCamera;\n" +
            " }\n" +

            "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
            "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
            "}\n" +

            "float getDepth(in vec4 depth)\n" +
            "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
            "}\n" +

            "void main()\n" +
            "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "if(dis < u_radius)\n" +
            "{\n" +
            "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
            "f = pow(f, 4.0);\n" +
            "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
            "}\n" +
            "}\n";
    }

    static get FS_RADAR(){
        return "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform vec3 u_scanLineNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +

        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
          " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
          " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
          " posInCamera =posInCamera / posInCamera.w;\n" +
          " return posInCamera;\n" +
        " }\n" +

        "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
            "vec3 v01 = testPt - ptOnLine;\n" +
            "normalize(v01);\n" +
            "vec3 temp = cross(v01, lineNormal);\n" +
            "float d = dot(temp, u_scanPlaneNormalEC);\n" +
            "return d > 0.5;\n" +
        "}\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
         "}\n" +

         "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
         "{\n" +
            "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
            "return length(tempPt - ptOnLine);\n" +
          "}\n" +

         "float getDepth(in vec4 depth)\n" +
         "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
         "}\n" +

         "void main()\n" +
         "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "float twou_radius = u_radius * 2.0;\n" +
            "if(dis < u_radius)\n" +
             "{\n" +
                "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                "f0 = pow(f0, 64.0);\n" +
                "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
                "float f = 0.0;\n" +
                "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
                "{\n" +
                    "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
                    "f = abs(twou_radius -dis1) / twou_radius;\n" +
                    "f = pow(f, 3.0);\n" +
                "}\n" +
                "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
             "}\n" +
          "}\n";
    }

    static get FS_STROKE(){
        return "#extension GL_OES_standard_derivatives : enable\n\
        uniform sampler2D colorTexture;\n\
        uniform sampler2D depthTexture;\n\
        uniform float lineWidth;\n\
        uniform float height;\n\
        uniform bvec3 strokeType;\n\
        uniform vec3 tjxColor;\n\
        uniform vec3 bjColor;\n\
        uniform vec3 cameraPos;\n\
        uniform float mbDis;\n\
        varying vec2 v_textureCoordinates;\n\
        vec4 toEye(in vec2 uv, in float depth){\n\
            vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
            vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n\
            posInCamera =posInCamera / posInCamera.w;\n\
            return posInCamera;\n\
        }\n\
        float getDepth(in vec4 depth){\n\
            float z_window = czm_unpackDepth(depth);\n\
            z_window = czm_reverseLogDepth(z_window);\n\
            float n_range = czm_depthRange.near;\n\
            float f_range = czm_depthRange.far;\n\
            return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n\
        }\n\
        bool isTJX(vec2 uv,float lw){\n\
            vec2 pixelSize = lw / czm_viewport.zw;\n\
            float dx0 = -pixelSize.x;\n\
            float dy0 = -pixelSize.y;\n\
            float dx1 = pixelSize.x;\n\
            float dy1 = pixelSize.y;\n\
            \n\
            vec2 currUV = uv + vec2(dx0, dy0);\n\
            vec4 currDepth = texture2D(depthTexture, currUV);\n\
            float depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(0.0, dy0);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(dx1, dy0);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(dx0, 0.0);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(dx1, 0.0);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(dx0, dy1);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(0.0, dy1);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            currUV = uv + vec2(dx1, dy1);\n\
            currDepth = texture2D(depthTexture, currUV);\n\
            depth = getDepth(currDepth);\n\
            if(depth>=1.0)return true;\n\
            \n\
            return false;\n\
        }\n\
        void main(){\n\
            \n\
            \n\
            vec4 color = texture2D(colorTexture, v_textureCoordinates);\n\
            if(height>14102.0){\n\
                gl_FragColor = color;\n\
                return;\n\
            }\n\
            vec4 currD = texture2D(depthTexture, v_textureCoordinates);\n\
            if(currD.r>=1.0){\n\
                gl_FragColor = color;\n\
                return;\n\
            }\n\
            float depth = getDepth(currD);\n\
            vec4 positionEC = toEye(v_textureCoordinates, depth);\n\
            vec3 dx = dFdx(positionEC.xyz);\n\
            vec3 dy = dFdy(positionEC.xyz);\n\
            vec3 normal = normalize(cross(dx,dy));\n\
            \n\
            if(strokeType.y||strokeType.z){\n\
                vec4 wp = czm_inverseView * positionEC;\n\
                if(distance(wp.xyz,cameraPos)>mbDis){\n\
                    gl_FragColor = color;\n\
                }else{\n\
                    float dotNum = abs(dot(normal,normalize(positionEC.xyz)));\n\
                    if(dotNum<0.05){\n\
                        gl_FragColor = vec4(bjColor,1.0);\n\
                        return;\n\
                    }\n\
                }\n\
            }\n\
            if(strokeType.x||strokeType.z){\n\
                bool tjx = isTJX(v_textureCoordinates,lineWidth);\n\
                if(tjx){\n\
                    gl_FragColor = vec4(tjxColor,1.0);\n\
                    return;\n\
                }\n\
            }\n\
            gl_FragColor = color;\n\
        }\n\
        "
    }


}