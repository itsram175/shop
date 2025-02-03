let imageArray = [];
let finalImageArray = [];
let removableImages = [];


function gotoFeature(ref) {
    resetIcons();
    hideAllSections();
    ref.classList.add('active');
    getId('right').children[parseInt(ref.value) - 1].classList.remove('hide');
}

function resetIcons() {
    let menuItems = getId('menuItems');
    for (let i = 0; i < menuItems.children.length; i++) {
        menuItems.children[i].classList.remove('active');
    }
}

function getId(element) {
    return document.getElementById(element);
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    resetWindow();

    const files = event.target.files;
    const photos = document.getElementById("photos");

    // Clear previous images
    photos.innerHTML = "";
    imageArray = [];
    finalImageArray = [];
    removableImages = [];
    // Loop through each selected file
    for (let file of files) {
        if (file.type.startsWith("image/")) { // Ensure it's an image
            const reader = new FileReader();

            reader.onload = function (e) {
                imageArray.push(e.target.result);
                const img = document.createElement("img");
                img.setAttribute("onclick", "addImage(this)");
                img.src = e.target.result;
                photos.appendChild(img);
            };

            reader.readAsDataURL(file); // Convert file to base64 URL
        }
    }

});

function imageFit(ref) {
    if (imageArray != 0) {
        if (ref.checked) {
            getId('preview').classList.add('fit');
            document.body.classList.add('fit');
        } else {
            getId('preview').classList.remove('fit');
            document.body.classList.remove('fit');
        }
    } else {
        alert("Please Upload Images!");
        getId('fitCheckBox').checked = false;
    }
}

function fillImagesPreview(inputArray) {
    let pages = inputArray.length / 6;
    let remaining = inputArray.length % 6;

    let preview = getId('preview');
    preview.innerHTML = "";

    let Heading = document.createElement('h3');
    Heading.innerText = "Preview";

    preview.appendChild(Heading);

    if (inputArray.length <= 6) {
        let printView = document.createElement('div');
        let printViewContent = document.createElement('div');

        printView.classList.add('printView');
        printViewContent.classList.add('printViewContent');

        for (let i = 0; i < inputArray.length; i++) {
            let image = document.createElement("img");
            image.setAttribute('onclick', 'removeImage(this)');
            image.src = inputArray[i];
            printViewContent.appendChild(image);
        }

        printView.appendChild(printViewContent)
        preview.appendChild(printView);

        let Price = 0;
        if (inputArray.length > 3) {
            Price = 20;
        } else {
            Price = inputArray.length * 5;
        }

        getId('priceLable').innerText = "Total Price : " + Price + "/-";
        getId('pageLable').innerText = "Total Pages : " + 1;
        getId('picturesLable').innerText = "Total Pictures : " + inputArray.length;
    } else {

        if (remaining == 0) {
            pages = pages;
        } else {
            pages += 1;
        }

        pages = parseInt(pages);



        for (let i = 0; i < pages; i++) {
            let page = document.createElement('div');
            let pageContent = document.createElement('div');

            page.classList.add('printView');
            pageContent.classList.add('printViewContent');

            page.appendChild(pageContent);

            let start = i * 6;
            let end = start + 6;

            for (let j = start; j < end; j++) {
                if (inputArray[j] == undefined) {

                } else {
                    let image = document.createElement('img');
                    image.setAttribute('onclick', 'removeImage(this)');
                    image.src = inputArray[j];
                    pageContent.appendChild(image);
                }
            }
            preview.appendChild(page);
        }

        let Price = 0;
        if (remaining == 0) {
            Price = pages * 20;
        } else {
            Price = (pages - 1) * 20;
            if (remaining == 1) {
                Price += 5;
            } else if (remaining == 2) {
                Price += 10;
            } else if (remaining == 3) {
                Price += 15;
            } else if (remaining > 3) {
                Price += 20;
            } else {
                Price = Price;
            }
        }


        getId('priceLable').innerText = "Total Price : " + Price + "/-";
        getId('pageLable').innerText = "Total Pages : " + pages;
        getId('picturesLable').innerText = "Total Pictures : " + inputArray.length;
    }

    finalImageArray = inputArray;
    highliteImages();
}

function viewPreview(ref) {
    if (imageArray.length != 0) {
        // getId('3_2').classList.remove('active');
        // getId('2_3').classList.remove('active');
        ref.classList.add('active');
        fillImagesPreview(imageArray);
    } else {
        alert("Please Upload Images First");
    }
}

