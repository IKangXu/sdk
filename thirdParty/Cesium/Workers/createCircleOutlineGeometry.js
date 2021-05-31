define(["./Cartesian2-49b1de22","./Check-6c0211bc","./when-54c2dc71","./EllipseOutlineGeometry-e9145a69","./Math-44e92d6b","./GeometryOffsetAttribute-d889f085","./Transforms-e9dbfb40","./RuntimeError-2109023a","./ComponentDatatype-6d99a1ee","./WebGLConstants-76bb35d1","./EllipseGeometryLibrary-60ebd5f1","./GeometryAttribute-669569db","./GeometryAttributes-4fcfcf40","./IndexDatatype-46306178"],function(r,e,l,n,i,t,s,o,a,d,u,c,m,p){"use strict";function y(e){var i=(e=l.defaultValue(e,l.defaultValue.EMPTY_OBJECT)).radius,e={center:e.center,semiMajorAxis:i,semiMinorAxis:i,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,numberOfVerticalLines:e.numberOfVerticalLines};this._ellipseGeometry=new n.EllipseOutlineGeometry(e),this._workerName="createCircleOutlineGeometry"}y.packedLength=n.EllipseOutlineGeometry.packedLength,y.pack=function(e,i,t){return n.EllipseOutlineGeometry.pack(e._ellipseGeometry,i,t)};var f=new n.EllipseOutlineGeometry({center:new r.Cartesian3,semiMajorAxis:1,semiMinorAxis:1}),G={center:new r.Cartesian3,radius:void 0,ellipsoid:r.Ellipsoid.clone(r.Ellipsoid.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,numberOfVerticalLines:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0};return y.unpack=function(e,i,t){i=n.EllipseOutlineGeometry.unpack(e,i,f);return G.center=r.Cartesian3.clone(i._center,G.center),G.ellipsoid=r.Ellipsoid.clone(i._ellipsoid,G.ellipsoid),G.height=i._height,G.extrudedHeight=i._extrudedHeight,G.granularity=i._granularity,G.numberOfVerticalLines=i._numberOfVerticalLines,l.defined(t)?(G.semiMajorAxis=i._semiMajorAxis,G.semiMinorAxis=i._semiMinorAxis,t._ellipseGeometry=new n.EllipseOutlineGeometry(G),t):(G.radius=i._semiMajorAxis,new y(G))},y.createGeometry=function(e){return n.EllipseOutlineGeometry.createGeometry(e._ellipseGeometry)},function(e,i){return(e=l.defined(i)?y.unpack(e,i):e)._ellipseGeometry._center=r.Cartesian3.clone(e._ellipseGeometry._center),e._ellipseGeometry._ellipsoid=r.Ellipsoid.clone(e._ellipseGeometry._ellipsoid),y.createGeometry(e)}});