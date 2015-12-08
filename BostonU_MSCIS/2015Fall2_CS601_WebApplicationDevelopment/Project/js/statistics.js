/* JS for statistics.html */

require(["esri/map", "dojo/domReady!"], function(Map) {

  // Load the map into the banner area
  var map = new Map("hongKongMap", {
    center: [114.18331146240234, 22.292289724571],
    zoom: 13,
    basemap: "streets"
  });

  // Variables for the charts used in this page
  var chartSize = {height: 180, width: 250};
  var hide = {show: false};
  var padding = {top: 0,right: 0,bottom: 0,left: 0};
  var color = {pattern: ["#1f77b4", "#064877", "#085E9A", "#65A4D1", "#3F8ABF"]};

  // Create and manipulate charts with the following code

  /***
   Male to female ratio chart
   ***/
  var maleToFemaleChartData = [
    ["Male", 46],
    ["Female", 54]
  ];

  c3.generate({
    bindto: "#maleToFemaleChart",
    data: {
      columns: maleToFemaleChartData,
      type : "donut"
    },
    donut: {
      label: {
        format: function(value, d, r){
          return r + " (" + d3.format(",")(value) + "%)";
        }
      }
    },
    color: color,
    size: chartSize,
    legend: hide,
    tooltip: hide,
    padding: padding
  });

  /***
   Age group chart
   ***/
  var ageGroupData = [
    ["<15", 804],
    ["15-34", 1932],
    ["35-64", 3439],
    [">=65", 1066]
  ];

  c3.generate({
    bindto: "#ageGroupChart",
    data: {
      columns: ageGroupData,
      type : "bar",
      labels: {
        format: function(value, d){
          return d + " (" + d3.format(",")(value) + ",000)";
        }
      }
    },
    axis: {
      x: {
        type : 'categorized',
        tick: {
          format: function () {return "";}
        }
      },
      y: {
        label: {
          text: "Population (x 1000)",
          position: "outer-middle"
        }
      }
    },
    color: color,
    size: chartSize,
    legend: hide,
    tooltip: hide
  });

  /***
   Ethnic group chart
   ***/
  var ethnicGroupData = [
    ["Indonesian", 30],
    ["Filipino", 29],
    ["White", 12],
    ["Indian", 6],
    ["Others", 6]
  ];

  c3.generate({
    bindto: "#ethnicGroupChart",
    data: {
      columns: ethnicGroupData,
      type : "pie"
    },
    pie: {
      label: {
        format: function(value, d, r){
          return r + " (" + d3.format(",")(value) + ",000)";
        }
      }
    },
    color: color,
    size: chartSize,
    legend: hide,
    tooltip: hide,
    padding: padding
  });

  /***
   Businesses chart
   ***/
  var businessesChartData = [
    ["Financing", 5.6],
    ["Social services", 12.6],
    ["Trade", 20.8],
    ["Transportation", 4.5]
  ];

  c3.generate({
    bindto: "#businessesChart",
    data: {
      columns: businessesChartData,
      type : "bar",
      labels: {
        format: function(value, d){
          return d + " (" + d3.format(",")(value) + ")";
        }
      }
    },
    axis: {
      x: {
        type : 'categorized',
        tick: {
          format: function () {return "";}
        }
      },
      y: {
        label: {
          text: "Employment by sectors (%)",
          position: "outer-middle"
        }
      }
    },
    color: color,
    size: chartSize,
    legend: hide,
    tooltip: hide
  });

  /***
   Crime rate chart
   ***/
  var crimeChartData = [["H.K. Safe Cities Index (2015)", 77.24]];
  c3.generate({
    bindto: "#crimeChart",
    data: {
      columns: crimeChartData,
      type: "gauge"
    },
    gauge: {
      label: {
        format: function(value, ratio) {
          return value;
        },
        units: ""
      },
      color: color,
      size: chartSize
    }});

  /***
   Land area chart
   ***/
  var landAreaChartData = [
    ["Kowloon", 47],
    ["New Territories", 978],
    ["H.K. Island", 81]
  ];

  c3.generate({
    bindto: "#landAreaChart",
    data: {
      columns: landAreaChartData,
      type : "bar",
      labels: {
        format: function(value, d){
          return d + " (" + d3.format(",")(value) + ")";
        }
      }
    },
    axis: {
      x: {
        type : 'categorized',
        tick: {
          format: function () {return "";}
        }
      },
      y: {
        label: {
          text: "Land area (sq. km)",
          position: "outer-middle"
        }
      }
    },
    color: color,
    size: chartSize,
    legend: hide,
    tooltip: hide
  });

  /***
   Weather chart
   ***/
  var weatherChartData =  {
    columns: [
      ["Humidity", 74, 80, 82, 83, 83, 82, 81, 81, 78, 73, 71, 69],
      ["Mean Temp.", 16.3, 16.8, 19.1, 22.6, 25.9, 27.9, 28.8, 28.6, 27.7, 25.5, 21.8, 17.9]
    ]
  };

  var weatherChart = c3.generate({
    bindto: "#weatherChart",
    data: weatherChartData,
    axis: {
      x: {
        type : "categorized",
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      y: {
        label: {
          text: "Mean Temp. / Humidity",
          position: "outer-middle"
        }
      }
    },
    color: { pattern: ["#085E9A", "#65A4D1"] },
    size: {height: 150, width: 250},
    legend: {position: "left"}
  });

  // When a radio button is clicked, update the chart to its appropriate temperature unit
  $("#celsiusBtn").click(function(){
    // Convert temp. data into Celsius

    for(var i=1; i< weatherChartData.columns[1].length; i++)
      weatherChartData.columns[1][i] = d3.round((weatherChartData.columns[1][i] - 32) * 5 / 9, 1);

    setTimeout(function () {
      weatherChart .load(weatherChartData);
    }, 1000);
  });

  $("#fahrenheitBtn").click(function(){
    // Convert temp. data into Fahrenheit

    for(var i=1; i< weatherChartData.columns[1].length; i++)
      weatherChartData.columns[1][i] = d3.round(weatherChartData.columns[1][i] * 9 / 5 + 32, 1);

    setTimeout(function () {
      weatherChart .load(weatherChartData);
    }, 1000);
  });
});
