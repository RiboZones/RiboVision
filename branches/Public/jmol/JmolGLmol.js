// JmolGLmol.js -- Jmol GLmol  extension	 author: Bob Hanson, hansonr@stolaf.edu	4/16/2012
//                                                       biochem_fan 6/12/2012

// This library requires
//
//	JmolCore.js
//  JmolApplet.js
//	jQuery.min.js
//      Three49cusom.js
//      GLmol.js
//
// prior to JmolGlmol.js

if(typeof(GLmol)=="undefined") GLmol = null;

(function (Jmol) {

	if (!GLmol) 
		return;

	Jmol._getCanvas = function(id, Info, checkOnly) {
		// overrides the function in JmolCore.js
		var canvas = null;
		if (Info.useWebGlIfAvailable && Jmol.featureDetection.supportsWebGL()) {
			canvas = new Jmol._Canvas3D(id, Info, null, checkOnly);
			if (Jmol._document)
				canvas._readyCallback(id, id, true, null);
		}
		return canvas;
	}

	Jmol._Canvas3D = function(id, Info, caption, checkOnly){
		this._is2D = false;
		this._jmolType = "Jmol._Canvas3D (GLmol)";
		if (checkOnly)
			return this;
		this._dataMultiplier=1;
		this._create(id, Info, caption);
		return this;
	};

	var _glSetPrototype = function(proto) {
		Jmol._Applet._setCommonMethods(proto);
		proto._create = function(id, Info, caption) {
			Jmol._setObject(this, id, Info);
      var t = Jmol._getWrapper(this, true);
      //console.log(this);
			if (Jmol._document) {
				Jmol._documentWrite(t);				
        this.create(id + "_appletdiv", true);
				this._setDefaults();
				t = "";
			} else {
				t += '<script type="text/javascript">' 
					+ id + '.create("'+id+'",'+Info.width+','+Info.height+');' 
					+ id + '._setDefaults();'
				if (Info.defaultModel)
					t += id + "._search(" + id + "._defaultModel);";
				if (this._readyScript)
					t += id + '._script(' + id + '._readyScript);'
				t += '</script>';
			}
			t += Jmol._getWrapper(this, false);
			if (Info.addSelectionOptions)
				t += Jmol._getGrabberOptions(this, caption);
			if (Jmol._debugAlert && !Jmol._document)
				alert(t);
			this._code = Jmol._documentWrite(t);
		};
		
		proto._canScript = function(script) {return (script.indexOf("#alt") >= 0);};

		proto._script = function(script) {
			if (!this._canScript(script))
				return;
			var Cmd = jQuery.trim(script.split("#alt:")[1]);
			var pt = Cmd.indexOf(" ");
			var what = jQuery.trim(Cmd.substring(pt + 1));
			switch (Cmd.substring(0, pt)) {
			case "SETTING":
			    switch (what) {
			    case "Ball and Stick": this._hetatmMode = 'ballAndStick2'; break;
			    case "Line": this._hetatmMode = 'line'; break;
			    case "van der Waals Spheres": this._hetatmMode = 'sphere'; break;
			    }
			    this.rebuildScene();
			    this.show();
			    return;
			case "LOAD":
			    if (what.indexOf("??") >= 0) {
				var db = what.split("??")[0];
				what = prompt(what.split("??")[1], "");
				if (!what)
				    return;
				if (!Jmol.db._DirectDatabaseCalls[what.substring(0,1)])
				    what = db + what;
			    }
			    Jmol.loadFile(this, what);
			    return;
			}
		};
				
		proto._searchDatabase = function(query, database, script){
			if (Jmol._searchDatabase(this, query, database, script))
				return;
			this.emptyMessage="Searching...";
			var glcanvas = this;
			Jmol._getRawDataFromServer(
				database,
				query,
				function(data){Jmol._glProcessFileData(glcanvas, data, script)}
			);
		};

		proto._show = function(tf) {
			document.getElementById(this._id + "_appletdiv").style.display = (tf ? "block" : "none");
		};

		proto._loadFile = function(fileName, script){
			this._showInfo(false);
			this._thisJmolModel = "" + Math.random();
			this.emptyMessage="Retrieving data...";
			this._jmolFileType = Jmol._getFileType(fileName);
      var glcanvas = this;
			Jmol._loadFileData(glcanvas, fileName, function(data){Jmol._glProcessFileData(glcanvas, data, script)});
		};

    proto.defineRepresentation = function() {
		  var all = this.getAllAtoms();
		  var allHet = this.getHetatms(all);
			var hetatm = this.removeSolvents(allHet);
		  this.colorByAtom(all, {});
		  switch (this._colorMode) {
		  case 'ss': this.colorByStructure(all, 0xcc00cc, 0x00cccc); break;
		  case 'chain': this.colorByChain(all); break;
		  case 'chainbow': this.colorChainbow(all); break;
		  case 'b': this.colorByBFactor(all); break;
		  case 'polarity': this.colorByPolarity(all, 0xcc0000, 0xcccccc); break;
		  }
	
		  var asu = new THREE.Object3D();
		  switch (this._mainchainMode) {
		  case 'ribbon':
				this.drawCartoon(asu, all, this.wraper.doNotSmoothen);
				this.drawCartoonNucleicAcid(asu, all);
				break;
		  case 'thickRibbon':
				this.drawCartoon(asu, all, this.doNotSmoothen, this.thickness);
				this.drawCartoonNucleicAcid(asu, all, null, this.thickness);
				break;
		  case 'strand':
				this.drawStrand(asu, all, null, null, null, null, null, doNotSmoothen);
				this.drawStrandNucleicAcid(asu, all);
				break;
		  case 'chain':
				this.drawMainchainCurve(asu, all, this.curveWidth, 'CA', 1);
				this.drawMainchainCurve(asu, all, this.curveWidth, 'O3\'', 1);
				break;
		  case 'tube':
				this.drawMainchainTube(asu, all, 'CA');
				this.drawMainchainTube(asu, all, 'O3\'');
				break;
		  case 'bonds':
				this.drawBondsAsLine(asu, all, this.lineWidth);
				break;
		  }
		        
		  if (this.drawSidechains)
				this.drawBondsAsLine(this.modelGroup, this.getSidechains(all), this.lineWidth);
		    
		  switch (this.baseMode) {
		  case 'nuclStick': this.drawNucleicAcidStick(this.modelGroup, all); break;
		  case 'nuclLine': this.drawNucleicAcidLine(this.modelGroup, all); break;
		  case 'nuclPolygon': this.drawNucleicAcidLadder(this.modelGroup, all); break;
		  }
		    
		  var target = this.symopAtoms ? asu : this.modelGroup;
		  if (this.showNonbonded) {
				var nonBonded = this.getNonbonded(allHet);
				if (this.nbMode == 'nb_sphere') {
			    this.drawAtomsAsIcosahedron(target, nonBonded, 0.3, true);
				} else if (this.nbMode == 'nb_cross') {
			    this.drawAsCross(target, nonBonded, 0.3, true);   
				}
		  }
		    
		  switch (this._hetatmMode) {
		  case 'stick': this.drawBondsAsStick(target, hetatm, this.cylinderRadius, this.cylinderRadius, true); break;
		  case 'sphere': this.drawAtomsAsSphere(target, hetatm, this.sphereRadius); break;
			case 'line': this.drawBondsAsLine(target, hetatm, this.curveWidth); break;
		  case 'ballAndStick': this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 2.0, this.cylinderRadius, true, false, 0.3); break;
		  case 'ballAndStick2': this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 2.0, this.cylinderRadius, true, true, 0.3); break;
		  } 
		    
		  this.setBackground(this._backgroundColor);
		    
		  if (this.showCell)
				this.drawUnitcell(this.modelGroup);
		    
		  if (this.drawBiomt)
				this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
		    
		  if (this.drawPacking)
				this.drawSymmetryMatesWithTranslation2(this.modelGroup, asu, this.protein.symMat);
		  this.modelGroup.add(asu);
		};

		return proto;
	};

	Jmol._Canvas3D.prototype = _glSetPrototype(new GLmol);

  Jmol._Canvas3D.prototype._setDefaults = function() {
    this._backgroundColor = 0x000000;
    this._hetatmMode = 'ballAndStick2';
    this._mainchainMode = 'thickRibbon';
    this._colorMode = 'chainbow';
  };
     
	Jmol._glProcessFileData = function(glcanvas, data, script) {
    glcanvas.loadMoleculeStr(false, Jmol._cleanFileData(data));
    script && Jmol.script(glcanvas, script);
	};

  
})(Jmol);
