Clazz.declarePackage ("J.adapter.readers.pymol");
Clazz.load (["J.adapter.readers.cifpdb.PdbReader", "java.util.Hashtable", "J.util.BS", "$.JmolList", "$.P3"], "J.adapter.readers.pymol.PyMOLReader", ["java.lang.Boolean", "$.Character", "$.Float", "J.adapter.readers.pymol.ModelSettings", "$.PickleReader", "$.PyMOL", "$.PyMOLAtom", "J.adapter.smarter.Bond", "$.Structure", "J.atomdata.RadiusData", "J.constant.EnumStructure", "$.EnumVdw", "J.modelset.MeasurementData", "J.util.ArrayUtil", "$.BSUtil", "$.BoxInfo", "$.C", "$.ColorUtil", "$.Escape", "$.Logger", "$.Point3fi", "$.SB", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.allowSurface = true;
this.doResize = false;
this.settings = null;
this.localSettings = null;
this.settingCount = 0;
this.atomCount0 = 0;
this.$atomCount = 0;
this.strucNo = 0;
this.isHidden = false;
this.pymolAtoms = null;
this.bsBondedPyMOL = null;
this.bsBondedJmol = null;
this.bsHidden = null;
this.bsNucleic = null;
this.bsNoSurface = null;
this.haveTraceOrBackbone = false;
this.haveNucleicLadder = false;
this.atomMap = null;
this.htSpacefill = null;
this.htAtomMap = null;
this.ssMapSeq = null;
this.ssMapAtom = null;
this.atomColorList = null;
this.labels = null;
this.modelSettings = null;
this.colixes = null;
this.isStateScript = false;
this.width = 0;
this.height = 0;
this.valence = false;
this.xyzMin = null;
this.xyzMax = null;
this.nModels = 0;
this.logging = false;
this.reps = null;
this.cartoonTranslucency = 0;
this.sphereTranslucency = 0;
this.stickTranslucency = 0;
this.cartoonLadderMode = false;
this.solventAsSpheres = false;
this.movie = null;
this.isMovie = false;
this.pymol = null;
this.lstStates = null;
this.htNames = null;
this.lstTrajectories = null;
this.currentFrame = -1;
this.pymolFrame = 0;
this.allStates = false;
this.totalAtomCount = 0;
this.branchName = null;
this.bsModelAtoms = null;
this.branchID = 0;
this.nonBondedSize = 0;
this.sphereScale = 0;
this.selections = null;
this.uniqueSettings = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.pymol, "PyMOLReader", J.adapter.readers.cifpdb.PdbReader);
Clazz.prepareFields (c$, function () {
this.bsBondedPyMOL =  new J.util.BS ();
this.bsBondedJmol =  new J.util.BS ();
this.bsHidden =  new J.util.BS ();
this.bsNucleic =  new J.util.BS ();
this.bsNoSurface =  new J.util.BS ();
this.htSpacefill =  new java.util.Hashtable ();
this.htAtomMap =  new java.util.Hashtable ();
this.ssMapSeq =  new java.util.Hashtable ();
this.ssMapAtom =  new java.util.Hashtable ();
this.atomColorList =  new J.util.JmolList ();
this.labels =  new J.util.JmolList ();
this.modelSettings =  new J.util.JmolList ();
this.xyzMin = J.util.P3.new3 (1e6, 1e6, 1e6);
this.xyzMax = J.util.P3.new3 (-1000000.0, -1000000.0, -1000000.0);
this.reps =  new Array (16);
this.pymol =  new java.util.Hashtable ();
this.lstStates =  new J.util.JmolList ();
this.htNames =  new java.util.Hashtable ();
this.lstTrajectories =  new J.util.JmolList ();
this.bsModelAtoms = J.util.BS.newN (1000);
});
$_M(c$, "initializeReader", 
function () {
this.isBinary = true;
this.isStateScript = this.htParams.containsKey ("isStateScript");
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("noAutoBond", Boolean.TRUE);
this.atomSetCollection.setAtomSetAuxiliaryInfo ("pdbNoHydrogens", Boolean.TRUE);
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("isPyMOL", Boolean.TRUE);
Clazz.superCall (this, J.adapter.readers.pymol.PyMOLReader, "initializeReader", []);
});
Clazz.overrideMethod (c$, "processBinaryDocument", 
function (doc) {
this.doResize = this.checkFilterKey ("DORESIZE");
this.allowSurface = !this.checkFilterKey ("NOSURFACE");
var reader =  new J.adapter.readers.pymol.PickleReader (doc, this.viewer);
this.logging = false;
var map = reader.getMap (this.logging);
reader = null;
this.process (map);
}, "J.api.JmolDocument");
$_M(c$, "process", 
($fz = function (map) {
this.logging = (this.viewer.getLogFile ().length > 0);
var names = J.adapter.readers.pymol.PyMOLReader.getMapList (map, "names");
for (var e, $e = map.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) {
var name = e.getKey ();
J.util.Logger.info (name);
if (name.equals ("names")) {
for (var i = 1; i < names.size (); i++) J.util.Logger.info ("  " + J.adapter.readers.pymol.PyMOLReader.getString (J.adapter.readers.pymol.PyMOLReader.getList (names, i), 0));

} else if (name.equals ("version")) {
this.appendLoadNote ("PyMOL version: " + map.get ("version").toString ());
}}
if (this.logging) {
if (this.logging) this.viewer.log ("$CLEAR$");
for (var e, $e = map.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) {
var name = e.getKey ();
if (!"names".equals (name)) {
this.viewer.log ("\n===" + name + "===");
this.viewer.log (J.util.TextFormat.simpleReplace (e.getValue ().toString (), "[", "\n["));
}}
this.viewer.log ("\n===names===");
for (var i = 1; i < names.size (); i++) {
this.viewer.log ("");
var list = names.get (i);
this.viewer.log (" =" + list.get (0).toString () + "=");
try {
this.viewer.log (J.util.TextFormat.simpleReplace (list.toString (), "[", "\n["));
} catch (e) {
e.printStackTrace ();
}
}
}this.addColors (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "colors"));
this.settings = J.adapter.readers.pymol.PyMOLReader.getMapList (map, "settings");
this.settingCount = this.settings.size ();
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("settings", this.settings);
this.setUniqueSettings (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "unique_settings"));
this.allStates = this.getBooleanSetting (49);
this.pymolFrame = Clazz.floatToInt (this.getFloatSetting (194));
var mov = J.adapter.readers.pymol.PyMOLReader.getMapList (map, "movie");
if (mov != null && !this.allStates) {
var frameCount = J.adapter.readers.pymol.PyMOLReader.getInt (mov, 0);
if (frameCount > 0) {
this.currentFrame = Clazz.floatToInt (this.getFloatSetting (194));
this.isMovie = true;
this.movie =  new java.util.Hashtable ();
this.movie.put ("states", this.lstStates);
this.movie.put ("frameCount", Integer.$valueOf (frameCount));
this.movie.put ("frames", J.adapter.readers.pymol.PyMOLReader.getList (mov, 4));
this.movie.put ("currentFrame", Integer.$valueOf (this.currentFrame));
this.pymol.put ("movie", this.movie);
this.appendLoadNote ("PyMOL movie frameCount = " + frameCount);
}}if (!this.isStateScript && this.doResize) {
try {
this.width = J.adapter.readers.pymol.PyMOLReader.getInt (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "main"), 0);
this.height = J.adapter.readers.pymol.PyMOLReader.getInt (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "main"), 1);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
if (this.width > 0 && this.height > 0) {
this.appendLoadNote ("PyMOL dimensions width=" + this.width + " height=" + this.height);
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("perferredWidthHeight", [this.width, this.height]);
var d = this.viewer.resizeInnerPanel (this.width, this.height);
this.width = d.width;
this.height = d.height;
} else {
this.appendLoadNote ("PyMOL dimensions unknown");
}}this.totalAtomCount = this.getTotalAtomCount (names);
J.util.Logger.info ("PyMOL total atom count = " + this.totalAtomCount);
this.selections =  new J.util.JmolList ();
for (var i = 1; i < names.size (); i++) this.processBranch (J.adapter.readers.pymol.PyMOLReader.getList (names, i));

this.processSelections ();
if (this.isMovie) {
this.appendLoadNote ("PyMOL trajectories read: " + this.lstTrajectories.size ());
this.atomSetCollection.finalizeTrajectoryAs (this.lstTrajectories, null);
}this.setDefinitions ();
this.setRendering (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "view"));
}, $fz.isPrivate = true, $fz), "java.util.Map");
$_M(c$, "setDefinitions", 
($fz = function () {
this.modelSettings.addLast ( new J.adapter.readers.pymol.ModelSettings (1060866, null, this.htNames));
this.appendLoadNote (this.viewer.getAtomDefs (this.htNames));
}, $fz.isPrivate = true, $fz));
$_M(c$, "getTotalAtomCount", 
($fz = function (names) {
var n = 0;
for (var i = 1; i < names.size (); i++) {
var branch = J.adapter.readers.pymol.PyMOLReader.getList (names, i);
var type = J.adapter.readers.pymol.PyMOLReader.getBranchType (branch);
if (type == 1 && this.checkBranch (branch)) {
var deepBranch = J.adapter.readers.pymol.PyMOLReader.getList (branch, 5);
if (this.isMovie) {
n += J.adapter.readers.pymol.PyMOLReader.getBranchAtoms (deepBranch).size ();
} else {
var states = J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 4);
var ns = states.size ();
for (var j = 0; j < ns; j++) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, j);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
n += idxToAtm.size ();
}
}}}
return n;
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "addColors", 
($fz = function (colors) {
if (colors == null || colors.size () == 0) return;
var pt =  new J.util.P3 ();
for (var i = colors.size (); --i >= 0; ) {
var c = J.adapter.readers.pymol.PyMOLReader.getList (colors, i);
J.adapter.readers.pymol.PyMOL.addColor (c.get (1), J.util.ColorUtil.colorPtToInt (this.getPoint (J.adapter.readers.pymol.PyMOLReader.getList (c, 2), 0, pt)));
}
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
c$.getString = $_M(c$, "getString", 
($fz = function (list, i) {
var s = list.get (i);
return (s.length == 0 ? " " : s);
}, $fz.isPrivate = true, $fz), "J.util.JmolList,~N");
c$.getInt = $_M(c$, "getInt", 
($fz = function (list, i) {
return (list.get (i)).intValue ();
}, $fz.isPrivate = true, $fz), "J.util.JmolList,~N");
c$.getFloatAt = $_M(c$, "getFloatAt", 
($fz = function (list, i) {
return (list == null ? 0 : (list.get (i)).floatValue ());
}, $fz.isPrivate = true, $fz), "J.util.JmolList,~N");
$_M(c$, "getPoint", 
($fz = function (list, i, pt) {
pt.set (J.adapter.readers.pymol.PyMOLReader.getFloatAt (list, i++), J.adapter.readers.pymol.PyMOLReader.getFloatAt (list, i++), J.adapter.readers.pymol.PyMOLReader.getFloatAt (list, i));
return pt;
}, $fz.isPrivate = true, $fz), "J.util.JmolList,~N,J.util.P3");
c$.getList = $_M(c$, "getList", 
($fz = function (list, i) {
if (list == null || list.size () <= i) return null;
var o = list.get (i);
return (Clazz.instanceOf (o, J.util.JmolList) ? o : null);
}, $fz.isPrivate = true, $fz), "J.util.JmolList,~N");
c$.getMapList = $_M(c$, "getMapList", 
($fz = function (map, key) {
return map.get (key);
}, $fz.isPrivate = true, $fz), "java.util.Map,~S");
$_M(c$, "getBooleanSetting", 
($fz = function (i) {
return (this.getFloatSetting (i) != 0);
}, $fz.isPrivate = true, $fz), "~N");
$_M(c$, "getFloatSetting", 
($fz = function (i) {
if (i >= this.settingCount) return 0;
var setting = null;
if (this.localSettings != null) {
setting = this.localSettings.get (Integer.$valueOf (i));
}if (setting == null) setting = J.adapter.readers.pymol.PyMOLReader.getList (this.settings, i);
var v = (setting.get (2)).floatValue ();
J.util.Logger.info ("Pymol setting " + i + " = " + v);
return v;
}, $fz.isPrivate = true, $fz), "~N");
$_M(c$, "processBranch", 
($fz = function (branch) {
var type = J.adapter.readers.pymol.PyMOLReader.getBranchType (branch);
if (!this.checkBranch (branch)) return;
J.util.Logger.info ("PyMOL model " + (this.nModels + 1) + " Branch " + this.branchName + (this.isHidden ? " (hidden)" : " (visible)"));
var deepBranch = J.adapter.readers.pymol.PyMOLReader.getList (branch, 5);
this.branchID = 0;
switch (type) {
case -1:
this.selections.addLast (branch);
break;
case 1:
this.processBranchModels (deepBranch);
break;
case 4:
this.processBranchMeasure (deepBranch);
break;
case 2:
case 3:
case 6:
case 7:
case 12:
System.out.println ("Unprocessed branch type " + type);
break;
}
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "processSelections", 
($fz = function () {
for (var i = this.selections.size (); --i >= 0; ) {
var branch = this.selections.get (i);
this.checkBranch (branch);
this.processBranchSelection (J.adapter.readers.pymol.PyMOLReader.getList (branch, 5));
}
}, $fz.isPrivate = true, $fz));
$_M(c$, "processBranchSelection", 
($fz = function (deepBranch) {
var bs =  new J.util.BS ();
for (var j = deepBranch.size (); --j >= 0; ) {
var data = J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, j);
var parent = J.adapter.readers.pymol.PyMOLReader.getString (data, 0);
this.atomMap = this.htAtomMap.get (parent);
if (this.atomMap == null) continue;
var atoms = J.adapter.readers.pymol.PyMOLReader.getList (data, 1);
for (var i = atoms.size (); --i >= 0; ) {
var ia = this.atomMap[J.adapter.readers.pymol.PyMOLReader.getInt (atoms, i)];
if (ia >= 0) bs.set (ia);
}
}
if (!bs.isEmpty ()) this.addName (this.branchName, bs);
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "checkBranch", 
($fz = function (branch) {
this.branchName = J.adapter.readers.pymol.PyMOLReader.getString (branch, 0);
this.isHidden = (J.adapter.readers.pymol.PyMOLReader.getInt (branch, 2) != 1);
return (this.branchName.indexOf ("_") != 0);
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "processBranchMeasure", 
($fz = function (deepBranch) {
if (this.isHidden) return;
J.util.Logger.info ("PyMOL measure " + this.branchName);
var measure = J.adapter.readers.pymol.PyMOLReader.getList (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 2), 0);
var color = J.adapter.readers.pymol.PyMOLReader.getInt (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 0), 2);
var pt;
var nCoord = (Clazz.instanceOf (measure.get (pt = 1), J.util.JmolList) ? 2 : Clazz.instanceOf (measure.get (pt = 4), J.util.JmolList) ? 3 : Clazz.instanceOf (measure.get (pt = 6), J.util.JmolList) ? 4 : 0);
if (nCoord == 0) return;
var list = J.adapter.readers.pymol.PyMOLReader.getList (measure, pt);
var len = list.size ();
var p = 0;
var rad = this.getFloatSetting (107) / 1000;
if (rad == 0) rad = 0.002;
while (p < len) {
var points =  new J.util.JmolList ();
for (var i = 0; i < nCoord; i++, p += 3) points.addLast (this.getPoint (list, p,  new J.util.Point3fi ()));

var bs = J.util.BSUtil.newAndSetBit (0);
var md =  new J.modelset.MeasurementData (this.viewer, points);
md.note = this.branchName;
var strFormat = "";
var nDigits = -1;
switch (nCoord) {
case 2:
nDigits = Clazz.floatToInt (this.getFloatSetting (530));
break;
case 3:
nDigits = Clazz.floatToInt (this.getFloatSetting (531));
break;
case 4:
nDigits = Clazz.floatToInt (this.getFloatSetting (532));
break;
}
if (nDigits > 0) strFormat = nCoord + ":%0." + nDigits + "VALUE %UNITS";
 else strFormat = "";
md.strFormat = strFormat;
md.colix = J.util.C.getColix (J.adapter.readers.pymol.PyMOL.getRGB (color));
var ms =  new J.adapter.readers.pymol.ModelSettings (6, bs, md);
ms.setSize (rad);
this.modelSettings.addLast (ms);
}
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "processBranchModels", 
($fz = function (deepBranch) {
var branchInfo = J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 0);
this.setLocalSettings (J.adapter.readers.pymol.PyMOLReader.getList (branchInfo, 8));
if (this.isMovie) {
} else {
this.processCryst (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 10));
}this.$atomCount = this.atomCount0 = this.atomSetCollection.getAtomCount ();
this.atomMap =  Clazz.newIntArray (J.adapter.readers.pymol.PyMOLReader.getInt (deepBranch, 3), 0);
this.htAtomMap.put (this.branchName, this.atomMap);
var states = J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 4);
var bonds = this.processBonds (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 6));
this.pymolAtoms = J.adapter.readers.pymol.PyMOLReader.getBranchAtoms (deepBranch);
var ns = states.size ();
if (ns > 1) System.out.println (ns + " PyMOL states");
if (ns == 1) this.allStates = true;
var bsState = null;
var bsAtoms = J.util.BS.newN (this.atomCount0 + this.pymolAtoms.size ());
this.addName (this.branchName, bsAtoms);
for (var i = 0; i < 16; i++) this.reps[i] = J.util.BS.newN (1000);

J.util.Logger.info ("PyMOL molecule " + this.branchName);
if (this.isMovie) {
if (this.nModels == 0) this.model (++this.nModels);
var n = this.pymolAtoms.size ();
bsState = J.util.BS.newN (n);
if (this.lstTrajectories.size () == 0) {
for (var i = ns; --i >= 0; ) {
this.lstTrajectories.addLast ( new Array (this.totalAtomCount));
this.lstStates.addLast ( new J.util.BS ());
}
}for (var i = ns; --i >= 0; ) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, i);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
if (idxToAtm == null) {
System.out.println ("movie error: no idxToAtm");
continue;
}for (var j = idxToAtm.size (); --j >= 0; ) bsState.set (J.adapter.readers.pymol.PyMOLReader.getInt (idxToAtm, j));

}
for (var i = bsState.nextSetBit (0); i >= 0; i = bsState.nextSetBit (i + 1)) if (!this.addAtom (this.pymolAtoms, i, -1, null, bsAtoms)) bsState.clear (i);

for (var i = 0; i < ns; i++) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, i);
var coords = J.adapter.readers.pymol.PyMOLReader.getList (state, 2);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
if (idxToAtm == null) continue;
var trajectory = this.lstTrajectories.get (i);
var bs = this.lstStates.get (i);
for (var j = idxToAtm.size (); --j >= 0; ) {
var apt = J.adapter.readers.pymol.PyMOLReader.getInt (idxToAtm, j);
if (!bsState.get (apt)) continue;
var ia = this.atomMap[apt];
bs.set (ia);
var cpt = j * 3;
var x = J.adapter.readers.pymol.PyMOLReader.getFloatAt (coords, cpt);
var y = J.adapter.readers.pymol.PyMOLReader.getFloatAt (coords, ++cpt);
var z = J.adapter.readers.pymol.PyMOLReader.getFloatAt (coords, ++cpt);
trajectory[ia] = J.util.P3.new3 (x, y, z);
J.util.BoxInfo.addPointXYZ (x, y, z, this.xyzMin, this.xyzMax, 0);
}
}
this.processStructures ();
this.setBranchShapes ();
} else {
ns = 1;
this.lstStates.clear ();
for (var i = 0; i < ns; i++) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, i);
var coords = J.adapter.readers.pymol.PyMOLReader.getList (state, 2);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
var n = idxToAtm.size ();
var name = J.adapter.readers.pymol.PyMOLReader.getString (state, 5).trim ();
if (n == 0) continue;
this.branchID++;
if (name.length == 0) {
this.currentFrame = this.pymolFrame;
if (this.lstStates.size () < ns) for (var j = this.lstStates.size (); j < ns; j++) this.lstStates.addLast ( new J.util.BS ());

bsState = this.lstStates.get (i);
} else {
bsAtoms = J.util.BS.newN (this.atomCount0 + this.pymolAtoms.size ());
this.addName (name, bsAtoms);
}this.model (++this.nModels);
for (var idx = 0; idx < n; idx++) this.addAtom (this.pymolAtoms, J.adapter.readers.pymol.PyMOLReader.getInt (idxToAtm, idx), idx, coords, bsState);

if (bsState != null) {
bsAtoms.or (bsState);
}this.processStructures ();
this.setBranchShapes ();
}
}this.setBonds (bonds);
J.util.Logger.info ("reading " + (this.$atomCount - this.atomCount0) + " atoms");
this.dumpBranch ();
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "setAtomReps", 
($fz = function (iAtom) {
var atom = this.atomSetCollection.getAtom (iAtom);
for (var i = 0; i < 12; i++) if (atom.bsReps.get (i)) this.reps[i].set (iAtom);

if (this.reps[3].get (iAtom)) {
if (atom.label.equals (" ")) this.reps[3].clear (iAtom);
 else this.labels.addLast (atom.label);
}var isSphere = this.reps[1].get (iAtom);
if (!isSphere && !this.solventAsSpheres && this.reps[11].get (iAtom) && !atom.bonded) {
this.reps[4].clear (iAtom);
this.reps[11].clear (iAtom);
this.reps[15].set (iAtom);
}var rad = 0;
if (isSphere) {
var mySphereSize = this.getUniqueFloat (atom.uniqueID, 155, this.sphereScale);
rad = atom.radius * mySphereSize;
} else if (this.reps[11].get (iAtom) || this.reps[4].get (iAtom)) {
var myNonBondedSize = this.getUniqueFloat (atom.uniqueID, 65, this.nonBondedSize);
rad = -atom.radius * myNonBondedSize;
}if (rad != 0) this.addSpacefill (iAtom, rad);
if (this.reps[5].get (iAtom)) {
switch (atom.cartoonType) {
case -1:
this.reps[5].clear (iAtom);
break;
case 1:
this.reps[13].set (iAtom);
break;
case 4:
this.reps[13].set (iAtom);
break;
case 7:
this.reps[5].clear (iAtom);
this.reps[14].set (iAtom);
break;
}
}}, $fz.isPrivate = true, $fz), "~N");
$_M(c$, "setBonds", 
($fz = function (bonds) {
var n = bonds.size ();
for (var i = 0; i < n; i++) {
var bond = bonds.get (i);
bond.atomIndex1 = this.atomMap[bond.atomIndex1];
bond.atomIndex2 = this.atomMap[bond.atomIndex2];
if (bond.atomIndex1 >= 0 && bond.atomIndex2 >= 0) this.atomSetCollection.addBond (bond);
}
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "setLocalSettings", 
($fz = function (list) {
this.localSettings =  new java.util.Hashtable ();
if (list != null && list.size () != 0) {
J.util.Logger.info (list.toString ());
for (var i = list.size (); --i >= 0; ) {
var setting = list.get (i);
this.localSettings.put (setting.get (0), setting);
}
}this.nonBondedSize = this.getFloatSetting (65);
this.sphereScale = this.getFloatSetting (155);
this.valence = this.getBooleanSetting (64);
this.cartoonTranslucency = this.getFloatSetting (279);
this.stickTranslucency = this.getFloatSetting (198);
this.sphereTranslucency = this.getFloatSetting (172);
this.cartoonLadderMode = this.getBooleanSetting (448);
this.solventAsSpheres = this.getBooleanSetting (203);
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "setUniqueSettings", 
($fz = function (list) {
this.uniqueSettings =  new java.util.Hashtable ();
if (list != null && list.size () != 0) {
for (var i = list.size (); --i >= 0; ) {
var atomSettings = list.get (i);
var id = J.adapter.readers.pymol.PyMOLReader.getInt (atomSettings, 0);
var mySettings = atomSettings.get (1);
for (var j = mySettings.size (); --j >= 0; ) {
var setting = mySettings.get (j);
var uid = id * 1000 + J.adapter.readers.pymol.PyMOLReader.getInt (setting, 0);
this.uniqueSettings.put (Integer.$valueOf (uid), setting);
System.out.println ("PyMOL unique setting " + id + " " + setting);
}
}
}}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "getUniqueFloat", 
($fz = function (id, key, defaultValue) {
var setting;
if (id < 0 || (setting = this.uniqueSettings.get (Integer.$valueOf (id * 1000 + key))) == null) return defaultValue;
var v = (setting.get (2)).floatValue ();
J.util.Logger.info ("Pymol unique setting for " + id + ": " + key + " = " + v);
return v;
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
$_M(c$, "addName", 
($fz = function (name, bs) {
this.htNames.put (J.adapter.readers.pymol.PyMOLReader.fixName (name), bs);
}, $fz.isPrivate = true, $fz), "~S,J.util.BS");
c$.fixName = $_M(c$, "fixName", 
($fz = function (name) {
var chars = name.toLowerCase ().toCharArray ();
for (var i = chars.length; --i >= 0; ) if (!Character.isLetterOrDigit (chars[i])) chars[i] = '_';

return "__" + String.valueOf (chars);
}, $fz.isPrivate = true, $fz), "~S");
c$.getBranchType = $_M(c$, "getBranchType", 
($fz = function (branch) {
return J.adapter.readers.pymol.PyMOLReader.getInt (branch, 4);
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
c$.getBranchAtoms = $_M(c$, "getBranchAtoms", 
($fz = function (deepBranch) {
return J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 7);
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "model", 
function (modelNumber) {
this.bsModelAtoms.clearAll ();
Clazz.superCall (this, J.adapter.readers.pymol.PyMOLReader, "model", [modelNumber]);
}, "~N");
$_M(c$, "addAtom", 
($fz = function (pymolAtoms, apt, icoord, coords, bsState) {
this.atomMap[apt] = -1;
var a = J.adapter.readers.pymol.PyMOLReader.getList (pymolAtoms, apt);
var seqNo = J.adapter.readers.pymol.PyMOLReader.getInt (a, 0);
var chainID = J.adapter.readers.pymol.PyMOLReader.getString (a, 1);
var altLoc = J.adapter.readers.pymol.PyMOLReader.getString (a, 2);
var insCode = " ";
var name = J.adapter.readers.pymol.PyMOLReader.getString (a, 6);
var group3 = J.adapter.readers.pymol.PyMOLReader.getString (a, 5);
if (group3.length > 3) group3 = group3.substring (0, 3);
if (group3.equals (" ")) group3 = "UNK";
var isNucleic = (J.adapter.readers.pymol.PyMOLReader.nucleic.indexOf (group3) >= 0);
if (isNucleic) this.bsNucleic.set (this.$atomCount);
var sym = J.adapter.readers.pymol.PyMOLReader.getString (a, 7);
if (sym.equals ("A")) sym = "C";
var isHetero = (J.adapter.readers.pymol.PyMOLReader.getInt (a, 19) != 0);
var atom = this.processAtom ( new J.adapter.readers.pymol.PyMOLAtom (), name, altLoc.charAt (0), group3, chainID.charAt (0), seqNo, insCode.charAt (0), isHetero, sym);
if (!this.filterPDBAtom (atom, this.fileAtomIndex++)) return false;
atom.label = J.adapter.readers.pymol.PyMOLReader.getString (a, 9);
var ss = J.adapter.readers.pymol.PyMOLReader.getString (a, 10);
if (seqNo >= -1000 && (!ss.equals (" ") || name.equals ("CA"))) {
if (this.ssMapAtom.get (ss) == null) this.ssMapAtom.put (ss,  new J.util.BS ());
var bs = this.ssMapSeq.get (ss);
if (bs == null) this.ssMapSeq.put (ss, bs =  new J.util.BS ());
bs.set (seqNo - -1000);
ss += chainID;
bs = this.ssMapSeq.get (ss);
if (bs == null) this.ssMapSeq.put (ss, bs =  new J.util.BS ());
bs.set (seqNo - -1000);
}atom.bfactor = J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 14);
atom.occupancy = Clazz.floatToInt (J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 15) * 100);
atom.radius = J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 16);
atom.partialCharge = J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 17);
var formalCharge = J.adapter.readers.pymol.PyMOLReader.getInt (a, 18);
atom.bsReps = this.getBsReps (J.adapter.readers.pymol.PyMOLReader.getList (a, 20));
var serNo = J.adapter.readers.pymol.PyMOLReader.getInt (a, 22);
atom.cartoonType = J.adapter.readers.pymol.PyMOLReader.getInt (a, 23);
atom.flags = J.adapter.readers.pymol.PyMOLReader.getInt (a, 24);
atom.bonded = J.adapter.readers.pymol.PyMOLReader.getInt (a, 25) != 0;
if (a.size () > 40 && J.adapter.readers.pymol.PyMOLReader.getInt (a, 40) == 1) atom.uniqueID = J.adapter.readers.pymol.PyMOLReader.getInt (a, 32);
if ((atom.flags & J.adapter.readers.pymol.PyMOL.FLAG_NOSURFACE) != 0) {
this.bsNoSurface.set (this.$atomCount);
}var translucency = this.getUniqueFloat (atom.uniqueID, 172, this.sphereTranslucency);
var atomColor = J.adapter.readers.pymol.PyMOLReader.getInt (a, 21);
this.atomColorList.addLast (this.getColix (atomColor, translucency));
this.bsHidden.setBitTo (this.$atomCount, this.isHidden);
this.bsModelAtoms.set (this.$atomCount);
if (bsState != null) bsState.set (this.$atomCount);
var cpt = icoord * 3;
var x = J.adapter.readers.pymol.PyMOLReader.getFloatAt (coords, cpt);
var y = J.adapter.readers.pymol.PyMOLReader.getFloatAt (coords, ++cpt);
var z = J.adapter.readers.pymol.PyMOLReader.getFloatAt (coords, ++cpt);
J.util.BoxInfo.addPointXYZ (x, y, z, this.xyzMin, this.xyzMax, 0);
this.processAtom2 (atom, serNo, x, y, z, formalCharge);
if (a.size () > 46) {
var data =  Clazz.newFloatArray (7, 0);
for (var i = 0; i < 6; i++) data[i] = J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, i + 41);

this.atomSetCollection.setAnisoBorU (atom, data, 12);
}this.setAtomReps (this.$atomCount);
this.atomMap[apt] = this.$atomCount++;
return true;
}, $fz.isPrivate = true, $fz), "J.util.JmolList,~N,~N,J.util.JmolList,J.util.BS");
$_M(c$, "getColix", 
($fz = function (colorIndex, translucency) {
return Integer.$valueOf (J.util.C.getColixTranslucent3 (J.util.C.getColixO (Integer.$valueOf (J.adapter.readers.pymol.PyMOL.getRGB (colorIndex))), translucency > 0, translucency));
}, $fz.isPrivate = true, $fz), "~N,~N");
$_M(c$, "getBsReps", 
($fz = function (list) {
var bsReps =  new J.util.BS ();
for (var i = 0; i < 12; i++) if (J.adapter.readers.pymol.PyMOLReader.getInt (list, i) == 1) bsReps.set (i);

return bsReps;
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "dumpBranch", 
($fz = function () {
J.util.Logger.info ("----------");
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "setAdditionalAtomParameters", 
function (atom) {
}, "J.adapter.smarter.Atom");
$_M(c$, "processStructures", 
($fz = function () {
if (this.atomSetCollection.bsStructuredModels == null) this.atomSetCollection.bsStructuredModels =  new J.util.BS ();
this.atomSetCollection.bsStructuredModels.set (Math.max (this.atomSetCollection.getCurrentAtomSetIndex (), 0));
this.processSS ("H", this.ssMapAtom.get ("H"), J.constant.EnumStructure.HELIX, 0);
this.processSS ("S", this.ssMapAtom.get ("S"), J.constant.EnumStructure.SHEET, 1);
this.processSS ("L", this.ssMapAtom.get ("L"), J.constant.EnumStructure.TURN, 0);
this.processSS (" ", this.ssMapAtom.get (" "), J.constant.EnumStructure.NONE, 0);
this.ssMapSeq =  new java.util.Hashtable ();
}, $fz.isPrivate = true, $fz));
$_M(c$, "processSS", 
($fz = function (ssType, bsAtom, type, strandCount) {
if (this.ssMapSeq.get (ssType) == null) return;
var istart = -1;
var iend = -1;
var ichain = '\u0000';
var atoms = this.atomSetCollection.getAtoms ();
var bsSeq = null;
var n = this.$atomCount + 1;
var seqNo = -1;
var thischain = '\u0000';
var imodel = -1;
var thismodel = -1;
for (var i = this.atomCount0; i < n; i++) {
if (i == this.$atomCount) {
thischain = '\0';
} else {
seqNo = atoms[i].sequenceNumber;
thischain = atoms[i].chainID;
thismodel = atoms[i].atomSetIndex;
}if (thischain != ichain || thismodel != imodel) {
ichain = thischain;
imodel = thismodel;
bsSeq = this.ssMapSeq.get (ssType + thischain);
--i;
if (istart < 0) continue;
} else if (bsSeq != null && seqNo >= -1000 && bsSeq.get (seqNo - -1000)) {
iend = i;
if (istart < 0) istart = i;
continue;
} else if (istart < 0) {
continue;
}if (type !== J.constant.EnumStructure.NONE) {
var structure =  new J.adapter.smarter.Structure (imodel, type, type, type.toString (), ++this.strucNo, strandCount);
var a = atoms[istart];
var b = atoms[iend];
structure.set (a.chainID, a.sequenceNumber, a.insertionCode, b.chainID, b.sequenceNumber, b.insertionCode);
this.atomSetCollection.addStructure (structure);
}bsAtom.setBits (istart, iend + 1);
istart = -1;
}
}, $fz.isPrivate = true, $fz), "~S,J.util.BS,J.constant.EnumStructure,~N");
$_M(c$, "processBonds", 
($fz = function (bonds) {
var bondList =  new J.util.JmolList ();
this.bsBondedPyMOL.clear (this.totalAtomCount);
var color = Clazz.floatToInt (this.getFloatSetting (376));
var radius = this.getFloatSetting (21) / 2;
var translucency = this.getFloatSetting (198);
var n = bonds.size ();
for (var i = 0; i < n; i++) {
var b = J.adapter.readers.pymol.PyMOLReader.getList (bonds, i);
var order = (this.valence ? J.adapter.readers.pymol.PyMOLReader.getInt (b, 2) : 1);
if (order < 1 || order > 3) order = 1;
var ia = J.adapter.readers.pymol.PyMOLReader.getInt (b, 0);
var ib = J.adapter.readers.pymol.PyMOLReader.getInt (b, 1);
this.bsBondedPyMOL.set (ia);
this.bsBondedPyMOL.set (ib);
var bond =  new J.adapter.smarter.Bond (ia, ib, order);
bondList.addLast (bond);
var c;
var rad;
var t;
var hasID = (b.size () > 6 && J.adapter.readers.pymol.PyMOLReader.getInt (b, 6) != 0);
if (hasID) {
var id = J.adapter.readers.pymol.PyMOLReader.getInt (b, 5);
rad = this.getUniqueFloat (id, 21, radius) / 2;
c = Clazz.floatToInt (this.getUniqueFloat (id, 376, color));
t = this.getUniqueFloat (id, 198, translucency);
} else {
rad = radius;
c = color;
t = translucency;
}bond.radius = rad;
if (c >= 0) bond.colix = J.util.C.getColixTranslucent3 (J.util.C.getColix (J.adapter.readers.pymol.PyMOL.getRGB (c)), t > 0, t);
}
return bondList;
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "processCryst", 
($fz = function (cryst) {
if (cryst == null || cryst.size () == 0) return;
var l = J.adapter.readers.pymol.PyMOLReader.getList (J.adapter.readers.pymol.PyMOLReader.getList (cryst, 0), 0);
var a = J.adapter.readers.pymol.PyMOLReader.getList (J.adapter.readers.pymol.PyMOLReader.getList (cryst, 0), 1);
this.setUnitCell (J.adapter.readers.pymol.PyMOLReader.getFloatAt (l, 0), J.adapter.readers.pymol.PyMOLReader.getFloatAt (l, 1), J.adapter.readers.pymol.PyMOLReader.getFloatAt (l, 2), J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 0), J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 1), J.adapter.readers.pymol.PyMOLReader.getFloatAt (a, 2));
this.setSpaceGroupName (J.adapter.readers.pymol.PyMOLReader.getString (cryst, 1));
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "setRendering", 
($fz = function (view) {
if (this.isStateScript) return;
this.setJmolDefaults ();
var sb =  new J.util.SB ();
this.setView (sb, view);
this.setFrame ();
if (!this.bsHidden.isEmpty ()) this.modelSettings.addLast ( new J.adapter.readers.pymol.ModelSettings (3145770, this.bsHidden, null));
this.addJmolScript (sb.toString ());
}, $fz.isPrivate = true, $fz), "J.util.JmolList");
$_M(c$, "setJmolDefaults", 
($fz = function () {
this.viewer.setBooleanProperty ("navigationMode", false);
this.viewer.setBooleanProperty ("zoomLarge", false);
this.viewer.setBooleanProperty ("ssBondsBackbone", false);
this.viewer.setStringProperty ("measurementUnits", "ANGSTROMS");
}, $fz.isPrivate = true, $fz));
$_M(c$, "setBranchShapes", 
($fz = function () {
if (this.isStateScript) return;
var bs = J.util.BSUtil.newBitSet2 (this.atomCount0, this.$atomCount);
var ms =  new J.adapter.readers.pymol.ModelSettings (0, bs, null);
this.colixes = this.setColors (this.colixes, this.atomColorList);
ms.setSize (0);
ms.setColors (this.colixes, 0);
this.modelSettings.addLast (ms);
ms =  new J.adapter.readers.pymol.ModelSettings (1, bs, null);
ms.setSize (0);
this.modelSettings.addLast (ms);
this.setSpacefill ();
this.cleanSingletonCartoons (this.reps[5]);
this.reps[13].and (this.reps[5]);
this.reps[5].andNot (this.reps[13]);
for (var i = 0; i < 16; i++) this.setShape (i);

this.setSurface ();
this.ssMapAtom =  new java.util.Hashtable ();
}, $fz.isPrivate = true, $fz));
$_M(c$, "setColors", 
($fz = function (colixes, colorList) {
if (colixes == null) colixes =  Clazz.newShortArray (this.$atomCount, 0);
 else colixes = J.util.ArrayUtil.ensureLengthShort (colixes, this.$atomCount);
for (var i = this.$atomCount; --i >= this.atomCount0; ) colixes[i] = colorList.get (i).intValue ();

return colixes;
}, $fz.isPrivate = true, $fz), "~A,J.util.JmolList");
$_M(c$, "setShape", 
($fz = function (shapeID) {
var bs = this.reps[shapeID];
var f;
switch (shapeID) {
case 11:
case 4:
break;
case 7:
bs.andNot (this.reps[0]);
break;
}
if (bs.isEmpty ()) return;
var ss = null;
switch (shapeID) {
case 15:
ss =  new J.adapter.readers.pymol.ModelSettings (7, bs, null);
ss.rd =  new J.atomdata.RadiusData (null, this.getFloatSetting (65) / 2, J.atomdata.RadiusData.EnumType.FACTOR, J.constant.EnumVdw.AUTO);
ss.setColors (this.colixes, 0);
this.modelSettings.addLast (ss);
break;
case 11:
ss =  new J.adapter.readers.pymol.ModelSettings (0, bs, null);
ss.setColors (this.colixes, 0);
ss.translucency = this.sphereTranslucency;
this.modelSettings.addLast (ss);
break;
case 4:
case 1:
ss =  new J.adapter.readers.pymol.ModelSettings (0, bs, null);
ss.setColors (this.colixes, 0);
ss.translucency = this.sphereTranslucency;
this.modelSettings.addLast (ss);
break;
case 0:
f = this.getFloatSetting (21) * 2;
ss =  new J.adapter.readers.pymol.ModelSettings (1, bs, null);
ss.setSize (f);
ss.translucency = this.stickTranslucency;
this.modelSettings.addLast (ss);
break;
case 9:
ss =  new J.adapter.readers.pymol.ModelSettings (16, bs, null);
f = this.getFloatSetting (155);
ss.rd =  new J.atomdata.RadiusData (null, f, J.atomdata.RadiusData.EnumType.FACTOR, J.constant.EnumVdw.AUTO);
this.modelSettings.addLast (ss);
break;
case 7:
f = this.getFloatSetting (44) / 15;
ss =  new J.adapter.readers.pymol.ModelSettings (1, bs, null);
ss.setSize (f);
this.modelSettings.addLast (ss);
break;
case 5:
this.setCartoon ("H", 100, 2);
this.setCartoon ("S", 96, 2);
this.setCartoon ("L", 92, 2);
this.setCartoon (" ", 92, 2);
break;
case 8:
case 2:
break;
case 3:
ss =  new J.adapter.readers.pymol.ModelSettings (5, bs, this.labels);
this.modelSettings.addLast (ss);
break;
case 14:
this.setPutty (bs);
break;
case 13:
this.haveTraceOrBackbone = true;
this.setTrace (bs);
break;
case 6:
this.haveTraceOrBackbone = true;
this.setRibbon (bs);
break;
case 10:
break;
default:
if (shapeID < 13) System.out.println ("Unprocessed representation type " + shapeID);
}
}, $fz.isPrivate = true, $fz), "~N");
$_M(c$, "addSpacefill", 
($fz = function (i, rad) {
var r = Float.$valueOf (rad);
var bsr = this.htSpacefill.get (r);
if (bsr == null) this.htSpacefill.put (r, bsr =  new J.util.BS ());
bsr.set (i);
}, $fz.isPrivate = true, $fz), "~N,~N");
$_M(c$, "setSpacefill", 
($fz = function () {
for (var i = this.bsBondedPyMOL.nextSetBit (0); i >= 0; i = this.bsBondedPyMOL.nextSetBit (i + 1)) {
if (i >= this.atomMap.length) break;
var pt = this.atomMap[i];
if (pt >= 0) this.bsBondedJmol.set (pt);
}
for (var e, $e = this.htSpacefill.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) {
var r = e.getKey ().floatValue ();
var bs = e.getValue ();
if (r < 0) {
bs.andNot (this.bsBondedJmol);
r = -r;
}if (bs.isEmpty ()) continue;
var ss =  new J.adapter.readers.pymol.ModelSettings (0, bs, null);
ss.rd =  new J.atomdata.RadiusData (null, r, J.atomdata.RadiusData.EnumType.ABSOLUTE, J.constant.EnumVdw.AUTO);
this.modelSettings.addLast (ss);
}
this.htSpacefill.clear ();
}, $fz.isPrivate = true, $fz));
$_M(c$, "setSurface", 
($fz = function () {
if (!this.allowSurface || this.isStateScript || this.bsModelAtoms.isEmpty ()) return;
var bs = this.reps[2];
J.util.BSUtil.andNot (bs, this.bsNoSurface);
if (!bs.isEmpty ()) {
var ss =  new J.adapter.readers.pymol.ModelSettings (24, bs, [this.branchName + "_" + this.branchID, this.getBooleanSetting (156) ? "FULLYLIT" : "FRONTLIT"]);
ss.setSize (this.getFloatSetting (4));
ss.translucency = this.getFloatSetting (138);
ss.setColors (this.colixes, 0);
this.modelSettings.addLast (ss);
}bs = this.reps[8];
J.util.BSUtil.andNot (bs, this.bsNoSurface);
if (!bs.isEmpty ()) {
var ss =  new J.adapter.readers.pymol.ModelSettings (24, bs, [this.branchName + "_" + this.branchID, null]);
ss.setSize (this.getFloatSetting (4));
ss.translucency = this.getFloatSetting (138);
ss.setColors (this.colixes, 0);
this.modelSettings.addLast (ss);
}}, $fz.isPrivate = true, $fz));
$_M(c$, "setTrace", 
($fz = function (bs) {
var ss;
var bsNuc = J.util.BSUtil.copy (this.bsNucleic);
bsNuc.and (bs);
if (!bsNuc.isEmpty () && this.cartoonLadderMode) {
this.haveNucleicLadder = true;
ss =  new J.adapter.readers.pymol.ModelSettings (11, bsNuc, null);
ss.setColors (this.colixes, this.cartoonTranslucency);
ss.setSize (this.getFloatSetting (103) * 2);
this.modelSettings.addLast (ss);
bs.andNot (bsNuc);
if (bs.isEmpty ()) return;
}ss =  new J.adapter.readers.pymol.ModelSettings (10, bs, null);
ss.setColors (this.colixes, this.cartoonTranslucency);
ss.setSize (this.getFloatSetting (103) * 2);
this.modelSettings.addLast (ss);
}, $fz.isPrivate = true, $fz), "J.util.BS");
$_M(c$, "setPutty", 
($fz = function (bs) {
var ss;
var info = [this.getFloatSetting (378), this.getFloatSetting (377), this.getFloatSetting (382), this.getFloatSetting (379), this.getFloatSetting (380), this.getFloatSetting (381), this.getFloatSetting (581)];
ss =  new J.adapter.readers.pymol.ModelSettings (13, bs, info);
ss.setColors (this.colixes, this.cartoonTranslucency);
this.modelSettings.addLast (ss);
}, $fz.isPrivate = true, $fz), "J.util.BS");
$_M(c$, "setRibbon", 
($fz = function (bs) {
var sampling = this.getFloatSetting (19);
var ss =  new J.adapter.readers.pymol.ModelSettings ((sampling > 1 ? 10 : 9), bs, null);
ss.setColors (this.colixes, 0);
ss.setSize (this.getFloatSetting (106) * 0.1);
this.modelSettings.addLast (ss);
}, $fz.isPrivate = true, $fz), "J.util.BS");
$_M(c$, "setCartoon", 
($fz = function (key, sizeID, factor) {
var bs = J.util.BSUtil.copy (this.ssMapAtom.get (key));
if (bs == null) return;
bs.and (this.reps[5]);
if (bs.isEmpty ()) return;
var ss =  new J.adapter.readers.pymol.ModelSettings (11, bs, null);
ss.setColors (this.colixes, this.cartoonTranslucency);
ss.setSize (this.getFloatSetting (sizeID) * factor);
this.modelSettings.addLast (ss);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
$_M(c$, "cleanSingletonCartoons", 
($fz = function (bs) {
var bsr =  new J.util.BS ();
for (var pass = 0; pass < 2; pass++) {
var offset = 1;
var iPrev = -2147483648;
var iSeqLast = -2147483648;
var iSeq = -2147483648;
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
if (!this.isSequential (i, iPrev)) offset++;
iSeq = this.atomSetCollection.getAtom (i).sequenceNumber;
if (iSeq != iSeqLast) {
iSeqLast = iSeq;
offset++;
}if (pass == 0) bsr.set (offset);
 else if (!bsr.get (offset)) bs.clear (i);
iPrev = i;
}
if (pass == 1) break;
var bsnot =  new J.util.BS ();
for (var i = bsr.nextSetBit (0); i >= 0; i = bsr.nextSetBit (i + 1)) if (!bsr.get (i - 1) && !bsr.get (i + 1)) bsnot.set (i);

bsr.andNot (bsnot);
}
}, $fz.isPrivate = true, $fz), "J.util.BS");
$_M(c$, "isSequential", 
($fz = function (i, iPrev) {
if (i != iPrev + 1) return false;
var a = this.atomSetCollection.getAtom (iPrev);
var b = this.atomSetCollection.getAtom (i);
return a.chainID == b.chainID && a.atomSetIndex == b.atomSetIndex;
}, $fz.isPrivate = true, $fz), "~N,~N");
$_M(c$, "setFrame", 
($fz = function () {
var bs = J.util.BSUtil.newAndSetBit (0);
if (!this.allStates && this.isMovie) {
this.modelSettings.addLast ( new J.adapter.readers.pymol.ModelSettings (1073742032, bs, this.pymol.get ("movie")));
} else if (!this.allStates || this.isMovie) {
this.modelSettings.addLast ( new J.adapter.readers.pymol.ModelSettings (4115, bs, Integer.$valueOf (this.currentFrame)));
} else {
this.modelSettings.addLast ( new J.adapter.readers.pymol.ModelSettings (4115, bs, Integer.$valueOf (-1)));
}}, $fz.isPrivate = true, $fz));
$_M(c$, "setView", 
($fz = function (sb, view) {
var ptCenter = this.getPoint (view, 19,  new J.util.P3 ());
sb.append (";center ").append (J.util.Escape.eP (ptCenter));
var fov = this.getFloatSetting (152);
var tan = Math.tan (fov / 2 * 3.141592653589793 / 180);
var jmolCameraToCenter = 0.5 / tan;
var jmolCameraDepth = (jmolCameraToCenter - 0.5);
var szoom = "100";
var pymolDistanceToCenter = -J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 18);
var w = pymolDistanceToCenter * tan * 2;
var noDims = (this.width == 0 || this.height == 0);
if (noDims) {
this.width = this.viewer.getScreenWidth ();
this.height = this.viewer.getScreenHeight ();
} else {
}var aspectRatio = (this.width * 1.0 / this.height);
if (aspectRatio < 1) szoom = "" + (100 / aspectRatio);
var pymolCameraToCenter = pymolDistanceToCenter / w;
var pymolCameraToSlab = J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 22) / w;
var pymolCameratToDepth = J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 23) / w;
var slab = 50 + Clazz.floatToInt ((pymolCameraToCenter - pymolCameraToSlab) * 100);
var depth = 50 + Clazz.floatToInt ((pymolCameraToCenter - pymolCameratToDepth) * 100);
sb.append (";set perspectiveDepth " + (!this.getBooleanSetting (23)));
sb.append (";set cameraDepth " + jmolCameraDepth);
sb.append (";set rotationRadius " + (w / 2));
sb.append (";zoom " + szoom + "; slab on; slab " + slab + "; depth " + depth);
sb.append (";rotate @{quaternion({").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 0)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 1)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 2)).append ("}{").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 4)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 5)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 6)).append ("})}");
sb.append (";translate X ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 16)).append (" angstroms;");
sb.append (";translate Y ").appendF (-J.adapter.readers.pymol.PyMOLReader.getFloatAt (view, 17)).append (" angstroms");
var depthCue = this.getBooleanSetting (84);
var fog = this.getBooleanSetting (88);
if (depthCue && fog) {
var range = depth - slab;
var fog_start = this.getFloatSetting (192);
sb.append (";set zShade true; set zshadePower 1;set zslab " + (slab + fog_start * range) + "; set zdepth " + depth);
} else if (depthCue) {
sb.append (";set zShade true; set zshadePower 1;set zslab " + ((slab + depth) / 2) + "; set zdepth " + depth);
} else {
sb.append (";set zShade false");
}sb.append (";set traceAlpha " + this.getBooleanSetting (111));
sb.append (";set cartoonRockets " + this.getBooleanSetting (180));
sb.append (";set cartoonLadders " + this.haveNucleicLadder);
sb.append (";set ribbonBorder " + this.getBooleanSetting (118));
sb.append (";set cartoonFancy " + (!this.isMovie && !this.getBooleanSetting (118)));
sb.append (";background " + J.adapter.readers.pymol.PyMOLReader.getList (this.settings, 6).get (2));
if (this.isMovie) sb.append (";animation mode loop");
sb.append (";");
}, $fz.isPrivate = true, $fz), "J.util.SB,J.util.JmolList");
Clazz.overrideMethod (c$, "finalizeModelSet", 
function (modelSet, baseModelIndex, baseAtomIndex) {
var bsCarb = (this.haveTraceOrBackbone ? modelSet.getAtomBits (3145764, null) : null);
if (this.modelSettings != null) {
for (var i = 0; i < this.modelSettings.size (); i++) {
var ss = this.modelSettings.get (i);
ss.offset (baseModelIndex, baseAtomIndex);
ss.createShape (modelSet, bsCarb);
}
}this.viewer.setTrajectoryBs (J.util.BSUtil.newBitSet2 (baseModelIndex, modelSet.modelCount));
}, "J.modelset.ModelSet,~N,~N");
Clazz.defineStatics (c$,
"nucleic", " A C G T U ADE THY CYT GUA URI DA DC DG DT DU ",
"BRANCH_SELECTION", -1,
"BRANCH_MOLECULE", 1,
"BRANCH_MAPSURFACE", 2,
"BRANCH_MAPMESH", 3,
"BRANCH_MEASURE", 4,
"BRANCH_CGO", 6,
"BRANCH_SURFACE", 7,
"BRANCH_GROUP", 12,
"MIN_RESNO", -1000,
"REP_JMOL_MIN", 13,
"REP_JMOL_TRACE", 13,
"REP_JMOL_PUTTY", 14,
"REP_JMOL_STARS", 15,
"REP_JMOL_MAX", 16);
});
