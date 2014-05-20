Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.MapFileReader"], "J.jvxl.readers.PyMOLMeshReader", ["java.lang.Float", "JU.SB", "J.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.data = null;
this.voxelList = null;
this.surfaceName = null;
this.pymolType = 0;
this.isMesh = false;
this.pt = 0;
Clazz.instantialize (this, arguments);
}, J.jvxl.readers, "PyMOLMeshReader", J.jvxl.readers.MapFileReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.PyMOLMeshReader, []);
});
$_V(c$, "init2", 
function (sg, brNull) {
this.init2MFR (sg, null);
this.allowSigma = true;
this.nSurfaces = 1;
var map = sg.getReaderData ();
this.data = map.get (this.params.calculationType);
if (this.data == null) return;
this.pymolType = Clazz.floatToInt (this.getFloat (J.jvxl.readers.PyMOLMeshReader.getList (this.data, 0), 0));
this.isMesh = (this.pymolType == 3);
this.surfaceName = this.data.get (this.data.size () - 1);
J.util.Logger.info ("PyMOLMeshReader for " + this.params.calculationType + " pymolType=" + this.pymolType + "; isMesh=" + this.isMesh + " surfaceName=" + this.surfaceName);
this.data = J.jvxl.readers.PyMOLMeshReader.getList (J.jvxl.readers.PyMOLMeshReader.getList (this.data, 2), 0);
if (this.isMesh && this.params.thePlane == null && this.params.cutoffAutomatic) {
this.params.cutoff = this.getFloat (this.data, 8);
this.params.cutoffAutomatic = false;
}if (this.isMesh) this.data = J.jvxl.readers.PyMOLMeshReader.getList (J.jvxl.readers.PyMOLMeshReader.getList (map.get (this.surfaceName), 2), 0);
this.voxelList = J.jvxl.readers.PyMOLMeshReader.getList (J.jvxl.readers.PyMOLMeshReader.getList (J.jvxl.readers.PyMOLMeshReader.getList (this.data, 14), 2), 6);
J.util.Logger.info ("PyMOLMeshReader: Number of grid points = " + this.voxelList.size ());
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
c$.getList = $_M(c$, "getList", 
($fz = function (list, i) {
return list.get (i);
}, $fz.isPrivate = true, $fz), "JU.List,~N");
$_V(c$, "readParameters", 
function () {
var t;
this.jvxlFileHeaderBuffer =  new JU.SB ();
this.jvxlFileHeaderBuffer.append ("PyMOL surface reader\n");
this.jvxlFileHeaderBuffer.append (this.surfaceName + " (" + this.params.calculationType + ")\n");
var s = J.jvxl.readers.PyMOLMeshReader.getList (this.data, 1);
t = J.jvxl.readers.PyMOLMeshReader.getList (s, 0);
var haveUnitCell = false;
if (t != null) {
if (t.size () < 3) t = J.jvxl.readers.PyMOLMeshReader.getList (s = J.jvxl.readers.PyMOLMeshReader.getList (s, 0), 0);
this.a = this.getFloat (t, 0);
haveUnitCell = (this.a != 1);
if (haveUnitCell) {
this.b = this.getFloat (t, 1);
this.c = this.getFloat (t, 2);
t = J.jvxl.readers.PyMOLMeshReader.getList (s, 1);
this.alpha = this.getFloat (t, 0);
this.beta = this.getFloat (t, 1);
this.gamma = this.getFloat (t, 2);
}}t = J.jvxl.readers.PyMOLMeshReader.getList (this.data, 7);
this.origin.set (this.getFloat (t, 0), this.getFloat (t, 1), this.getFloat (t, 2));
t = J.jvxl.readers.PyMOLMeshReader.getList (this.data, 10);
this.na = Clazz.floatToInt (this.getFloat (t, 0));
this.nb = Clazz.floatToInt (this.getFloat (t, 1));
this.nc = Clazz.floatToInt (this.getFloat (t, 2));
t = J.jvxl.readers.PyMOLMeshReader.getList (this.data, 11);
this.nxyzStart[0] = Clazz.floatToInt (this.getFloat (t, 0));
this.nxyzStart[1] = Clazz.floatToInt (this.getFloat (t, 1));
this.nxyzStart[2] = Clazz.floatToInt (this.getFloat (t, 2));
t = J.jvxl.readers.PyMOLMeshReader.getList (this.data, 13);
this.nz = Clazz.floatToInt (this.getFloat (t, 0));
this.ny = Clazz.floatToInt (this.getFloat (t, 1));
this.nx = Clazz.floatToInt (this.getFloat (t, 2));
if (!haveUnitCell) {
this.na = this.nz - 1;
this.nb = this.ny - 1;
this.nc = this.nx - 1;
t = J.jvxl.readers.PyMOLMeshReader.getList (this.data, 8);
this.a = this.getFloat (t, 0) - this.origin.x;
this.b = this.getFloat (t, 1) - this.origin.y;
this.c = this.getFloat (t, 2) - this.origin.z;
this.alpha = this.beta = this.gamma = 90;
}this.mapc = 3;
this.mapr = 2;
this.maps = 1;
this.getVectorsAndOrigin ();
this.setCutoffAutomatic ();
});
$_V(c$, "nextVoxel", 
function () {
return this.getFloat (this.voxelList, this.pt++);
});
$_M(c$, "getFloat", 
($fz = function (list, i) {
return (list.get (i)).floatValue ();
}, $fz.isPrivate = true, $fz), "JU.List,~N");
$_V(c$, "skipData", 
function (nPoints) {
}, "~N");
$_V(c$, "setCutoffAutomatic", 
function () {
if (this.params.thePlane != null) return;
if (Float.isNaN (this.params.sigma)) {
if (!this.params.cutoffAutomatic) return;
this.params.cutoff = (this.boundingBox == null ? 3.0 : 1.6);
if (this.dmin != 3.4028235E38) {
if (this.params.cutoff > this.dmax) this.params.cutoff = this.dmax / 4;
}} else {
this.params.cutoff = this.calculateCutoff ();
}J.util.Logger.info ("MapReader: setting cutoff to default value of " + this.params.cutoff + (this.boundingBox == null ? " (no BOUNDBOX parameter)\n" : "\n"));
});
$_M(c$, "calculateCutoff", 
($fz = function () {
var n = this.voxelList.size ();
var sum = 0;
var sum2 = 0;
for (var i = 0; i < n; i++) {
var v = this.getFloat (this.voxelList, i);
sum += v;
sum2 += v * v;
}
var mean = sum / n;
var rmsd = Math.sqrt (sum2 / n);
J.util.Logger.info ("PyMOLMeshReader rmsd=" + rmsd + " mean=" + mean);
return this.params.sigma * rmsd + mean;
}, $fz.isPrivate = true, $fz));
Clazz.defineStatics (c$,
"cMapSourceCrystallographic", 1,
"cMapSourceCCP4", 2,
"cMapSourceGeneralPurpose", 3,
"cMapSourceDesc", 4,
"cMapSourceFLD", 5,
"cMapSourceBRIX", 6,
"cMapSourceGRD", 7,
"cMapSourceChempyBrick", 8,
"cMapSourceVMDPlugin", 9,
"cMapSourceObsolete", 10,
"OBJECT_MAPDATA", 2,
"OBJECT_MAPMESH", 3);
});