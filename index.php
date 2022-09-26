<!DOCTYPE html>
<html>

<head>


<meta charset="UTF-8">
<meta name="viewport" content="width=800">
<meta name="mobile-web-app-capable" content="yes">
<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />

<script src="jquery-3.3.1.js"></script>
<script src="mqttws31.js"></script>
<script src="sorttable.js"></script>
<script src="mqttuserpass.js"></script>
<script src="esp.js?filemtime=<?php echo filemtime('esp.js'); ?>"></script>


<style>
@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
    color: white;
  }
}

html {
  overflow-y: scroll;
}

#esptable {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  margin-left:auto; 
  margin-right:auto;
  cursor: pointer;
  table-layout: fixed;
}


#esptable td, 
#esptable th 
{
  border: 1px solid #ddd;
  padding: 2px;
}

#esptable td:nth-of-type(2)
{
  text-align: center;
}

#esptable td:nth-of-type(3),
#esptable td:nth-of-type(4),
#esptable td:nth-of-type(5),
#esptable td:nth-of-type(6),
#esptable td:nth-of-type(7)
{
  text-align: right;
}


#esptable tr:hover {background-color: #ddd;}

#esptable th {
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 5px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
  text-align: center;
}

        html {
            overflow-x: auto;
  min-width: 950px;
        }
        

.espdetailtable {
  margin-left:40px; 
  margin-right:auto;
  border-collapse: collapse;
  border: 0 !important;
}
.espdetailtable tr
{
  background: rgba(0,0,0,0) !important;
}


.espdetailtable td
{
  border: 0 !important;
  text-align: left !important;
}

td.details-control {
    background: url('details_open.png') no-repeat center center;
    cursor: pointer;
}

tr.details td.details-control {
    background: url('details_close.png') no-repeat center center;
}



</style>


<title>Esp Status</title>
</head>

<body>

<table id="esptable" style="width:830px">
        <thead>
            <tr>
                <th width=400px onclick="theadclick(0);">MainTopic</th>
                <th width=100px onclick="theadclick(1);">Status</th>
                <th width=100px onclick="theadclick(2);">Uptime</th>
                <th width=80px  onclick="theadclick(3);">Freeram</th>
                <th width=80px onclick="theadclick(4);">Version</th>
                <th width=70px  onclick="theadclick(5);">Channel</th>
                <th width=50px  onclick="theadclick(6);">RSSI</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    
</body>
</html>
