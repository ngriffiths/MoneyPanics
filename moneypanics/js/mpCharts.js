window.onload = function() {
	/* GOVT DEBT CHART */
	//Get the deficit data
	var data = [],
		country = [];
	$.each(debt2011, function(ctry,val) {
		//console.log(ctry+": "+val);
		country.push(ctry);
		data.push(val);
		//console.log(data+country);
	});
	// Draw the Chart
	var r = Raphael("govtDebt",450,455),
		fin = function () {
	    	this.flag = r.g.popup(this.bar.x, this.bar.y, this.bar.value+"%" || "0").insertBefore(this);
	  	},
	  	fout = function () {
        	this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    	},
    	txtattr = {font: "18px 'Fontin Sans', Fontin-Sans, sans-serif, bold"};

	//r.g.text(250,15,"Total Government Debt as % of GDP (Q2, 2011)").attr(txtattr);
	var debtChart = r.g.hbarchart(130,15,400,455,[data]).hover(fin,fout); //hbarchart(x,y,width,height)
	//debtChart.label([country]);
	
	/* UNEMPLOYEMENT CHART */
	//Get the unemployment data
	var jdata = [],
		jcountry = [];
	$.each(unemployment, function(ctry,val) {
		//console.log(ctry+": "+val);
		jcountry.push(ctry);
		jdata.push(val);
		//console.log(data+country);
	});
	// Draw the Chart
	var jr = Raphael("unemployment",450,455),
		jfin = function () {
	    	this.flag = r.g.popup(this.bar.x, this.bar.y, this.bar.value+"%" || "0").insertBefore(this);
	  	},
	  	jfout = function () {
        	this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    	},
    	txtattr = {font: "18px 'Fontin Sans', Fontin-Sans, sans-serif, bold"};

	var jobChart = jr.g.hbarchart(130,15,400,455,[jdata]).hover(jfin,jfout); //hbarchart(x,y,width,height)
	//jobChart.label([jcountry]);
};