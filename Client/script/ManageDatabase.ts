namespace ManageDatabase {

    const selectCategory: HTMLSelectElement = <HTMLSelectElement> document.getElementById("category");
    const selectName: HTMLInputElement = <HTMLInputElement> document.getElementById("name");
    const selectDate: HTMLInputElement = <HTMLInputElement> document.getElementById("ablaufdatum");
    const addNotes: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("notes");
    const submit: HTMLButtonElement = <HTMLButtonElement> document.getElementById("submit");

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

    submit.addEventListener("click", onSubmit);

    async function onSubmit(event: Event): Promise<void> {
        if (selectCategory.value == "" || selectName.value == "" || selectDate.value == "")
            return;

        event.preventDefault();

        let item: Item = {
            index: await getItemsFromServer(),
            category: returnCategory(selectCategory.value),
            name: selectName.value,
            expiryDate: selectDate.value,
            submitDate: new Date().toLocaleDateString(),
            notes: addNotes.value
        };
        console.log(item);

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

    async function getItemsFromServer(): Promise<number> {
    
        let response: Response = await fetch(_url + portAll);
        let text: string = await response.text();
    
        itemsFromServer = JSON.parse(text);
    
        return itemsFromServer.length;
    }


    function returnCategory(input: string): string {
        switch (input) {
            case "&#129385; Fleisch":
                return "&#129385;";
            case "&#129371; Milchprodukte":
                return "&#129371;";
            case "&#129382; Gemüse":
                return "&#129382;";
            case "&#129380; Getränke":
                return "&#129380;";
            case "&#127851; Snacks":
                return "&#127851;";
            case "&#63; Sonstiges":
                return "&#63;";
            default:
                return "&#63;";
        }
    }

    function clearInput(): void {
        selectCategory.value = "";
        selectName.value = "";
        selectDate.value = "";
        addNotes.value = "";
    }
}