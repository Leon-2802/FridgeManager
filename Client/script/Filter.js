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
var Filter;
(function (Filter) {
    var table = document.getElementById("fridge-table");
    var filterBtn = document.getElementById("filter-btn");
    var categoryFilter = document.getElementById("filter-input");
    var expired = document.getElementById("expired");
    var submitFilter = document.getElementById("submit-filter");
    var filterActive = false;
    var filtered = false;
    var filterExpired = false;
    var itemsFromServer = [];
    var itemsToDisplay = [];
    filterBtn.addEventListener("click", activateFilter);
    submitFilter.addEventListener("click", filterItems);
    expired.addEventListener("click", function () {
        if (filterExpired == false) {
            filterExpired = true;
            expired.style.border = "1px solid #84db8c";
            expired.style.color = "#84db8c";
        }
        else {
            filterExpired = false;
            expired.style.border = "1px solid #fff";
            expired.style.color = "#fff";
        }
    });
    function getItemsFromServer() {
        return __awaiter(this, void 0, void 0, function () {
            var response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate.innerHTML = new Date().toLocaleDateString();
                        return [4 /*yield*/, fetch(_url + portAll, {
                                method: "GET"
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        itemsFromServer = JSON.parse(text);
                        return [2 /*return*/];
                }
            });
        });
    }
    function activateFilter(event) {
        event.preventDefault();
        if (filterActive == false) {
            categoryFilter.style.display = "inline";
            expired.style.display = "inline";
            submitFilter.style.display = "inline";
            filterActive = true;
            filterBtn.innerHTML = "Filter aus";
            getItemsFromServer();
        }
        else {
            categoryFilter.style.display = "none";
            expired.style.display = "none";
            submitFilter.style.display = "none";
            filterExpired = false;
            expired.style.border = "1px solid #fff";
            expired.style.color = "#fff";
            filterActive = false;
            filterBtn.innerHTML = "Filter setzen...";
            itemsToDisplay = [];
            if (filtered) {
                table.innerHTML = "";
                loadIntoTable(itemsFromServer);
            }
        }
    }
    function filterItems() {
        for (var i = 0; i < itemsFromServer.length; i++) {
            if (itemsFromServer[i].category == returnCategory(categoryFilter.value)) {
                itemsToDisplay.push(itemsFromServer[i]);
            }
            if (filterExpired) {
                if (checkIfExpired(itemsFromServer[i].expiryDate))
                    itemsToDisplay.push(itemsFromServer[i]);
            }
        }
        table.innerHTML = "";
        filtered = true;
        loadIntoTable(itemsToDisplay);
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
    function checkIfExpired(date) {
        var currentDate = new Date().toLocaleDateString();
        var currentDateYear = parseInt(currentDate.substring(5, 9));
        var expiryYear = parseInt(date.substring(5, 9));
        console.log(currentDateYear);
        console.log(expiryYear);
        if (currentDateYear > expiryYear)
            return true;
        else
            return false;
    }
    function loadIntoTable(items) {
        var newRow = document.createElement("tr");
        table.appendChild(newRow);
        for (var i = 0; i < items.length; i++) {
            var eintrag = document.createElement("td");
            var button = document.createElement("a");
            button.innerHTML = items[i].category + " " + items[i].name + "<br>" + items[i].expiryDate;
            button.href = "detailedView.html?index=" + items[i].index;
            eintrag.appendChild(button);
            newRow.appendChild(eintrag);
        }
    }
})(Filter || (Filter = {}));
//# sourceMappingURL=Filter.js.map