Components.utils.import("resource://ddospreventer/ddosPrefs.js");

var descript = document.getElementById("alert-description");
descript.textContent = "asfasdfsadf";

function doOK(){
  /**let tBox = document.getElementById("ddos-pref-textbox");
  let messageCount = XULSchool.Prefs.count;

  if(tbox) {
    tBox.value = messageCount;
  } */
 
  return true;
}

function doCancel(){
  // window.alert(prefs.accessPerMin);	
  return true;
}
