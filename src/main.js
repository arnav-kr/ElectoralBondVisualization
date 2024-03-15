import './css/style.css';
import * as d3 from "d3";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// TODO: Uncomment the following lines to enable PWA Support
// // PWAManager
import { PWAManager } from './js/PWAManager';
let PWAManagerInstance = new PWAManager({
  serviceWorkerPath: './sw.js',
  beforeInstallPrompt: () => { },
  appInstalled: () => { },
  controllerChange: () => { },
  installButton: null,
  updateButton: null,
});

PWAManagerInstance.init();

function chart(data) {
  // Specify the dimensions of the chart.
  const width = 1440;
  const height = width;
  const margin = 1; // to avoid clipping the root circle stroke
  const name = d => d.name; // "Strings" of "flare.util.Strings"
  const names = d => name(d).split(/(?=[A-Z][a-z])|\s+/g); // ["Legend", "Item"] of "flare.vis.legend.LegendItems"

  // Specify the number format for values.
  const format = d3.format(",d");

  // Create a categorical color scale.
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // Create the pack layout.
  const pack = d3.pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  // Compute the hierarchy from the (flat) data; expose the values
  // for each node; lastly apply the pack layout.
  const root = pack(d3.hierarchy({ children: data })
    .sum(d => d.amount));

  // Create the SVG container.
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-margin, -margin, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
    .attr("text-anchor", "middle");

  // Place each (leaf) node according to the layout’s x and y values.
  const node = svg.append("g")
    .selectAll()
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  // Add a title.
  // node.append("title")
  //     .text(d => `${d.data.id}\n${format(d.value)}`);

  // Add a filled circle.
  node.append("circle")
    .attr("fill-opacity", 0.7)
    .attr("fill", d => color(name(d.data)))
    .attr("r", d => d.r);

  // Add a label.
  const text = node.append("text")
    .attr("clip-path", d => `circle(${d.r})`);

  // Add a tspan for each CamelCase-separated word.
  text.selectAll()
    .data(d => names(d.data))
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
    .text(d => d);

  // Add a tspan for the node’s value.
  text.append("tspan")
    .attr("x", 0)
    .attr("y", d => `${names(d.data).length / 2 + 0.35}em`)
    .attr("fill-opacity", 0.7)
    .text(d => format(d.value));

  return Object.assign(svg.node(), { scales: { color } });
}

Chart.defaults.color = "#fafafa";
Chart.defaults.backgroundColor = '#212121';
Chart.defaults.borderColor = "#fafafa11";
// load parties.csv

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

d3.csv("/assets/buyers.csv").then(data => {
  const ctx = document.getElementById('chart');
  console.log(data);
  data = data.sort((a, b) => b.amount - a.amount).slice(0, 30);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Denomination',
        data: data.map(d => d.amount),
        borderWidth: 1,
        backgroundColor: "#EF4444",
        borderColor: "#F87171"
      }]
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: '#030712',
        },
        title: {
          display: true,
          text: 'Top 30 Buyers of Electoral Bonds in India 2019-24'
        },
        subtitle: {
          display: true,
          text: 'eci.gov.in/disclosure-of-electoral-bonds'
      }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [plugin]
  });
});

d3.csv("/assets/parties.csv").then(data => {
  const ctx = document.getElementById('chart1');
  console.log(data);
  data = data.sort((a, b) => b.amount - a.amount).slice(0, 20);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Denomination',
        data: data.map(d => d.amount),
        borderWidth: 1,
        backgroundColor: "#EF4444",
        borderColor: "#F87171"
      }]
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: '#030712',
        },
        title: {
          display: true,
          text: 'Party wise Electoral Bonds Donation in India 2019-24'
        },
        subtitle: {
          display: true,
          text: 'eci.gov.in/disclosure-of-electoral-bonds'
      }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [plugin]
  });
});