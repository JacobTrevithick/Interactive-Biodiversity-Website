const samplesPath = "../data/samples.json";

function init() {
    // Initialize Hbar chart, bubble chart, demo info, gauge chart

    
    d3.json(samplesPath).then(function(data){
        
        // Input dropdown menu items
        var options = data['names'];
        var sel = document.getElementById('selDataset');
        for (var i = 0; i < options.length; i++){
          var opt = document.createElement('option');
          opt.innerHTML = options[i];
          opt.value = options[i];
          sel.appendChild(opt);
        };

        var id1 = data['names'][0];

        for (var i = 0; i < data['samples'].length; i++) {

            if (data['samples'][i]['id'] == id1){

                var reference = i

                var otu_ids = data['samples'][i]['otu_ids'].reverse();
                var sample_values = data['samples'][i]['sample_values'].reverse();
                var otu_labels = data['samples'][i]['otu_labels'].reverse();

                var panelBody = d3.select(".panel-body");

                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
                for (const [key, value] of Object.entries(data['metadata'][i])) {
                    panelBody.append("p").text(`${key}: ${value}`)
                    console.log(`${key}: ${value}`);
                };
            };
        };


        var otuIdStrings = [];

        for (var i =0; i < otu_labels.length; i++){
            otuIdStrings.push(`OTU: ${otu_ids[i]}`);
        };


        if (otu_ids.length >= 10){

            var data1 = [{
                x: sample_values.slice(sample_values.length-10, sample_values.length),
                y: otuIdStrings.slice(otuIdStrings.length-10, otuIdStrings.length),
                orientation: 'h',
                text: otu_labels.slice(otu_labels.length-10, otu_labels.length),
                type: 'bar'
            }];

        } else {

            var data1 = [{
                x: sample_values,
                y: otuIdStrings,
                orientation: 'h',
                text: otu_labels,
                type: 'bar'
            }];

        };

        var layout = {
            title: `Sample: ${id1}`
        };

        Plotly.newPlot("bar", data1, layout);

        var data2 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids
            },
            mode: 'markers'
        }];

        Plotly.newPlot('bubble', data2, layout);

        var data3 = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: data['metadata'][reference]['wfreq'],
              title: { text: `Washing Frequency, Sample: ${id1}` },
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
          
        //   var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', data3);

      });
};

d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {

    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var id = dropdownMenu.property("value");

    d3.json(samplesPath).then(function(data){

        for (var i = 0; i < data['samples'].length; i++) {

            if (data['samples'][i]['id'] == id){

                var reference = i;

                var otu_ids = data['samples'][i]['otu_ids'].reverse();
                var sample_values = data['samples'][i]['sample_values'].reverse();
                var otu_labels = data['samples'][i]['otu_labels'].reverse();

                var panelBody = d3.select(".panel-body");

                panelBody.html('')

                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
                for (const [key, value] of Object.entries(data['metadata'][i])) {
                    panelBody.append("p").text(`${key}: ${value}`)
                };
            };
        };


        var otuIdStrings = [];

        for (var i =0; i < otu_labels.length; i++){
            otuIdStrings.push(`OTU: ${otu_ids[i]}`);
        };


        if (otu_ids.length >= 10){

            var update1 = [{
                x: sample_values.slice(sample_values.length-10, sample_values.length),
                y: otuIdStrings.slice(otuIdStrings.length-10, otuIdStrings.length),
                orientation: 'h',
                text: otu_labels.slice(otu_labels.length-10, otu_labels.length),
                type: 'bar'
            }];

        } else {

            var update1 = [{
                x: sample_values,
                y: otuIdStrings,
                text: otu_labels,
                type: 'bar',
                orientation: 'h'
            }];

        };

        var layout = {
            title: `Sample: ${id}`
        };

        Plotly.newPlot("bar", update1, layout);

        var update2 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids
            },
            mode: 'markers'
        }];

        Plotly.newPlot('bubble', update2, layout);

        var data3 = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: data['metadata'][reference]['wfreq'],
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
          
        //   var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', data3);
    });
};

// function getSampleInfo(data) {
    
//     for (var i = 0; i < data['samples'].length; i++) {

//         if (data['samples'][i]['id'] == id1){

//             var otu_ids = data['samples'][i]['otu_ids'].reverse();
//             var sample_values = data['samples'][i]['sample_values'].reverse();
//             var otu_labels = data['samples'][i]['otu_labels'].reverse();

//             var panelBody = d3.select(".panel-body");

//             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
//             for (const [key, value] of Object.entries(data['metadata'][i])) {
//                 panelBody.append("p").text(`${key}: ${value}`)
//                 console.log(`${key}: ${value}`);
//             };
//         };
//     };

//     var sampleInfo = [otu_ids, sample_values, otu_labels]

//     return sampleInfo
// };

init()