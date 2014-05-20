Clazz.declarePackage ("J.quantum");
Clazz.load (["J.api.JmolNMRInterface", "java.util.Hashtable"], "J.quantum.NMRCalculation", ["java.io.BufferedInputStream", "java.lang.Character", "$.Double", "$.Float", "$.NullPointerException", "J.io.JmolBinary", "J.util.BS", "$.Escape", "$.JmolList", "$.Logger", "$.Parser", "$.V3"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.isotopeData = null;
this.shiftRefsPPM = null;
Clazz.instantialize (this, arguments);
}, J.quantum, "NMRCalculation", null, J.api.JmolNMRInterface);
Clazz.prepareFields (c$, function () {
this.shiftRefsPPM =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function () {
this.getData ();
});
Clazz.overrideMethod (c$, "setViewer", 
function (viewer) {
this.viewer = viewer;
return this;
}, "J.viewer.Viewer");
Clazz.overrideMethod (c$, "getQuadrupolarConstant", 
function (efg) {
if (efg == null) return 0;
var a = this.viewer.modelSet.atoms[efg.atomIndex1];
return (this.getIsotopeData (a, 2) * efg.eigenValues[2] * 2.349647144641375E8);
}, "J.util.Tensor");
$_M(c$, "getInteractionTensorList", 
($fz = function (type, bs, bs2) {
type = type.toLowerCase ();
var bsModels = this.viewer.getModelBitSet (bs, false);
var iAtom = (bs.cardinality () == 1 ? bs.nextSetBit (0) : -1);
var list =  new J.util.JmolList ();
for (var i = bsModels.nextSetBit (0); i >= 0; i = bsModels.nextSetBit (i + 1)) {
var tensors = this.viewer.getModelAuxiliaryInfoValue (i, "interactionTensors");
if (tensors == null) continue;
var n = tensors.size ();
for (var j = 0; j < n; j++) {
var t = tensors.get (j);
if (t.type.equals (type) && t.isSelected (bs, iAtom) && (bs2 == null || bs2.get (this.getOtherAtom (t, iAtom)))) list.addLast (t);
}
}
return list;
}, $fz.isPrivate = true, $fz), "~S,J.util.BS,J.util.BS");
$_M(c$, "getOtherAtom", 
($fz = function (t, iAtom) {
return (t.atomIndex1 == iAtom ? t.atomIndex2 : t.atomIndex1);
}, $fz.isPrivate = true, $fz), "J.util.Tensor,~N");
Clazz.overrideMethod (c$, "getUniqueTensorSet", 
function (bsAtoms) {
var bs =  new J.util.BS ();
var atoms = this.viewer.modelSet.atoms;
for (var i = this.viewer.getModelCount (); --i >= 0; ) {
var bsModelAtoms = this.viewer.getModelUndeletedAtomsBitSet (i);
bsModelAtoms.and (bsAtoms);
if (this.viewer.getModelUnitCell (i) == null) continue;
for (var j = bsModelAtoms.nextSetBit (0); j >= 0; j = bsModelAtoms.nextSetBit (j + 1)) if (atoms[j].atomSite != atoms[j].index + 1) bsModelAtoms.clear (j);

bs.or (bsModelAtoms);
for (var j = bsModelAtoms.nextSetBit (0); j >= 0; j = bsModelAtoms.nextSetBit (j + 1)) {
var ta = atoms[j].getTensors ();
if (ta == null) continue;
for (var jj = ta.length; --jj >= 0; ) {
var t = ta[jj];
if (t == null) continue;
for (var k = bsModelAtoms.nextSetBit (j + 1); k >= 0; k = bsModelAtoms.nextSetBit (k + 1)) {
var tb = atoms[k].getTensors ();
if (tb == null) continue;
for (var kk = tb.length; --kk >= 0; ) {
if (t.isEquiv (tb[kk])) {
bsModelAtoms.clear (k);
bs.clear (k);
break;
}}
}
}
}
}
return bs;
}, "J.util.BS");
Clazz.overrideMethod (c$, "getJCouplingHz", 
function (a1, a2, type, isc) {
if (isc == null) {
type = this.getISCtype (a1, type);
if (type == null || a1.modelIndex != a2.modelIndex) return 0;
var bs =  new J.util.BS ();
var bs2 =  new J.util.BS ();
var i0 = this.viewer.modelSet.models[a1.modelIndex].firstAtomIndex - 1;
bs.set (a1.atomSite + i0);
bs2.set (a2.atomSite + i0);
var list = this.getInteractionTensorList (type, bs, bs2);
if (list.size () == 0) return NaN;
isc = list.get (0);
} else {
a1 = this.viewer.modelSet.atoms[isc.atomIndex1];
a2 = this.viewer.modelSet.atoms[isc.atomIndex2];
}return (this.getIsotopeData (a1, 1) * this.getIsotopeData (a2, 1) * isc.getIso () * 0.0167840302932219);
}, "J.modelset.Atom,J.modelset.Atom,~S,J.util.Tensor");
$_M(c$, "getISCtype", 
($fz = function (a1, type) {
var tensors = this.viewer.getModelAuxiliaryInfoValue (a1.modelIndex, "interactionTensors");
if (tensors == null) return null;
type = (type == null ? "" : type.toLowerCase ());
var pt = -1;
if ((pt = type.indexOf ("_hz")) >= 0 || (pt = type.indexOf ("_khz")) >= 0 || (pt = type.indexOf ("hz")) >= 0 || (pt = type.indexOf ("khz")) >= 0) type = type.substring (0, pt);
if (type.length == 0) type = "isc";
return type;
}, $fz.isPrivate = true, $fz), "J.modelset.Atom,~S");
Clazz.overrideMethod (c$, "getDipolarConstantHz", 
function (a1, a2) {
if (J.util.Logger.debugging) J.util.Logger.debug (a1 + " g=" + this.getIsotopeData (a1, 1) + "; " + a2 + " g=" + this.getIsotopeData (a2, 1));
var v = (-this.getIsotopeData (a1, 1) * this.getIsotopeData (a2, 1) / Math.pow (a1.distance (a2), 3) * 1054.5717253362893);
return (v == 0 || a1 === a2 ? NaN : v);
}, "J.modelset.Atom,J.modelset.Atom");
Clazz.overrideMethod (c$, "getDipolarCouplingHz", 
function (a1, a2, vField) {
var v12 = J.util.V3.newV (a2);
v12.sub (a1);
var r = v12.length ();
var costheta = v12.dot (vField) / r / vField.length ();
return (this.getDipolarConstantHz (a1, a2) * (3 * costheta - 1) / 2);
}, "J.modelset.Atom,J.modelset.Atom,J.util.V3");
$_M(c$, "getIsotopeData", 
($fz = function (a, iType) {
var iso = a.getIsotopeNumber ();
var sym = a.getElementSymbolIso (false);
var d = this.isotopeData.get (iso == 0 ? sym : "" + iso + sym);
return (d == null ? 0 : d[iType]);
}, $fz.isPrivate = true, $fz), "J.modelset.Atom,~N");
$_M(c$, "getData", 
($fz = function () {
var br = null;
var debugging = J.util.Logger.debugging;
try {
var is;
var url = null;
if ((url = this.getClass ().getResource ("nmr_data.txt")) == null) {
J.util.Logger.error ("Couldn\'t find file: J/quantum/nmr_data.txt");
return;
}is = url.getContent ();
br = J.io.JmolBinary.getBufferedReader ( new java.io.BufferedInputStream (is), null);
var line;
this.isotopeData =  new java.util.Hashtable ();
while ((line = br.readLine ()) != null) {
if (debugging) J.util.Logger.info (line);
if (line.indexOf ("#") >= 0) continue;
var tokens = J.util.Parser.getTokens (line);
var name = tokens[0];
var defaultIso = tokens[2] + name;
if (debugging) J.util.Logger.info (name + " default isotope " + defaultIso);
for (var i = 3; i < tokens.length; i += 3) {
var n = Integer.parseInt (tokens[i]);
var isoname = n + name;
var dataGQ = [n, Double.parseDouble (tokens[i + 1]), Double.parseDouble (tokens[i + 2])];
if (debugging) J.util.Logger.info (isoname + "  " + J.util.Escape.eAD (dataGQ));
this.isotopeData.put (isoname, dataGQ);
}
var defdata = this.isotopeData.get (defaultIso);
if (defdata == null) {
J.util.Logger.error ("Cannot find default NMR data in nmr_data.txt for " + defaultIso);
throw  new NullPointerException ();
}defdata[0] = -defdata[0];
this.isotopeData.put (name, defdata);
}
br.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
J.util.Logger.error ("Exception " + e.toString () + " reading " + "J/quantum/nmr_data.txt");
try {
br.close ();
} catch (ee) {
if (Clazz.exceptionOf (ee, Exception)) {
} else {
throw ee;
}
}
} else {
throw e;
}
}
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "getInfo", 
function (what) {
if (what.equals ("all")) {
var map =  new java.util.Hashtable ();
map.put ("isotopes", this.isotopeData);
map.put ("shiftRefsPPM", this.shiftRefsPPM);
return map;
}if (Character.isDigit (what.charAt (0))) return this.isotopeData.get (what);
var info =  new J.util.JmolList ();
for (var e, $e = this.isotopeData.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) {
var key = e.getKey ();
if (Character.isDigit (key.charAt (0)) && key.endsWith (what)) info.addLast (e.getValue ());
}
return info;
}, "~S");
Clazz.overrideMethod (c$, "getChemicalShift", 
function (atom) {
var v = this.getMagneticShielding (atom);
if (Float.isNaN (v)) return v;
var ref = this.shiftRefsPPM.get (atom.getElementSymbol ());
return (ref == null ? 0 : ref.floatValue ()) - v;
}, "J.modelset.Atom");
Clazz.overrideMethod (c$, "getMagneticShielding", 
function (atom) {
var t = this.viewer.modelSet.getAtomTensor (atom.index, "ms");
return (t == null ? NaN : t.getIso ());
}, "J.modelset.Atom");
Clazz.overrideMethod (c$, "getState", 
function (sb) {
if (this.shiftRefsPPM.isEmpty ()) return false;
for (var nuc, $nuc = this.shiftRefsPPM.entrySet ().iterator (); $nuc.hasNext () && ((nuc = $nuc.next ()) || true);) sb.append ("  set shift_").append (nuc.getKey ()).append (" ").appendO (nuc.getValue ()).append ("\n");

return true;
}, "J.util.SB");
Clazz.overrideMethod (c$, "setChemicalShiftReference", 
function (element, value) {
if (element == null) {
this.shiftRefsPPM.clear ();
return false;
}element = element.substring (0, 1).toUpperCase () + element.substring (1);
this.shiftRefsPPM.put (element, Float.$valueOf (value));
return true;
}, "~S,~N");
Clazz.overrideMethod (c$, "getTensorInfo", 
function (tensorType, infoType, bs) {
var data =  new J.util.JmolList ();
var list1;
if (infoType.equals (";dc.")) {
var atoms = this.viewer.modelSet.atoms;
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) for (var j = bs.nextSetBit (i + 1); j >= 0; j = bs.nextSetBit (j + 1)) {
list1 =  new J.util.JmolList ();
list1.addLast (Integer.$valueOf (atoms[i].index));
list1.addLast (Integer.$valueOf (atoms[j].index));
list1.addLast (Float.$valueOf (this.getDipolarConstantHz (atoms[i], atoms[j])));
data.addLast (list1);
}

} else if (tensorType.startsWith ("isc")) {
var isJ = infoType.equals (";j.");
var list = this.getInteractionTensorList (tensorType, bs, null);
var n = (list == null ? 0 : list.size ());
for (var i = 0; i < n; i++) {
var t = list.get (i);
list1 =  new J.util.JmolList ();
list1.addLast (Integer.$valueOf (t.atomIndex1));
list1.addLast (Integer.$valueOf (t.atomIndex2));
list1.addLast (isJ ? Float.$valueOf (this.getJCouplingHz (null, null, null, t)) : t.getInfo (infoType));
data.addLast (list1);
}
} else {
var isChi = tensorType.startsWith ("efg") && infoType.equals (";chi.");
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
var t = this.viewer.modelSet.getAtomTensor (i, tensorType);
data.addLast (t == null ? null : isChi ? Float.$valueOf (this.getQuadrupolarConstant (t)) : t.getInfo (infoType));
}
}return data;
}, "~S,~S,J.util.BS");
Clazz.overrideMethod (c$, "getMinDistances", 
function (md) {
var bsPoints1 = md.points.get (0);
var n1 = bsPoints1.cardinality ();
if (n1 == 0 || !(Clazz.instanceOf (md.points.get (1), J.util.BS))) return null;
var bsPoints2 = md.points.get (1);
var n2 = bsPoints2.cardinality ();
if (n1 < 2 && n2 < 2) return null;
var htMin =  new java.util.Hashtable ();
var atoms = this.viewer.modelSet.atoms;
for (var i = bsPoints1.nextSetBit (0); i >= 0; i = bsPoints1.nextSetBit (i + 1)) {
var a1 = atoms[i];
var name = a1.getAtomName ();
for (var j = bsPoints2.nextSetBit (0); j >= 0; j = bsPoints2.nextSetBit (j + 1)) {
var a2 = atoms[j];
var d = a2.distanceSquared (a1);
if (d == 0) continue;
var name1 = a2.getAtomName ();
var key = (name.compareTo (name1) < 0 ? name + name1 : name1 + name);
var min = htMin.get (key);
if (min == null) {
min = Float.$valueOf (d);
htMin.put (key, min);
continue;
}if (d < min.floatValue ()) htMin.put (key, Float.$valueOf (d));
}
}
return htMin;
}, "J.modelset.MeasurementData");
Clazz.defineStatics (c$,
"MAGNETOGYRIC_RATIO", 1,
"QUADRUPOLE_MOMENT", 2,
"e_charge", 1.60217646e-19,
"h_planck", 6.62606957e-34,
"h_bar_planck", 1.0545717253362894E-34,
"DIPOLAR_FACTOR", 1054.5717253362893,
"J_FACTOR", 0.0167840302932219,
"Q_FACTOR", 2.349647144641375E8,
"resource", "J/quantum/nmr_data.txt");
});