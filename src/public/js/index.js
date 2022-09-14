const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const toast = document.querySelector(".toast");


const bookSearchBarBtn = document.querySelector("#bookSearchBarBtn");

// const baseURL = "http://localhost:3000";
const baseURL = "https://the-csv-scanner.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;
const bookSearchUrl = `${baseURL}/files/search/book/`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb


browseBtn.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  const fileName = files[0].name;
  var ext = fileName.split('.').reverse()[0];
  // console.log(ext);
  if ((files.length === 1) && (ext == "csv")) {
    if (files[0].size < maxAllowedSize && ext == "csv") {
      fileInput.files = files;
      uploadFile();
    } else {
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

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragged");


});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");
});

// file input change and uploader
fileInput.addEventListener("change", () => {
  if (fileInput.files[0].size > maxAllowedSize) {
    showToast("Max file size is 100MB");
    fileInput.value = ""; // reset the input
    return;
  }
  uploadFile();
});

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => {
  fileURL.select();
});

const uploadFile = () => {

  files = fileInput.files;
  let isChecked = document.getElementById("isBook").checked;
  console.log({ isChecked });
  const formData = new FormData();
  formData.append("myfile", files[0]);
  formData.append("isBook", isChecked);

  //show the uploader
  progressContainer.style.display = "block";

  // upload file
  const xhr = new XMLHttpRequest();

  // listen for upload progress
  xhr.upload.onprogress = function (event) {
    // find the percentage of uploaded
    let percent = Math.round((100 * event.loaded) / event.total);
    progressPercent.innerText = percent;
    const scaleX = `scaleX(${percent / 100})`;
    bgProgress.style.transform = scaleX;
    progressBar.style.transform = scaleX;
  };

  // handle error
  xhr.upload.onerror = function () {
    showToast(`Error in upload: ${xhr.status}.`);
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

const onFileUploadSuccess = (res) => {
  fileInput.value = ""; // reset the input
  status.innerText = "Uploaded";
  progressContainer.style.display = "none"; // hide the box

  const { file: url } = JSON.parse(res);
  sharingContainer.style.display = "block";
  fileURL.value = url;
};



let toastTimer;
// the toast function 
const showToast = (msg) => {  
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};


bookSearchBarBtn.addEventListener("click", async () => {
  const searchText = document.querySelector("#booksearchInput").value || "";
  console.log({ len: searchText.length });
  if (searchText.length > 0) {
      getJSON(bookSearchUrl + searchText, (err, data)=>{
        if (err !== null) {
          alert('Something went wrong: ' + err);
        } else {
          data = data.data;
          let resultDiv = document.querySelector("#bookResults"), innerText = "";
          resultDiv.style.display = "block";
          if(data && !data.error){
            innerText+=`<div class="column" style="box-sizing: border-box;font-size: 12px;line-height: 15px;">Title : ${data.title}</div>`;
            innerText+=`<div class="column" style="box-sizing: border-box;font-size: 12px;line-height: 15px;">isbn : ${data.isbn}</div>`;
            innerText+=`<div class="column" style="box-sizing: border-box;font-size: 12px;line-height: 15px;">description : ${data.description}</div>`;
            resultDiv.innerHTML = innerText;
            return;
          }else{
            innerText+= "No book found"
            resultDiv.innerHTML = innerText;
            return;
          }
        }
      });
  }else return;
});

const getJSON = function(url, callback) {
  console.log({url});
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

document.querySelector('.searchInput').addEventListener('input', function(e) {
  var foo = this.value.split("-").join("");
  if (foo.length > 0) {
    foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
  }
  this.value = foo;
});
