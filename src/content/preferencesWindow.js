Components.utils.import("resource://ddospreventer/ddosPrefs.js");

if (!ddosawareness) {
  var ddosawareness = {
    
  };
}

ddosawareness.prefWindow = {
  init : function() {
	this._addOriginButton = document.getElementById("addOrigin");
	
	this._addOrigin_originField = document
          .getElementById("addOrigin-originField");
	
	// Each "allow" button has an array of its associated textboxes.
	this._addOriginButton.textboxes = [this._addOrigin_originField];

 	// Each "allow" textbox knows its associated button.
        this._addOrigin_originField.button = this._addOriginButton;

        // Each button has an "allow" function to whitelist the user-entered item.
        this._addOriginButton.allow = function() {
 
          var origin = ddosawareness.prefWindow._addOriginButton.textboxes[0].value;
          // First forbid the item so that amy temporarily allowed item will be
          // removed         
          //ddosawareness.prefWindow.forbidOrigin(origin);
	  if(origin != "")
            ddosawareness.prefWindow.allowOrigin(origin);
         
        };


        this._originsList = document.getElementById("originsList");
 	// Each list has a "removeButton" property which is the list's associated
        // "remove selected items" button.
	this._originsList.removeButton = document.getElementById("removeOrigin");

        // Each "remove selected items" button has a "listbox" property which is
        // the button's associated list.
	this._originsList.removeButton.listbox = this._originsList;

        this.populateListbox();
       
  },

  openPreferences : function() {  
      /**if (null == this._preferencesWindow || this._preferencesWindow.closed) {  
        let instantApply =  
          Application.prefs.get("browser.preferences.instantApply");  
        let features =  
          "chrome,titlebar,toolbar,centerscreen" +  
          (instantApply.value ? ",dialog=no" : ",modal");  
  
        this._preferencesWindow =  
          window.openDialog(  
            "chrome://ddospreventer/content/preferencesWindow.xul",  
            "xulschoolhello-preferences-window", features);  
      }  
  
      this._preferencesWindow.focus();*/

      window.openDialog(  
            "chrome://ddospreventer/content/preferencesWindow.xul",  
            "xulschoolhello-preferences-window", "chrome,titlebar,toolbar,centerscreen");   
  },

  openLicense : function() {  

      window.openDialog(  
            "chrome://ddospreventer/content/licenseDialog.xul",  
            "license-dialog");
      /*
      if (null == this._licenseWindow || this._licenseWindow.closed) {  
        let features =  
          "chrome,titlebar,toolbar,centerscreen");  
  
        this._licenseWindow =  
          window.openDialog(  
            "chrome://ddospreventer/content/licenseDialog.xul",  
            "license-dialog", features);  
      }  
  
      this._licenseWindow.focus();  */
  },

  openBlocked : function() {

    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"] 
	.getService(Components.interfaces.nsIWindowMediator);

    var mainWindow = wm.getMostRecentWindow("navigator:browser");

    mainWindow.gBrowser.selectedTab = mainWindow.gBrowser.addTab("http://ddosmitigator.com/firefoxextension/blocked.html");

  },

  addToWhitelistInputChanged : function(textbox) {
    for (var i = 0; i < textbox.button.textboxes.length; i++) {
      if (textbox.button.textboxes[i].value.length == 0) {
        textbox.button.disabled = true;
        return;
      }
    }
    
    textbox.button.disabled = false;
    
  },

  addToWhitelist : function(button) {
    // TODO: Warn people when they enter UTF8 formatted IDNs for TLDs that
    //       Mozilla doesn't support UTF8 IDNs for, and warn when they enter
    //       ACE formatted IDNs for TLDs that are supported in UTF8. An entry
    //       in the wrong format will get ignored. This seems to be somewhat
    //       of an argument for always storing/comparing in ACE format. Even
    //       though this seems like it may be a pain to go back and rectify
    //       later if we decide we only want to store ACE format, I just don't
    //       see the complexity of dealing with it now to be worth it,
    //       especially as only time will tell if it really is a nuisance.
    
    button.disabled = true;
    // Remove pipes and spaces which would conflict with the separators we use
    // when storing these in preferences.
    for (var i = 0; i < button.textboxes.length; i++) {
      button.textboxes[i].value = button.textboxes[i].value.replace(/[\|\s]/g,
          "");
      if (button.textboxes[i].value == "") {
        return;
      }
    }
    
    button.allow();

    for (var i = 0; i < button.textboxes.length; i++) {
      button.textboxes[i].value = "";
    }
  },

  allowOrigin : function(origin) {
    let trimmedOrig = this.trimOrigin(origin);
    let arr = DDosPrefs.getAllowedOrigins();
    let hasDuplicate = 0;

    for(var i = 0; i<arr.length; i++) {
      if(arr[i] == trimmedOrig) {
        hasDuplicate = 1;
      }
    }
    
    if(hasDuplicate == 0 && origin != "") {
	DDosPrefs.addToAllowedOrigins(trimmedOrig);
        var theList = this._originsList;
        var row = document.createElement('listitem');
   	row.setAttribute('label', trimmedOrig);
    	theList.appendChild(row);
    }
    
  },

  trimOrigin : function(origin) {
    neworig = origin.replace("http://","");
    neworig = neworig.replace("www.","");
    return neworig;
  },

  listSelectionChanged : function(listbox) {
    listbox.removeButton.setAttribute("disabled",
        listbox.selectedItems.length == 0);
  },

  removeSelectedFromList : function(listbox) {
    let selectedLabel = listbox.selectedItem.label;
    let selectedIndex = listbox.selectedIndex;
    let litem = listbox.selectedItem;

    listbox.removeChild(litem);  
    DDosPrefs.removeFromAllowedOrigins(selectedLabel);*
  },


  populateListbox : function() {
    let arr = DDosPrefs.getAllowedOrigins();
    
    for (var i = 0; i < arr.length; i++) {   
        var theList = document.getElementById('originsList');     
        var row = document.createElement('listitem');
        row.setAttribute('label', arr[i]);
	theList.appendChild(row);
    }
  }
}


//init
addEventListener("DOMContentLoaded", function(event) {
      ddosawareness.prefWindow.init();
}, false);