function gotoprint() {
    if (finalImageArray.length != 0) {
        document.body.classList.add('final');
        getId('left').classList.add('hide');
        getId('right').classList.add('hide');
    } else {
        alert("Please Upload Images First");
    }

    for (let i = 0; i < finalImageArray.length; i++) {
        let image = document.createElement('img');
        image.src = finalImageArray[i];
        document.body.appendChild(image);
    }

    window.print();
}

function removeImage(ref) {
    finalImageArray = imageArray;
    let indexToRemove = finalImageArray.indexOf(ref.src);
    removableImages.push(indexToRemove);
    finalImageArray = finalImageArray.filter((_, index) => !removableImages.includes(index));
    fillImagesPreview(finalImageArray);
}

function addImage(ref) {
    let imageToAdd = ref.src;
    if (finalImageArray.includes(imageToAdd)) {
        alert("Image already Selected");
    } else {
        finalImageArray = imageArray;
        let indexToRemove = finalImageArray.indexOf(imageToAdd);
        removableImages = removableImages.filter(num => num !== indexToRemove);
        finalImageArray = finalImageArray.filter((_, index) => !removableImages.includes(index));
        fillImagesPreview(finalImageArray);
    }
}

function highliteImages() {
    let photos = getId('photos');
    for (let i = 0; i < photos.children.length; i++) {
        if (finalImageArray.includes(photos.children[i].src)) {
            photos.children[i].classList.add('selected');
        } else {
            photos.children[i].classList.remove('selected');
        }
    }
}

function resetWindow() {
    let preview = getId('preview');
    preview.innerHTML = "";

    let h3 = document.createElement('h3');
    let printView = document.createElement('div');
    let printViewContent = document.createElement('div');

    h3.textContent = "Preview";
    printView.classList.add('printView');
    printViewContent.classList.add('printViewContent');

    printView.appendChild(printViewContent);
    preview.appendChild(h3);
    preview.appendChild(printView);

    getId('2_3').classList.remove('active');

    getId('priceLable').innerText = "Total Price : ";
    getId('pageLable').innerText = "Total Pages : ";
    getId('picturesLable').innerText = "Total Pictures : ";
    getId('fitCheckBox').checked = false;
}

function hideAllSections() {
    let right = getId('right');
    for (let i = 0; i < right.children.length; i++) {
        right.children[i].classList.add('hide');
    }
}

function openLink(link) {
    window.open(link, '_blank');
}

window.addEventListener("beforeunload", function (event) {
    if (statusDisplay.innerText == "Opened!") {
        // event.preventDefault();
        // this.alert("Close the Shop!");
    }
});

hideAllSections();
getId('firstItem').click();

let noteContainer = getId('noteContainer');
let message = getId('message');
let lastKey = localStorage.getItem("lastKey");

if (lastKey == null) {
    localStorage.setItem("lastKey", "0");
}


function saveNotes() {
    if (message.value != "") {
        lastKey++;
        localStorage.setItem(lastKey, message.value);
        localStorage.setItem("lastKey", lastKey);
        message.value = "";
        message.focus();
        getNotesAndDisplay();
    }

    // console.log(localStorage.getItem("lastKey"));
}

function getNotesAndDisplay() {
    noteContainer.innerHTML = "";
    for (let i = 1; i <= lastKey; i++) {
        if (localStorage.getItem(i) != null) {
            let notes = document.createElement('div');
            let msg = document.createElement('p');
            notes.classList.add('notes');
            notes.setAttribute("id", i);
            notes.setAttribute("onclick", "deleteNote(this)");
            msg.textContent = localStorage.getItem(i);
            notes.appendChild(msg);
            noteContainer.append(notes);
        }
    }

    // console.log(localStorage.getItem("lastKey"));
}

function deleteNote(ref) {
    if (confirm("Are you sure you want to Delete?")) {
        localStorage.removeItem(ref.id);
        getNotesAndDisplay();
    }
    // console.log(localStorage.getItem("lastKey"));
}

function deletAllNotes() {
    if (confirm("Are you sure you want to Delete?")) {
        lastKey = 0;
        localStorage.setItem("lastKey", lastKey);
        noteContainer.innerHTML = "";
        message.value = "";
    }

    // console.log(localStorage.getItem("lastKey"));

}

getNotesAndDisplay();

// console.log(localStorage.getItem("lastKey"));