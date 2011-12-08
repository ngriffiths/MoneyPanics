var $j=jQuery.noConflict();
//$j(document).ready(function() {
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
drawMap();

/* CHARTS */
	/* GOVT DEBT CHART */
	//Get the deficit data
	var debtdata = [],
		country = [];
	$j.each(debt2011, function(ctry,val) {
		//console.log(ctry+": "+val);
		country.push(ctry);
		debtdata.push(val);
	});
	// Create the bar graph
	var debtChart = new Grafico.HorizontalBarGraph($('govtDebt'), debtdata,
		{
			labels:country,
			datalabels:{one:debtdata},
			height:450, //This needs to be explicity set
			background_color:"#666", //Set to background color of div container if setting opacity
			color:"#FCBBA1",
			hover_color:"#99000D",
			bargraph_lastcolor:"#99000D",
			vertical_label_unit:"%",
			show_ticks:false,
			grid:false
		});
	
	/* GOVT DEFICIT CHART */
	//Get the deficit data
	var defdata = [],
		country = [];
	$j.each(def2010, function(ctry,val) {
		country.push(ctry);
		defdata.push(val);
	});
	// Create the bar graph
	var defChart = new Grafico.HorizontalBarGraph($('govtDef'), defdata,
		{
			labels:country,
			datalabels:{one:defdata},
			height:450, //This needs to be explicity set
			background_color:"#666", //Set to background color of div container if setting opacity
			color:"#FCBBA1", //#4b80b6",
			hover_color:"#99000D",
			bargraph_lastcolor:"#99000D",
		    //bargraph_negativecolor:"red",
			vertical_label_unit:"%",
			show_ticks:false,
			grid:false
		});
	
	/* Unemployment CHART */
	//Get the deficit data
	var jobdata = [],
		jcountry = [];
	$j.each(unemployment, function(ctry,val) {
		country.push(ctry);
		jobdata.push(val);
	});
	// Create the bar graph
	var jobChart = new Grafico.HorizontalBarGraph($('unemployment'), jobdata,
		{
			labels:country,
			datalabels:{one:jobdata},
			height:450, //This needs to be explicity set
			background_color:"#666", //Set to background color of div container
			color:"#FCBBA1",
			hover_color:"#99000D",
			vertical_label_unit:"%",
			bargraph_lastcolor:"#99000D",
			show_ticks:false,
			grid:false
		});
		
	// Sliding Drawer Effect
	// http://www.sohtanaka.com/web-design/simple-accordion-w-css-and-jquery/
	$j(".drawer_container").hide(); //Close all containers
	$j(".drawer_header:last").addClass("active").nextAll(".drawer_container:first").show(); //Display the last container
	$j(".drawer_header").click(function() {
		if( $j(this).is(".active") ) {
			jQuery.noop();
			//$j(this).removeClass("active").nextAll(".drawer_container:first").slideUp(550);
		} else {
			$j(".active").removeClass("active");
			$j(".drawer_container").slideUp(550);
			$j(this).addClass("active").nextAll(".drawer_container:first").slideDown(550);
			$j(".Reds").fadeOut(800).hide(600, function() {
				$j(this).remove();	
				drawMap();
				$j(".Reds").show(900);
			});
		}
		return false; //Prevent browser from jumping to link anchor
	});	
//});