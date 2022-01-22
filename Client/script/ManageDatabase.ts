namespace ManageDatabase {

    const selectCategory: HTMLSelectElement = <HTMLSelectElement> document.getElementById("category");
    const selectName: HTMLInputElement = <HTMLInputElement> document.getElementById("name");
    const selectDate: HTMLInputElement = <HTMLInputElement> document.getElementById("ablaufdatum");
    const addNotes: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("notes");
    const submit: HTMLButtonElement = <HTMLButtonElement> document.getElementById("submit");
    const currentDate: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("currentDate");

    const _url: string = "http://127.0.0.1:3000/";
    const portSingle: string = "item";
    const portAll: string = "items";

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: string;
        submitDate: string;
        notes: string;
    }

    let itemsFromServer: Item[] = [];

    if (window.location.href.indexOf("?index") > -1) {
        let params: URLSearchParams = new URLSearchParams(window.location.search);
        let index: string = `?index=${params.get("index")}`;

        submit.innerHTML = "Aktualisieren";
        setCurrentDate();

        getSelectedItem(index);


        submit.addEventListener("click", submitUpdate);
    } 
    else {
        setCurrentDate();
        submit.addEventListener("click", onSubmit);
    }

    //Fürs Hochladen:
    async function onSubmit(event: Event): Promise<void> {
        if (selectCategory.value == "" || selectName.value == "" || selectDate.value == "")
            return;

        event.preventDefault();

        let item: Item = {
            index: await setIndex(),
            category: returnCategory(selectCategory.value),
            name: selectName.value,
            expiryDate: setDateFormat(selectDate.value),
            submitDate: new Date().toLocaleDateString(),
            notes: addNotes.value
        };
        itemsFromServer.push(item);
        console.log(itemsFromServer);

        sendJSONStringWithPost(_url + portSingle, JSON.stringify(item));

        setTimeout(() => {
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
        let response: Response = await fetch(_url + portAll, {
                method: "GET"
            });
        let text: string = await response.text();
    
        itemsFromServer = JSON.parse(text);
        console.log(itemsFromServer);

        let result: number = 0;
        for (let i: number = 0; i < itemsFromServer.length; i++) {
            if (itemsFromServer[i].index > result) {
                result = itemsFromServer[i].index;
            }
        }
        result++;
        console.log(result);

        return result;
    }

    //Bei Bearbeiten:
    async function getSelectedItem(index: string): Promise<void> {
        let text: string = "";
        text = await requestTextWithGet(_url + portSingle + index);
        console.log(text);

        itemsFromServer = JSON.parse(text);

        console.log(itemsFromServer);
        loadIntoDOM();
    }
    async function requestTextWithGet(url: RequestInfo): Promise<string> {
        let response: Response = await fetch(url);
        let text: string = await response.text();
        return text;
    }
    async function submitUpdate(event: Event): Promise<void> {
        event.preventDefault();

        let item: Item = {
            index: itemsFromServer[0].index,
            category: returnCategory(selectCategory.value),
            name: selectName.value,
            expiryDate: setDateFormat(selectDate.value),
            submitDate: itemsFromServer[0].submitDate,
            notes: addNotes.value
        };

        itemsFromServer[0] = item;
        console.log(itemsFromServer[0]);

        let index: string = `?index=${itemsFromServer[0].index}`;

        await fetch(_url + portSingle + index, {
            method: "PATCH",
            body: JSON.stringify(itemsFromServer[0])
        }); 
        console.log("updated");

        setTimeout(() => {
            window.location.href = "index.html";
        },         200);
    }


    //Nicht-async functions:
    function setCurrentDate(): void {
        currentDate.innerHTML = new Date().toLocaleDateString();
    }

    function loadIntoDOM(): void {
        selectCategory.value = returnCategoryForEdit(itemsFromServer[0].category);
        selectName.value = itemsFromServer[0].name;
        selectDate.value = itemsFromServer[0].expiryDate;
        addNotes.value = itemsFromServer[0].notes;
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
    function returnCategoryForEdit(data: string): string {
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
    function setDateFormat(date: string): string {
        let year: string = date.substring(0, 4);
        let month: string = date.substring(5, 7);
        let day: string = date.substring(8, 10);

        if (month.substring(0, 1) == "0") {
            month = month.substring(1, 2);
        }
        if (day.substring(0, 1) == "0") {
            day = day.substring(1, 2);
        }

        return day + "." + month + "." + year;
    }

    function clearInput(): void {
        selectCategory.value = "";
        selectName.value = "";
        selectDate.value = "";
        addNotes.value = "";
    }
}