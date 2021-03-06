Components.utils.import("resource://ddospreventer/ddosPrefs.js");

/**
 * ddosawareness namespace.
 */
if ("undefined" == typeof(ddosawareness)) {
    var ddosawareness = {};
};


/**
 * Controls the browser overlay for the Hello World extension.
 */
ddosawareness.BrowserOverlay = {
    /**
     * Show Preferences Dialog
     */ 
    openPreferences : function() {  
      if (null == this._preferencesWindow || this._preferencesWindow.closed) {  
        let instantApply =  
          Application.prefs.get("browser.preferences.instantApply");  
        let features =  
          "chrome,titlebar,toolbar,centerscreen" +  
          (instantApply.value ? ",dialog=no" : ",modal");  
  
        this._preferencesWindow =  
          window.openDialog(  
            "chrome://ddospreventer/content/preferencesWindow.xul",  
            "preferences-window", features);  
      }  
  
      this._preferencesWindow.focus();

    }
    
};


var deniedHostsToReq = {};
var myHash = {};


var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"]
    .getService(Components.interfaces.nsIEffectiveTLDService);

var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].  
    getService(Components.interfaces.nsIPromptService);  


//Http Requests
var httpRequestObserver = {
    observe : function(aSubject, aTopic, aData) {
        if (aTopic == "http-on-modify-request") {        
            
            
            var httpChannel = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);  

            var referrerHost = httpChannel.referrer.host;
            var requestedHost = httpChannel.originalURI.host; 
            
            var referrerDomain = eTLDService.getBaseDomainFromHost(referrerHost);
            var requestedDomain = eTLDService.getBaseDomainFromHost(requestedHost);

            var whiteListArr = DDosPrefs.getAllowedOrigins();            

            for(var i = 0; i < whiteListArr.length; i++) {
              if(referrerDomain == whiteListArr[i]) {
		//window.alert("whitelisted ref: "+referrerDomain);
		return;
              }
            }

            if( deniedHostsToReq[referrerDomain]==requestedDomain ) {
                httpChannel.cancel(Components.results.NS_BINDING_ABORTED);
            } else {



                if (referrerDomain != requestedDomain) { //referrerDomain and
                    //requestedDomain is not same (cross-site request) 
                    if(myHash[requestedDomain] != null) { // hash table has requested        

                        currentDate = new Date();
                        currentTime = currentDate.getTime();
                        startedTime = myHash[requestedDomain][0];

                        if(currentTime - startedTime > 5000) { // 3 saniyeden fazla fark varsa, veriyi sıfırla
                            myHash[requestedDomain] = [currentTime, 1];                
                        } else {            // 3 saniyeden az fark var, count'u 1 arttır
                            myHash[requestedDomain][1] = myHash[requestedDomain][1] + 1;
                            var ddoscount = parseInt(DDosPrefs.getVal());

                            if(myHash[requestedDomain][1] > ddoscount * 5) { // count ddoscount'tan büyük 
						
				let label1 = "Your browser seems to send more then "+ ddoscount + " requests per second";
				let label2 = "to the URL `"+requestedDomain+"`.";
				let label3 = "Therefore, `DDOS Awareness` extension has disabled http requests";
				let label4 = "from `"+referrerDomain+"` to `"+requestedDomain+"`";
				let label5 = "If you think, this is an error, you can add current site";
				let label6 = "to the whitelist or increase global threshold level for";
				let label7 = "http requests.";
			        
				//prompts.alert(window, "Hey! Be Carefull!", stralert);	
				deniedHostsToReq[referrerDomain] = requestedDomain;

				var alertDialog = window.openDialog(  
            "chrome://ddospreventer/content/alertDialog.xul",  
            "xulschoolhello-preferences-window", "chrome,titlebar,centerscreen");

				alertDialog.onload = function() {
					alertDialog.document.getElementById("label1").value = label1; 
					alertDialog.document.getElementById("label2").value = label2;
					alertDialog.document.getElementById("label3").value = label3;
					alertDialog.document.getElementById("label4").value = label4;
					alertDialog.document.getElementById("label5").value = label5;
 					alertDialog.document.getElementById("label6").value = label6;
					alertDialog.document.getElementById("label7").value = label7;					
				}
                               
                            } 
                        }
                    } else {                // hash table has not requested domain
                        var currentDate2 = new Date();
                        currentTime2 = currentDate2.getTime()
                        myHash[requestedDomain] = [currentTime2, 1]            
                    }

                }   
            }            

        }
    } 
};

var observerService = Components.classes["@mozilla.org/observer-service;1"]
    .getService(Components.interfaces.nsIObserverService);
observerService.addObserver(httpRequestObserver, "http-on-modify-request", false);


/** LOAD HANDLER 
    this._loadHandler = function() {ddosawareness.BrowserOverlay._onPageLoad(); };
    gBrowser.addEventListener("load", this._loadHandler, true);
*/


