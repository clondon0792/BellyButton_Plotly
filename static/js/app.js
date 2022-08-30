
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then(function(response){

    console.log(response);
    var metadata = response;

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach( ([key, value]) => panel.append('p').append('small').text(key + ": " + value));

  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json('samples/' + sample).then(function(response) {

    // @TODO: Build a Bubble Chart using the sample data  
    var sampleData = response;

    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth',
        type: 'heatmap'
      },
      text: sampleData.otu_labels
    };

    var data = [trace1];

    var layout = {
      title: "<b>Bubble Chart of Belly Button Bacteria</b><br>(All Bacteria)",
      showlegend: false,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Value"
      }
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Prepare a list of objects for sorting
    var list = [];
    for (var i = 0; i < sampleData.otu_ids.length; i++) {
        // Push each object into the list
        list.push({'otu_ids': sampleData.otu_ids[i], 'otu_labels': sampleData.otu_labels[i], 'sample_values': sampleData.sample_values[i]});
    }

    // Sort function by object key in array
    console.log(list.sort((a, b) => parseInt(b.sample_values) - parseInt(a.sample_values)));

    var trace2 = {
      x: list.slice(0,10).map(record => record.sample_values),
      y: list.slice(0,10).map(record => "OTU" + record.otu_ids.toString()),
      hovertext: list.slice(0,10).map(record => "(" + record.otu_ids + ", " + record.otu_labels + ")"),
      type: "bar",
      orientation: "h"
    };

    var data = [trace2];

    var layout = {
      height: 500,
      width: 500
    };

    Plotly.newPlot("bar", data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
