namespace Filter {

    const table: HTMLTableElement = <HTMLTableElement> document.getElementById("fridge-table");
    const filterBtn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("filter-btn");
    const categoryFilter: HTMLSelectElement = <HTMLSelectElement> document.getElementById("filter-input");
    const expired: HTMLButtonElement = <HTMLButtonElement> document.getElementById("expired");
    const submitFilter: HTMLButtonElement = <HTMLButtonElement> document.getElementById("submit-filter");

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: string;
        submitDate: string;
        notes: string;
    }

    let filterActive: boolean = false;
    let filtered: boolean = false;
    let filterExpired: boolean = false;

    let itemsFromServer: Item[] = [];
    let itemsToDisplay: Item[] = [];


    filterBtn.addEventListener("click", activateFilter);
    submitFilter.addEventListener("click", filterItems);
    expired.addEventListener("click", (): void => {
        if (filterExpired == false) {
            filterExpired = true;
            expired.style.border = "1px solid #84db8c";
            expired.style.color = "#84db8c";
        }
        else {
            filterExpired = false;
            expired.style.border = "1px solid #fff";
            expired.style.color = "#fff";
        }
    });


    async function getItemsFromServer(): Promise<void> {
        currentDate.innerHTML = new Date().toLocaleDateString();

        let response: Response = await fetch(_url + portAll, {
            method: "GET"
        });
        let text: string = await response.text();

        itemsFromServer = JSON.parse(text);
    }
    function activateFilter(event: Event): void {
        event.preventDefault();

        if (filterActive == false) {
            categoryFilter.style.display = "inline";
            expired.style.display = "inline";
            submitFilter.style.display = "inline";
            filterActive = true;
            filterBtn.innerHTML = "Filter aus";
            getItemsFromServer();
        } 
        else {
            categoryFilter.style.display = "none";
            expired.style.display = "none";
            submitFilter.style.display = "none";
            filterExpired = false;
            expired.style.border = "1px solid #fff";
            expired.style.color = "#fff";
            filterActive = false;
            filterBtn.innerHTML = "Filter setzen...";
            itemsToDisplay = [];
            if (filtered) {
                table.innerHTML = "";
                loadIntoTable(itemsFromServer);
            }
        }
    }

    function filterItems(): void {
        for (let i: number = 0; i < itemsFromServer.length; i++) {
            if (itemsFromServer[i].category == returnCategory(categoryFilter.value)) {
                itemsToDisplay.push(itemsFromServer[i]);
            }
            if (filterExpired) {
                if (checkIfExpired(itemsFromServer[i].expiryDate)) 
                    itemsToDisplay.push(itemsFromServer[i]);
            }
        }
        table.innerHTML = "";
        filtered = true;
        loadIntoTable(itemsToDisplay);
    }
    function returnCategory(input: string): string {
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
    function checkIfExpired(date: string): boolean {
        let currentDate: string = new Date().toLocaleDateString();

        let currentDateYear: number = parseInt(currentDate.substring(5, 9));
        let expiryYear: number = parseInt(date.substring(5, 9));
        console.log(currentDateYear);
        console.log(expiryYear);
        if (currentDateYear > expiryYear)
            return true;
        else 
            return false;
    }

    function loadIntoTable(items: Item[]): void {
        let newRow: HTMLTableRowElement = <HTMLTableRowElement> document.createElement("tr");
        table.appendChild(newRow);
        for (let i: number = 0; i < items.length; i++) {
            let eintrag: HTMLElement = document.createElement("td");
            let button: HTMLAnchorElement = <HTMLAnchorElement> document.createElement("a");
            button.innerHTML = items[i].category + " " + items[i].name + "<br>" + items[i].expiryDate;
            button.href = `detailedView.html?index=${items[i].index}`;
            eintrag.appendChild(button);
            newRow.appendChild(eintrag);
        }
    }

}

