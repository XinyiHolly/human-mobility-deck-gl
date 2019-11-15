/**
 * @author Xinyi Liu @ UW-Madison
 * AJAX request/response
 */

var map;
var infowindow = null;
var drawingManager;
var selectedShape;
var markerList = [];
var pointList = [];
var convexhullboundary=[];
var concaveboundary=[];
var trajectoryid;
var clusterMethod;
var nexttime;

function initMap() {
	
	var myLatlng = new google.maps.LatLng(43.0731, -89.4012);
	var mapOptions = {
		zoom : 16,
		center : myLatlng,
		mapTypeId : 'terrain' //hybrid
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
//
//	var input = document.getElementById('select');
//
//	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//	drawingManager = new google.maps.drawing.DrawingManager({
//		drawingMode : google.maps.drawing.OverlayType.HAND,
//		drawingControl : true,
//		drawingControlOptions : {
//			position : google.maps.ControlPosition.TOP_RIGHT,
//			drawingModes : [ 'marker', 'circle', 'polygon', 'rectangle' ]
//		},
//		/*markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},*/
//		circleOptions : {
//			fillColor : '#ffff00',
//			fillOpacity : 1,
//			strokeWeight : 5,
//			clickable : false,
//			editable : true,
//			zIndex : 1
//		}
//	});
//	drawingManager.setMap(map);

//	new deck.DeckGL({
//	  mapboxApiAccessToken: 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA',
//	  mapStyle: 'mapbox://styles/mapbox/light-v9',
//	  longitude: -74,
//	  latitude: 40.76,
//	  zoom: 11,
//	  maxZoom: 16,
//	  layers: [
//	    new deck.ScatterplotLayer({
//	      id: 'scatter-plot',
//	      data: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scatterplot/manhattan.json',
//	      radiusScale: 10,
//	      radiusMinPixels: 0.5,
//	      getPosition: d => [d[0], d[1], 0],
//	      getColor: d => (d[2] === 1 ? MALE_COLOR : FEMALE_COLOR)
//	    })
//	  ]
//	});
	
	ajaxGetAllPointsAndArcs();

//	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(
//			event) {
//		if (event.type != google.maps.drawing.OverlayType.MARKER) {
//			// Switch back to non-drawing mode after drawing a shape.
//			drawingManager.setDrawingMode(null);
//
//			// Add an event listener that selects the newly-drawn shape when the user
//			// mouses down on it.
//			var newShape = event.overlay;
//			newShape.type = event.type;
//			google.maps.event.addListener(newShape, 'click', function() {
//				setSelection(newShape);
//			});
//			setSelection(newShape);
//			google.maps.event.addListener(newShape, 'rightclick', function() {
//				setClusterCode(newShape);
//			});
//		}
//	});
//
//	google.maps.event.addListener(drawingManager, 'drawingmode_changed',
//			clearSelection);
//	google.maps.event.addListener(map, 'click', clearSelection);
//	google.maps.event.addListener(map, 'rightclick', deleteSelectedShape);

	/*ajaxGet1();*/
}

initMap();

function ajaxGetAllPointsAndArcs() {
	console.log("ajaxGetAllPointsAndArcs run");
//	var action = "GetAllPoints";
	var action = "5";

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			var geojson = JSON.parse(data);
			addAllPoints(geojson.points);
			addAllTransits(geojson.transits);
		}
	};

	var params = "action=" + action;

	xhr.open('GET', "DBServlet?" + params, true);
	xhr.send(null);
}

