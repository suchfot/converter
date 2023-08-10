


function calculate(e) {
  let exchangeRateInput = document.getElementById("exchangeRate");
let amountInput = document.getElementById("amount");
    const resultElement = document.getElementById("result");
    const exchangeRate = parseFloat(exchangeRateInput.value);
    const amount = parseFloat(amountInput.value);

    if (isNaN(exchangeRate) || isNaN(amount)) {
        resultElement.textContent = "Bitte gültige Zahlen eingeben.";
    } else {
        const convertedAmount = amount * exchangeRate;
        resultElement.textContent = `${convertedAmount.toFixed(2).replace(".", ",")} €`;
        localStorage.setItem("kurs", exchangeRate);
    }
}
function getParameterFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const numberString = urlParams.get("kurs");
    const numberWithPoint = numberString.replace(",", ".");
    const parsedNumber = parseFloat(numberWithPoint);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    } else {
        return null;
    }
}
function validateInput(event) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9,.]/g, '');
    const firstCommaIndex = inputValue.indexOf(',');
    if (firstCommaIndex !== -1) {
        const commaSubstring = inputValue.substring(firstCommaIndex + 1);
        const commaReplacement = commaSubstring.replace(/,/g, '');
        event.target.value = inputValue.substring(0, firstCommaIndex + 1) + commaReplacement;
        event.target.value = event.target.value.replace(/\./g, ',');
    } else {
        event.target.value = event.target.value.replace(/\./g, ',');
    }
    calculate();
}


function loadExchangeRate(quote) {
  fetch('api.php')
  .then(response => response.json())
  .then(data => {
    const result = JSON.parse(data);
    document.getElementById("exchangeRate").value = 1/parseFloat(result.quotes['EUR'+quote]);
    calculate();
})
  .catch(error => console.error('Fehler beim Abrufen der Daten:', error));

}

function handleButtonClick(event) {
    const buttonValue = event.target.textContent;
    const amountInput = document.getElementById("amount");
    if (buttonValue === "C") {
        amountInput.value = "";
        document.getElementById("result").textContent = "0 €";
        return;
    }
    amountInput.value += buttonValue;
    validateInput(event);
}

window.addEventListener("DOMContentLoaded", function () {
    const exchangeRateInput = document.getElementById("exchangeRate");
    const amountInput = document.getElementById("amount");
    exchangeRateInput.addEventListener("input", calculate);
    amountInput.addEventListener("input", validateInput);
    const calculatorButtons = document.querySelectorAll(".calculator button");
    calculatorButtons.forEach(button => {
        button.addEventListener("click", handleButtonClick);
    });
});


function fetchFileFromCache(file) {
  caches.open('data-cache').then(cache => {
    cache.match(file + '.json').then(response => {
      if (response) {
        response.json().then(data => {
          return data;
        });
      } else {

        return false;
      }
    });
  });
}

const datas = ['currencies'];
for( savedata of datas ){
 if(!fetchFileFromCache(savedata)){
  fetch('currencies/'+ savedata + '.json')
  .then(response => response.json())
  .then(data => {
    caches.open('data-cache').then(cache => {
      cache.put(savedata + '.json', new Response(JSON.stringify(data)));
     });
  })
  .catch(error => console.error('Fehler beim Abrufen der JSON-Datei:', error));
 }
}



  fetch('manifest.json')
    .then(response => response.json())
    .then(manifest => {
      const quotesElement = document.getElementById('quotes');
      const saveQuotes =  localStorage?.getItem("quotes");
      for(wae in manifest.quotes){

        const option = document.createElement('option');
        option.textContent = manifest.quotes[wae];
        option.value = wae;
        if(saveQuotes === wae){
          option.selected = true;
          loadExchangeRate(wae);
        }
        quotesElement.appendChild(option);
      }
     document.getElementById('quotes').addEventListener('change', function() {
      localStorage.setItem("quotes", this.value);
      loadExchangeRate(this.value);
     });

    })
    .catch(error => {
      console.error('Fehler beim Laden des Manifests:', error);
    });
