Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.SpinThread", ["org.jmol.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.transformManager = null;
this.endDegrees = 0;
this.endPositions = null;
this.nDegrees = 0;
this.bsAtoms = null;
this.isNav = false;
this.$isGesture = false;
this.myFps = 0;
this.angle = 0;
this.haveNotified = false;
this.index = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "SpinThread", org.jmol.thread.JmolThread);
Clazz.defineMethod (c$, "isGesture", 
function () {
return this.$isGesture;
});
Clazz.makeConstructor (c$, 
function (transformManager, viewer, endDegrees, endPositions, bsAtoms, isNav, isGesture) {
Clazz.superConstructor (this, org.jmol.thread.SpinThread);
this.setViewer (viewer, "SpinThread");
this.transformManager = transformManager;
this.endDegrees = Math.abs (endDegrees);
this.endPositions = endPositions;
this.bsAtoms = bsAtoms;
this.isNav = isNav;
this.$isGesture = isGesture;
}, "org.jmol.viewer.TransformManager,org.jmol.viewer.Viewer,~N,java.util.List,org.jmol.util.BitSet,~B,~B");
Clazz.overrideMethod (c$, "run1", 
function (mode) {
while (true) switch (mode) {
case -1:
this.myFps = (this.isNav ? this.transformManager.navFps : this.transformManager.spinFps);
this.viewer.getGlobalSettings ().setParamB (this.isNav ? "_navigating" : "_spinning", true);
this.viewer.startHoverWatcher (false);
mode = 0;
break;
case 0:
if (this.isReset || this.checkInterrupted ()) {
mode = -2;
break;
}if (this.isNav && this.myFps != this.transformManager.navFps) {
this.myFps = this.transformManager.navFps;
this.index = 0;
this.startTime = System.currentTimeMillis ();
} else if (!this.isNav && this.myFps != this.transformManager.spinFps && this.bsAtoms == null) {
this.myFps = this.transformManager.spinFps;
this.index = 0;
this.startTime = System.currentTimeMillis ();
}if (this.myFps == 0 || !(this.isNav ? this.transformManager.navOn : this.transformManager.spinOn)) {
mode = -2;
break;
}var refreshNeeded = (this.isNav ? this.transformManager.navX != 0 || this.transformManager.navY != 0 || this.transformManager.navZ != 0 : this.transformManager.isSpinInternal && this.transformManager.internalRotationAxis.angle != 0 || this.transformManager.isSpinFixed && this.transformManager.fixedRotationAxis.angle != 0 || !this.transformManager.isSpinFixed && !this.transformManager.isSpinInternal && (this.transformManager.spinX != 0 || this.transformManager.spinY != 0 || this.transformManager.spinZ != 0));
this.targetTime = Clazz.floatToLong (++this.index * 1000 / this.myFps);
this.currentTime = System.currentTimeMillis () - this.startTime;
this.sleepTime = (this.targetTime - this.currentTime);
if (this.sleepTime < 0) {
if (!this.haveNotified) org.jmol.util.Logger.info ("spinFPS is set too fast (" + this.myFps + ") -- can't keep up!");
this.haveNotified = true;
this.startTime -= this.sleepTime;
this.sleepTime = 0;
}var isInMotion = (this.bsAtoms == null && this.viewer.getInMotion ());
if (isInMotion) {
if (this.$isGesture) {
mode = -2;
break;
}this.sleepTime += 1000;
}if (refreshNeeded && !isInMotion && (this.transformManager.spinOn || this.transformManager.navOn)) this.doTransform ();
mode = 1;
break;
case 1:
while (!this.checkInterrupted () && !this.viewer.getRefreshing ()) if (!this.runSleep (10, 1)) return;

if (this.bsAtoms == null) this.viewer.refresh (1, "SpinThread:run()");
 else this.viewer.requestRepaintAndWait ();
if (!this.isNav && this.nDegrees >= this.endDegrees - 0.001) this.transformManager.setSpinOff ();
if (!this.runSleep (this.sleepTime, 0)) return;
mode = 0;
break;
case -2:
if (this.bsAtoms != null && this.endPositions != null) {
this.viewer.setAtomCoord (this.bsAtoms, 1146095626, this.endPositions);
this.bsAtoms = null;
this.endPositions = null;
}if (!this.isReset) {
this.transformManager.setSpinOff ();
this.viewer.startHoverWatcher (true);
}this.resumeEval ();
return;
}

}, "~N");
Clazz.defineMethod (c$, "doTransform", 
($fz = function () {
if (this.isNav) {
this.transformManager.setNavigationOffsetRelative ();
} else if (this.transformManager.isSpinInternal || this.transformManager.isSpinFixed) {
this.angle = (this.transformManager.isSpinInternal ? this.transformManager.internalRotationAxis : this.transformManager.fixedRotationAxis).angle / this.myFps;
if (this.transformManager.isSpinInternal) {
this.transformManager.rotateAxisAngleRadiansInternal (this.angle, this.bsAtoms);
} else {
this.transformManager.rotateAxisAngleRadiansFixed (this.angle, this.bsAtoms);
}this.nDegrees += Math.abs (this.angle * 57.29577951308232);
} else {
if (this.transformManager.spinX != 0) {
this.transformManager.rotateXRadians (this.transformManager.spinX * 0.017453292 / this.myFps, null);
}if (this.transformManager.spinY != 0) {
this.transformManager.rotateYRadians (this.transformManager.spinY * 0.017453292 / this.myFps, null);
}if (this.transformManager.spinZ != 0) {
this.transformManager.rotateZRadians (this.transformManager.spinZ * 0.017453292 / this.myFps);
}}}, $fz.isPrivate = true, $fz));
});
