/*
  JmolJME.js   Bob Hanson hansonr@stolaf.edu  6/14/2012

  JME 2D option -- use Jmol.getJMEApplet(id, Info, linkedApplet) to access
  
  linkedApplet puts JME into INFO block for that applet; 
	use Jmol.showInfo(jmol,true/false) to show/hide JME
	
	see http://chemapps.stolaf.edu/jmol/jme for files and demo
	
	There is a bug in JME that the first time it loads a model, it centers it, 
	but after that, it fails to center it. Could get around that, perhaps, by
	creating a new JME applet each time.
	
	JME licensing: http://www.molinspiration.com/jme/doc/index.html
	note that required boilerplate: "JME Editor courtesy of Peter Ertl, Novartis"
	
  
  these methods are private to JmolJME.js
  
*/

(function (Jmol, document) {

	Jmol._JMEApplet = function(id, Info, linkedApplet) {
		this._jmolType = "Jmol._JME";
		Jmol._setObject(this, id, Info);
		this._options = Info.options;
		this._linkedApplet = linkedApplet;
 		this._jarPath = Info.jarPath || ".";
		this._jarFile = Info.jarFile || "JME.jar";
		if (Jmol._document) {
			if (this._linkedApplet) {
				this._linkedApplet._infoObject = this;
				this._linkedApplet._info = null;
				var d = Jmol._getElement(this._linkedApplet, "infotablediv");
				d.style.display = "block";
				var d = Jmol._getElement(this._linkedApplet, "infodiv");
				Jmol._document = null;
				d.innerHTML =  this.create();
				Jmol._document = document;
				this._showContainer(false, false);
			} else {
				this.create();
			}
		}
		return this;
  }
  
  Jmol._JMEApplet.prototype.create = function() {
		var w = (this._linkedApplet ? "2px" : this._containerWidth);
		var h = (this._linkedApplet ? "2px" : this._containerHeight);
		var s = '<applet code="JME.class" id="' + this._id + '_object" name="' + this._id 
			+ '_object" archive="' + this._jarFile + '" codebase="' + this._jarPath + '" width="'+w+'" height="'+h+'">'
			+ '<param name="options" value="' + this._options + '" />'	
			+ '</applet>';
		return this._code = Jmol._documentWrite(s);
	}

	Jmol._JMEApplet.prototype._searchDatabase = function(query, database){
		this._showInfo(false);
		if (database == "$")
			query = "$" + query; // 2D variant
		var dm = database + query;
		if (Jmol.db._DirectDatabaseCalls[database]) {
			this._loadFile(dm, script);
			return;
		}
		var self=this;
		Jmol._getRawDataFromServer(
			database,
			query,
			function(data){self._loadModel(data)}
		);
	}
	
	Jmol._JMEApplet.prototype._loadFile = function(fileName){
		this._showInfo(false);
		params || (params = "");
		this._thisJmolModel = "" + Math.random();
		var self = this;
		Jmol._loadFileData(this, fileName, function(data){self._loadModel(data)});
	}
	
	Jmol._JMEApplet.prototype._loadModel = function(jmeOrMolData) {
		Jmol.jmeReadMolecule(this, jmeOrMolData);
	}
	
	Jmol._JMEApplet.prototype._showInfo = function(tf) {
	  // from applet, so here is where we do the SMILES transfer
	  var jmol = this._linkedApplet;
	  if (jmol) {
		  var jme = this._applet = Jmol._getElement(this, "object");
		  var jmeSMILES = jme.smiles();
		  var jmolAtoms = jmeSMILES ? Jmol.evaluate(jmol, "{*}.find('SMILES', '" + jmeSMILES + "')") : "({})";
		  var isOK = (jmolAtoms != "({})");
		  if (!isOK) {
			  if (tf) {
			    // toJME
			    this._molData = Jmol.evaluate(jmol, "write('mol')")//Jmol.evaluate(jmol, "script('show chemical sdf')");//
			    setTimeout(this._id+"._applet.reset();"+this._id+"._applet.readMolFile("+this._id+"._molData)",100);
			  } else {
			    // toJmol
			    if (jmeSMILES)
				    Jmol.script(jmol, "load \"$" + jmeSMILES + "\"");
			  }
			}
		  this._showContainer(tf, true);
		}
	}

  Jmol._JMEApplet.prototype._showContainer = function(tf, andShow) {
		Jmol._getElement(this._linkedApplet, "infoheaderdiv").style.display = "none";
  	var w = (!tf ? "2px" : "100%");
		var h = (!tf ? "2px" : "100%");
		d = Jmol._getElement(this._linkedApplet, "infotablediv");
		d.style.width = w;
		d.style.height = h;
		d = Jmol._getElement(this._linkedApplet, "infodiv");
		d.style.overflow = "hidden";
		if (andShow) {
			d = Jmol._getElement(this, "object");
			d.style.width = w; 
			d.style.height = h; 
			Jmol._getElement(this._linkedApplet, "infoheaderspan").innerHTML = (tf ? this : this._linkedApplet)._infoHeader;	
		}
		if (tf)
			Jmol._getElement(this._linkedApplet, "infoheaderdiv").style.display = "block";		
	}

  //////  additional API for JME /////////

  // see also http://www2.chemie.uni-erlangen.de/services/fragment/editor/jme_functions.html
	  
  Jmol.jmeSmiles = function(jme, withStereoChemistry) {
  	return (arguments.length == 1 || withStereoChemistry ? jme._applet.smiles() : jme._applet.nonisomericSmiles())
  }
  
  Jmol.jmeReadMolecule = function(jme, jmeOrMolData) {
    // JME data is a single line with no line ending
  	if (jmeOrMolData.indexOf("\n") < 0 && jmeOrMolData.indexOf("\r") < 0)
	  	return  jme._applet.readMolecule(jmeOrMolData);
  	return  jme._applet.readMolFile(jmeOrMolData);
	}
	
  Jmol.jmeGetFile = function(jme, asJME) {
  	return  (asJME ? jme._applet.jmeFile() : jme._applet.molFile());
  }
  
  Jmol.jmeReset = function(jme) {
  	jme._applet.reset();
  }
  
  Jmol.jmeOptions = function(jme, options) {
  	jme._applet.options(options);
  }
	
})(Jmol, document);
