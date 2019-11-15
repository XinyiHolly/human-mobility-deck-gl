<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Location Prediction</title>
<meta name="viewport" content="initial-scale=1.0">
<meta charset="utf-8">
<style>
/* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
#map {
	height: 100%;
}
/* Optional: Makes the sample page fill the window. */
html, body {
	height: 100%;
	margin: 0;
	padding: 0;
}
</style>

<!-- <script src="https://unpkg.com/deck.gl@^7.0.0/dist.min.js"></script>
<script src="https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.js"></script> -->
<script src="https://unpkg.com/deck.gl@^7.0.0/dist.min.js"></script>
<script type="text/javascript"
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCmgCHDMKEjxjr46rAwVpavJ6bQJAQ6VZU&v=3.exp&libraries=visualization&libraries=geometry&sensor=false&libraries=drawing"></script>

</head>
<body>
	<div id="select">
		<table>
			<tr>
				<td><select id="userno" name="userid" style="width: 70px;">
						<!-- <option value="volvo">Volvo</option>
        				<option value="saab">Saab</option>
        				<option value="fiat">Fiat</option>
        				<option value="audi">Audi</option> -->
				</select></td>
				<td><select id="nexttimeselect" name="nexttimeselect"
					onchange="ajaxGet4()">
						<option value="5" selected="selected">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="25">25</option>
						<option value="30">10</option>
						<option value="35">15</option>
						<option value="40">20</option>
				</select></td>
				<td><select id="clusterselect" name="clusterselect"
					onchange="ajaxGet2()">
						<option value="MDBSCAN" selected="selected">MDBSCANCluster</option>
						<option value="DBSCAN_20_4">DBSCANCluster_20_4</option>
						<option value="DBSCAN_30_4">DBSCANCluster_30_4</option>
						<option value="DBSCAN_40_4">DBSCANCluster_40_4</option>
						<option value="DBSCAN_50_4">DBSCANCluster_50_4</option>
						<option value="DBSCAN_60_4">DBSCANCluster_60_4</option>
						<option value="DBSCAN_80_4">DBSCANCluster_80_4</option>
						<option value="DBSCAN_100_4">DBSCANCluster_100_4</option>
						<option value="DBSCAN_120_4">DBSCANCluster_120_4</option>
						<option value="DBSCAN_160_4">DBSCANCluster_160_4</option>
						<option value="DBSCAN_200_4">DBSCANCluster_200_4</option>
						<option value="DBSCAN_300_4">DBSCANCluster_300_4</option>
						<option value="DBSCAN_400_4">DBSCANCluster_400_4</option>
						<option value="DBSCAN_500_4">DBSCANCluster_500_4</option>
						<option value="DBSCAN_600_4">DBSCANCluster_600_4</option>
						<option value="DBSCAN_700_4">DBSCANCluster_700_4</option>
						<option value="DBSCAN_800_4">DBSCANCluster_800_4</option>
						<option value="DBSCAN_900_4">DBSCANCluster_900_4</option>
						<option value="DBSCAN_1000_4">DBSCANCluster_1000_4</option>
						<option value="STDBSCAN">STDBSCANCluster</option>
						<option value="VDBSCAN">VDBSCANCluster</option>
						<option value="RawData">RawData</option>
				</select></td>
				
				<td><select id="labelselect" name="labelselect" onchange="ajaxGetLabelMode()">
						<option value="MDBSCAN" selected="selected">MDBSCANCluster</option>
						<option value="Activity">ActivityCluster</option>
				</select></td>

				<td>
					<button id="getAccuracy" onclick="getAccuracy()">getAccuracy</button>
					<input type="text" id="accuracy" disabled>
				</td>
			</tr>
		</table>
	</div>

	<div id="map"></div>
	<script src="js/maplabel-compiled.js"></script>
	<script src="js/loadpage.js"></script>

</body>

</html>