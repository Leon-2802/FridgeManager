const table: HTMLTableElement = <HTMLTableElement> document.getElementById("fridge-table");
const currentDate: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("dateSlot");

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
let itemsPerRow: number = 0;


let selectedItem: string;
console.log(selectedItem);

window.addEventListener("load", getItemsFromServer);
defineItemsPerRow();


async function getItemsFromServer(event: Event): Promise<void> {
    event.preventDefault();

    currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();

    let response: Response = await fetch(_url + portAll, {
        method: "GET"
    });
    let text: string = await response.text();

    itemsFromServer = JSON.parse(text);

    console.log(itemsFromServer);

    loadIntoTable();
}

function loadIntoTable(): void {
    let newRow: HTMLTableRowElement = <HTMLTableRowElement> document.createElement("tr");
    table.appendChild(newRow);

    let itemCounter: number = 0;

    for (let i: number = 0; i < itemsFromServer.length; i++) {
        let eintrag: HTMLElement = document.createElement("td");
        let button: HTMLAnchorElement = <HTMLAnchorElement> document.createElement("a");
        let expiryDate: string = new Date(itemsFromServer[i].expiryDate).toLocaleDateString();

        button.innerHTML = itemsFromServer[i].category + " " + itemsFromServer[i].name + "<br>" + expiryDate;
        button.href = `detailedView.html?index=${itemsFromServer[i].index}`;

        eintrag.appendChild(button);
        newRow.appendChild(eintrag);

        itemCounter++;

        if (itemCounter == itemsPerRow) {
            newRow = <HTMLTableRowElement> document.createElement("tr");
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
