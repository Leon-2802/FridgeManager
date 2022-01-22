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
    var selectCategory = document.getElementById("category");
    var selectName = document.getElementById("name");
    var selectDate = document.getElementById("ablaufdatum");
    var addNotes = document.getElementById("notes");
    var submit = document.getElementById("submit");
    var currentDate = document.getElementById("currentDate");
    var _url = "http://127.0.0.1:3000/";
    var portSingle = "item";
    var portAll = "items";
    var itemsFromServer = [];
    if (window.location.href.indexOf("?index") > -1) {
        var params = new URLSearchParams(window.location.search);
        var index = "?index=" + params.get("index");
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
    function onSubmit(event) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (selectCategory.value == "" || selectName.value == "" || selectDate.value == "")
                            return [2 /*return*/];
                        event.preventDefault();
                        _a = {};
                        return [4 /*yield*/, setIndex()];
                    case 1:
                        item = (_a.index = _b.sent(),
                            _a.category = returnCategory(selectCategory.value),
                            _a.name = selectName.value,
                            _a.expiryDate = setDateFormat(selectDate.value),
                            _a.submitDate = new Date().toLocaleDateString(),
                            _a.notes = addNotes.value,
                            _a);
                        itemsFromServer.push(item);
                        console.log(itemsFromServer);
                        sendJSONStringWithPost(_url + portSingle, JSON.stringify(item));
                        setTimeout(function () {
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
            var response, text, result, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(_url + portAll, {
                            method: "GET"
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        itemsFromServer = JSON.parse(text);
                        console.log(itemsFromServer);
                        result = 0;
                        for (i = 0; i < itemsFromServer.length; i++) {
                            if (itemsFromServer[i].index > result) {
                                result = itemsFromServer[i].index;
                            }
                        }
                        result++;
                        console.log(result);
                        return [2 /*return*/, result];
                }
            });
        });
    }
    //Bei Bearbeiten:
    function getSelectedItem(index) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = "";
                        return [4 /*yield*/, requestTextWithGet(_url + portSingle + index)];
                    case 1:
                        text = _a.sent();
                        console.log(text);
                        itemsFromServer = JSON.parse(text);
                        console.log(itemsFromServer);
                        loadIntoDOM();
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
                            expiryDate: setDateFormat(selectDate.value),
                            submitDate: itemsFromServer[0].submitDate,
                            notes: addNotes.value
                        };
                        itemsFromServer[0] = item;
                        console.log(itemsFromServer[0]);
                        index = "?index=" + itemsFromServer[0].index;
                        return [4 /*yield*/, fetch(_url + portSingle + index, {
                                method: "PATCH",
                                body: JSON.stringify(itemsFromServer[0])
                            })];
                    case 1:
                        _a.sent();
                        console.log("updated");
                        setTimeout(function () {
                            window.location.href = "index.html";
                        }, 200);
                        return [2 /*return*/];
                }
            });
        });
    }
    //Nicht-async functions:
    function setCurrentDate() {
        currentDate.innerHTML = new Date().toLocaleDateString();
    }
    function loadIntoDOM() {
        selectCategory.value = returnCategoryForEdit(itemsFromServer[0].category);
        selectName.value = itemsFromServer[0].name;
        selectDate.value = itemsFromServer[0].expiryDate;
        addNotes.value = itemsFromServer[0].notes;
    }
    function returnCategory(input) {
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
        var year = date.substring(0, 4);
        var month = date.substring(5, 7);
        var day = date.substring(8, 10);
        if (month.substring(0, 1) == "0") {
            month = month.substring(1, 2);
        }
        if (day.substring(0, 1) == "0") {
            day = day.substring(1, 2);
        }
        return day + "." + month + "." + year;
    }
    function clearInput() {
        selectCategory.value = "";
        selectName.value = "";
        selectDate.value = "";
        addNotes.value = "";
    }
})(ManageDatabase || (ManageDatabase = {}));
//# sourceMappingURL=ManageDatabase.js.map