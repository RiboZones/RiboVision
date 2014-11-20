Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.PeriodicVolumeFileReader"], "J.jvxl.readers.VaspChgcarReader", ["JU.SB", "JU.SimpleUnitCell"], function () {
c$ = Clazz.decorateAsClass (function () {
this.volume = 0;
this.pt = 0;
Clazz.instantialize (this, arguments);
}, J.jvxl.readers, "VaspChgcarReader", J.jvxl.readers.PeriodicVolumeFileReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.VaspChgcarReader, []);
});
Clazz.overrideMethod (c$, "init2", 
function (sg, br) {
this.init2VFR (sg, br);
this.isAngstroms = true;
this.nSurfaces = 1;
this.canDownsample = this.isProgressive = false;
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.overrideMethod (c$, "readParameters", 
function () {
this.jvxlFileHeaderBuffer =  new JU.SB ();
this.jvxlFileHeaderBuffer.append ("Vasp CHGCAR format\n");
this.rd ();
var scale = this.parseFloatStr (this.rd ());
var data =  Clazz.newFloatArray (15, 0);
data[0] = -1;
for (var i = 0, pt = 6; i < 3; ++i) this.volumetricVectors[i].set (data[pt++] = this.parseFloatStr (this.rd ()) * scale, data[pt++] = this.parseFloat () * scale, data[pt++] = this.parseFloat () * scale);

this.volume = JU.SimpleUnitCell.newA (data).volume;
while (this.rd ().length > 2) {
}
this.rd ();
var counts = this.getTokens ();
for (var i = 0; i < 3; ++i) {
this.volumetricVectors[i].scale (1 / ((this.voxelCounts[i] = this.parseIntStr (counts[i]) + 1) - 1));
if (this.isAnisotropic) this.setVectorAnisotropy (this.volumetricVectors[i]);
}
this.swapXZ ();
this.volumetricOrigin.set (0, 0, 0);
});
Clazz.overrideMethod (c$, "nextVoxel", 
function () {
if ((this.pt++) % 5 == 0) {
this.rd ();
this.next[0] = 0;
}return this.parseFloat () / this.volume;
});
Clazz.overrideMethod (c$, "getPeriodicVoxels", 
function () {
var ni = this.voxelCounts[0] - 1;
var nj = this.voxelCounts[1] - 1;
var nk = this.voxelCounts[2] - 1;
for (var i = 0; i < ni; i++) for (var j = 0; j < nj; j++) for (var k = 0; k < nk; k++) this.voxelData[i][j][k] = this.recordData (this.nextVoxel ());



});
Clazz.overrideMethod (c$, "readSkip", 
function () {
});
});