function addAllPoints(allPoints) {
	
	const HOME_COLOR = [0, 128, 255];
	const OTHER_COLOR = [255, 0, 128];
	
//	var geojson = JSON.parse(allPoints);
	var features = allPoints.features;
//	console.log(features);
//	console.log(features[0]["properties"]["lon"]);
	const overlay = new GoogleMapsOverlay({
		layers: [
		    new deck.ScatterplotLayer({
		        id: 'scatter-plot',
		        data: features,
		        radiusScale: 10,
		        radiusMinPixels: 0.5,
		        getPosition: d => [d.properties.lon, d.properties.lat, 0],
		        getFillColor: d => (d.properties.zonetype === "Dwelling" ? HOME_COLOR : OTHER_COLOR)
		    })
		]
	});

	overlay.setMap(map);
}

function addAllTransits(allTransits) {
	
	const HOME_COLOR = [0, 128, 255];
	const OTHER_COLOR = [255, 0, 128];
	
	console.log(allTransits);
	
//	const deckOverlay = new deck.GoogleMapsOverlay({
//	  layers: [
//	    new deck.ArcLayer({
//	      id: 'arcs',
//	      data: allTransits,
//	      dataTransform: d => d.features.filter(f => f.userno > -1),
//	      getSourcePosition: f => [f.originlon, f.originlat],
//	      getTargetPosition: f => [f.destlon, f.destlat],
//	      getSourceColor: f => (f.zonetype === "Dwelling" ? HOME_COLOR : OTHER_COLOR),
//	      getTargetColor: f => (f.zonetype === "Dwelling" ? HOME_COLOR : OTHER_COLOR),
//	      getWidth: 1
//	    })
//	  ]
//	});
	
	const deckOverlay = new deck.GoogleMapsOverlay({
	  layers: [
	    new deck.ArcLayer({
	      id: 'arcs',
	      data: allTransits,
	      getSourcePosition: d => [d.originlon, d.originlat],
	      getTargetPosition: d => [d.destlon, d.destlat],
	      getSourceColor: d => (d.zonetype === "Dwelling" ? HOME_COLOR : OTHER_COLOR),
	      getTargetColor: d => (d.zonetype === "Dwelling" ? HOME_COLOR : OTHER_COLOR),
	      getWidth: 1
	    })
	  ]
	});

	deckOverlay.setMap(map);
}

//Add heatmap to the map
function addHeatMap(jsonString) {
	// TBD........

}

