document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const MAX_IMAGES = 5;
  const images = document.querySelectorAll(".carousel-item img");
  let currentIndex = 0;

  function nextImage() {
    images[currentIndex].classList.remove("visible"); // Hide current image
    currentIndex = (currentIndex + 1) % images.length; // Move to next image
    images[currentIndex].classList.add("visible"); // Show next image
  }

  // Automatically transition to the next image every 3 seconds
  setInterval(nextImage, 2000);

  // Get images array from local storage
  let imagesData = JSON.parse(localStorage.getItem("storedImagesData") || "[]");

  // Store images array to local storage
  function storeToLocalDB() {
    localStorage.setItem("storedImagesData", JSON.stringify(imagesData));
  }

  // Function to display file
  function displayFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileData = {
        src: e.target.result,
        name: file.name,
        description: "",
        isDescriptionAdded: false,
      };

      imagesData.push(fileData);
      storeToLocalDB(); // Save to local storage

      const div = document.createElement("div");
      div.className = "file-container";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;
      img.className = "thumbnail";
      div.appendChild(img);

      const textarea = document.createElement("textarea");
      textarea.value = fileData.description;
      textarea.setAttribute("required", "");
      div.appendChild(textarea);

      const checkButton = document.createElement("button");
      checkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      checkButton.className = "add-file";
      checkButton.addEventListener("click", () => {
        alert("Description has been added.");
        textarea.disabled = true;
        fileData.description = textarea.value;
        fileData.isDescriptionAdded = true;
        storeToLocalDB(); // Save updated data
      });
      div.appendChild(checkButton);

      const removeButton = document.createElement("button");
      removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      removeButton.className = "remove-file";
      removeButton.addEventListener("click", () => {
        imagesData = imagesData.filter((img) => img.src !== fileData.src);
        fileList.removeChild(div);
        storeToLocalDB(); // Save updated data
      });
      div.appendChild(removeButton);

      fileList.appendChild(div);
    };

    reader.readAsDataURL(file);
  }

  // Function to load data from local storage
  function loadFromLocalStorage() {
    imagesData.forEach((data) => {
      const div = document.createElement("div");
      div.className = "file-container";

      const img = document.createElement("img");
      img.src = data.src;
      img.alt = data.name;
      img.className = "thumbnail";
      div.appendChild(img);

      const textarea = document.createElement("textarea");
      textarea.value = data.description;
      textarea.disabled = data.isDescriptionAdded;
      div.appendChild(textarea);

      const checkButton = document.createElement("button");
      checkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      checkButton.className = "add-file";
      checkButton.addEventListener("click", (e) => {
        console.log("value decription", e.target.prevnode);
        alert("Description has been added.");
        textarea.disabled = true;
        data.description = textarea.value;
        data.isDescriptionAdded = true;
        storeToLocalDB(); // Save updated data
      });
      div.appendChild(checkButton);

      const removeButton = document.createElement("button");
      removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      removeButton.className = "remove-file";
      removeButton.addEventListener("click", () => {
        imagesData = imagesData.filter((img) => img.src !== data.src);
        fileList.removeChild(div);
        storeToLocalDB(); // Save updated data
      });
      div.appendChild(removeButton);

      fileList.appendChild(div);
    });
  }

  // Handle file selection
  function handleFiles(files) {
    // console.log(files);
    if (files.length + imagesData.length > MAX_IMAGES) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && file.size < 1024 * 1024) {
        // 1MB = 1024*1024 bytes
        displayFile(file);
      } else {
        alert("Only images below 1MB are allowed.");
      }
    });
  }

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => {
    console.log(e.target.files);
    handleFiles(e.target.files);
  });

  loadFromLocalStorage(); // Load images on page load
});
