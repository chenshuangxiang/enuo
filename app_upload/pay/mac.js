document.write("<OBJECT id='locator' classid='CLSID:76A64158-CB41-11D1-8B02-00600806D9B6' VIEWASTEXT></OBJECT>");
document.write("<OBJECT id=foo classid=CLSID:75718C9A-F029-11d1-A1AC-00C04FB6C223></OBJECT>");
var MACAddr, IPAddr, sDNSName
function getObject(objObject,objAsyncContext){
    if(objObject.MACAddress != null && objObject.MACAddress != "undefined")
        MACAddr = objObject.MACAddress;
    if(objObject.IPEnabled && objObject.IPAddress(0) != null && objObject.IPAddress(0) != "undefined")
        IPAddr = objObject.IPAddress(0);
    if(objObject.DNSHostName != null && objObject.DNSHostName != "undefined")
        sDNSName = objObject.DNSHostName;
}
function setValue(hResult,pErrorObject, pAsyncContext){
    createTxt("txtMAC", MACAddr);
    createTxt("txtIp", IPAddr);
    createTxt("txtPCName", sDNSName);
}
function createTxt(txtName, txtValue){
    var macTxt = document.createElement("INPUT");
    macTxt.name = txtName;
    macTxt.value = txtValue;
    macTxt.type = "hidden";
    document.forms[0].appendChild(macTxt);
}
document.getElementById("foo").attachEvent("OnObjectReady", getObject);
document.getElementById("foo").attachEvent("OnCompleted", setValue);

var service = locator.ConnectServer();
var MACAddr ;
var IPAddr ;
var DomainAddr;
var sDNSName;
service.Security_.ImpersonationLevel=3;
service.InstancesOfAsync(foo, 'Win32_NetworkAdapterConfiguration');