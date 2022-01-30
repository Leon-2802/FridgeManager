namespace GetItemsFromServer {

    //#region Variablen und Interfaces
    //HTML-Elemente
    const table: HTMLTableElement = <HTMLTableElement>document.getElementById("fridge-table");
    const currentDate: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("dateSlot");

    //Server-URL
    const _url: string = "http://127.0.0.1:3000/";
    const portAll: string = "items";

    //Interface für die Items:
    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: Date;
        submitDate: Date;
        notes: string;
    }

    //Array für Items von Server
    let itemsFromServer: Item[] = [];
    let itemsPerRow: number = 0;
    //#endregion

    window.addEventListener("load", getItemsFromServer);
    //Berechnung für Responsive Menge an Elementen der Tabellenreihen:
    defineItemsPerRow();


    //#region Server-Kommunikation
    async function getItemsFromServer(event: Event): Promise<void> {
        event.preventDefault();

        //Aktuelles Datum holen und anzeigen
        currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();

        let response: Response = await fetch(_url + portAll, {
            method: "GET"
        });
        let text: string = await response.text();

        itemsFromServer = JSON.parse(text);

        loadIntoTable();
    }
    //#endregion

    //#region Laden in Tabelle
    function loadIntoTable(): void {
        let newRow: HTMLTableRowElement = <HTMLTableRowElement>document.createElement("tr");
        table.appendChild(newRow);

        let itemCounter: number = 0;

        for (let i: number = 0; i < itemsFromServer.length; i++) {
            let eintrag: HTMLElement = document.createElement("td");
            let button: HTMLAnchorElement = <HTMLAnchorElement>document.createElement("a");
            //Date muss neu Instanziert werden mit Wert aus Datenbank:
            let expiryDate: string = new Date(itemsFromServer[i].expiryDate).toLocaleDateString();
            //Inhalt des Item-Feldes
            button.innerHTML = itemsFromServer[i].category + " " + itemsFromServer[i].name + "<br>" + expiryDate;
            //Link zur Detailseite:
            button.href = `detailedView.html?index=${itemsFromServer[i].index}`;

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

    function defineItemsPerRow(): void {
        if (window.innerWidth < 500)
            itemsPerRow = 4;
        else
            itemsPerRow = 5;
    }
    //#endregion

}
