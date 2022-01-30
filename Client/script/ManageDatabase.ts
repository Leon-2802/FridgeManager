namespace ManageDatabase {

    //#region Variablen und Interfaces
    //HTML-Elemtent zum Hinzufügen:
    const selectCategory: HTMLSelectElement = <HTMLSelectElement>document.getElementById("category");
    const selectName: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
    const selectDate: HTMLInputElement = <HTMLInputElement>document.getElementById("ablaufdatum");
    const addNotes: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("notes");
    const submit: HTMLButtonElement = <HTMLButtonElement>document.getElementById("submit");
    //Datum-Anzeige:
    const currentDate: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("currentDate");

    //URL vom Server:
    const _url: string = "http://127.0.0.1:3000/";
    const portSingle: string = "item";
    const portAll: string = "items";

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: Date;
        submitDate: Date;
        notes: string;
    }

    let itemsFromServer: Item[] = [];
    //#endregion

    //#region Checken ob von Homepage oder von Detailseite aufgerufen:
    if (window.location.href.indexOf("?index") > -1) {
        let params: URLSearchParams = new URLSearchParams(window.location.search);
        //Index aus URL rauslesen
        let index: string = `?index=${params.get("index")}`;

        //Button anpassen für Updaten
        submit.innerHTML = "Aktualisieren";
        //Aktuelles Datum holen und Anzeigen:
        setCurrentDate();

        //Gewünschtes Item zu Aktualisieren holen und gleich itemsFromServer setzen:
        getSelectedItem(index);

        submit.addEventListener("click", submitUpdate);
    }
    else {
        setCurrentDate();
        submit.addEventListener("click", onSubmit);
    }
    //#endregion

    //#region Fürs Hochladen:
    async function onSubmit(event: Event): Promise<void> {
        //Wenn keine Werte in required-Felder vorhanden, Funktion abbrechen
        if (selectCategory.value == "" || selectName.value == "" || selectDate.value == "")
            return;

        event.preventDefault();

        //Item aus Input-Werten erstellen:
        let item: Item = {
            index: await setIndex(), //Index muss erst berechnet werden, hängt von anderen Items ab
            category: returnCategory(selectCategory.value),
            name: selectName.value,
            expiryDate: new Date(selectDate.value),
            submitDate: new Date(),
            notes: addNotes.value
        };
        itemsFromServer.push(item);

        //Item absenden und in Datenbank speichern:
        sendJSONStringWithPost(_url + portSingle, JSON.stringify(item));

        setTimeout(() => {
            //Input-Felder leeren:
            clearInput();
        },         100);
    }

    async function sendJSONStringWithPost(url: RequestInfo, jsonString: string): Promise<void> {
        try {
            await fetch(url, {
                method: "POST",
                body: jsonString
            });
            console.log("sent to server");
        } catch {
            console.log("Server not running");
        }
    }

    async function setIndex(): Promise<number> {
        //Items vom Server holen
        let text: string = "";
        text = await requestTextWithGet(_url + portAll);

        itemsFromServer = JSON.parse(text);

        let result: number = 0;
        //Checken welcher der höchste aktuelle Index unter den items ist:
        for (let i: number = 0; i < itemsFromServer.length; i++) {
            if (itemsFromServer[i].index > result) {
                result = itemsFromServer[i].index;
            }
        }
        //Der Index des neuen Items liegt nun 1 höher und ist daher sicher nicht der gleiche wie der eines anderen Items:
        result++;
        console.log(result);
        
        return result;
    }
    //#endregion

    //#region Bei Bearbeiten:
    async function getSelectedItem(index: string): Promise<void> {
        let text: string = "";
        //Hier nur ein einzelnes Item anfragen (mit index raussuchen lassen):
        text = await requestTextWithGet(_url + portSingle + index);

        itemsFromServer = JSON.parse(text);

        loadIntoDOM();
    }
    //Funktion die die Request sendet, nutzbar für Anfragen auf einzelne, wie auf mehrere Items:
    async function requestTextWithGet(url: RequestInfo): Promise<string> {
        let response: Response = await fetch(url);
        let text: string = await response.text();
        return text;
    }

    async function submitUpdate(event: Event): Promise<void> {
        event.preventDefault();

        //Updaten mit Werten aus Input-Feldern (nicht geänderte Werte auch dabei, weil in Inputs geladen):
        let item: Item = {
            index: itemsFromServer[0].index,
            category: returnCategory(selectCategory.value),
            name: selectName.value,
            expiryDate: new Date(selectDate.value),
            submitDate: itemsFromServer[0].submitDate,
            notes: addNotes.value
        };


        itemsFromServer[0] = item;

        //index bleibt gleich:
        let index: string = `?index=${itemsFromServer[0].index}`;

        //Mit Methode PATCH absenden:
        await fetch(_url + portSingle + index, {
            method: "PATCH",
            body: JSON.stringify(itemsFromServer[0])
        });
        console.log("updated");

        //nach 0.2 s wieder zurück zur Homepage:
        setTimeout(() => {
            window.location.href = "index.html";
        },         200);
    }
    //#endregion


    //#region Nicht-async functions:
    function setCurrentDate(): void {
        currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();
    }

    function loadIntoDOM(): void {
        //Bei Aufruf von Detailseite zum Bearbeiten, Item-Werte des gewählten Items in Input-Felder laden
        selectCategory.value = returnCategoryForEdit(itemsFromServer[0].category);
        selectName.value = itemsFromServer[0].name;
        selectDate.value = setDateFormat(new Date(itemsFromServer[0].expiryDate));
        addNotes.value = itemsFromServer[0].notes;
    }

    function returnCategory(input: string): string {
        //Für Speichern in Datenbank muss value des Select-Elements zu String der jeweiligen Kategorie geändert werden:
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
    function returnCategoryForEdit(data: string): string {
        //Beim reinladen der Werte von der Datenbank zum Bearbeiten ist es genau anders herum:
        switch (data) {
            case "&#129385;":
                return "fleisch";
            case "&#129371;":
                return "milchprodukte";
            case "&#129382;":
                return "gemuese";
            case "&#129380;":
                return "getraenke";
            case "&#127851;":
                return "snack";
            case "&#63;":
                return "other";
            default:
                return "other";
        }
    }
    function setDateFormat(date: Date): string {
        //datum der Date-Klasse zu yyyy-mm-dd umformatieren:
        const offset: number = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset * 60 * 1000));
        return date.toISOString().split("T")[0];
    }

    function clearInput(): void {
        selectCategory.value = "";
        selectName.value = "";
        selectDate.value = "";
        addNotes.value = "";
    }
    //#endregion
}