function interpolateHsl(lowHsl, highHsl, fraction) {
	var color = [];
	for (var i = 0; i < 3; i++) {
		// Calculate color based on the fraction.
		color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
	}

	return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

//Add choices to the list
function addListChoices(jsonString) {

	var geojson = JSON.parse(jsonString);
	var userno = document.getElementById("userno");
	for (var i = 0; i < geojson.features.length; i++) {
		var option = document.createElement("option");
		var feature = geojson.features[i];
		option.text = feature.properties.user_no;
		option.value = feature.properties.user_no;
		userno.add(option);
	}

	userno.addEventListener("click", function(e) {
		if (e.target /*&& e.target.nodeName == "OPTION"*/) {
			console.log(e.target.value + " was clicked");
			trajectoryid = e.target.value;
			if (clusterMethod != null) {
				ajaxGet2();
			}
		}
	});

	userno.selectedIndex = 1; // select userno = 14
	
	trajectoryid = userno.value;

	ajaxGet2(); // retrieve data

	/*var clusterselect = document.getElementById("clusterselect");
	clusterselect.addEventListener("click", function(e) {
		console.log(e.target.nodeName)
		if(e.target && e.target.nodeName == "SELECT") {
			console.log(e.target.value + " was clicked");
			ajaxGet2();
		}
	});*/
	//userno.value=14;
}

//Add markers to the map
function addMarkers(jsonString) {

	clearMarkers();
	var geojson = JSON.parse(jsonString);

	map.data.addGeoJson(geojson);
	console.debug(map.data, "Logged!");
	var low = [ 151, 83, 34 ]; // color of mag 1.0
	var high = [ 5, 69, 54 ]; // color of mag 6.0 and above

	map.data.setStyle(function(feature) {
		//	alert("feature info :" + feature.getGeometry().get());	
		markerList.push(feature);
		var den = 10;
		var clusterid = feature.getProperty('clusterid');

		if (clusterid == null) {
			clusterid = 4;
		}
		var fraction = clusterid / den;
		if (feature.getProperty('dbscanc') == 1) {
			fraction = 2;
		}

		var color = interpolateHsl(low, high, fraction);
		
		var placetype = feature.getProperty('placetype')
		
		console.log (placetype);
		
		var scale = 4;
		if(placetype != 'NA'){
			console.log ('It is here');
			if(placetype = 'HOME'){
				color = '#f00';
			}else{
				color = '#0f0';
			}
			
			
			scale = 8;
		}
		//console.log(color);
		return {
			icon : {
				path : google.maps.SymbolPath.CIRCLE,
				strokeWeight : 0.5,
				strokeColor : '#fff',
				fillColor : color,
				fillOpacity : 1,
				// while an exponent would technically be correct, quadratic looks nicer
				scale : scale
			//Math.pow(feature.getProperty('waveclusterid'), 2)
			}
		};
	});

	map.data.addListener('click', function(event) {
		var eps, zonetype;
		if (clusterMethod == "RawData") {
			eps = " (raw data)";
		} else {
			var clusterid = event.feature.getProperty('clusterid');
			if (clusterid == 0) {
				zonetype = "(noise)";
			} else {
				zonetype = event.feature.getProperty('zonetype');
			}			
			eps = event.feature.getProperty('eps');
			var info = "<div class='infowindow' align='left'>"
				
				+ "<info_header>clusterid:</info_header>"
				+ event.feature.getProperty('clusterid') + "<br><br>"
			
				+ "<info_header>msg:</info_header>"
				+ event.feature.getProperty('content') + "<br><br>"
				
				+ "<info_header>time:</info_header>"
				+ event.feature.getProperty('create_at') + "<br><br>"
				
				+ "<info_header>nexttime:</info_header>"
				+ event.feature.getProperty('nexttime') + "<br><br>"
				
				+ "<info_header>placetype:</info_header>"
				+ event.feature.getProperty('placetype') + "<br><br>"
			
				+ "<info_header>zonetype:</info_header>"
				+ zonetype + "<br><br>"
				//+ "<info_header>eps:</info_header>" + eps + "<br><br>"
				/*+ "<info_header>vst_et:</info_header>" + event.feature.getProperty('vst_et') + "<br><br>"*/
				+ "</div>";
		}

		if (infowindow != null) {
			infowindow.close(map);
		}

		infowindow = new google.maps.InfoWindow({
			content : info,
			position : event.feature.getGeometry().get()
		});
		infowindow.open(map);

	});
}

function clearSelection() {
	if (selectedShape) {
		selectedShape.setEditable(false);
		selectedShape = null;
	}
}

function setSelection(shape) {
	clearSelection();
	selectedShape = shape;
	shape.setEditable(true);
}

function deleteSelectedShape() {
	if (selectedShape) {
		selectedShape.setMap(null);
	}
}

function setClusterCode(newShape) {
	if (clusterMethod != "RawData") {
		window.alert("setCluster only applied to RawData");
	} else {
		pointList = [];
		var selectedFeatures = [];
		for (var i = 0; i < markerList.length; i++) {
			var feature = markerList[i];
			var LatLng = feature.getGeometry().get();
			if (google.maps.geometry.poly.containsLocation(LatLng, newShape)) {
				pointList.push(feature.getProperty('tweet_no'));
				selectedFeatures.push(feature);
			}
		}

		var info = "<div class='selectwindow' id='selectwindow' align='left'>"
				+ "<input type='radio' name='type' id='cluster-0' value='0' checked='checked'>"
				+ "<label for='cluster-0'>noise</label>"

		for (var i = 1; i < 20; i++) {
			info += "<input type='radio' name='type' id='cluster-" + i
					+ "' value='" + i + "'>" + "<label for='cluster-" + i
					+ "'>cluster" + i + "</label>";
		}
		info += "<button type='submit' id='selectButton' onclick='ajaxPost()'>Submit</button></div>";

		if (infowindow != null) {
			infowindow.close(map);
		}

		infowindow = new google.maps.InfoWindow({
			content : info,
			position : selectedFeatures[0].getGeometry().get()
		});
		infowindow.open(map);
	}
}



function addConvexHull(jsonString) {

	//clearBoundaryBox();
	var polygons = JSON.parse(jsonString);
	console.log(polygons);

	var index = 0;

	//Setup all the paths inside polygons
	polygons.forEach(function(rec) {
			
		var mpath = [];
		
		console.log(rec);
		var json = JSON.parse(rec.geom);
		var coordinates = json.coordinates;
		coordinates.forEach(function(latLng) {
				for (i = 0; i < latLng.length; i++) {
				var coordinate = latLng[i]

				mpath.push(new google.maps.LatLng(coordinate[1],
								coordinate[0]));
			}

		});
		//Each polygons item now is a set of similarly typed set of coordinates
		var fillcolor = 'red';
		var fillppacity = 0;
		var boundary = new google.maps.Polygon({
			path : mpath,
			geodesic : true,
			strokeColor : fillcolor,
			//strokeOpacity : 2,
			strokeWeight : 2,
			//fillColor: 'red',
			fillOpacity : fillppacity,
			map : map,
			strokeWeight : 2.2
		});
		
				
		convexhullboundary.push(boundary);

		index++;
		
		// Add concave bounding box
		
		var concave_path = [];
		var concave_json = JSON.parse(rec.concave_geom);
		var concave_coordinates = concave_json.coordinates;
		console.log(concave_coordinates);
		console.log(concave_coordinates.length);
		concave_coordinates.forEach(function(latLng) {
				for (i = 0; i < latLng.length; i++) {

				var coordinate = latLng[i]
			
				concave_path.push(new google.maps.LatLng(coordinate[1],
								coordinate[0]));
			}

		});
		
		var concave_boundary = new google.maps.Polygon({
			path : concave_path,
			geodesic : true,
			strokeColor : "blue",
			//strokeOpacity : 2,
			strokeWeight : 2,
			//fillColor: 'red',
			fillOpacity : fillppacity,
			map : map,
			strokeWeight : 2.2
		});
		
		
		concaveboundary.push(concave_boundary);
		
		
		var mean_lat = rec.mean_lat;
		var mean_lon = rec.mean_lon;
			
		var median_lat = rec.median_lat;
		var median_lon = rec.median_lon;
		
		var cid = rec.cid;
		var centroid = new google.maps.LatLng(mean_lat, mean_lon);
		
		var centroid_color = '#FF0000';
		var centroid_circle = new google.maps.Circle({
            strokeColor: centroid_color,
            strokeOpacity: 0.1,
            strokeWeight: 0.5,
            fillColor: centroid_color,
            fillOpacity: 0.35,
            map: map,
            center: centroid,
            radius: 0.5
          });

		var median = new google.maps.LatLng(median_lat, median_lon);
	
		var median_color = '#0000FF';
		var median_circle = new google.maps.Circle({
            strokeColor: median_color, // 
            strokeOpacity: 0.1,
            strokeWeight: 0.5,
            fillColor: median_color,
            fillOpacity: 0.35,
            map: map,
            center: median,
            radius: 0.5
          });		
		
	
		
		 /*var mapLabel = new MapLabel({
		    text: 'Centroid' + cid ,
		    position: centroid,
		    map: map,
		    fontSize: 30,
		    align: 'right'
		  });
		
		*/
		//console.log(mpath);

	});

	

}
function ajaxGet1() {

	console.log("ajaxGet1 run");
	var action = "1";

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			addListChoices(data);
		}
	};

	var params = "action=" + action;

	xhr.open('GET', "DBServlet?" + params, true);
	xhr.send(null);
}

