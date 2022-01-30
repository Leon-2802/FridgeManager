namespace Details {

    const nameAndCategory: HTMLElement = document.getElementById("category+name");
    const expiry: HTMLElement = document.getElementById("expiry");
    const postDate: HTMLElement = document.getElementById("postDate");
    const notes: HTMLElement = document.getElementById("notes");
    const deleteBtn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("delete");
    const editBtn: HTMLAnchorElement = <HTMLAnchorElement> document.getElementById("edit");
    const currentDate: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("currentDate");

    const _url: string = "http://127.0.0.1:3000/";
    const portSingle: string = "item";

    let params: URLSearchParams = new URLSearchParams(window.location.search);
    let index: string = `?index=${params.get("index")}`;
    console.log(index);

    interface Item {
        index: number;
        category: string;
        name: string;
        expiryDate: Date;
        submitDate: Date;
        notes: string;
    }
    let selectedItem: Item[] = [];

    window.addEventListener("load", getSelectedItem);

    deleteBtn.addEventListener("click", deleteItem);


    async function getSelectedItem(event: Event): Promise<void> {
        event.preventDefault();

        currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();

        let text: string = "";
        text = await requestTextWithGet(_url + portSingle + index);
        console.log(text);

        selectedItem = JSON.parse(text);

        console.log(selectedItem);

        loadIntoDOM(selectedItem);

        //link für edit-Button:
        editBtn.href = `addItem.html${index}`;
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

        nameAndCategory.innerHTML = "Gelöscht";
        expiry.innerHTML = "Gelöscht";
        postDate.innerHTML = "Gelöscht";
        notes.innerHTML = "Gelöscht";
    }

    function loadIntoDOM(item: Item[]): void {
        nameAndCategory.innerHTML = item[0].category + " " + item[0].name;
        expiry.innerHTML += new Date(item[0].expiryDate).toLocaleDateString();
        postDate.innerHTML += new Date(item[0].submitDate).toLocaleDateString();
        notes.innerHTML = item[0].notes;
    }

}
