const samplesPath = "/../data/samples.json";

function init() {
    // Initialize Hbar chart, bubble chart, demo info, gauge chart

    // open json file
    d3.json(samplesPath).then(function(data){
        
        // Input dropdown menu items
        var options = data['names'];
        var sel = document.getElementById('selDataset');

        // loop through sample ids and append to the menu list
        for (var i = 0; i < options.length; i++){
            // create new 'option' element and give it HTML and value attributes. Then append to dropdown menu.
          var opt = document.createElement('option');
          opt.innerHTML = options[i];
          opt.value = options[i];
          sel.appendChild(opt);
        };

        // assign opening page to first sample
        var id1 = data['names'][0];

        // get sample information to update all plots
        var sampleInfo = getSampleInfo(data, id1);

        // update bar plot with first sample id info
        updateBar(sampleInfo, id1);

        // update bubble plot with first sample id info
        updateBubble(sampleInfo, id1);

        // update gauge plot with first sample id info
        updateGauge(data, id1, sampleInfo);
      });
};

// Trigger updatePlotly on a change to the dropdown menu value
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {

    // select the dropdown menu from the page
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var id = dropdownMenu.property("value");

    // open data file
    d3.json(samplesPath).then(function(data){

        // get sample info for current selection
        var sampleInfo = getSampleInfo(data, id);

        // update all plots with the current selection.
        updateBar(sampleInfo, id);
        updateBubble(sampleInfo, id);
        updateGauge(data, id, sampleInfo);
    });
};

function getSampleInfo(data, id) {
    
    // loop through samples to find current sample id
    for (var i = 0; i < data['samples'].length; i++) {
        // check 'id' value for match
        if (data['samples'][i]['id'] == id){
            // save reference place in dataset for use in gauge plotting
            var reference = i;

            // gather otu_ids, sample_values, and otu_labels for current sample
            // reversed to display largest values on top in Bar chart
            var otu_ids = data['samples'][i]['otu_ids'].reverse();
            var sample_values = data['samples'][i]['sample_values'].reverse();
            var otu_labels = data['samples'][i]['otu_labels'].reverse();

            // select the demographic info panel
            var panelBody = d3.select(".panel-body");

            // clear demo info panel 
            panelBody.html('');

            // append each key: value pair from the metadata for the given sample. Code sourced from here:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
            for (const [key, value] of Object.entries(data['metadata'][i])) {
                panelBody.append("p").text(`${key}: ${value}`)
            };
        };
    };

    // Create list of otuIdStrings for displaying
    var otuIdStrings = [];
    for (var i =0; i < otu_labels.length; i++){
        otuIdStrings.push(`OTU: ${otu_ids[i]}`);
    };

    // create sampleInfo information
    var sampleInfo = {
        otuIds: otu_ids,
        sampleValues: sample_values,
        otuLabels: otu_labels,
        otuIdStrings: otuIdStrings,
        ref: reference
    };

    return sampleInfo
};


function updateBar(sampleInfo, id) {
    
    // Check if there are ten or more otus in for the given sample
    // if so, slice the highest ten
    if (sampleInfo['otuIds'].length >= 10){

        var barData = [{
            x: sampleInfo['sampleValues'].slice(sampleInfo['sampleValues'].length-10, sampleInfo['sampleValues'].length),
            y: sampleInfo['otuIdStrings'].slice(sampleInfo['otuIdStrings'].length-10, sampleInfo['otuIdStrings'].length),
            orientation: 'h',
            text: sampleInfo['otuLabels'].slice(sampleInfo['otuLabels'].length-10, sampleInfo['otuLabels'].length),
            type: 'bar'
        }];
        // if not, get all values
    } else {

        var barData = [{
            x: sampleInfo['sampleValues'],
            y: sampleInfo['otuIdStrings'],
            text: sampleInfo['otuLabels'],
            type: 'bar',
            orientation: 'h'
        }];

    };

    var layout = {
        title: `Sample: ${id}`
    };

    // update bar plot
    Plotly.newPlot("bar", barData, layout);
};

function updateBubble(sampleInfo, id) {
    
    // retrieve sample information
    var bubbleData = [{
        x: sampleInfo['otuIds'],
        y: sampleInfo['sampleValues'],
        text: sampleInfo['otuLabels'],
        marker: {
            size: sampleInfo['sampleValues'],
            color: sampleInfo['otuIds']
        },
        mode: 'markers'
    }];

    var layout = {
        title: `Sample: ${id}`
    };
    // update bubble plot
    Plotly.newPlot('bubble', bubbleData, layout);
};

function updateGauge(data, id, sampleInfo) {
    
    // retrieve sample information
    var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: data['metadata'][sampleInfo['ref']]['wfreq'],
          title: { text: `Washing Frequency, Sample: ${id}` },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            borderwidth: 2,
            bordercolor: "black",
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "rgb (229,255,204)" },
              { range: [1, 2], color: "rgb (204,255,153)" },
              { range: [2, 3], color: "rgb (178,255,102)" },
              { range: [3, 4], color: "rgb (153,255,51)" },
              { range: [4, 5], color: "rgb (128,255,0)" },
              { range: [5, 6], color: "rgb (102,204,0)" },
              { range: [6, 7], color: "rgb (76,153,0)" },
              { range: [7, 8], color: "rgb (51,102,0)" },
              { range: [8, 9], color: "rgb (25,51,0)" },
            ],
          }
        }
      ];
    //   update gauge plot
      Plotly.newPlot('gauge', gaugeData);
}

// call init function 
init()