/**display data*/

function ajaxGet2() {

	console.log("ajaxGet2 run");
	clusterMethod = document.getElementById("clusterselect").value;
	
	nexttime = document.getElementById("nexttimeselect").value;
	
	var action = "2";

	console.log(clusterMethod);

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			// alert(data);
			addMarkers(data);
		}
	};

	var params = "clusterMethod=" + clusterMethod + "&action=" + action
			+ "&user_no=" + trajectoryid
			+ "&nexttime=" + nexttime
			;
	xhr.open('GET', "DBServlet?" + params, true);
	xhr.send(null);

	/**add convexhull*/
	//ajaxGetConvexHull();

}

function ajaxGet4() {

	console.log("ajaxGet2 run");
	clusterMethod = document.getElementById("clusterselect").value;
	
	nexttime = document.getElementById("nexttimeselect").value;
	
	var action = "4";

	console.log(clusterMethod);

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			// alert(data);
			addMarkers(data);
		}
	};

	var params = "clusterMethod=" + clusterMethod + "&action=" + action
			+ "&user_no=" + trajectoryid
			+ "&nexttime=" + nexttime
			;
	xhr.open('GET', "DBServlet?" + params, true);
	xhr.send(null);

	/**add convexhull*/
	//ajaxGetConvexHull();

}

