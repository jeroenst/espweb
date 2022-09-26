var mqttdata = {};

// Create a client instance
client = new Paho.MQTT.Client("wss://" + window.location.hostname + "/wsmqtt", "browser_" + Math.random().toString(36).substr(2, 9));


function onConnect() 
{
  // Once a connection has been made, make a subscription and send a message.
  console.log("MQTT Connected");
  client.subscribe("+/+/hostname");
  client.subscribe("+/+/status");
  client.subscribe("+/+/status/upgrade");
  client.subscribe("+/+/firmware/name");
  client.subscribe("+/+/firmware/target");
  client.subscribe("+/+/system/uptime");
  client.subscribe("+/+/firmware/compiletime");
  client.subscribe("+/+/firmware/version");
  client.subscribe("+/+/system/freeram");
  client.subscribe("+/+/wifi/rssi");
  client.subscribe("+/+/wifi/channel");
  client.subscribe("+/+/wifi/ssid");
  client.subscribe("+/+/wifi/localip");
  client.subscribe("+/+/wifi/externalip");
  client.subscribe("+/+/mqtt/clientid");
  client.subscribe("+/+/mqtt/server");
  client.subscribe("+/+/mqtt/port");
  client.subscribe("+/+/mqtt/ssl");
  client.subscribe("+/+/tele/LWT");
  client.subscribe("+/+/stat/+");
}

// called when the client loses its connection
function onConnectionLost(responseObject) 
{
  if (responseObject.errorCode !== 0) 
  {
    console.log("MQTT Connection lost, reason: "+responseObject.errorMessage);
    mqttdata = {};
  }
  connectMQTT();
}

function onFailure(err) {
//      if (err == 0x04) window.location = window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?incorrectpassword";
}

var counter = 0;

function rowClickHandler(myrow)
{
                             var cell = myrow.getElementsByTagName("td")[0];
                             var id = cell.innerHTML;
                             alert("id:" + id);
                               var table = document.getElementById('esptable').getElementsByTagName('tbody')[0];
/*  var rows = table.getElementsByTagName("tr");
       rows[row.rowIndex].cells[0].style.display = "table-row";*/
}

