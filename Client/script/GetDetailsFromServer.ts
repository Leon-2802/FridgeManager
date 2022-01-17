namespace Details {

    const nameAndCategory: HTMLElement = document.getElementById("category+name");
    const expiry: HTMLElement = document.getElementById("expiry");
    const postDate: HTMLElement = document.getElementById("postDate");
    const notes: HTMLElement = document.getElementById("notes");
    const deleteBtn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("delete");

    const _url: string = "http://127.0.0.1:3000/";
    const portSingle: string = "item";

    let params: URLSearchParams = new URLSearchParams(window.location.search);
    let index: string = `?index=${params.get("index")}`;
    console.log(index);

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: string;
        submitDate: string;
        notes: string;
    }
    let selectedItem: Item[] = [];

    window.addEventListener("load", getSelectedItem);

    deleteBtn.addEventListener("click", deleteItem);


    async function getSelectedItem(): Promise<void> {
        let text: string = "";
        text = await requestTextWithGet(_url + portSingle + index);
        console.log(text);

        selectedItem = JSON.parse(text);

        console.log(selectedItem);

        loadIntoDOM(selectedItem);
    }

    async function requestTextWithGet(url: RequestInfo): Promise<string> {
        let response: Response = await fetch(url);
        let text: string = await response.text();
        return text;
    }

    async function deleteItem(event: Event): Promise<void> {
        await fetch(_url + portSingle + index, {
            method: "DELETE"
        });
        console.log("deleted");
    }

    function loadIntoDOM(item: Item[]): void {
        nameAndCategory.innerHTML = item[0].category + " " + item[0].name;
        expiry.innerHTML += item[0].expiryDate;
        postDate.innerHTML += item[0].submitDate;
        notes.innerHTML = item[0].notes;
    }

}