/**
 * Add associated convex hull for clusters
 * @returns
 */

function ajaxGetConvexHull() {

	clearBoundaryBox();
	
	//alert("ajaxGetConvexHull run");
	clusterMethod = document.getElementById("clusterselect").value;
	nexttime = document.getElementById("nexttimeselect").value;
	var action = "3";

	console.log(clusterMethod);
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			// alert(data);
			addConvexHull(data);
		}
	};

	var params = "clusterMethod=" + clusterMethod + "&nexttime=" + nexttime + "&action=" + action
			+ "&user_no=" + trajectoryid;
	xhr.open('GET', "DBServlet?" + params, true);
	xhr.send(null);

}
function ajaxPost() {

	console.log("ajaxPost run");
	var clusterId;
	var action = "1";
	for (var i = 0; i < 20; i++) {
		var id = "cluster-" + i;
		if (document.getElementById(id).checked) {
			clusterId = document.getElementById(id).value;
		}
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			window.alert("update success");
			if (infowindow != null) {
				infowindow.close(map);
			}
			clearMarkers();
			ajaxGet2();
			deleteSelectedShape();
		}
	};

	var params = "clusterId=" + clusterId + "&action=" + action + "&points="
			+ pointList + "&user_no=" + trajectoryid;

	xhr.open('POST', "DBServlet?" + params, true);
	xhr.send(null);
}

function getAccuracy() {

	nexttime = document.getElementById("nexttimeselect").value;
	
	if (clusterMethod == "RawData") {
		window.alert("getAccuracy only applied to non-RawData");
	} else {
		console.log("getAccuracy run");
		var action = "2";

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var data = xhr.responseText;
				var json = JSON.parse(data);
				document.getElementById('accuracy').value = parseFloat(
						json.accuracy).toFixed(4);
				console.log("getAccuracy success");
			}
		};

		var params = "clusterMethod=" + clusterMethod + "&action=" + action
				+ "&user_no=" + trajectoryid + "&nexttime=" + nexttime;

		xhr.open('POST', "DBServlet?" + params, true);
		xhr.send(null);
	}
}

function clearBoundaryBox(){
	for (var i = 0; i < convexhullboundary.length; i++) {
		convexhullboundary[i].setMap(null); 
		
		concaveboundary[i].setMap(null);
	}
	convexhullboundary=[];
	
	concaveboundary = [];
}
function clearMarkers() {
	for (var i = 0; i < markerList.length; i++) {
		map.data.remove(markerList[i]);
	}
	markerList.length = 0;
}