function onMessageArrived(message) 
{
  var value = message.payloadString;
  var jsonvalue;
  try {
    jsonvalue = JSON.parse(value);
  } catch (e) {  }
  console.log("MQTT-Received:'"+message.destinationName+"'='"+message.payloadString+"'");

  var maintopic = message.destinationName.split("/", 2);
  maintopic = maintopic[0] + "/" + maintopic[1];
  var subtopic = message.destinationName.substr(maintopic.length+1);

  if(typeof mqttdata[maintopic] === 'undefined') {
   mqttdata[maintopic] = {};
  }

//STATUS2 = {"StatusFWR":{"Version":"12.1.1.2(tasmota)","BuildDateTime":"2022-09-26T11:05:50","Boot":31,"Core":"2_7_4_9","SDK":"2.2.2-dev(38a443e)","CpuFrequency":80,"Hardware":"ESP8266EX","CR":"411/699"}}
//STATUS5 = {"StatusNET":{"Hostname":"tasmota-coffee","IPAddress":"172.30.31.183","Gateway":"172.30.30.254","Subnetmask":"255.255.254.0","DNSServer1":"172.30.30.3","DNSServer2":"0.0.0.0","Mac":"4C:EB:D6:0F:EB:9C","Webserver":2,"HTTP_API":1,"WifiConfig":4,"WifiPower":17.0}} (retained)
//STATUS6 = {"StatusMQT":{"MqttHost":"mqtt.jst-it.nl","MqttPort":1883,"MqttClientMask":"DVES_%06X","MqttClient":"DVES_0FEB9C","MqttUser":"jeroen","MqttCount":1,"MAX_PACKET_SIZE":1200,"KEEPALIVE":30,"SOCKET_TIMEOUT":4}} (retained)
//Status11 {"StatusSTS":{"Time":"2022-09-26T13:08:21","Uptime":"5T20:20:20","UptimeSec":505220,"Heap":21,"SleepMode":"Dynamic","Sleep":50,"LoadAvg":21,"MqttCount":5,"POWER":"OFF","Dimmer":0,"Fade":"OFF","Speed":1,"LedTable":"ON","Wifi":{"AP":1,"SSId":"M-T-S IOT","BSSId":"BE:FB:E4:F7:3B:05","Channel":9,"Mode":"11n","RSSI":74,"Signal":-63,"LinkCount":1,"Downtime":"0T00:00:07"}}}  
 try {

    if (subtopic == "stat/STATUS2")
    {
      mqttdata[maintopic]["firmware/compiletime"] = jsonvalue.StatusFWR.BuildDateTime.replace("T"," ");;
      mqttdata[maintopic]["firmware/version"] = jsonvalue.StatusFWR.Version.split("(")[0];
      mqttdata[maintopic]["firmware/name"] = "Tasmota";
      mqttdata[maintopic]["firmware/target"] = jsonvalue.StatusFWR.Version.split("(")[1].split(")")[0];
    }
    if (subtopic == "stat/STATUS3")
    {
      mqttdata[maintopic]["mqtt/ssl"] = parseInt(jsonvalue.StatusLOG.SetOption[3][2],16) & 2 ? "1" : "0";
    }
    else if (subtopic == "stat/STATUS5")
    {
      mqttdata[maintopic]["hostname"] = jsonvalue.StatusNET.Hostname;
      mqttdata[maintopic]["wifi/localip"] = jsonvalue.StatusNET.IPAddress;
    }
    else if (subtopic == "stat/STATUS6")
    {
      mqttdata[maintopic]["mqtt/server"] = jsonvalue.StatusMQT.MqttHost;
      mqttdata[maintopic]["mqtt/port"] = jsonvalue.StatusMQT.MqttPort;
      mqttdata[maintopic]["mqtt/user"] = jsonvalue.StatusMQT.MqttUser;
      mqttdata[maintopic]["mqtt/clientid"] = jsonvalue.StatusMQT.MqttClient;
    }
    else if (subtopic == "stat/STATUS11")
    {
      mqttdata[maintopic]["system/uptime"] = jsonvalue.StatusSTS.Uptime.replace("T",":");
      mqttdata[maintopic]["wifi/rssi"] = jsonvalue.StatusSTS.Wifi.Signal;
      mqttdata[maintopic]["wifi/ssid"] = jsonvalue.StatusSTS.Wifi.SSId;
      mqttdata[maintopic]["wifi/channel"] = jsonvalue.StatusSTS.Wifi.Channel;
      mqttdata[maintopic]["system/freeram"] = jsonvalue.StatusSTS.Heap * 1024;
    }
    else mqttdata[maintopic][subtopic] = value;
  } catch (e) {}

  var table = document.getElementById('esptable').getElementsByTagName('tbody')[0];
  var rows = table.rows;
  var row = null;
  var row2 = null;
  for (i = 0; i < rows.length; i++) 
  {
    var currentRow = table.rows[i];
    if (currentRow.cells[0].innerText == maintopic)
    {
      row = currentRow;
      row2 = table.rows[i+1];
    }
  }

  if (row == null)
  {
    row = table.insertRow();
    newcell = row.insertCell(0);
    newcell.innerHTML=maintopic;
    row.insertCell(1);
    row.insertCell(2);
    row.insertCell(3);
    row.insertCell(4);
    row.insertCell(5);
    row.insertCell(6);
    row2 = table.insertRow();
    newcell = row2.insertCell(0);
    newcell.colSpan = 8;
        row.onclick = function(myrow){
                          return function() { 
                             var rows = table.rows;
                             if (rows[myrow.rowIndex].style.display == "table-row") rows[myrow.rowIndex].style.display = "none";
                             else rows[myrow.rowIndex].style.display = "table-row";
                             
                             for (i = 1; i < (rows.length - 1); i = i + 1) {
                               if (i !== myrow.rowIndex) if (rows[i].style.display == "table-row") rows[i].style.display = "none";
                             }
                      };
                  }(row);
             row2.style.display = "none";
/*        row2.onclick = function(myrow){
                          return function() { 
                             var rows = table.rows;
                             rows[myrow.rowIndex].style.display = "none";

                      };
                  }(row);*/
 sortTable(sortcolumnid, 0);
  }
  


    if (subtopic == "status")
    {
     color = "#FF0000";
     if (value == "online") color = "#00FF00";
     if (value == "querying") color = "#00FF00";
     if (value == "ready") color = "#00FF00";
     if (value == "receiving") color = "#00FF00";
     if (value == "fetching") color = "#00FF00";
     if (value == "error") color = "#FFBB00";
     if (value == "commerror") color = "#FFBB00";
     if (value == "upgrading") color = "#0000FF";
     
     row.cells[1].innerHTML = "<FONT COLOR=\""+color+"\">"+value+"</FONT>";
    }

    if (subtopic == "tele/LWT")
    {
     color = "#FF0000";
     if (value == "Online") 
     {
       color = "#00FF00";
     }
     row.cells[1].innerHTML = "<FONT COLOR=\""+color+"\">"+value.toLowerCase()+"</FONT>";
    }
    


  if ((value = mqttdata[maintopic]["system/uptime"]) == undefined) value = "-";
  row.cells[2].innerHTML = value;

  if ((value = mqttdata[maintopic]["system/freeram"]) == undefined) value = "-";
  row.cells[3].innerHTML = value;
  
  if ((value = mqttdata[maintopic]["wifi/channel"]) == undefined) value = "-";
  row.cells[5].innerHTML = value;

  color = "#000000";
  value = mqttdata[maintopic]["wifi/rssi"];
  if (value <= -80) color = "#FF0000";
  else if (value <= -70) color = "#FFBB00";
  else if (value <= -60) color = "#88BB00";
  else color = "#00FF00";
  if ((value = mqttdata[maintopic]["wifi/rssi"]) == undefined) value = "-";
  row.cells[6].innerHTML = "<B><FONT COLOR=\""+color+"\">"+value+"</FONT></B>";

  if ((value = mqttdata[maintopic]["firmware/version"]) == undefined) value = "-";
  row.cells[4].innerHTML = value;

 
 
//  row2.cells[0].style.padding = "10px 20px 10px 20px";
  row2.cells[0].innerHTML='<table class="espdetailtable">'+
           '<tr><td>Hostname:</td><td>'+mqttdata[maintopic]["hostname"]+'</td></tr>'+
           '<tr><td>Firmware Name:</td><td>'+mqttdata[maintopic]["firmware/name"]+'</td></tr>'+
           '<tr><td>Firmware Target:</td><td>'+mqttdata[maintopic]["firmware/target"]+'</td></tr>'+
           '<tr><td>Firmware Compiletime:</td><td>'+mqttdata[maintopic]["firmware/compiletime"]+'</td></tr>'+
           '<tr><td>Wifi SSID:</td><td>'+mqttdata[maintopic]["wifi/ssid"]+'</td></tr>'+
           '<tr><td>Wifi Channel:</td><td>'+mqttdata[maintopic]["wifi/channel"]+'</td></tr>'+
           '<tr><td>Wifi Local Ip:</td><td><a href="http://'+mqttdata[maintopic]["wifi/localip"]+'" target="_blank">'+mqttdata[maintopic]["wifi/localip"]+'</a></td></tr>'+
           '<tr><td>Wifi External Ip:</td><td>'+gettopic(maintopic,"wifi/externalip")+'</td></tr>'+
           '<tr><td>MQTT Server:</td><td>'+mqttdata[maintopic]["mqtt/server"]+'</td></tr>'+
           '<tr><td>MQTT Port:</td><td>'+mqttdata[maintopic]["mqtt/port"]+'</td></tr>'+
           '<tr><td>MQTT SSL:</td><td>'+gettopic(maintopic, "mqtt/ssl")+'</td></tr>'+
           '<tr><td>MQTT Client Id:</td><td>'+mqttdata[maintopic]["mqtt/clientid"]+'</td></tr>'+
           '</table>';
}

