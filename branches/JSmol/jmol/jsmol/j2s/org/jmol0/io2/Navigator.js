Clazz.declarePackage ("org.jmol.io2");
Clazz.load (["org.jmol.api.JmolNavigatorInterface"], "org.jmol.io2.Navigator", ["java.lang.Float", "$.Thread", "org.jmol.util.Escape", "$.Hermite", "$.Point3f", "$.Vector3f"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tm = null;
this.viewer = null;
this.nHits = 0;
this.multiplier = 1;
Clazz.instantialize (this, arguments);
}, org.jmol.io2, "Navigator", null, org.jmol.api.JmolNavigatorInterface);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "navigateTo", 
function (floatSecondsTotal, axis, degrees, center, depthPercent, xTrans, yTrans) {
if (!this.viewer.haveDisplay) floatSecondsTotal = 0;
var ptMoveToCenter = (center == null ? this.tm.navigationCenter : center);
var fps = 30;
var totalSteps = Clazz.floatToInt (floatSecondsTotal * fps);
if (floatSecondsTotal > 0) this.viewer.setInMotion (true);
if (degrees == 0) degrees = NaN;
if (totalSteps > 1) {
var frameTimeMillis = Clazz.doubleToInt (1000 / fps);
var targetTime = System.currentTimeMillis ();
var depthStart = this.tm.getNavigationDepthPercent ();
var depthDelta = depthPercent - depthStart;
var xTransStart = this.tm.navigationOffset.x;
var xTransDelta = xTrans - xTransStart;
var yTransStart = this.tm.navigationOffset.y;
var yTransDelta = yTrans - yTransStart;
var degreeStep = degrees / totalSteps;
var aaStepCenter =  new org.jmol.util.Vector3f ();
aaStepCenter.setT (ptMoveToCenter);
aaStepCenter.sub (this.tm.navigationCenter);
aaStepCenter.scale (1 / totalSteps);
var centerStart = org.jmol.util.Point3f.newP (this.tm.navigationCenter);
for (var iStep = 1; iStep < totalSteps; ++iStep) {
this.tm.navigating = true;
var fStep = iStep / (totalSteps - 1);
if (!Float.isNaN (degrees)) this.tm.navigateAxis (0, axis, degreeStep);
if (center != null) {
centerStart.add (aaStepCenter);
this.tm.navigatePt (0, centerStart);
}if (!Float.isNaN (xTrans) || !Float.isNaN (yTrans)) {
var x = NaN;
var y = NaN;
if (!Float.isNaN (xTrans)) x = xTransStart + xTransDelta * fStep;
if (!Float.isNaN (yTrans)) y = yTransStart + yTransDelta * fStep;
this.navTranslatePercent (-1, x, y);
}if (!Float.isNaN (depthPercent)) {
this.setNavigationDepthPercent (depthStart + depthDelta * fStep);
}this.tm.navigating = false;
targetTime += frameTimeMillis;
if (System.currentTimeMillis () < targetTime) {
this.viewer.requestRepaintAndWait ();
if (!this.viewer.isScriptExecuting ()) return;
var sleepTime = (targetTime - System.currentTimeMillis ());
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
return;
} else {
throw ie;
}
}
}}}
} else {
var sleepTime = Clazz.floatToInt (floatSecondsTotal * 1000) - 30;
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
} else {
throw ie;
}
}
}}if (!Float.isNaN (xTrans) || !Float.isNaN (yTrans)) this.navTranslatePercent (-1, xTrans, yTrans);
if (!Float.isNaN (depthPercent)) this.setNavigationDepthPercent (depthPercent);
this.viewer.setInMotion (false);
}, "~N,org.jmol.util.Vector3f,~N,org.jmol.util.Point3f,~N,~N,~N");
Clazz.overrideMethod (c$, "set", 
function (tm, viewer) {
this.tm = tm;
this.viewer = viewer;
}, "org.jmol.viewer.TransformManager11,org.jmol.viewer.Viewer");
Clazz.defineMethod (c$, "navigate", 
function (seconds, pathGuide, path, theta, indexStart, indexEnd) {
if (seconds <= 0) seconds = 2;
if (!this.viewer.haveDisplay) seconds = 0;
var isPathGuide = (pathGuide != null);
var nSegments = Math.min ((isPathGuide ? pathGuide.length : path.length) - 1, indexEnd);
if (!isPathGuide) while (nSegments > 0 && path[nSegments] == null) nSegments--;

nSegments -= indexStart;
if (nSegments < 1) return;
var nPer = Clazz.doubleToInt (Math.floor (10 * seconds));
var nSteps = nSegments * nPer + 1;
var points =  new Array (nSteps + 2);
var pointGuides =  new Array (isPathGuide ? nSteps + 2 : 0);
var iPrev;
var iNext;
var iNext2;
var iNext3;
var pt;
for (var i = 0; i < nSegments; i++) {
iPrev = Math.max (i - 1, 0) + indexStart;
pt = i + indexStart;
iNext = Math.min (i + 1, nSegments) + indexStart;
iNext2 = Math.min (i + 2, nSegments) + indexStart;
iNext3 = Math.min (i + 3, nSegments) + indexStart;
if (isPathGuide) {
org.jmol.util.Hermite.getHermiteList (7, pathGuide[iPrev][0], pathGuide[pt][0], pathGuide[iNext][0], pathGuide[iNext2][0], pathGuide[iNext3][0], points, i * nPer, nPer + 1, true);
org.jmol.util.Hermite.getHermiteList (7, pathGuide[iPrev][1], pathGuide[pt][1], pathGuide[iNext][1], pathGuide[iNext2][1], pathGuide[iNext3][1], pointGuides, i * nPer, nPer + 1, true);
} else {
org.jmol.util.Hermite.getHermiteList (7, path[iPrev], path[pt], path[iNext], path[iNext2], path[iNext3], points, i * nPer, nPer + 1, true);
}}
var totalSteps = nSteps;
this.viewer.setInMotion (true);
var frameTimeMillis = Clazz.floatToInt (1000 / this.tm.navFps);
var targetTime = System.currentTimeMillis ();
for (var iStep = 0; iStep < totalSteps; ++iStep) {
this.tm.navigatePt (0, points[iStep]);
if (isPathGuide) {
this.alignZX (points[iStep], points[iStep + 1], pointGuides[iStep]);
}targetTime += frameTimeMillis;
if (System.currentTimeMillis () < targetTime) {
this.viewer.requestRepaintAndWait ();
if (!this.viewer.isScriptExecuting ()) return;
var sleepTime = (targetTime - System.currentTimeMillis ());
if (sleepTime > 0) {
try {
Thread.sleep (sleepTime);
} catch (ie) {
if (Clazz.exceptionOf (ie, InterruptedException)) {
return;
} else {
throw ie;
}
}
}}}
}, "~N,~A,~A,~A,~N,~N");
Clazz.defineMethod (c$, "alignZX", 
($fz = function (pt0, pt1, ptVectorWing) {
var pt0s =  new org.jmol.util.Point3f ();
var pt1s =  new org.jmol.util.Point3f ();
var m = this.tm.getMatrixRotate ();
m.transform2 (pt0, pt0s);
m.transform2 (pt1, pt1s);
var vPath = org.jmol.util.Vector3f.newV (pt0s);
vPath.sub (pt1s);
var v = org.jmol.util.Vector3f.new3 (0, 0, 1);
var angle = vPath.angle (v);
v.cross (vPath, v);
if (angle != 0) this.tm.navigateAxis (0, v, (angle * 57.29577951308232));
m.transform2 (pt0, pt0s);
var pt2 = org.jmol.util.Point3f.newP (ptVectorWing);
pt2.add (pt0);
var pt2s =  new org.jmol.util.Point3f ();
m.transform2 (pt2, pt2s);
vPath.setT (pt2s);
vPath.sub (pt0s);
vPath.z = 0;
v.set (-1, 0, 0);
angle = vPath.angle (v);
if (vPath.y < 0) angle = -angle;
v.set (0, 0, 1);
if (angle != 0) this.tm.navigateAxis (0, v, (angle * 57.29577951308232));
if (this.viewer.getNavigateSurface ()) {
v.set (1, 0, 0);
this.tm.navigateAxis (0, v, 20);
}m.transform2 (pt0, pt0s);
m.transform2 (pt1, pt1s);
m.transform2 (ptVectorWing, pt2s);
}, $fz.isPrivate = true, $fz), "org.jmol.util.Point3f,org.jmol.util.Point3f,org.jmol.util.Point3f");
Clazz.overrideMethod (c$, "zoomByFactor", 
function (factor, x, y) {
var navZ = this.tm.navZ;
if (navZ > 0) {
navZ /= factor;
if (navZ < 5) navZ = -5;
 else if (navZ > 200) navZ = 200;
} else if (navZ == 0) {
navZ = (factor < 1 ? 5 : -5);
} else {
navZ *= factor;
if (navZ > -5) navZ = 5;
 else if (navZ < -200) navZ = -200;
}this.tm.navZ = navZ;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "calcNavigationPoint", 
function () {
this.calcNavigationDepthPercent ();
if (!this.tm.navigating && this.tm.navMode != 1) {
if (this.tm.navigationDepth < 100 && this.tm.navigationDepth > 0 && !Float.isNaN (this.tm.previousX) && this.tm.previousX == this.tm.fixedTranslation.x && this.tm.previousY == this.tm.fixedTranslation.y && this.tm.navMode != -1) this.tm.navMode = 3;
 else this.tm.navMode = 0;
}switch (this.tm.navMode) {
case 1:
this.tm.navigationOffset.set (this.tm.width / 2, this.tm.getNavPtHeight (), this.tm.referencePlaneOffset);
this.tm.zoomFactor = 3.4028235E38;
this.tm.calcCameraFactors ();
this.tm.calcTransformMatrix ();
this.newNavigationCenter ();
break;
case 0:
case -1:
this.tm.fixedRotationOffset.setT (this.tm.fixedTranslation);
this.newNavigationCenter ();
break;
case 2:
this.newNavigationCenter ();
break;
case -2:
case 3:
var pt1 =  new org.jmol.util.Point3f ();
this.tm.matrixTransform.transform2 (this.tm.navigationCenter, pt1);
var z = pt1.z;
this.tm.matrixTransform.transform2 (this.tm.fixedRotationCenter, pt1);
this.tm.modelCenterOffset = this.tm.referencePlaneOffset + (pt1.z - z);
this.tm.calcCameraFactors ();
this.tm.calcTransformMatrix ();
break;
case 4:
this.tm.navigationOffset.z = this.tm.referencePlaneOffset;
this.tm.unTransformPoint (this.tm.navigationOffset, this.tm.navigationCenter);
break;
}
this.tm.matrixTransform.transform2 (this.tm.navigationCenter, this.tm.navigationShiftXY);
if (this.viewer.getNavigationPeriodic ()) {
var pt = org.jmol.util.Point3f.newP (this.tm.navigationCenter);
this.viewer.toUnitCell (this.tm.navigationCenter, null);
if (pt.distance (this.tm.navigationCenter) > 0.01) {
this.tm.matrixTransform.transform2 (this.tm.navigationCenter, pt);
var dz = this.tm.navigationShiftXY.z - pt.z;
this.tm.modelCenterOffset += dz;
this.tm.calcCameraFactors ();
this.tm.calcTransformMatrix ();
this.tm.matrixTransform.transform2 (this.tm.navigationCenter, this.tm.navigationShiftXY);
}}this.tm.transformPoint2 (this.tm.fixedRotationCenter, this.tm.fixedTranslation);
this.tm.fixedRotationOffset.setT (this.tm.fixedTranslation);
this.tm.previousX = this.tm.fixedTranslation.x;
this.tm.previousY = this.tm.fixedTranslation.y;
this.tm.transformPoint2 (this.tm.navigationCenter, this.tm.navigationOffset);
this.tm.navigationOffset.z = this.tm.referencePlaneOffset;
this.tm.navMode = 0;
this.calcNavSlabAndDepthValues ();
});
Clazz.defineMethod (c$, "calcNavSlabAndDepthValues", 
($fz = function () {
this.tm.calcSlabAndDepthValues ();
if (this.tm.slabEnabled) {
this.tm.slabValue = (this.tm.mode == 1 ? -100 : 0) + Clazz.floatToInt (this.tm.referencePlaneOffset - this.tm.navigationSlabOffset);
if (this.tm.zSlabPercentSetting == this.tm.zDepthPercentSetting) this.tm.zSlabValue = this.tm.slabValue;
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "newNavigationCenter", 
($fz = function () {
this.tm.mode = this.tm.defaultMode;
var pt =  new org.jmol.util.Point3f ();
this.tm.transformPoint2 (this.tm.fixedRotationCenter, pt);
pt.x -= this.tm.navigationOffset.x;
pt.y -= this.tm.navigationOffset.y;
var f = -this.tm.getPerspectiveFactor (pt.z);
pt.x /= f;
pt.y /= f;
pt.z = this.tm.referencePlaneOffset;
this.tm.matrixTransformInv.transform2 (pt, this.tm.navigationCenter);
this.tm.mode = 1;
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "setNavigationOffsetRelative", 
function (navigatingSurface) {
if (navigatingSurface) {
this.navigateSurface (2147483647);
return;
}if (this.tm.navigationDepth < 0 && this.tm.navZ > 0 || this.tm.navigationDepth > 100 && this.tm.navZ < 0) {
this.tm.navZ = 0;
}this.tm.rotateXRadians (0.017453292 * -0.02 * this.tm.navY, null);
this.tm.rotateYRadians (0.017453292 * .02 * this.tm.navX, null);
var pt = this.tm.getNavigationCenter ();
var pts =  new org.jmol.util.Point3f ();
this.tm.transformPoint2 (pt, pts);
pts.z += this.tm.navZ;
this.tm.unTransformPoint (pts, pt);
this.tm.navigatePt (0, pt);
}, "~B");
Clazz.defineMethod (c$, "navigate", 
function (keyCode, modifiers) {
var key = null;
var value = 0;
if (this.tm.mode != 1) return;
if (keyCode == 0) {
this.nHits = 0;
this.multiplier = 1;
if (!this.tm.navigating) return;
this.tm.navigating = false;
return;
}this.nHits++;
if (this.nHits % 10 == 0) this.multiplier *= (this.multiplier == 4 ? 1 : 2);
var navigateSurface = this.viewer.getNavigateSurface ();
var isShiftKey = ((modifiers & 1) > 0);
var isAltKey = ((modifiers & 8) > 0);
var isCtrlKey = ((modifiers & 2) > 0);
var speed = this.viewer.getNavigationSpeed () * (isCtrlKey ? 10 : 1);
switch (keyCode) {
case 46:
this.tm.navX = this.tm.navY = this.tm.navZ = 0;
this.tm.homePosition (true);
return;
case 32:
if (!this.tm.navOn) return;
this.tm.navX = this.tm.navY = this.tm.navZ = 0;
return;
case 38:
if (this.tm.navOn) {
if (isAltKey) {
this.tm.navY += this.multiplier;
value = this.tm.navY;
key = "navY";
} else {
this.tm.navZ += this.multiplier;
value = this.tm.navZ;
key = "navZ";
}break;
}if (navigateSurface) {
this.navigateSurface (2147483647);
break;
}if (isShiftKey) {
this.tm.navigationOffset.y -= 2 * this.multiplier;
this.tm.navMode = 2;
break;
}if (isAltKey) {
this.tm.rotateXRadians (0.017453292 * -0.2 * this.multiplier, null);
this.tm.navMode = 3;
break;
}this.tm.modelCenterOffset -= speed * (this.viewer.getNavigationPeriodic () ? 1 : this.multiplier);
this.tm.navMode = 4;
break;
case 40:
if (this.tm.navOn) {
if (isAltKey) {
this.tm.navY -= this.multiplier;
value = this.tm.navY;
key = "navY";
} else {
this.tm.navZ -= this.multiplier;
value = this.tm.navZ;
key = "navZ";
}break;
}if (navigateSurface) {
this.navigateSurface (-2 * this.multiplier);
break;
}if (isShiftKey) {
this.tm.navigationOffset.y += 2 * this.multiplier;
this.tm.navMode = 2;
break;
}if (isAltKey) {
this.tm.rotateXRadians (0.017453292 * .2 * this.multiplier, null);
this.tm.navMode = 3;
break;
}this.tm.modelCenterOffset += speed * (this.viewer.getNavigationPeriodic () ? 1 : this.multiplier);
this.tm.navMode = 4;
break;
case 37:
if (this.tm.navOn) {
this.tm.navX -= this.multiplier;
value = this.tm.navX;
key = "navX";
break;
}if (navigateSurface) {
break;
}if (isShiftKey) {
this.tm.navigationOffset.x -= 2 * this.multiplier;
this.tm.navMode = 2;
break;
}this.tm.rotateYRadians (0.017453292 * 3 * -0.2 * this.multiplier, null);
this.tm.navMode = 3;
break;
case 39:
if (this.tm.navOn) {
this.tm.navX += this.multiplier;
value = this.tm.navX;
key = "navX";
break;
}if (navigateSurface) {
break;
}if (isShiftKey) {
this.tm.navigationOffset.x += 2 * this.multiplier;
this.tm.navMode = 2;
break;
}this.tm.rotateYRadians (0.017453292 * 3 * .2 * this.multiplier, null);
this.tm.navMode = 3;
break;
default:
this.tm.navigating = false;
this.tm.navMode = 0;
return;
}
if (key != null) this.viewer.getGlobalSettings ().setParamF (key, value);
this.tm.navigating = true;
this.tm.finalizeTransformParameters ();
}, "~N,~N");
Clazz.defineMethod (c$, "navigateSurface", 
($fz = function (dz) {
if (this.viewer.isRepaintPending ()) return;
this.viewer.setShapeProperty (23, "navigate", Integer.$valueOf (dz == 2147483647 ? 2 * this.multiplier : dz));
this.viewer.requestRepaintAndWait ();
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "setNavigationDepthPercent", 
($fz = function (percent) {
this.viewer.getGlobalSettings ().setParamF ("navigationDepth", percent);
this.tm.calcCameraFactors ();
this.tm.modelCenterOffset = this.tm.referencePlaneOffset - (1 - percent / 50) * this.tm.modelRadiusPixels;
this.tm.calcCameraFactors ();
this.tm.navMode = -1;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "calcNavigationDepthPercent", 
($fz = function () {
this.tm.calcCameraFactors ();
this.tm.navigationDepth = (this.tm.modelRadiusPixels == 0 ? 50 : 50 * (1 + (this.tm.modelCenterOffset - this.tm.referencePlaneOffset) / this.tm.modelRadiusPixels));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setNavigationDepthPercent", 
function (timeSec, percent) {
if (timeSec > 0) {
this.navigateTo (timeSec, null, NaN, null, percent, NaN, NaN);
return;
}this.setNavigationDepthPercent (percent);
}, "~N,~N");
Clazz.overrideMethod (c$, "navTranslatePercent", 
function (seconds, x, y) {
this.tm.transformPoint2 (this.tm.navigationCenter, this.tm.navigationOffset);
if (seconds >= 0) {
if (!Float.isNaN (x)) x = this.tm.width * x / 100 + (Float.isNaN (y) ? this.tm.navigationOffset.x : (this.tm.width / 2));
if (!Float.isNaN (y)) y = this.tm.height * y / 100 + (Float.isNaN (x) ? this.tm.navigationOffset.y : this.tm.getNavPtHeight ());
}if (seconds > 0) {
this.navigateTo (seconds, null, NaN, null, NaN, x, y);
return;
}if (!Float.isNaN (x)) this.tm.navigationOffset.x = x;
if (!Float.isNaN (y)) this.tm.navigationOffset.y = y;
this.tm.navMode = 2;
this.tm.navigating = true;
this.tm.finalizeTransformParameters ();
this.tm.navigating = false;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "getNavigationState", 
function () {
return "# navigation state;\nnavigate 0 center " + org.jmol.util.Escape.escapePt (this.tm.getNavigationCenter ()) + ";\nnavigate 0 translate " + this.tm.getNavigationOffsetPercent ('X') + " " + this.tm.getNavigationOffsetPercent ('Y') + ";\nset navigationDepth " + this.tm.getNavigationDepthPercent () + ";\nset navigationSlab " + this.getNavigationSlabOffsetPercent () + ";\n\n";
});
Clazz.defineMethod (c$, "getNavigationSlabOffsetPercent", 
($fz = function () {
this.tm.calcCameraFactors ();
return 50 * this.tm.navigationSlabOffset / this.tm.modelRadiusPixels;
}, $fz.isPrivate = true, $fz));
});
