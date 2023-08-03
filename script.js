let exchangeRateInput = document.getElementById("exchangeRate");
let amountInput = document.getElementById("amount");


function calculate(e) {

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

    // Ersetze das Komma durch einen Punkt (für das Dezimaltrennzeichen)
    const numberWithPoint = numberString.replace(",", ".");

    // Versuche die Zahl zu parsen und gib sie zurück
    const parsedNumber = parseFloat(numberWithPoint);
    if (!isNaN(parsedNumber)) {
      return parsedNumber;
    } else {
      return null; // Wenn keine gültige Zahl gefunden wurde, gib null zurück
    }
  }
  function validateInput(event) {
    const allowedChars = /[0-9,.]/;
    const inputValue = event.target.value;

    // Entferne alle Zeichen, die nicht erlaubt sind (Buchstaben und Punkte)
    event.target.value = inputValue.replace(/[^0-9,.]/g, '');

    // Ersetze Punkte durch Kommas und entferne alle Kommas, die nach dem ersten Komma kommen
    const firstCommaIndex = inputValue.indexOf(',');
    if (firstCommaIndex !== -1) {
      const commaSubstring = inputValue.substring(firstCommaIndex + 1);
      const commaReplacement = commaSubstring.replace(/,/g, '');
      event.target.value = inputValue.substring(0, firstCommaIndex + 1) + commaReplacement;
      event.target.value = event.target.value.replace(/\./g, ','); // Ersetze Punkte durch Kommas
    } else {
      event.target.value = event.target.value.replace(/\./g, ','); // Ersetze Punkte durch Kommas
    }
    calculate();
  }


  function loadExchangeRate() {
    // Lade den Wechselkurs aus localStorage
    const exchangeRate = localStorage.getItem("kurs");

    // Wenn der Wechselkurs in localStorage vorhanden ist, setze ihn im Eingabefeld
    if (exchangeRate) {
      const exchangeRateInput = document.getElementById("exchangeRate");
      exchangeRateInput.value = exchangeRate;
    }
  }

  function handleButtonClick(event) {
    const buttonValue = event.target.textContent;
    const amountInput = document.getElementById("amount");
    if( buttonValue === "C") {
        amountInput.value = "";
        document.getElementById("result").textContent = "0 €";
        return;
    }


    // Hinzufügen des gedrückten Buttons zum aktuellen Wert des Eingabefelds
    amountInput.value += buttonValue;
    validateInput(event);
  }

  // Beispielanwendung:
  window.addEventListener("DOMContentLoaded", function() {

   loadExchangeRate();
    const exchangeRateInput = document.getElementById("exchangeRate");
    const amountInput = document.getElementById("amount");

    exchangeRateInput.addEventListener("input", calculate);
    amountInput.addEventListener("input", validateInput);


      // Event-Listener für die Tasten des Taschenrechner-Tastenfelds hinzufügen
      const calculatorButtons = document.querySelectorAll(".calculator button");
      calculatorButtons.forEach(button => {
        button.addEventListener("click", handleButtonClick);
      });
    });

