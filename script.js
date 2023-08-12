let browserLanguage = navigator.language || navigator.userLanguage;
browserLanguage = browserLanguage.split("-")[1];


function calculate(e) {
  let exchangeRateInput = document.getElementById("exchangeRate");
  let amountInput = document.getElementById("amount");
  const resultElement = document.getElementById("result");
  const exchangeRate = parseFloat(exchangeRateInput.value);
  const amount = parseFloat(amountInput.value.replace(/,/g, '.'));
  if (isNaN(exchangeRate) || isNaN(amount)) {
    resultElement.textContent = "Bitte gültige Zahlen eingeben.";
  } else {
    const convertedAmount = amount * exchangeRate;
    resultElement.textContent = `${convertedAmount.toFixed(2).replace(".", ",")} €`;
    localStorage.setItem("kurs", exchangeRate);
  }
}


function validateInput(event) {
  const inputElement = document.getElementById("amount");
  let inputValue = inputElement.value;
  inputValue = inputValue.replace(/[^\d,.]/g, '');
  inputValue = inputValue.replace(/,/g, (match, offset) => (offset === inputValue.indexOf(',') ? match : ''));
  inputElement.value = inputValue;
  calculate();
}

async function loadExchangeRate(quote) {
  const allKurs = localStorage?.getItem("allKurs");
  if (allKurs !== null) {
    const result = JSON.parse(allKurs);
    document.getElementById("exchangeRate").value = 1 / parseFloat(result.quotes['EUR' + quote]);
    calculate();
  } else {

    await fetch('api.php')
      .then(response => response.json())
      .then(data => {
        const result = JSON.parse(data);
        localStorage.setItem("allKurs", data);
        document.getElementById("exchangeRate").value = 1 / parseFloat(result.quotes['EUR' + quote]);
        calculate();
      })
      .catch(error => console.error('Fehler beim Abrufen der Daten:', error));

  }
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
for (savedata of datas) {
  if (!fetchFileFromCache(savedata)) {
    fetch('currencies/' + savedata + '.json')
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
    const saveQuotes = localStorage?.getItem("quotes");
    let waes = manifest.quotes;
    if (manifest.translatetQuotes[browserLanguage] !== undefined) {
      waes = manifest.translatetQuotes[browserLanguage];
    }

    for (wae in waes) {

      const option = document.createElement('option');
      option.textContent = waes[wae];
      option.value = wae;
      if (saveQuotes === wae) {
        option.selected = true;
        loadExchangeRate(wae);
      }
      quotesElement.appendChild(option);
    }
    document.getElementById('quotes').addEventListener('change', async function () {
      localStorage.setItem("quotes", this.value);
     await loadExchangeRate(this.value);
    });

  })
  .catch(error => {
    console.error('Fehler beim Laden des Manifests:', error);
  });


//   // Überprüfe, ob der Browser die Geolocation unterstützt
// if ("geolocation" in navigator) {
//   // Frage den Nutzer nach der Berechtigung zur Standortabfrage
//   navigator.geolocation.getCurrentPosition(
//     function(position) {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;

//       // Hier kannst du die Koordinaten verwenden, um den Standort zu ermitteln
//       // Du könntest z.B. eine API für geografische Informationen verwenden

//       console.log("Latitude: " + latitude + ", Longitude: " + longitude);
//     },
//     function(error) {
//       console.error("Fehler bei der Geolocation: " + error.message);
//     }
//   );
// } else {
//   console.error("Geolocation wird nicht unterstützt.");
// }