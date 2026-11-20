// Tasas de referencia (Base USD)
const currencyData = {
  USD: { rate: 1.0, name: 'Dólar Estadounidense', flag: '🇺🇸' },
  EUR: { rate: 0.92, name: 'Euro', flag: '🇪🇺' },
  ARS: { rate: 1015.0, name: 'Peso Argentino', flag: '🇦🇷' },
  GBP: { rate: 0.79, name: 'Libra Esterlina', flag: '🇬🇧' },
  MXN: { rate: 20.15, name: 'Peso Mexicano', flag: '🇲🇽' },
  BRL: { rate: 5.75, name: 'Real Brasileño', flag: '🇧🇷' },
  JPY: { rate: 154.2, name: 'Yen Japonés', flag: '🇯🇵' }
};

// Elementos del DOM
const baseAmountInput = document.getElementById('baseAmount');
const targetAmountInput = document.getElementById('targetAmount');
const baseCurrencySelect = document.getElementById('baseCurrency');
const targetCurrencySelect = document.getElementById('targetCurrency');
const baseNameLabel = document.getElementById('baseName');
const targetNameLabel = document.getElementById('targetName');
const unitRateDisplay = document.getElementById('unitRateDisplay');
const swapBtn = document.getElementById('swapCurrencies');
const quickRatesBody = document.getElementById('quickRatesBody');
const tableBaseLabel = document.getElementById('tableBaseLabel');

let trendChart = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initTrendChart();
  convertCurrency();

  baseAmountInput.addEventListener('input', convertCurrency);
  baseCurrencySelect.addEventListener('change', convertCurrency);
  targetCurrencySelect.addEventListener('change', convertCurrency);

  swapBtn.addEventListener('click', () => {
    const temp = baseCurrencySelect.value;
    baseCurrencySelect.value = targetCurrencySelect.value;
    targetCurrencySelect.value = temp;
    convertCurrency();
  });
});

function convertCurrency() {
  const amount = parseFloat(baseAmountInput.value) || 0;
  const fromCode = baseCurrencySelect.value;
  const toCode = targetCurrencySelect.value;

  const fromInfo = currencyData[fromCode];
  const toInfo = currencyData[toCode];

  // Actualizar nombres descriptivos
  baseNameLabel.textContent = fromInfo.name;
  targetNameLabel.textContent = toInfo.name;

  // Cálculo de tasa cruzada
  const conversionRate = toInfo.rate / fromInfo.rate;
  const convertedValue = amount * conversionRate;

  // Mostrar resultados formateados
  targetAmountInput.value = convertedValue.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  unitRateDisplay.textContent = `1 ${fromCode} = ${conversionRate.toFixed(4)} ${toCode}`;

  // Actualizar tabla de equivalencias rápidas y gráfico
  updateQuickTable(amount, fromCode);
  updateChart(conversionRate, fromCode, toCode);
}

function updateQuickTable(amount, fromCode) {
  const displayAmount = amount > 0 ? amount : 1;
  tableBaseLabel.textContent = `${displayAmount.toLocaleString('es-AR')} ${fromCode}`;
  quickRatesBody.innerHTML = '';

  const targetKeys = Object.keys(currencyData).filter(code => code !== fromCode).slice(0, 4);

  targetKeys.forEach(code => {
    const rate = currencyData[code].rate / currencyData[fromCode].rate;
    const total = displayAmount * rate;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${currencyData[code].flag} ${code}</td>
      <td>${rate.toFixed(4)}</td>
      <td><strong>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
    `;
    quickRatesBody.appendChild(row);
  });
}

function initTrendChart() {
  const ctx = document.getElementById('fxTrendChart').getContext('2d');
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'],
      datasets: [{
        label: 'Tasa',
        data: [1, 1, 1, 1, 1, 1, 1],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#2563eb'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { size: 11 } }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { color: '#64748b', font: { size: 11 } }
        }
      }
    }
  });
}

function updateChart(rate, fromCode, toCode) {
  if (!trendChart) return;

  const historyPoints = [
    rate * 0.985,
    rate * 0.992,
    rate * 0.988,
    rate * 0.995,
    rate * 1.003,
    rate * 0.998,
    rate
  ];

  trendChart.data.datasets[0].label = `${fromCode} → ${toCode}`;
  trendChart.data.datasets[0].data = historyPoints;
  trendChart.update();
}
