"use strict";
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
var dropZone = document.querySelector(".drop-zone");
var fileInput = document.querySelector("#fileInput");
var browseBtn = document.querySelector("#browseBtn");
var bgProgress = document.querySelector(".bg-progress");
var progressPercent = document.querySelector("#progressPercent");
var progressContainer = document.querySelector(".progress-container");
var progressBar = document.querySelector(".progress-bar");
var status = document.querySelector(".status");
var sharingContainer = document.querySelector(".sharing-container");
var copyURLBtn = document.querySelector("#copyURLBtn");
var fileURL = document.querySelector("#fileURL");
var toast = document.querySelector(".toast");
var bookSearchBarBtn = document.querySelector("#bookSearchBarBtn");
var baseURL = "https://the-csv-scanner.herokuapp.com";
var uploadURL = "".concat(baseURL, "/api/files");
var bookSearchUrl = "".concat(baseURL, "/files/search/book/");
var maxAllowedSize = 100 * 1024 * 1024; //100mb
browseBtn.addEventListener("click", function () {
    fileInput.click();
});
dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    var fileName = files[0].name;
    var ext = fileName.split('.').reverse()[0];
    // console.log(ext);
    if ((files.length === 1) && (ext == "csv")) {
        if (files[0].size < maxAllowedSize && ext == "csv") {
            fileInput.files = files;
            uploadFile();
        }
        else {
            showToast("Max file size is 100MB");
        }
    }
    else if (ext != "csv") {
        showToast("please upload a csv file");
    }
    else if (files.length > 1) {
        showToast("You can't upload multiple files");
    }
    dropZone.classList.remove("dragged");
});
dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("dragged");
});
dropZone.addEventListener("dragleave", function (e) {
    dropZone.classList.remove("dragged");
});
// file input change and uploader
fileInput.addEventListener("change", function () {
    if (fileInput.files[0].size > maxAllowedSize) {
        showToast("Max file size is 100MB");
        fileInput.value = ""; // reset the input
        return;
    }
    uploadFile();
});
// sharing container listenrs
copyURLBtn.addEventListener("click", function () {
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
});
fileURL.addEventListener("click", function () {
    fileURL.select();
});
var uploadFile = function () {
    files = fileInput.files;
    var isChecked = document.getElementById("isBook").checked;
    console.log({ isChecked: isChecked });
    var formData = new FormData();
    formData.append("myfile", files[0]);
    formData.append("isBook", isChecked);
    //show the uploader
    progressContainer.style.display = "block";
    // upload file
    var xhr = new XMLHttpRequest();
    // listen for upload progress
    xhr.upload.onprogress = function (event) {
        // find the percentage of uploaded
        var percent = Math.round((100 * event.loaded) / event.total);
        progressPercent.innerText = percent;
        var scaleX = "scaleX(".concat(percent / 100, ")");
        bgProgress.style.transform = scaleX;
        progressBar.style.transform = scaleX;
    };
    // handle error
    xhr.upload.onerror = function () {
        showToast("Error in upload: ".concat(xhr.status, "."));
        fileInput.value = ""; // reset the input
    };
    // listen for response which will give the link
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onFileUploadSuccess(xhr.responseText);
        }
    };
    xhr.open("POST", uploadURL);
    xhr.send(formData);
};
var onFileUploadSuccess = function (res) {
    fileInput.value = ""; // reset the input
    status.innerText = "Uploaded";
    progressContainer.style.display = "none"; // hide the box
    var url = JSON.parse(res).file;
    sharingContainer.style.display = "block";
    fileURL.value = url;
};
var toastTimer;
// the toast function 
var showToast = function (msg) {
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2000);
};
bookSearchBarBtn.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
    var searchText;
    return __generator(this, function (_a) {
        searchText = document.querySelector("#booksearchInput").value || "";
        console.log({ len: searchText.length });
        if (searchText.length > 0) {
            getJSON(bookSearchUrl + searchText, function (err, data) {
                if (err !== null) {
                    alert('Something went wrong: ' + err);
                }
                else {
                    data = data.data;
                    var resultDiv = document.querySelector("#bookResults"), innerText = "";
                    resultDiv.style.display = "block";
                    if (data && !data.error) {
                        innerText += "<div class=\"column\" style=\"box-sizing: border-box;font-size: 12px;line-height: 15px;\">Title : ".concat(data.title, "</div>");
                        innerText += "<div class=\"column\" style=\"box-sizing: border-box;font-size: 12px;line-height: 15px;\">isbn : ".concat(data.isbn, "</div>");
                        innerText += "<div class=\"column\" style=\"box-sizing: border-box;font-size: 12px;line-height: 15px;\">description : ".concat(data.description, "</div>");
                        resultDiv.innerHTML = innerText;
                        return;
                    }
                    else {
                        innerText += "No book found";
                        resultDiv.innerHTML = innerText;
                        return;
                    }
                }
            });
        }
        else
            return [2 /*return*/];
        return [2 /*return*/];
    });
}); });
var getJSON = function (url, callback) {
    console.log({ url: url });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        }
        else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};
document.querySelector('.searchInput').addEventListener('input', function (e) {
    var foo = this.value.split("-").join("");
    if (foo.length > 0) {
        foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
    }
    this.value = foo;
});
