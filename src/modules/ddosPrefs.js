var EXPORTED_SYMBOLS = ["DDosPrefs"];

if ("undefined" == typeof(DDosPrefs)) {
  var DDosPrefs = {};
};

const Cc = Components.classes;
const Ci = Components.interfaces;

var DDosPrefs = {
  _allowedConnection : null,
  _allowedOrigins : null,

  _init : function() {
    let application =
        Cc["@mozilla.org/fuel/application;1"].getService(Ci.fuelIApplication);

    this._allowedConnection =
	application.prefs.get("extensions.ddospreventer.allowed.connection");

    this._allowedOrigins = 
    	application.prefs.get("extensions.ddospreventer.allowed.origins");

  },

  addToAllowedOrigins : function(origin) {
    //return this._allowedConnection.value;
    //return 15;
    if(this._allowedOrigins.value=="")
      this._allowedOrigins.value = origin; 
    else
      this._allowedOrigins.value = this._allowedOrigins.value + ";" + origin; 
  },

  removeFromAllowedOrigins : function(origin) {
    let arr = this._allowedOrigins.value.split(";"); 
    let arr2 = new Array();

    for (var i = 0; i < arr.length; i++) {
      if(arr[i] != origin) 
	arr2.push(arr[i]);
    }

    this._allowedOrigins.value = "";
    for (var i = 0; i < arr2.length; i++) { 
      if (i == 0) {
	this._allowedOrigins.value = arr2[i];
      } else {
	this._allowedOrigins.value = this._allowedOrigins.value + ";" + arr2[i];
      }
    }
    
  },

  getAllowedOrigins : function() {
    let arr = this._allowedOrigins.value.split(";"); 
    return arr;
  },

  getVal : function() {
    return this._allowedConnection.value;
    //return 10; 
  },

  setVal : function(value) {
    this._allowedConnection.value = value;
  }

};

//Constructor.
(function() { this._init(); }).
  apply(DDosPrefs);






