import * as http from "http";
import * as mongo from "mongodb";

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

// tslint:disable-next-line:typedef
async function dbFind (
    // tslint:disable-next-line:no-any
    db: string, collection: string, requestObject: any, response: http.ServerResponse) {
  // tslint:disable-next-line:no-any
  let result: any = await mongoClient
    .db(db)
    .collection(collection)
    .find(requestObject)
    .toArray();
  // console.log(result, requestObject); // bei Fehlern zum Testen
  response.setHeader("Content-Type", "application/json");
  response.write(JSON.stringify(result));
}

const server: http.Server = http.createServer(
  async (request: http.IncomingMessage, response: http.ServerResponse) => {

    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*"); // bei CORS Fehler
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, UPDATE");
    response.setHeader("Access-Control-Allow-Headers", "X_Token, Content-Type");

    let url: URL = new URL(request.url || "", `http://${request.headers.host}`);

    switch (url.pathname) {
      case "/item": {
        await mongoClient.connect();
        switch (request.method) {
          case "GET":
            await dbFind(
              "fridge",
              "items",
              {
                index: Number(url.searchParams.get("index")) // von String zu Zahl konvertieren
              },
              response
            );
            break;
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
                .updateOne(
                  {index: Number(url.searchParams.get("index"))},         
                  {$set: {"category": item.category, "name": item.name, "expiryDate": item.expiryDate, "notes": item.notes}}
                );
            });
            break;
        }
        break;
      }
      case "/items": {
        await mongoClient.connect();
        switch (request.method) {
          case "GET":
            await dbFind("fridge", "items", {}, response);
            break;
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
      default:
        response.statusCode = 404;
    }
    response.end();
  }
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//Starten mit: node ./Server/script/server.js

/* MongoDB Datenbanksystem starten (bei zipInstall):
cd C:\Programme\MongoDB 
zipInstall\bin\mongod.exe --dbpath c:\Programme\MongoDB\data\db*/