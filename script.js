var rates = {};

var currencyFlags = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
    'AUD': '🇦🇺', 'CAD': '🇨🇦', 'CHF': '🇨🇭', 'CNY': '🇨🇳',
    'INR': '🇮🇳', 'MXN': '🇲🇽', 'BRL': '🇧🇷', 'ZAR': '🇿🇦',
    'RUB': '🇷🇺', 'KRW': '🇰🇷', 'SGD': '🇸🇬', 'HKD': '🇭🇰',
    'NOK': '🇳🇴', 'SEK': '🇸🇪', 'DKK': '🇩🇰', 'PLN': '🇵🇱',
    'THB': '🇹🇭', 'MYR': '🇲🇾', 'IDR': '🇮🇩', 'PHP': '🇵🇭',
    'CZK': '🇨🇿', 'HUF': '🇭🇺', 'ILS': '🇮🇱', 'NZD': '🇳🇿',
    'TRY': '🇹🇷', 'AED': '🇦🇪', 'SAR': '🇸🇦', 'ARS': '🇦🇷',
    'CLP': '🇨🇱', 'COP': '🇨🇴', 'EGP': '🇪🇬', 'PKR': '🇵🇰',
    'BDT': '🇧🇩', 'VND': '🇻🇳', 'NGN': '🇳🇬', 'UAH': '🇺🇦'
};

var fromCurrency = document.getElementById('fromCurrency');
var toCurrency = document.getElementById('toCurrency');
var amount = document.getElementById('amount');
var resultInput = document.getElementById('resultInput');
var rateDisplay = document.getElementById('rateDisplay');
var lastUpdated = document.getElementById('lastUpdated');
var swapBtn = document.getElementById('swapBtn');
var refreshBtn = document.getElementById('refreshBtn');
var fromFlag = document.getElementById('fromFlag');
var toFlag = document.getElementById('toFlag');

var isUpdatingFrom = false;
var isUpdatingTo = false;

function fetchRates() {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            rates = data.rates;
            lastUpdated.textContent = 'Last updated: ' + new Date().toLocaleString();
            calculate();
        })
        .catch(function(error) {
            console.error('Error fetching rates:', error);
            lastUpdated.textContent = 'Error loading rates';
        });
}

function calculate() {
    var from = fromCurrency.value;
    var to = toCurrency.value;
    var amt = parseFloat(amount.value) || 0;

    fromFlag.textContent = currencyFlags[from] || '🏳️';
    toFlag.textContent = currencyFlags[to] || '🏳️';

    if (rates[from] && rates[to] && !isUpdatingTo) {
        isUpdatingFrom = true;
        var converted = (amt / rates[from]) * rates[to];
        resultInput.value = converted.toFixed(2);
        isUpdatingFrom = false;

        var rate = (rates[to] / rates[from]).toFixed(4);
        rateDisplay.textContent = '1 ' + from + ' = ' + rate + ' ' + to;
    }
}

function calculateReverse() {
    var from = fromCurrency.value;
    var to = toCurrency.value;
    var resultAmt = parseFloat(resultInput.value) || 0;

    if (rates[from] && rates[to] && !isUpdatingFrom) {
        isUpdatingTo = true;
        var converted = (resultAmt / rates[to]) * rates[from];
        amount.value = converted.toFixed(2);
        isUpdatingTo = false;

        var rate = (rates[to] / rates[from]).toFixed(4);
        rateDisplay.textContent = '1 ' + from + ' = ' + rate + ' ' + to;
    }
}

function swap() {
    var temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    calculate();
}

fromCurrency.addEventListener('change', calculate);
toCurrency.addEventListener('change', calculate);
amount.addEventListener('input', calculate);
resultInput.addEventListener('input', calculateReverse);
swapBtn.addEventListener('click', swap);
refreshBtn.addEventListener('click', fetchRates);

fetchRates();