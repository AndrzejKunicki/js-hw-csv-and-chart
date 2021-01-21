var ctx = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
  .then(parsedData)
  .then(getLabelsAndData)
  .then(({ years, temps, nHem, sHem }) => drawChart(years, temps, nHem, sHem));

function fetchData() {
  return fetch('./ZonAnn.Ts+dSST.csv').then(response => response.text());
}

function parsedData(data) {
  return Papa.parse(data, { header: true }).data;
}

function getLabelsAndData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.temps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
      acc.nHem.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
      acc.sHem.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);

      return acc;
    },
    {
      years: [],
      temps: [],
      nHem: [],
      sHem: [],
    },
  );
}

function drawChart(labels, data1, data2, data3) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Global temps',
          data: data1,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'NHem',
          data: data2,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'SHem',
          data: data3,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback(value, index, values) {
                return value + ' °C';
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              callback(value, index, values) {
                return value + ' yr';
              },
            },
          },
        ],
      },
    },
  });
}
