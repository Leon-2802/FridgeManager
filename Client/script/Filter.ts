namespace Filter {

    //#region Variablen und Interfaces

    //HTML-Elemente für Filter
    const table: HTMLTableElement = <HTMLTableElement>document.getElementById("fridge-table");
    const filterBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("filter-btn");
    const fliterElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("filter");
    const categoryFilter: HTMLSelectElement = <HTMLSelectElement>document.getElementById("filter-input");
    const nameFilter: HTMLInputElement = <HTMLInputElement>document.getElementById("fiter-name");
    const expired: HTMLButtonElement = <HTMLButtonElement>document.getElementById("expired");
    const expiredSoon: HTMLButtonElement = <HTMLButtonElement>document.getElementById("soon-expired");
    const submitFilter: HTMLButtonElement = <HTMLButtonElement>document.getElementById("submit-filter");

    //Server-Variablen
    const _url: string = "http://127.0.0.1:3000/";
    const portAll: string = "items";

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: Date;
        submitDate: Date;
        notes: string;
    }

    //interface für die Speicherung der Filter-Einstellungen im Localstorage
    interface SaveFilter {
        category: string;
        name: string;
        expired: boolean;
        soonExpired: boolean;
    }

    //Booleans für Setzen des Filters:
    let filterActive: boolean = false;
    let filtered: boolean = false;
    let filterExpired: boolean = false;
    let filterSoonExpired: boolean = false;

    //Arrays zu Speichern der Items vom Server
    let itemsFromServer: Item[] = [];
    let itemsToDisplay: Item[] = [];

    let itemsPerRow: number = 0;

    //localstorage-stuff:
    let filterSettings: SaveFilter;
    let savedFilter: string;
    //#endregion

    //#region Eventlistener bei Laden der Seite und für das An-/Ausschalten des Filters
    window.addEventListener("load", (): void => {
        getItemsFromServer();
        defineItemsPerRow();
        setTimeout((): void => {
            //Filtereinstellungen werden aus Localstorage, falls vorhanden, geladen: 
            //Timeout, um zu verhindern, dass über die GetItemsFormServer-Datei wieder alle Items reingeladen werden:
            loadFilterSettings();
        },         50);
    });

    filterBtn.addEventListener("click", activateFilter);
    //#endregion

    //#region Filter bestätigen
    submitFilter.addEventListener("click", (): void => {
        checkFilterCount();
    });
    //Prüft wie viele der Filter-Optionen aktiv sind:
    function checkFilterCount(): void {
        let counter: number = 0;
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
    categoryFilter.addEventListener("click", (): void => {
        //Für besseres Design-Feedback Submit-Button wieder rot machen wenn Filter-Elemente angeklickt werden
        submitFilter.style.border = "1px solid #fc6a60";
    });
    nameFilter.addEventListener("click", (): void => {
        submitFilter.style.border = "1px solid #fc6a60";
    });
    expired.addEventListener("click", (): void => {
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
    function setExpired(): void {
        filterExpired = true;
        expired.style.border = "1px solid #84db8c";
        expired.style.color = "#84db8c";
    }
    function resetExpired(): void {
        filterExpired = false;
        expired.style.border = "1px solid #fff";
        expired.style.color = "#fff";
    }

    expiredSoon.addEventListener("click", (): void => {
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
    function setSoonExpired(): void {
        filterSoonExpired = true;
        expiredSoon.style.border = "1px solid #84db8c";
        expiredSoon.style.color = "#84db8c";
    }
    function resetExpiredSoon(): void {
        filterSoonExpired = false;
        expiredSoon.style.border = "1px solid #fff";
        expiredSoon.style.color = "#fff";
    }
    //#endregion


    //#region Kommunikation mit Server + Localstorage
    async function getItemsFromServer(): Promise<void> {
        //Datenbankinhalt anfordern:
        let response: Response = await fetch(_url + portAll, {
            method: "GET"
        });
        let text: string = await response.text();

        //Array mit Items vom Server mit Daten vom Server füllen:
        itemsFromServer = JSON.parse(text);
    }
    //LocalStorage Functions:
    function storeFilterSettings(categoryValue: string, nameValue: string, expiredValue: boolean, soonExpiredValue: boolean): void {
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

    function loadFilterSettings(): void {
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
    function activateFilter(): void {
        //Filter-Div mit allen HTML-Elementen anzeigen:
        if (filterActive == false) {
            for (let i: number = 0; i < fliterElements.length; i++) {
                fliterElements[i].style.display = "inline";
            }
            filterActive = true;
            filterBtn.innerHTML = "Filter aus";
        }
        else {
            //Filter-Div wieder verstecken:
            for (let i: number = 0; i < fliterElements.length; i++) {
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


    function filterItems(counter: number): void {
        //Counter um zu cecken ob alle Bedingungen erfüllt wurden:
        let checkCounter: number = 0;
        for (let i: number = 0; i < itemsFromServer.length; i++) {
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
    function returnCategory(input: string): string {
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

    function checkIfExpired(date: Date): boolean {
        let currentDate: Date = new Date();

        let difference: number = date.getTime() - currentDate.getTime();
        difference /= (1000 * 60 * 60 * 24);

        //Wenn Differenz zwischen aktuellem Datum und Ablaufdatum kleiner als 0 = Abgelaufen
        if (difference < 0)
            return true;
        else
            return false;

    }

    function checkIfSoonExpired(date: Date): boolean {
        let currentDate: Date = new Date();

        let difference: number = date.getTime() - currentDate.getTime();
        difference /= (1000 * 60 * 60 * 24);

        //Differenz zwischen 0 und 3 Tagen = bald Abgelaufen
        if (difference > 0 && difference < 3)
            return true;
        else
            return false;
    }


    function loadIntoTable(items: Item[]): void {
        let newRow: HTMLTableRowElement = <HTMLTableRowElement>document.createElement("tr");
        table.appendChild(newRow);

        //Zum Zählen wie viel items in Reihe:
        let itemCounter: number = 0;

        for (let i: number = 0; i < items.length; i++) {
            let eintrag: HTMLElement = document.createElement("td");
            let button: HTMLAnchorElement = <HTMLAnchorElement>document.createElement("a");
            //Date muss neu Instanziert werden mit Wert aus Datenbank:
            let expiryDate: string = new Date(items[i].expiryDate).toLocaleDateString();
            //Inhalt des Item-Feldes
            button.innerHTML = items[i].category + " " + items[i].name + "<br>" + expiryDate;
            //Link zur Detailseite:
            button.href = `detailedView.html?index=${items[i].index}`;
            
            eintrag.appendChild(button);
            newRow.appendChild(eintrag);

            itemCounter++;

            //Wenn so viel Items in der Reihe wie erlaubt -> neue Reihe hinzufügen für die folgenden Items
            if (itemCounter == itemsPerRow) {
                newRow = <HTMLTableRowElement>document.createElement("tr");
                table.appendChild(newRow);
                itemCounter = 0;
            }
        }
    }
    //Wird bei Laden der Seite aufgerufen um Menge an Elementen der Tabellenreihen responsiv zu machen:
    function defineItemsPerRow(): void {
        if (window.innerWidth < 500)
            itemsPerRow = 4;
        else
            itemsPerRow = 5;
    }
    //#endregion

}

