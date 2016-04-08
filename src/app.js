// TODO: Common chart factory for React chart component to pass arguments to render different cart types.

(function(window){
	// Setup a single namespace
	var clv = {};

	// Get Data via Ajax
	$.ajax({
	  url: "/data/data.json",
	  success: function(data){
	  	clv.data = data.data;
	  },
	  dataType: "json"
	});


	// Common function to determine a friendly label from associative array
	// Overloaded to format kpi for corresponding label
	clv.formatKPI = function(label, kpi){
		var friendlyLabel = label;
		if(!kpi){
			newKpi = 0;
		} else {
			newKpi = kpi.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		}

		switch(label) {
		    case "total_customer_equity":
		        friendlyLabel = "Total Customer Equity";
		        newKpi = "$" + newKpi;

		        break;
		    case "number_customers":
		        friendlyLabel = "Number of Customers";
		        break;
		    case "average_clv":
		    	friendlyLabel = "Average CLV";
		    	newKpi = "$" + newKpi;
		}

		return {
			label: friendlyLabel,
			kpi: newKpi
		}
	}

	// Data Formatting for KPICharts
	clv.kpiDataFormat = function(kpiData){
		var dataSet = [];
		for (var i in kpiData){
			// Get Key
			var key = Object.keys(kpiData[i])[0];

			var dataArray = [];

			// Format data for chart
			dataArray.push(key);
			dataArray.push(kpiData[i][key]);

			dataSet.push(dataArray);
		}
		return dataSet;
	}




	// Common Chart Settings 
	clv.kpiCharts = function(data, dataSet){
		var format = (data.unit == "") ? '<b>{point.y:,.0f}</b>' : '<b>' + data.unit + '{point.y:,.2f}</b>';
		return {
		    chart: {
		        type: 'bar',
		        height: 200
		    },
		    title: {
		        text: data.label
		    },
		    xAxis: {
		        type: 'category'
		    },
		    yAxis: {
		        min: 0,
		        title: {
		        	text: null
		        }
		    },
		    legend: {
		        enabled: false
		    },
		    tooltip: {
		        pointFormat: format
		    },
		    series: [{
		        name: data.label,
		        data: dataSet,
		        dataLabels: {
		            enabled: false
		        }
		    }],
		    credits: {
				enabled: false
			}
		}
	};

	clv.histogramChart = function(data){
		return {
		    chart: {
		        type: 'column',
		        height: 200
		    },
		    title: {
		        text: 'Histogram of Customer Value'
		    },
		    xAxis: {
		        categories: data.endpoints
		    },
		    yAxis: {
		        min: 0,
		        title: {
		        	text: "Number of Customers"
		        }
		    },
		    legend: {
		        enabled: false
		    },
		    series: [{
		        data: data.counts,
		        dataLabels: {
		            enabled: false
		        }
		    }],
		    tooltip: {
	            formatter: function () {
	                return '<b>' + this.y +
	                    ' Customers</b> worth <b>$' + this.x + '</b>';
	            }
	        },
		    credits: {
				enabled: false
			}
		}
	}

	clv.lineChart = function(data){
		// Setup the Data in form the chart expects
		// [X, Y]
		var dataPoints = data.data;
		var newPoints = [];

		dataPoints.map(function(point, index){
			var set = [];
			set.push(Date.parse(point.x));
			set.push(point.y);
			newPoints.push(set);
		});

		return {
		    chart: {
		        type: 'spline',
		        height: 200
		    },
		    title: {
		        text: "Total Customer Value"
		    },
		    xAxis: {
	            type: 'datetime',
	            dateTimeLabelFormats: {
	            	day: '%b %y'
	            },
	            title: {
	                text: data.label.x
	            }
	        },
		    yAxis: {
			    title: {
	                text: data.label.y + " ($)"
	            }
		    },
		    legend: {
		        enabled: false
		    },
		    tooltip: {
		        pointFormat: '${point.y:,.2f}'
		    },
		    series: [{
		        data: newPoints
		    }],
		    plotOptions: {
	            spline: {
	                marker: {
	                    enabled: true
	                }
	            }
	        },
		    credits: {
				enabled: false
			}
		}
	}

	clv.splineChart = function(data){
		// Setup the Data in form the chart expects
		// [X, Y]
		var dataPoints = data.data;
		var newPoints = [];

		dataPoints.map(function(point, index){
			var set = [];
			set.push(point.x);
			set.push(point.y);
			newPoints.push(set);
		});

		return {
		    chart: {
		        type: 'spline',
		        height: 250
		    },
		    title: {
		        text: "Equity Allocation"
		    },
		    xAxis: {
	            title: {
	                text: data.label.x
	            },
	            startOnTick: true,
            	endOnTick: true,
            	min: 0
	        },
		    yAxis: {
			    title: {
	                text: data.label.y
	            },
	            min: 0
		    },
		    legend: {
		        enabled: false
		    },
		    tooltip: {
		        pointFormat: '{point.y:,.2f}'
		    },
		    series: [{
		        data: newPoints
		    }],
	        plotOptions: {
	            spline: {
	                marker: {
	                    enabled: false
	                }
	            }
            },
		    credits: {
				enabled: false
			}
		}
	}

window.clv = clv;
	
}(window))