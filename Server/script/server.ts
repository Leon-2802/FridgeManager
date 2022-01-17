import * as http from "http";
import * as mongo from "mongodb";

const hostname: string = "127.0.0.1"; // localhost
const port: number = 3000;
const mongoUrl: string = "mongodb://localhost:27017"; // für lokale MongoDB
let mongoClient: mongo.MongoClient = new mongo.MongoClient(mongoUrl);

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
    response.setHeader("Access-Control-Allow-Origin", "GET, POST, OPTIONS, PUT, DELETE, UPDATE"); // bei CORS Fehler

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
        }
        break;
      }
      case "/items": {
        await mongoClient.connect();
        switch (request.method) {
          case "GET":
            await dbFind("fridge", "items", {}, response);
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

/* MongoDB Datenbanksystem starten (Warum eigtl auf einmal?!):
cd C:\Programme\MongoDB
zipInstall\bin\mongod.exe --dbpath c:\Programme\MongoDB\data\db */