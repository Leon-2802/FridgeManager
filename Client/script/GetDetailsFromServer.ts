namespace Details {

    //#region Variablen
    //HTML-Elemente für Item-Details
    const nameAndCategory: HTMLElement = document.getElementById("category+name");
    const expiry: HTMLElement = document.getElementById("expiry");
    const postDate: HTMLElement = document.getElementById("postDate");
    const notes: HTMLElement = document.getElementById("notes");
    const deleteBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("delete");
    const editBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("edit");
    //aktuelles Datum
    const currentDate: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("currentDate");

    const _url: string = "http://127.0.0.1:3000/";
    const portSingle: string = "item";

    let params: URLSearchParams = new URLSearchParams(window.location.search);
    //index des Items für Detailansicht in URL mitgegeben
    let index: string = `?index=${params.get("index")}`;

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: Date;
        submitDate: Date;
        notes: string;
    }
    //Item muss in Array-Form heruntergeladen werden
    let selectedItem: Item[] = [];
    //#endregion


    //#region Eventlistener für window-load und Löschbutton
    window.addEventListener("load", getSelectedItem);
    deleteBtn.addEventListener("click", deleteItem);
    //#endregion

    //#region Kommunikation mit Server
    async function getSelectedItem(event: Event): Promise<void> {
        event.preventDefault();

        currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();

        let text: string = "";
        text = await requestTextWithGet(_url + portSingle + index);
        console.log(text);

        selectedItem = JSON.parse(text);

        console.log(selectedItem);

        loadIntoDOM(selectedItem);

        //link für edit-Button (Zu Seite für Anlegen/Bearbeiten, Index im Link zeigt dann welches Item zu bearbeiten ist):
        editBtn.href = `addItem.html${index}`;
    }

    async function requestTextWithGet(url: RequestInfo): Promise<string> {
        let response: Response = await fetch(url);
        let text: string = await response.text();
        return text;
    }

    async function deleteItem(event: Event): Promise<void> {
        //Löschen mit DELETE-Method:
        await fetch(_url + portSingle + index, {
            method: "DELETE"
        });
        console.log("deleted");

        //Feedback im HTML:
        nameAndCategory.innerHTML = "Gelöscht";
        expiry.innerHTML = "Gelöscht";
        postDate.innerHTML = "Gelöscht";
        notes.innerHTML = "Gelöscht";
    }
    //#endregion


    //#region im HTML anzeigen
    function loadIntoDOM(item: Item[]): void {
        nameAndCategory.innerHTML = item[0].category + " " + item[0].name;
        expiry.innerHTML += new Date(item[0].expiryDate).toLocaleDateString();
        postDate.innerHTML += new Date(item[0].submitDate).toLocaleDateString();
        notes.innerHTML = item[0].notes;
    }
    //#endregion

}