function gettopic (maintopic, subtopic)
{
  if (mqttdata[maintopic][subtopic] !== undefined)
  {
    return mqttdata[maintopic][subtopic];
  }
  else return "-"

}

function connectMQTT()
{
   try
   {
        if (!client.isConnected()) client.connect({onSuccess:onConnect, onFailure:onFailure, userName: mqttusername, password: mqttpassword});
   }
   catch (err)
   {
   }
}

function undefstr ( str )
{
  if (str === undefined) return '-';
  return str;
}

$(document).ready(function() 
{
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    connectMQTT();
} );

var sortcolumnid = 0;

function theadclick(columnid)
{
 console.log("theadclick("+columnid+")");
 sortcolumnid = columnid;
 sortTable(sortcolumnid, 1);
}


var sortTableSortArray = {};
function sortTable(columnid, changedirection) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("esptable");
  if (typeof sortTableSortArray[columnid] == 'undefined') sortTableSortArray[columnid] = "a-z";
  else if (changedirection)
  {
   if (sortTableSortArray[columnid] == "a-z") sortTableSortArray[columnid] = "z-a";
   else sortTableSortArray[columnid] = "a-z";
  }
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 2); i = i + 2) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[columnid].innerText;
      y = rows[i + 2].getElementsByTagName("TD")[columnid].innerText;
      if ((!isNaN(x) && !isNaN(y)) || ((x == '') && (y == '')) || (!isNaN(x) && (y == '')) || ((x == '') && !isNaN(y)))
      {
        x = parseInt(x);
        y = parseInt(y);
        if (isNaN(x)) x = 0;
        if (isNaN(y)) y = 0;
      }
      
      //check if the two rows should switch place:
      if (sortTableSortArray[columnid] == "a-z")
      {
       if (x > y) {
         //if so, mark as a switch and break the loop:
         shouldSwitch = true;
         break;
       }
      }
      else
      {
       if (x < y) {
         //if so, mark as a switch and break the loop:
         shouldSwitch = true;
         break;
       }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 2], rows[i]);
      rows[i+1].parentNode.insertBefore(rows[i + 3], rows[i+1]);
      switching = true;
    }
  }
}