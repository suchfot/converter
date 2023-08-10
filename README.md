# converter
einfacher Währungsumrechner

## Wie jetzt?
Wenn Du zum Bespiel wissen willst was in der Landeswährung wo Du gerade bist bzw. die du einfach nur wissen willst in Euro ist dann kannst du das hier gut benutzen.
Ich hab edas so Aufgebaut das Du quasie von jeder Währung in jede Währung rechnen kannst. Ich lebe im Euroland also will ich immer wissen was es In euro umgerechnet ist. Das lege ich in der Datei api.php unter der Variable

```
$convertin = "EUR";
```

fest. Was es für Währungen gibt kannst Du Dir in der Datei currencies.json anschauen.

Wenn Du zum Beispiel alles in Dollar berechnen lassen willst wäre dann die Änderung:
```
$convertin = "USD";
``````

## API Dokumentation
https://apilayer.com/marketplace/currency_data-api#documentation-tab

Wenn Du das Script benutzen möchtest musst du Dich auf apilayer.com registrieren.
Wenn Du dann dort einen Apikey erhälst tragst du diesen in die Datei currencies/apikey.json ein so wie in der Beispieldatei _apikey.json angezeigt.

Du hast dort einen Freeplan von 10 Abfragen am Tag desswegen frag ich beim ersten Aufruf ab ob es heute schon eine Abfrage gab wenn es die gab gebe ich einfach das schon erstellte JSON zurück ansonsten erstelle ich es per curl speichere es und geb es zurück. Wenn man offline sein sollte wird der Stand zurückgegeben der zuletzt abgerufen wurde. Das sollte erstmal reichen da es ja nicht so viele schwankunegn pro Tag im normal Fall geben sollte so das eine Berechnung immer noch relativ genau sein sollte.
