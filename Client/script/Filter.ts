namespace Filter {

    const table: HTMLTableElement = <HTMLTableElement> document.getElementById("fridge-table");
    const filterBtn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("filter-btn");
    const fliterElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>> document.getElementsByClassName("filter");
    const categoryFilter: HTMLSelectElement = <HTMLSelectElement> document.getElementById("filter-input");
    const nameFilter: HTMLInputElement = <HTMLInputElement> document.getElementById("fiter-name");
    const expired: HTMLButtonElement = <HTMLButtonElement> document.getElementById("expired");
    const expiredSoon: HTMLButtonElement = <HTMLButtonElement> document.getElementById("soon-expired");
    const submitFilter: HTMLButtonElement = <HTMLButtonElement> document.getElementById("submit-filter");

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: Date;
        submitDate: Date;
        notes: string;
    }
    interface SaveFilter {
        category: string;
        name: string;
        expired: boolean;
        soonExpired: boolean;
    }

    let filterActive: boolean = false;
    let filtered: boolean = false;
    let filterExpired: boolean = false;
    let filterSoonExpired: boolean = false;

    let itemsFromServer: Item[] = [];
    let itemsToDisplay: Item[] = [];
    let itemsPerRow: number = 0;

    //localstorage-stuff:
    let filterSettings: SaveFilter;
    let savedFilter: string;


    window.addEventListener("load", (): void => {
        getItemsFromServer();
        defineItemsPerRow();
        setTimeout( (): void => {
            loadFilterSettings();
        },          50);
    });

    filterBtn.addEventListener("click", activateFilter);

    submitFilter.addEventListener("click", (): void => {
        checkFilterCount();
    });
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

        filterItems(counter);
    }

    categoryFilter.addEventListener("click", (): void => {
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


    async function getItemsFromServer(): Promise<void> {
        let response: Response = await fetch(_url + portAll, {
            method: "GET"
        });
        let text: string = await response.text();

        itemsFromServer = JSON.parse(text);
    }

    function activateFilter(): void {

        if (filterActive == false) {
            for (let i: number = 0; i < fliterElements.length; i++) {
                fliterElements[i].style.display = "inline";
            }
            filterActive = true;
            filterBtn.innerHTML = "Filter aus";
        } 
        else {
            for (let i: number = 0; i < fliterElements.length; i++) {
                fliterElements[i].style.display = "none";
            }
            filterActive = false;
            filterBtn.innerHTML = "Filter setzen...";
            itemsToDisplay = [];
            categoryFilter.value = "default";
            nameFilter.value = "";
            resetExpired();
            resetExpiredSoon();
            submitFilter.style.border = "1px solid #fc6a60";
            if (filtered) {
                table.innerHTML = "";
                loadIntoTable(itemsFromServer);
            }
            localStorage.clear();
        }
    }


    function filterItems(counter: number): void {
        let checkCounter: number = 0;
        for (let i: number = 0; i < itemsFromServer.length; i++) {
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

            if (checkCounter == counter) 
                itemsToDisplay.push(itemsFromServer[i]);
            checkCounter = 0;
        }
        table.innerHTML = "";
        filtered = true;
        console.log(itemsFromServer);
        loadIntoTable(itemsToDisplay);

        //save in localstorage:
        storeFilterSettings(categoryFilter.value, nameFilter.value, filterExpired, filterSoonExpired);

        submitFilter.style.border = "1px solid #84db8c";
        itemsToDisplay = [];
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

    function checkIfExpired(date: Date): boolean {
        let currentDate: Date = new Date();

        let difference: number = date.getTime() - currentDate.getTime();
        difference /= (1000 * 60 * 60 * 24);

        if (difference < 0) 
            return true;
        else
            return false;
        
    }

    function checkIfSoonExpired(date: Date): boolean {
        let currentDate: Date = new Date();

        let difference: number = date.getTime() - currentDate.getTime();
        difference /= (1000 * 60 * 60 * 24);
        
        if (difference > 0 && difference < 3) 
            return true;
        else
            return false;
    }


    function loadIntoTable(items: Item[]): void {
        let newRow: HTMLTableRowElement = <HTMLTableRowElement> document.createElement("tr");
        table.appendChild(newRow);

        let itemCounter: number = 0;

        for (let i: number = 0; i < items.length; i++) {
            let eintrag: HTMLElement = document.createElement("td");
            let button: HTMLAnchorElement = <HTMLAnchorElement> document.createElement("a");
            let expiryDate: string = new Date(items[i].expiryDate).toLocaleDateString();
            button.innerHTML = items[i].category + " " + items[i].name + "<br>" + expiryDate;
            button.href = `detailedView.html?index=${items[i].index}`;
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

    //LocalStorage Functions:
    function storeFilterSettings(categoryValue: string, nameValue: string, expiredValue: boolean, soonExpiredValue: boolean): void {
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
        if (localStorage.length < 1)
            return;

        filterSettings = null;
        filterSettings = JSON.parse(localStorage.getItem("filterSettings"));

        filterActive = false;
        categoryFilter.value = filterSettings.category;
        nameFilter.value = filterSettings.name;
        filterExpired = filterSettings.expired;
        if (filterExpired)
            setExpired();
        filterSoonExpired = filterSettings.soonExpired;
        if (filterSoonExpired)
            setSoonExpired();


        activateFilter();
        checkFilterCount();
    }

}

