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
var Details;
(function (Details) {
    //#region Variablen
    //HTML-Elemente f??r Item-Details
    var nameAndCategory = document.getElementById("category+name");
    var expiry = document.getElementById("expiry");
    var postDate = document.getElementById("postDate");
    var notes = document.getElementById("notes");
    var deleteBtn = document.getElementById("delete");
    var editBtn = document.getElementById("edit");
    //aktuelles Datum
    var currentDate = document.getElementById("currentDate");
    var _url = "http://127.0.0.1:3000/";
    var portSingle = "item";
    var params = new URLSearchParams(window.location.search);
    //index des Items f??r Detailansicht in URL mitgegeben
    var index = "?index=" + params.get("index");
    //Item muss in Array-Form heruntergeladen werden
    var selectedItem = [];
    //#endregion
    //#region Eventlistener f??r window-load und L??schbutton
    window.addEventListener("load", getSelectedItem);
    deleteBtn.addEventListener("click", deleteItem);
    //#endregion
    //#region Kommunikation mit Server
    function getSelectedItem(event) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        currentDate.innerHTML = "Heutiges Datum: " + new Date().toLocaleDateString();
                        text = "";
                        return [4 /*yield*/, requestTextWithGet(_url + portSingle + index)];
                    case 1:
                        text = _a.sent();
                        console.log(text);
                        selectedItem = JSON.parse(text);
                        console.log(selectedItem);
                        loadIntoDOM(selectedItem);
                        //link f??r edit-Button (Zu Seite f??r Anlegen/Bearbeiten, Index im Link zeigt dann welches Item zu bearbeiten ist):
                        editBtn.href = "addItem.html" + index;
                        return [2 /*return*/];
                }
            });
        });
    }
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
    function deleteItem(event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //L??schen mit DELETE-Method:
                    return [4 /*yield*/, fetch(_url + portSingle + index, {
                            method: "DELETE"
                        })];
                    case 1:
                        //L??schen mit DELETE-Method:
                        _a.sent();
                        console.log("deleted");
                        //Feedback im HTML:
                        nameAndCategory.innerHTML = "Gel??scht";
                        expiry.innerHTML = "Gel??scht";
                        postDate.innerHTML = "Gel??scht";
                        notes.innerHTML = "Gel??scht";
                        return [2 /*return*/];
                }
            });
        });
    }
    //#endregion
    //#region im HTML anzeigen
    function loadIntoDOM(item) {
        nameAndCategory.innerHTML = item[0].category + " " + item[0].name;
        expiry.innerHTML += new Date(item[0].expiryDate).toLocaleDateString();
        postDate.innerHTML += new Date(item[0].submitDate).toLocaleDateString();
        notes.innerHTML = item[0].notes;
    }
    //#endregion
})(Details || (Details = {}));
//# sourceMappingURL=GetDetailsFromServer.js.map