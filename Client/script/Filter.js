var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Filter;
(function (Filter) {
    //#region Variablen und Interfaces
    //HTML-Elemente für Filter
    var table = document.getElementById("fridge-table");
    var filterBtn = document.getElementById("filter-btn");
    var fliterElements = document.getElementsByClassName("filter");
    var categoryFilter = document.getElementById("filter-input");
    var nameFilter = document.getElementById("fiter-name");
    var expired = document.getElementById("expired");
    var expiredSoon = document.getElementById("soon-expired");
    var submitFilter = document.getElementById("submit-filter");
    //Server-Variablen
    var _url = "http://127.0.0.1:3000/";
    var portAll = "items";
    //Booleans für Setzen des Filters:
    var filterActive = false;
    var filtered = false;
    var filterExpired = false;
    var filterSoonExpired = false;
    //Arrays zu Speichern der Items vom Server
    var itemsFromServer = [];
    var itemsToDisplay = [];
    var itemsPerRow = 0;
    //localstorage-stuff:
    var filterSettings;
    var savedFilter;
    //#endregion
    //#region Eventlistener bei Laden der Seite und für das An-/Ausschalten des Filters
    window.addEventListener("load", function () {
        getItemsFromServer();
        defineItemsPerRow();
        setTimeout(function () {
            //Filtereinstellungen werden aus Localstorage, falls vorhanden, geladen: 
            //Timeout, um zu verhindern, dass über die GetItemsFormServer-Datei wieder alle Items reingeladen werden:
            loadFilterSettings();
        }, 50);
    });
    filterBtn.addEventListener("click", activateFilter);
    //#endregion
    //#region Filter bestätigen
    submitFilter.addEventListener("click", function () {
        checkFilterCount();
    });
    //Prüft wie viele der Filter-Optionen aktiv sind:
    function checkFilterCount() {
        var counter = 0;
        if (categoryFilter.value != "default")
            counter++;
        if (nameFilter.value != "")
            counter++;
        if (filterExpired)
            counter++;
        if (filterSoonExpired)
            counter++;
        //Filter-Funktion aufrufen um nur die Items auszuwählen die gefordert sind:
        filterItems(counter);
    }
    //#endregion
    //#region EventListener für Filter-Einstellungen
    categoryFilter.addEventListener("click", function () {
        //Für besseres Design-Feedback Submit-Button wieder rot machen wenn Filter-Elemente angeklickt werden
        submitFilter.style.border = "1px solid #fc6a60";
    });
    nameFilter.addEventListener("click", function () {
        submitFilter.style.border = "1px solid #fc6a60";
    });
    expired.addEventListener("click", function () {
        if (filterExpired == false) {
            setExpired();
            submitFilter.style.border = "1px solid #fc6a60";
        }
        else {
            resetExpired();
            submitFilter.style.border = "1px solid #fc6a60";
        }
    });
    //Boolean entsprechend Setzen und Design auf Status der Filter-Option anpassen:
    function setExpired() {
        filterExpired = true;
        expired.style.border = "1px solid #84db8c";
        expired.style.color = "#84db8c";
    }
    function resetExpired() {
        filterExpired = false;
        expired.style.border = "1px solid #fff";
        expired.style.color = "#fff";
    }
    expiredSoon.addEventListener("click", function () {
        if (filterSoonExpired == false) {
            setSoonExpired();
            submitFilter.style.border = "1px solid #fc6a60";
        }
        else {
            resetExpiredSoon();
            submitFilter.style.border = "1px solid #fc6a60";
        }
    });
    //Boolean entsprechend Setzen und Design auf Status der Filter-Option anpassen:
    function setSoonExpired() {
        filterSoonExpired = true;
        expiredSoon.style.border = "1px solid #84db8c";
        expiredSoon.style.color = "#84db8c";
    }
    function resetExpiredSoon() {
        filterSoonExpired = false;
        expiredSoon.style.border = "1px solid #fff";
        expiredSoon.style.color = "#fff";
    }
    //#endregion
    //#region Kommunikation mit Server + Localstorage
    function getItemsFromServer() {
        return __awaiter(this, void 0, void 0, function () {
            var response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(_url + portAll, {
                            method: "GET"
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        //Array mit Items vom Server mit Daten vom Server füllen:
                        itemsFromServer = JSON.parse(text);
                        return [2 /*return*/];
                }
            });
        });
    }
    //LocalStorage Functions:
    function storeFilterSettings(categoryValue, nameValue, expiredValue, soonExpiredValue) {
        //Speichert den Inhalt der Kategorie- und Name-Filteroption und ob expired und soonExpired ausgewählt wurden im LocalStorage:
        filterSettings = {
            category: categoryValue,
            name: nameValue,
            expired: expiredValue,
            soonExpired: soonExpiredValue
        };
        savedFilter = JSON.stringify(filterSettings);
        localStorage.setItem("filterSettings", savedFilter);
    }
    function loadFilterSettings() {
        //Holt die gespeicherten Filtereinstellungen aus dem Localstorage...
        if (localStorage.length < 1)
            return;
        filterSettings = null;
        filterSettings = JSON.parse(localStorage.getItem("filterSettings"));
        filterActive = false;
        //...und setzt die Werte der Filter-HTML-Elemente entsprechend:
        categoryFilter.value = filterSettings.category;
        nameFilter.value = filterSettings.name;
        filterExpired = filterSettings.expired;
        if (filterExpired)
            setExpired();
        filterSoonExpired = filterSettings.soonExpired;
        if (filterSoonExpired)
            setSoonExpired();
        //Filter wird automatisch aktivert und bestätigt -> Items werden gefiltert:
        activateFilter();
        checkFilterCount();
    }
    //#endregion
    //#region Filter-Interaktion:
    function activateFilter() {
        //Filter-Div mit allen HTML-Elementen anzeigen:
        if (filterActive == false) {
            for (var i = 0; i < fliterElements.length; i++) {
                fliterElements[i].style.display = "inline";
            }
            filterActive = true;
            filterBtn.innerHTML = "Filter aus";
        }
        else {
            //Filter-Div wieder verstecken:
            for (var i = 0; i < fliterElements.length; i++) {
                fliterElements[i].style.display = "none";
            }
            //Alle Booleans auf initialen Wert setzen, Design zurücksetzen, Array für Items zum Anzeigen und Localstorage leeren:
            filterActive = false;
            filterBtn.innerHTML = "Filter setzen...";
            itemsToDisplay = [];
            categoryFilter.value = "default";
            nameFilter.value = "";
            resetExpired();
            resetExpiredSoon();
            submitFilter.style.border = "1px solid #fc6a60";
            //Wenn Items gefiltert wurden, Tabelle leeren und wieder alle Items die in der Collection liegen reinladen.
            if (filtered) {
                table.innerHTML = "";
                loadIntoTable(itemsFromServer);
            }
            localStorage.clear();
        }
    }
    function filterItems(counter) {
        //Counter um zu cecken ob alle Bedingungen erfüllt wurden:
        var checkCounter = 0;
        for (var i = 0; i < itemsFromServer.length; i++) {
            //Jedes if-Statement prüft ob die jeweilige Filteroption ausgewählt ist, und wenn ja wird der Wert des 
            //Items an der Stelle i im Array mit allen Items aus der Collection verglichen:
            if (categoryFilter.value != "default" && itemsFromServer[i].category == returnCategory(categoryFilter.value))
                checkCounter++;
            if (nameFilter.value != "" && itemsFromServer[i].name == nameFilter.value)
                checkCounter++;
            if (filterExpired) {
                if (checkIfExpired(new Date(itemsFromServer[i].expiryDate)))
                    checkCounter++;
            }
            if (filterSoonExpired) {
                if (checkIfSoonExpired(new Date(itemsFromServer[i].expiryDate)))
                    checkCounter++;
            }
            //Wenn alle Bedingungen erfüllt wurden wird das Item in das Array gepusht wo alle Items liegen die nach dem Filtern angezeigt werden:
            if (checkCounter == counter)
                itemsToDisplay.push(itemsFromServer[i]);
            checkCounter = 0;
        }
        table.innerHTML = "";
        filtered = true;
        loadIntoTable(itemsToDisplay);
        //save in localstorage:
        storeFilterSettings(categoryFilter.value, nameFilter.value, filterExpired, filterSoonExpired);
        //Submit-button grün färben für Feedback und Array leeren für die nächste Filtet-Anfrage
        submitFilter.style.border = "1px solid #84db8c";
        itemsToDisplay = [];
    }
    //#endregion
    //#region Funktionen zum Checken welche Items gefiltert werden und hochladen in Tabelle
    function returnCategory(input) {
        //kategorie-String zurückgeben, abhängig von Value des Feldes im Filter
        switch (input) {
            case "fleisch":
                return "&#129385;";
            case "milchprodukte":
                return "&#129371;";
            case "gemuese":
                return "&#129382;";
            case "getraenke":
                return "&#129380;";
            case "snack":
                return "&#127851;";
            case "other":
                return "&#63;";
            default:
                return "&#63;";
        }
    }
    function checkIfExpired(date) {
        var currentDate = new Date();
        var difference = date.getTime() - currentDate.getTime();
        difference /= (1000 * 60 * 60 * 24);
        //Wenn Differenz zwischen aktuellem Datum und Ablaufdatum kleiner als 0 = Abgelaufen
        if (difference < 0)
            return true;
        else
            return false;
    }
    function checkIfSoonExpired(date) {
        var currentDate = new Date();
        var difference = date.getTime() - currentDate.getTime();
        difference /= (1000 * 60 * 60 * 24);
        //Differenz zwischen 0 und 3 Tagen = bald Abgelaufen
        if (difference > 0 && difference < 3)
            return true;
        else
            return false;
    }
    function loadIntoTable(items) {
        var newRow = document.createElement("tr");
        table.appendChild(newRow);
        //Zum Zählen wie viel items in Reihe:
        var itemCounter = 0;
        for (var i = 0; i < items.length; i++) {
            var eintrag = document.createElement("td");
            var button = document.createElement("a");
            //Date muss neu Instanziert werden mit Wert aus Datenbank:
            var expiryDate = new Date(items[i].expiryDate).toLocaleDateString();
            //Inhalt des Item-Feldes
            button.innerHTML = items[i].category + " " + items[i].name + "<br>" + expiryDate;
            //Link zur Detailseite:
            button.href = "detailedView.html?index=" + items[i].index;
            eintrag.appendChild(button);
            newRow.appendChild(eintrag);
            itemCounter++;
            //Wenn so viel Items in der Reihe wie erlaubt -> neue Reihe hinzufügen für die folgenden Items
            if (itemCounter == itemsPerRow) {
                newRow = document.createElement("tr");
                table.appendChild(newRow);
                itemCounter = 0;
            }
        }
    }
    //Wird bei Laden der Seite aufgerufen um Menge an Elementen der Tabellenreihen responsiv zu machen:
    function defineItemsPerRow() {
        if (window.innerWidth < 500)
            itemsPerRow = 4;
        else
            itemsPerRow = 5;
    }
    //#endregion
})(Filter || (Filter = {}));
//# sourceMappingURL=Filter.js.map