Clazz.declarePackage ("JSV.export");
Clazz.load (["JSV.api.ExportInterface"], "JSV.export.Exporter", ["JU.Base64", "$.PT", "JSV.common.Annotation", "$.ExportType", "$.JSVFileManager", "$.JSViewer", "JSV.util.JSVTxt"], function () {
c$ = Clazz.declareType (JSV["export"], "Exporter", null, JSV.api.ExportInterface);
Clazz.makeConstructor (c$, 
function () {
});
$_V(c$, "write", 
function (viewer, tokens, forInkscape) {
if (tokens == null) return this.printPDF (viewer, null);
var type = null;
var fileName = null;
var eType;
var out;
var jsvp = viewer.selectedPanel;
try {
switch (tokens.size ()) {
default:
return "WRITE what?";
case 1:
fileName = JU.PT.trimQuotes (tokens.get (0));
if (fileName.indexOf (".") >= 0) type = "XY";
if (jsvp == null) return null;
eType = JSV.common.ExportType.getType (fileName);
switch (eType) {
case JSV.common.ExportType.PDF:
case JSV.common.ExportType.PNG:
case JSV.common.ExportType.JPG:
return this.exportTheSpectrum (viewer, eType, null, null, -1, -1, null);
default:
viewer.fileHelper.setFileChooser (eType);
var items = this.getExportableItems (viewer, eType.equals (JSV.common.ExportType.SOURCE));
var index = (items == null ? -1 : viewer.getOptionFromDialog (items, "Export", "Choose a spectrum to export"));
if (index == -2147483648) return null;
var file = viewer.fileHelper.getFile (this.getSuggestedFileName (viewer, eType), jsvp, true);
if (file == null) return null;
out = viewer.getOutputChannel (file.getFullPath (), false);
var msg = this.exportSpectrumOrImage (viewer, eType, index, out);
var isOK = msg.startsWith ("OK");
if (isOK) viewer.si.siUpdateRecentMenus (file.getFullPath ());
return msg;
}
case 2:
type = tokens.get (0).toUpperCase ();
fileName = JU.PT.trimQuotes (tokens.get (1));
break;
}
var ext = fileName.substring (fileName.lastIndexOf (".") + 1).toUpperCase ();
if (ext.equals ("JDX")) {
if (type == null) type = "XY";
} else if (JSV.common.ExportType.isExportMode (ext)) {
type = ext;
} else if (JSV.common.ExportType.isExportMode (type)) {
fileName += "." + type;
}eType = JSV.common.ExportType.getType (type);
if (forInkscape && eType === JSV.common.ExportType.SVG) eType = JSV.common.ExportType.SVGI;
out = viewer.getOutputChannel (fileName, false);
return this.exportSpectrumOrImage (viewer, eType, -1, out);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println (e);
return null;
} else {
throw e;
}
}
}, "JSV.common.JSViewer,JU.List,~B");
$_M(c$, "exportSpectrumOrImage", 
($fz = function (viewer, eType, index, out) {
var spec;
var pd = viewer.selectedPanel.getPanelData ();
if (index < 0 && (index = pd.getCurrentSpectrumIndex ()) < 0) return "Error exporting spectrum: No spectrum selected";
spec = pd.getSpectrumAt (index);
var startIndex = pd.getStartingPointIndex (index);
var endIndex = pd.getEndingPointIndex (index);
var msg = null;
try {
msg = this.exportTheSpectrum (viewer, eType, out, spec, startIndex, endIndex, pd);
if (msg.startsWith ("OK")) return "OK - Exported " + eType.name () + ": " + out.getFileName () + msg.substring (2);
} catch (ioe) {
if (Clazz.exceptionOf (ioe, Exception)) {
msg = ioe.toString ();
} else {
throw ioe;
}
}
return "Error exporting " + out.getFileName () + ": " + msg;
}, $fz.isPrivate = true, $fz), "JSV.common.JSViewer,JSV.common.ExportType,~N,JU.OC");
$_M(c$, "exportTheSpectrum", 
function (viewer, mode, out, spec, startIndex, endIndex, pd) {
var jsvp = viewer.selectedPanel;
var type = mode.name ();
switch (mode) {
case JSV.common.ExportType.AML:
case JSV.common.ExportType.CML:
case JSV.common.ExportType.SVG:
case JSV.common.ExportType.SVGI:
break;
case JSV.common.ExportType.DIF:
case JSV.common.ExportType.DIFDUP:
case JSV.common.ExportType.FIX:
case JSV.common.ExportType.PAC:
case JSV.common.ExportType.SQZ:
case JSV.common.ExportType.XY:
type = "JDX";
break;
case JSV.common.ExportType.JPG:
case JSV.common.ExportType.PNG:
if (jsvp == null) return null;
viewer.fileHelper.setFileChooser (mode);
var name = this.getSuggestedFileName (viewer, mode);
var file = viewer.fileHelper.getFile (name, jsvp, true);
if (file == null) return null;
if (viewer.isJS) {
var fname = file.getName ();
var isPNG = type.equals (JSV.common.ExportType.PNG);
var s = (isPNG ? "png" : "jpeg");
{
s = viewer.display.toDataURL(s);
if (!isPNG && s.contains("/png"))
fname = fname.split('.jp')[0] + ".png";
}try {
out = viewer.getOutputChannel (fname, true);
var data = JU.Base64.decodeBase64 (s);
out.write (data, 0, data.length);
out.closeChannel ();
return "OK " + out.getByteCount () + " bytes";
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return e.toString ();
} else {
throw e;
}
}
}return jsvp.saveImage (type.toLowerCase (), file);
case JSV.common.ExportType.PDF:
return this.printPDF (viewer, "PDF");
case JSV.common.ExportType.SOURCE:
if (jsvp == null) return null;
return JSV["export"].Exporter.fileCopy (jsvp.getPanelData ().getSpectrum ().getFilePath (), out);
case JSV.common.ExportType.UNK:
return null;
}
return (JSV.common.JSViewer.getInterface ("JSV.export." + type.toUpperCase () + "Exporter")).exportTheSpectrum (viewer, mode, out, spec, startIndex, endIndex, null);
}, "JSV.common.JSViewer,JSV.common.ExportType,JU.OC,JSV.common.JDXSpectrum,~N,~N,JSV.common.PanelData");
$_M(c$, "printPDF", 
($fz = function (viewer, pdfFileName) {
if (!viewer.si.isSigned ()) return "Error: Applet must be signed for the PRINT command.";
var isJob = (pdfFileName == null || pdfFileName.length == 0);
var isBase64 = (!isJob && pdfFileName.toLowerCase ().startsWith ("base64"));
var jsvp = viewer.selectedPanel;
if (jsvp == null) return null;
jsvp.getPanelData ().closeAllDialogsExcept (JSV.common.Annotation.AType.NONE);
var pl;
{
pl = new JSV.common.PrintLayout(); pl.asPDF = true;
}if (isJob && pl.asPDF) {
isJob = false;
pdfFileName = "PDF";
}if (!isBase64 && !isJob) {
var helper = viewer.fileHelper;
helper.setFileChooser (JSV.common.ExportType.PDF);
if (pdfFileName.equals ("?") || pdfFileName.equalsIgnoreCase ("PDF")) pdfFileName = this.getSuggestedFileName (viewer, JSV.common.ExportType.PDF);
var file = helper.getFile (pdfFileName, jsvp, true);
if (file == null) return null;
if (!viewer.isJS) viewer.setProperty ("directoryLastExportedFile", helper.setDirLastExported (file.getParentAsFile ().getFullPath ()));
pdfFileName = file.getFullPath ();
}var s = null;
try {
var out = (isJob ? null : viewer.getOutputChannel (isBase64 ? null : pdfFileName, true));
var printJobTitle = jsvp.getPanelData ().getPrintJobTitle (true);
if (pl.showTitle) {
printJobTitle = jsvp.getInput ("Title?", "Title for Printing", printJobTitle);
if (printJobTitle == null) return null;
}jsvp.printPanel (pl, out, printJobTitle);
s = (isBase64 ? JU.Base64.getBase64 (out.toByteArray ()).toString () : out.toString ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
jsvp.showMessage (e.toString (), "File Error");
} else {
throw e;
}
}
return s;
}, $fz.isPrivate = true, $fz), "JSV.common.JSViewer,~S");
$_M(c$, "getExportableItems", 
($fz = function (viewer, isSameType) {
var jsvp = viewer.selectedPanel;
var isView = viewer.currentSource.isView;
var nSpectra = jsvp.getPanelData ().getNumberOfSpectraInCurrentSet ();
if (nSpectra == 1 || !isView && isSameType || jsvp.getPanelData ().getCurrentSpectrumIndex () >= 0) return null;
var items =  new Array (nSpectra);
for (var i = 0; i < nSpectra; i++) items[i] = jsvp.getPanelData ().getSpectrumAt (i).getTitle ();

return items;
}, $fz.isPrivate = true, $fz), "JSV.common.JSViewer,~B");
$_M(c$, "getSuggestedFileName", 
($fz = function (viewer, imode) {
var pd = viewer.selectedPanel.getPanelData ();
var sourcePath = pd.getSpectrum ().getFilePath ();
var newName = JSV.common.JSVFileManager.getName (sourcePath);
var pt = newName.lastIndexOf (".");
var name = (pt < 0 ? newName : newName.substring (0, pt));
var ext = ".jdx";
var isPrint = false;
switch (imode) {
case JSV.common.ExportType.XY:
case JSV.common.ExportType.FIX:
case JSV.common.ExportType.PAC:
case JSV.common.ExportType.SQZ:
case JSV.common.ExportType.DIF:
case JSV.common.ExportType.DIFDUP:
case JSV.common.ExportType.SOURCE:
if (!(name.endsWith ("_" + imode))) name += "_" + imode;
ext = ".jdx";
break;
case JSV.common.ExportType.AML:
ext = ".xml";
break;
case JSV.common.ExportType.JPG:
case JSV.common.ExportType.PNG:
case JSV.common.ExportType.PDF:
isPrint = true;
default:
ext = "." + imode.toString ().toLowerCase ();
}
if (viewer.currentSource.isView) name = pd.getPrintJobTitle (isPrint);
name += ext;
return name;
}, $fz.isPrivate = true, $fz), "JSV.common.JSViewer,JSV.common.ExportType");
c$.fileCopy = $_M(c$, "fileCopy", 
($fz = function (name, out) {
try {
var br = JSV.common.JSVFileManager.getBufferedReaderFromName (name, null);
var line = null;
while ((line = br.readLine ()) != null) {
out.append (line);
out.append (JSV.util.JSVTxt.newLine);
}
out.closeChannel ();
return "OK " + out.getByteCount () + " bytes";
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return e.toString ();
} else {
throw e;
}
}
}, $fz.isPrivate = true, $fz), "~S,JU.OC");
});
