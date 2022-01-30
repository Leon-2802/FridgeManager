var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ManageDatabase;
(function (ManageDatabase) {
    //#region Variablen und Interfaces
    //HTML-Elemtent zum Hinzufügen:
    var selectCategory = document.getElementById("category");
    var selectName = document.getElementById("name");
    var selectDate = document.getElementById("ablaufdatum");
    var addNotes = document.getElementById("notes");
    var submit = document.getElementById("submit");
    //Datum-Anzeige:
    var currentDate = document.getElementById("currentDate");
    //URL vom Server:
    var _url = "http://127.0.0.1:3000/";
    var portSingle = "item";
    var portAll = "items";
    var itemsFromServer = [];
    //#endregion
    //#region Checken ob von Homepage oder von Detailseite aufgerufen:
    if (window.location.href.indexOf("?index") > -1) {
        var params = new URLSearchParams(window.location.search);
        //Index aus URL rauslesen
        var index = "?index=" + params.get("index");
        //Button anpassen für Updaten
        submit.innerHTML = "Aktualisieren";
        //Aktuelles Datum holen und Anzeigen:
        setCurrentDate();
        //Gewünschtes Item zu Aktualisieren holen und gleich itemsFromServer setzen:
        getSelectedItem(index);
        submit.addEventListener("click", submitUpdate);
    }
    else {
        setCurrentDate();
        submit.addEventListener("click", onSubmit);
    }
    //#endregion
    //#region Fürs Hochladen:
    function onSubmit(event) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //Wenn keine Werte in required-Felder vorhanden, Funktion abbrechen
                        if (selectCategory.value == "" || selectName.value == "" || selectDate.value == "")
                            return [2 /*return*/];
                        event.preventDefault();
                        _a = {};
                        return [4 /*yield*/, setIndex()];
                    case 1:
                        item = (_a.index = _b.sent(),
                            _a.category = returnCategory(selectCategory.value),
                            _a.name = selectName.value,
                            _a.expiryDate = new Date(selectDate.value),
                            _a.submitDate = new Date(),
                            _a.notes = addNotes.value,
                            _a);
                        itemsFromServer.push(item);
                        //Item absenden und in Datenbank speichern:
                        sendJSONStringWithPost(_url + portSingle, JSON.stringify(item));
                        setTimeout(function () {
                            //Input-Felder leeren:
                            clearInput();
                        }, 100);
                        return [2 /*return*/];
                }
            });
        });
    }
    function sendJSONStringWithPost(url, jsonString) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch(url, {
                                method: "POST",
                                body: jsonString
                            })];
                    case 1:
                        _b.sent();
                        console.log("sent to server");
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        console.log("Server not running");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function setIndex() {
        return __awaiter(this, void 0, void 0, function () {
            var text, result, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = "";
                        return [4 /*yield*/, requestTextWithGet(_url + portAll)];
                    case 1:
                        text = _a.sent();
                        itemsFromServer = JSON.parse(text);
                        result = 0;
                        //Checken welcher der höchste aktuelle Index unter den items ist:
                        for (i = 0; i < itemsFromServer.length; i++) {
                            if (itemsFromServer[i].index > result) {
                                result = itemsFromServer[i].index;
                            }
                        }
                        //Der Index des neuen Items liegt nun 1 höher und ist daher sicher nicht der gleiche wie der eines anderen Items:
                        result++;
                        console.log(result);
                        return [2 /*return*/, result];
                }
            });
        });
    }
    //#endregion
    //#region Bei Bearbeiten:
    function getSelectedItem(index) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = "";
                        return [4 /*yield*/, requestTextWithGet(_url + portSingle + index)];
                    case 1:
                        //Hier nur ein einzelnes Item anfragen (mit index raussuchen lassen):
                        text = _a.sent();
                        itemsFromServer = JSON.parse(text);
                        loadIntoDOM();
                        return [2 /*return*/];
                }
            });
        });
    }
    //Funktion die die Request sendet, nutzbar für Anfragen auf einzelne, wie auf mehrere Items:
    function requestTextWithGet(url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        return [2 /*return*/, text];
                }
            });
        });
    }
    function submitUpdate(event) {
        return __awaiter(this, void 0, void 0, function () {
            var item, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        item = {
                            index: itemsFromServer[0].index,
                            category: returnCategory(selectCategory.value),
                            name: selectName.value,
                            expiryDate: new Date(selectDate.value),
                            submitDate: itemsFromServer[0].submitDate,
                            notes: addNotes.value
                        };
                        itemsFromServer[0] = item;
                        index = "?index=" + itemsFromServer[0].index;
                        //Mit Methode PATCH absenden:
                        return [4 /*yield*/, fetch(_url + portSingle + index, {
                                method: "PATCH",
                                body: JSON.stringify(itemsFromServer[0])
                            })];
                    case 1:
                        //Mit Methode PATCH absenden:
                        _a.sent();
                        console.log("updated");
                        //nach 0.2 s wieder zurück zur Homepage:
                        setTimeout(function () {
                            window.location.href = "index.html";
                        }, 200);
                        return [2 /*return*/];
                }
            });
        });
    }
    //#endregion
    //#region Nicht-async functions:
    function setCurrentDate() {
        currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();
    }
    function loadIntoDOM() {
        //Bei Aufruf von Detailseite zum Bearbeiten, Item-Werte des gewählten Items in Input-Felder laden
        selectCategory.value = returnCategoryForEdit(itemsFromServer[0].category);
        selectName.value = itemsFromServer[0].name;
        selectDate.value = setDateFormat(new Date(itemsFromServer[0].expiryDate));
        addNotes.value = itemsFromServer[0].notes;
    }
    function returnCategory(input) {
        //Für Speichern in Datenbank muss value des Select-Elements zu String der jeweiligen Kategorie geändert werden:
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
    function returnCategoryForEdit(data) {
        //Beim reinladen der Werte von der Datenbank zum Bearbeiten ist es genau anders herum:
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
    function setDateFormat(date) {
        //datum der Date-Klasse zu yyyy-mm-dd umformatieren:
        var offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset * 60 * 1000));
        return date.toISOString().split("T")[0];
    }
    function clearInput() {
        selectCategory.value = "";
        selectName.value = "";
        selectDate.value = "";
        addNotes.value = "";
    }
    //#endregion
})(ManageDatabase || (ManageDatabase = {}));
//# sourceMappingURL=ManageDatabase.js.map