/* ========================================
   ConstruData Shield - Dashboard Charts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initVulnTrendChart();
  initSeverityChart();
});

/* ── Color tokens ── */
const YELLOW = '#FFEF4D';
const YELLOW_DIM = 'rgba(255, 239, 77, 0.55)';
const NAVY = '#2A428C';
const NAVY_LIGHT = '#334d9e';
const NAVY_DARK = '#1e3070';
const TEXT_MUTED = '#5c6a94';
const GRID_COLOR = 'rgba(255, 239, 77, 0.06)';

/* ── Global Chart.js defaults ── */
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = TEXT_MUTED;

/* ── Vulnerability Trend (Bar Chart) ── */
function initVulnTrendChart() {
  const ctx = document.getElementById('vulnTrendChart').getContext('2d');

  // Simulated monthly data
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const newVulns =     [320, 280, 340, 290, 380, 450, 420, 390, 360, 410, 370, 330];
  const resolvedVulns = [180, 220, 200, 250, 210, 280, 320, 310, 290, 350, 340, 300];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'New Vulnerabilities',
          data: newVulns,
          backgroundColor: YELLOW,
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.7,
        },
        {
          label: 'Resolved',
          data: resolvedVulns,
          backgroundColor: NAVY_LIGHT,
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#172560',
          titleColor: '#e8ecf5',
          bodyColor: '#8b97bf',
          borderColor: 'rgba(255, 239, 77, 0.15)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { weight: '700', size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            title: (items) => {
              const monthNames = [
                'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026',
                'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026',
                'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
              ];
              return monthNames[items[0].dataIndex] || items[0].label;
            },
            label: (item) => {
              const prefix = item.datasetIndex === 0 ? 'New' : 'Resolved';
              return `  ${prefix}: ${item.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11, weight: '600' },
            color: TEXT_MUTED,
          },
          border: { display: false },
        },
        y: {
          grid: {
            color: GRID_COLOR,
            lineWidth: 1,
          },
          ticks: {
            font: { size: 11 },
            color: TEXT_MUTED,
            callback: (val) => val >= 1000 ? `${val / 1000}k` : val,
            stepSize: 100,
          },
          border: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
}

/* ── Severity Doughnut Chart ── */
function initSeverityChart() {
  const ctx = document.getElementById('severityChart').getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [47, 189, 1204, 2451],
        backgroundColor: [
          '#ef4444',  // Critical - red
          '#f97316',  // High - orange
          '#FFEF4D',  // Medium - yellow
          '#60a5fa',  // Low - blue
        ],
        borderColor: '#14204e',
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#172560',
          titleColor: '#e8ecf5',
          bodyColor: '#8b97bf',
          borderColor: 'rgba(255, 239, 77, 0.15)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (item) => {
              const total = item.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((item.parsed / total) * 100).toFixed(1);
              return `  ${item.label}: ${item.parsed.toLocaleString()} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}
