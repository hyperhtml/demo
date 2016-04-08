var App = React.createClass({
	render: function(){
		return (
			<div className="container">
				<Header />
				<KPI data={clv.data.comparison} />
				<Segments segments={clv.data.by_feature} />
			</div>
		);
	}
});

var Header = React.createClass({
	render: function(){
		return (
			<div className="row">
				<h1>Metrics</h1>
			</div>
		)
	}
});

var KPI = React.createClass({
	render: function(){
		return (
			<div className="row">
				<ChartKPI data={this.props.data["Total CE"]} label="Total Customer Equity ($)" unit="$" />
				<ChartKPI data={this.props.data["Number of Customers"]} label="Number of Customers" unit=""/>
				<ChartKPI data={this.props.data["Average CLV"]} label="Average CLV ($)" unit = "$"/>
			</div>
		);
	}
});

var ChartKPI = React.createClass({
	// React Init Method
	componentDidMount: function(){
		// Get the svg canvas that was added
		var container = ReactDOM.findDOMNode(this);

		// Format the data 
		var dataSet = clv.kpiDataFormat(this.props.data);

		// Add Chart to the page
		$(container).highcharts(clv.kpiCharts(this.props, dataSet));
	},
	render: function(){
		return (
			<div className="col-md-4 kpi"></div>
		);
	}	
});

var Segments = React.createClass({
	render: function(){
		var segments;
		var self = this;

		// Render All Segments
		segments = Object.keys(this.props.segments).map(function(segment, index){
			return (
				<Segment segment={self.props.segments[segment]} label={segment} />
			)
		});

		return (
			<div className="row">
				{segments}
			</div>
		);
	}

});

var Segment = React.createClass({
	render: function(){
		var kpis;
		var self = this;

		// Save common references
		var sRef = self.props.segment;
		var summaryData = sRef.summary_data;
		var histogramData = sRef.histogram_data;
		var totalCustomerValue = sRef.longitudinal_data;
		var equityAllocation = sRef.equity_allocation_data;

		kpis = Object.keys(summaryData).map(function(kpi, index){
			return (
				<SegmentKPI kpi={summaryData[kpi]} label={kpi} />
			)
		});

		return (
			<div className="segment col-md-12">
				<div className="row">
					<h3>Customer Segment: {this.props.label}</h3>
				</div>
				<div className="row">
					{kpis}
				</div>
				<div className="row">
					<TotalCustomerValue data={totalCustomerValue.values} label={totalCustomerValue.labels} />
				</div>
				<div className="row">
					<Equity data={equityAllocation.values} label={equityAllocation.labels} />
				</div>
				<div className="row">
					<Histogram endpoints={histogramData.bin_endpoints} counts={histogramData.counts} />
				</div>
			</div>
		)
	}
});

var SegmentKPI = React.createClass({
	render: function(){
		var friendlyLabel = clv.formatKPI(this.props.label).label;
		var friendlyNumber = clv.formatKPI(this.props.label, this.props.kpi).kpi;
		return (
			<div className="col-md-4 segKpi">
				<span className="text">{friendlyLabel}</span>
				<span className="num">{friendlyNumber}</span>
			</div>
		)
	}
});

// TODO: Merge Chart views, common logic, take chartType as argument
var TotalCustomerValue = React.createClass({
	// React Init Method
	componentDidMount: function(){
		// Get the container the chart will render in
		var container = ReactDOM.findDOMNode(this);

		// Add Chart to the page
		$(container).highcharts(clv.lineChart(this.props));
	},
	render: function(){
		return (
			<div className="chart col-md-12"></div>
		);
	}	
});

var Equity = React.createClass({
	// React Init Method
	componentDidMount: function(){
		// Get the container the chart will render in
		var container = ReactDOM.findDOMNode(this);

		// Add Chart to the page
		$(container).highcharts(clv.splineChart(this.props));
	},
	render: function(){
		return (
			<div className="chart col-md-12"></div>
		);
	}	
});

var Histogram = React.createClass({
	// React Init Method
	componentDidMount: function(){
		// Get the container the chart will render in
		var container = ReactDOM.findDOMNode(this);

		// Add Chart to the page
		$(container).highcharts(clv.histogramChart(this.props));
	},
	render: function(){
		return (
			<div className="col-md-12"></div>
		);
	}	
});

// Insert React app into Dom
ReactDOM.render(
	<App />,
	document.getElementById('react')
);