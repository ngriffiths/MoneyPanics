var $j=jQuery.noConflict();
$j(document).ready(function() {
/*
function clearTitle() {
	// Save element for later reference
	var elem = $(this);
	console.log($(this));
	// Save title
	var savetitle = elem.attr("title");
	// Clear title on mouse over
	elem.hover(function() {
		elem.revoeAttr("title");
	}, function() {
	// Restore title on mouse out
		elem.attr({title:savetitle});
	});
}
*/
function load_countries(e) {
	var display = $j(".active").text();	
	if (display == "Government Debt (% of GDP)") {
			var data = debt2011;
		} else if (display == "Unemployment (%)") {
			var data = unemployment;
		} else {
			var data = def2010,
				invRange = true;
		}
		
	var count = e.features.length;
	if (!count) {return;}	
	for (var i = 0; i < count; i++) {
		var feature = e.features[i];
		// get the country name & data
		var country = feature.data.properties.NAME;
			cdata = data[country];
		
	// Calculate CSS color gradients 
	var quantile = pv.Scale.quantile()
		.quantiles(7)
		.domain(pv.values(data));
	
	if (invRange === true) {
		quantile.range(6,0);
	} else {
		quantile.range(0,6);
	}
		
   	// Assign mouse properties to the element
   	$j(feature.element).attr("title", country);
   	$j(feature.element).attr("id", cdata);	
		
	$j(feature.element).hover(function() {
		var country = $j(this).attr('title');
		var cdata = $j(this).attr('id');
			
		// Remove the title element so the firefox tooltip doesnt appear
		//$(this).removeAttr("title");
			
		// bring up the tooltip
			showTooltip(country,cdata);
		}, function() {
			// INSERT CODE TO REASSIGN COUNTRY NAME TO TITLE ELEMENT
			hideTooltip();
		}).mousemove(tooltipFollow);
    	
		// Assign colorbrewer code
		if (cdata == undefined) {
			$j(feature.element).attr("class", "no-quantile");
		} else {
			$j(feature.element).attr("class", "q" + quantile(cdata) + "-" + 7);
		}
   	}
}

// Tooltip content & display
function showTooltip(c,cdata) {
	var debt = debt2011[c],
		deficit = def2010[c],
		jobs = unemployment[c];
	if (debt == undefined) {
		$j("#tooltip").html("<h3>"+ c +"</h3><p>Non-Member Country</p>");
	} else {
	  $j("#tooltip").html("<h3>"+ c +"</h3><p><b>Unemployment: </b>"+jobs+"%<br /><b>Government Debt (% of GDP): </b>"+debt+"%<br /><b>Government Deficit (% of GDP): </b>"+deficit+"%</p>");
	}
	$j("#tooltip").stop().show();
}

// Makes the tooltip follow the cursor
function tooltipFollow(e) {
	$j("#tooltip").css({
    	top: (e.pageY) + "px",
    	left: (e.pageX + 15) + "px",
    });
}

// Hide the tooltip
function hideTooltip() {
	$j("#tooltip").stop().hide();
}

function drawMap() {
// Create the polymaps instance & the map surface	
var po = org.polymaps;
var map = po.map()
// add an svg element to the 'map' div, with settings 
	.container(document.getElementById("map").appendChild(po.svg("svg")))
	// set initial map positioning & zoom
	.center({lat:50,lon:-5})
	.zoom(4.5)
	.zoomRange([4,5.5])
	// include the interative features (key ctrl, mouse wheel, etc)
    //.add(po.wheel())
    .add(po.drag())
    .add(po.arrow());
    		
// draw the map from json data
map.add(po.geoJson()
    .url("http://127.0.0.1/Projects/MoneyPanics/moneypanics/data/EuroRegion_sm1.geojson")
    // excute the 'load' function(below) once loaded
    .on("load", load_countries)
 	.id("worldmap")
);

// creates the "+/-" zoom butoms
map.add(po.compass()
	// don't include the pan control wheel
	.pan("none")
	.position("top-right")
);    	

// Assign CSS stylings to map (see colorbrewer2.org)
map.container().setAttribute("class", "Reds");
} // End drawMap

/* Charts Function */
function drawcharts(div,indicator) {
	var data = [];
		country = [];
	$j.each(indicator, function(ctry,val) {
		country.push(ctry);
		data.push(val);
	});
	//Create the bar chart
	var chart = new Grafico.HorizontalBarGraph($(div), data,
		{
			labels:country,
			datalabels:{one:data},
			height:450, //This needs to be explicity set
			background_color:"#666", //Set to background color of div container if setting opacity
			color:"#FCBBA1",
			hover_color:"#99000D",
			bargraph_lastcolor:"#99000D",
			vertical_label_unit:"%",
			show_ticks:false,
			grid:false
		});
} // END DRAWCHARTS FUNCTION

	/* ASSIGN COUNTRY INDICATORS TO HTML DIVS FOR CHARTS */
	var barcharts = {"unemployment":unemployment,"govtDef":def2010,"govtDebt":debt2011};

	/* DRAW MAP & CHARTS */
	drawMap();
	for (var key in barcharts) {
		drawcharts(key,barcharts[key]);
	}

	/* Sliding Drawer Effect */
	// http://www.sohtanaka.com/web-design/simple-accordion-w-css-and-jquery/
	$j(".drawer_container").hide(); //Close all containers
	$j(".drawer_header:last").addClass("active").nextAll(".drawer_container:first").show(); //Display the last container
	$j(".drawer_header").click(function() {
		if( $j(this).not(".active") ) {
			$j(".active").removeClass("active"); // Find the active header & remove the 'active' class`
			$j(".drawer_container").slideUp(550); // Close the 'active' drawer
			$j(this).addClass("active").nextAll(".drawer_container:first").slideDown(550);
			$j(".Reds").fadeOut(800).hide(600, function() {
				$j(this).remove();	
				drawMap();
				$j(".Reds").show(900);
			});
		}
		return false; //Prevent browser from jumping to link anchor
	});	
});