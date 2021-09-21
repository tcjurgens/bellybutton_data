function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;  // sampleNames array
    sampleNames.forEach((sample) => {
      selector // adds options in the dropdown menu for all id's / data.names in the data
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
})}

init(); // initializing the dashboard

function optionChanged(newSample) {  // func exists here but is never called here,, 
                                     // called by onChange in the index.html file
  //console.log(newSample);
  
  buildMetadata(newSample);
  buildCharts(newSample); 
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");
    // clear existing metadata
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Deliverable 1
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samplesArray = data.samples;

    var IdSamples = samplesArray.filter(data => data.id == sample);
    
    var firstSample = IdSamples[0];
    
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    var yticks = otu_ids.slice(0,10).map(id => "OTU " + id).reverse();

    var bar_data = [{
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar"
    }];

    var bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
      
    };
    Plotly.newPlot("bar", bar_data, bar_layout, {responsive: true});

  // Deliverable 2
    var bubble_data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Tropic"
      }
    }];
    var bubble_layout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      xaxis: {
        title: "OTU IDs", 
        automargin: true
      },
      yaxis: {
        automargin: true
      },
      hovermode: "closest"
    };
    Plotly.newPlot("bubble", bubble_data, bubble_layout, {responsive: true});

    // Deliverable 3
    var metadata_id = data.metadata.filter(data => data.id == sample);
    var wash_freq = metadata_id[0].wfreq;
    var gauge_data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: "Belly Button Washing Frequency</b> ",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [0,2,4,6,8,10],
            ticktext: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "purple" },
            { range: [2, 4], color: "red" },
            { range: [4, 6], color: "orange" },
            { range: [6, 8], color: "yellow" },
            { range: [8, 10], color: "green" }]
        }
      }
    ];
    
    var gauge_layout = { 
      autosize: true,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.05,
        yanchor: 'center',
        text: 'Belly Button scrubs per Week',
        showarrow: false
      }]
    };

    Plotly.newPlot("gauge", gauge_data, gauge_layout, {responsive: true});
  });
}