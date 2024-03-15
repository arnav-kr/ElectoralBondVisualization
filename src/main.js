import * as d3 from "d3";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// PWAManager
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

Chart.defaults.color = "#fafafa";
Chart.defaults.backgroundColor = '#212121';
Chart.defaults.borderColor = "#fafafa11";

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const download = (chart, filename) => {
  const a = document.createElement('a');
  a.href = chart.toDataURL('image/png');
  a.download = `${filename}.png`;
  a.click();
};

const parties = document.getElementById('parties');
const buyers = document.getElementById('buyers');

// only allow viewing on large screen
if (innerWidth < 768) {
  parties.remove();
  buyers.remove();
  document.getElementById('mobile').style.display = "grid";
}

parties.addEventListener('click', () => download(parties, 'parties'));
buyers.addEventListener('click', () => download(buyers, 'buyers'));

d3.csv("/assets/buyers.csv").then(data => {
  data = data.sort((a, b) => b.amount - a.amount).slice(0, 30);
  new Chart(buyers, {
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
  console.log(data);
  data = data.sort((a, b) => b.amount - a.amount).slice(0, 20);
  new Chart(parties, {
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
          text: 'Party wise Electoral Bonds Donation Recieved in India 2019-24'
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