Clazz.declarePackage ("org.jmol.thread");
Clazz.load (["org.jmol.thread.JmolThread"], "org.jmol.thread.TimeoutThread", ["java.lang.Thread", "org.jmol.util.StringXBuilder"], function () {
c$ = Clazz.decorateAsClass (function () {
this.script = null;
this.status = 0;
this.triggered = true;
this.timeouts = null;
Clazz.instantialize (this, arguments);
}, org.jmol.thread, "TimeoutThread", org.jmol.thread.JmolThread);
Clazz.makeConstructor (c$, 
function (viewer, name, ms, script) {
Clazz.superConstructor (this, org.jmol.thread.TimeoutThread);
this.setViewer (viewer, name);
this.$name = name;
this.set (ms, script);
}, "org.jmol.viewer.Viewer,~S,~N,~S");
Clazz.defineMethod (c$, "set", 
($fz = function (ms, script) {
this.sleepTime = ms;
if (script != null) this.script = script;
}, $fz.isPrivate = true, $fz), "~N,~S");
Clazz.overrideMethod (c$, "toString", 
function () {
return "timeout name=" + this.$name + " executions=" + this.status + " mSec=" + this.sleepTime + " secRemaining=" + (this.targetTime - System.currentTimeMillis ()) / 1000 + " script=" + this.script;
});
Clazz.overrideMethod (c$, "run1", 
function (mode) {
while (true) switch (mode) {
case -1:
if (!this.isJS) Thread.currentThread ().setPriority (1);
this.timeouts = this.viewer.getTimeouts ();
this.targetTime = System.currentTimeMillis () + Math.abs (this.sleepTime);
mode = 0;
break;
case 0:
if (this.checkInterrupted () || this.script == null || this.script.length == 0) return;
if (!this.runSleep (26, 1)) return;
mode = 1;
break;
case 1:
mode = (System.currentTimeMillis () < this.targetTime ? 0 : 2);
break;
case 2:
this.currentTime = System.currentTimeMillis ();
if (this.timeouts.get (this.$name) == null) return;
this.status++;
var continuing = (this.sleepTime < 0);
this.targetTime = System.currentTimeMillis () + Math.abs (this.sleepTime);
if (!continuing) this.timeouts.remove (this.$name);
if (this.triggered) {
this.triggered = false;
this.viewer.evalStringQuiet ((continuing ? this.script + ";\ntimeout ID \"" + this.$name + "\";" : this.script));
}mode = (continuing ? 0 : -2);
break;
case -2:
this.timeouts.remove (this.$name);
return;
}

}, "~N");
c$.clear = Clazz.defineMethod (c$, "clear", 
function (timeouts) {
var e = timeouts.values ().iterator ();
while (e.hasNext ()) {
var t = e.next ();
if (!t.script.equals ("exitJmol")) t.interrupt ();
}
timeouts.clear ();
}, "java.util.Map");
c$.setTimeout = Clazz.defineMethod (c$, "setTimeout", 
function (viewer, timeouts, name, mSec, script) {
var t = timeouts.get (name);
if (mSec == 0) {
if (t != null) {
t.interrupt ();
timeouts.remove (name);
}return;
}if (t != null) {
t.set (mSec, script);
return;
}t =  new org.jmol.thread.TimeoutThread (viewer, name, mSec, script);
timeouts.put (name, t);
t.start ();
}, "org.jmol.viewer.Viewer,java.util.Map,~S,~N,~S");
c$.trigger = Clazz.defineMethod (c$, "trigger", 
function (timeouts, name) {
var t = timeouts.get (name);
if (t != null) t.triggered = (t.sleepTime < 0);
}, "java.util.Map,~S");
c$.showTimeout = Clazz.defineMethod (c$, "showTimeout", 
function (timeouts, name) {
var sb =  new org.jmol.util.StringXBuilder ();
if (timeouts != null) {
var e = timeouts.values ().iterator ();
while (e.hasNext ()) {
var t = e.next ();
if (name == null || t.$name.equalsIgnoreCase (name)) sb.append (t.toString ()).append ("\n");
}
}return (sb.length () > 0 ? sb.toString () : "<no timeouts set>");
}, "java.util.Map,~S");
});
