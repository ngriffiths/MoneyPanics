// Calculate noniles for CSS 
var quantile = pv.Scale.quantile()
	.quantiles(7)
	.domain(pv.values(def2010))
	.range(6,0);

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

function load_countries(e) {
	//var eng_link = "http://en.rsf.org/";
	var count = e.features.length;
	if (!count) {return;}	
	for (var i = 0; i < count; i++) {
		var feature = e.features[i];
		// get the country name & data
		var country = feature.data.properties.NAME,
			deficit = def2010[country];
		
		//console.log(country+": "+debt);
		//var deficit = countryData[1];
		//var rank = JSON.stringify(countryData[1])+'.'+country;
		//var score = score2010[country];
		//console.log(rank);
		
		
    	// Assign mouse properties to the element
    	$(feature.element).attr("title", country);
    	$(feature.element).attr("id", deficit);	
		
		$(feature.element).hover(function() {
			var country = $(this).attr('title');
			var deficit = $(this).attr('id');
			// create rsf-friendly link name from the country name
			//var linkname = country.toLowerCase().replace(/\s/g, "-");
			//var url = eng_link+linkname+".html"
			
			// Remove the title element so the firefox tooltip doesnt appear
			//$(this).removeAttr("title");
			
			// bring up the tooltip
			showTooltip(country,deficit);
			// Open the country page at RSF on click
			if (deficit != undefined) {
			$(this).dblclick(function() {
				window.open(url);
				// Prevent multiple windows from opening on occasion
				$(this).preventDefault();
			});
			} else {
				//dev/null
				jQuery.noop();
			}
		}, function() {
			// INSERT CODE TO REASSIGN COUNTRY NAME TO TITLE ELEMENT
			//console.log(country);
			hideTooltip();
		}).mousemove(tooltipFollow);
    	
    	
		// Assign colorbrewer code
		if (deficit == undefined) {
			$(feature.element).attr("class", "no-quantile");
		} else {
			$(feature.element).attr("class", "q" + quantile(deficit) + "-" + 7);
		}
   	}
}

// Tooltip content & display
function showTooltip(c,deficit) {
	var debt = debt2011[c],
		bonds = bondYields[c],
		jobs = unemployment[c],
		jobs1524 = unemployment1524[c];
	if (deficit == undefined) {
		$("#tooltip").html("<h3>"+ c +"</h3><p>Non-Member Country</p>");
	} else {
		$("#tooltip").html("<h3>"+ c +"</h3><p><b>Unemployment: </b>"+jobs+"%<br /><b>Youth Unemployment(15-24): </b>"+jobs1524+"%<br /><b>Government Deficit(% of GDP): </b>"+deficit+"%</p>");
		//$("#tooltip").html("<h3>"+ c +"</h3><p><b>Rank:</b> "+ r +" of 178<br />Double-click for more info.<p>");
	}
	$("#tooltip").stop().show();
}

// Makes the tooltip follow the cursor
function tooltipFollow(e) {
	$("#tooltip").css({
    	top: (e.pageY) + "px",
    	left: (e.pageX + 15) + "px",
    });
}

// Hide the tooltip
function hideTooltip() {
	$("#tooltip").stop().hide();
}

// Create the polymaps instance & the map surface	
var po = org.polymaps;
var map = po.map()
// add an svg element to the 'map' div, with settings 
	.container(document.getElementById("map").appendChild(po.svg("svg")))
	// set initial map positioning & zoom
	.center({lat:52,lon:-4})
	.zoom(4.25)
	.zoomRange([3.75,4.25])
	// include the interative features (key ctrl, mouse wheel, etc)
    //.add(po.wheel())
    .add(po.drag())
    .add(po.arrow());
    		
// draw the map from json data
map.add(po.geoJson()
    .url("http://127.0.0.1/Projects/MoneyPanics/moneypanics/data/EuroBorders.geojson")
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
map.container().setAttribute("class", "Oranges");

// Show/hide the title on click
$("#title").click(function() {
	$("#title").slideUp();
	$("#titleSmall").fadeIn(800);
});
$("#titleSmall").click(function() {
	$("#titleSmall").slideUp();
	$("#title").fadeIn(800);
});