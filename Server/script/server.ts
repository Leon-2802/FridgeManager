import * as http from "http";
import * as mongo from "mongodb";

//#region Variablen für Server Connection und Item-Interface
const hostname: string = "127.0.0.1"; // localhost
const port: number = 3000;
const mongoUrl: string = "mongodb://localhost:27017"; // für lokale MongoDB
let mongoClient: mongo.MongoClient = new mongo.MongoClient(mongoUrl);

interface Item {
  index: number;
  category: string;
  name: string;
  expiryDate: string;
  submitDate: string;
  notes: string;
}
let item: Item;
//#endregion

//#region Funktion um Item in Datenbank zu finden
// tslint:disable-next-line:typedef
async function dbFind(
  // tslint:disable-next-line:no-any
  db: string, collection: string, requestObject: any, response: http.ServerResponse) {
  // tslint:disable-next-line:no-any
  let result: any = await mongoClient
    .db(db)
    .collection(collection)
    .find(requestObject)
    //Item(s) werden immer als Array ausgegeben:
    .toArray();
  // console.log(result, requestObject); // bei Fehlern zum Testen
  response.setHeader("Content-Type", "application/json");
  //Item(s) aus der Datenbank im JSON-Format zurückgegeben:
  response.write(JSON.stringify(result)); 
}
//#endregion


//#region Funktion die bei Server-Request von Client aufgerufen wird
const server: http.Server = http.createServer(
  async (request: http.IncomingMessage, response: http.ServerResponse) => {

    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*"); // bei CORS Fehler
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, UPDATE"); //Alle erlaubten Methoden

    let url: URL = new URL(request.url || "", `http://${request.headers.host}`);

    switch (url.pathname) {
      //Wenn _portSingle gewählt wurde -> nur ein Item wird angesprochen:
      case "/item": {
        await mongoClient.connect();
        switch (request.method) {
          //Einzelnes Item anfragen:
          case "GET":
            //dbFind-Funktion aus Zeile 23 aufrufen und Datenbank- und Collectionname und index mitegeben
            await dbFind(
              "fridge",
              "items",
              {
                index: Number(url.searchParams.get("index")) // von String zu Zahl konvertieren
              },
              response
            );
            break;
          //Einzelnes Item hochladen:
          case "POST":
            let jsonString: string = "";
            request.on("data", data => {
              jsonString += data;
            });
            request.on("end", async () => {
              mongoClient
                .db("fridge")
                .collection("items")
                .insertOne(JSON.parse(jsonString));
            });
            break;
          //Einzelnes Item mit entsprechendem Index löschen:
          case "DELETE":
            request.on("end", async () => {
              mongoClient
                .db("fridge")
                .collection("items")
                .deleteOne({
                  index: Number(url.searchParams.get("index"))
                });
            });
            break;
          //Einzelnes Item mit entsprechendem Index updaten -> !bei case "UPDATE" klappt es nicht, obwohl es im Header erlaubt ist, daher habe ich PATCH benutzt!
          case "PATCH":
            let jsonStringUpdate: string = "";
            request.on("data", data => {
              jsonStringUpdate += data;
              item = JSON.parse(jsonStringUpdate);
            });
            request.on("end", async () => {
              mongoClient
                .db("fridge")
                .collection("items")
                //Mit Values des mitgegeben Items aktualisieren:
                .updateOne(
                  { index: Number(url.searchParams.get("index")) },
                  { $set: { "category": item.category, "name": item.name, "expiryDate": item.expiryDate, "notes": item.notes } }
                );
            });
            break;
        }
        break;
      }
      //Wenn alle Items angesprochen werden (url + portAll)
      case "/items": {
        await mongoClient.connect();
        switch (request.method) {
          //Alle Items anfragen:
          case "GET":
            await dbFind("fridge", "items", {}, response);
            break;
          //Alle löschen:
          case "DELETE":
            request.on("end", async () => {
              mongoClient
                .db("fridge")
                .collection("items")
                .deleteMany({});
            });
            break;
        }
        break;
      }
      //Falls pathname keine der cases erfüllt:
      default:
        response.statusCode = 404;
    }
    response.end();
  }
);
//#endregion

//#region Meldung für Terminal, dass Server läuft
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
//#endregion

//Starten mit: node ./Server/script/server.js