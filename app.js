let displayContainer = document.getElementById("display-container");
let descriptionContainer = document.getElementById("description-container");
let thumbnailsContainer = document.getElementById("thumbnails-container");
let form = document.getElementById("form");
let mediaScreenSize = window.matchMedia("(max-width: 600px)");

let imageIndex = 0;
let images;

// Search unsplash API for images from user input
async function search(query) {
  try {
    let response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=ZhelQ5q2rAqa5RAY_LImIMv-C70OG01OSHEGnmMekaE`);
    console.log(response);
    let data = await response.json();
    //console.log(data.results[0].urls.raw);
    createImages(data.results);
  } catch (error) {
    console.log("No results");
  }
}

// Display all images from search result
function createImages(arrayImages) {
  images = arrayImages; // Store images for arrow keys cycle

  // Set thumbnails
  thumbnailsContainer.style.display = "block"; // Make visible
  thumbnailsContainer.innerHTML = ""; // Clear previous images
  console.log(arrayImages);
  arrayImages.forEach((image) => {
    // Create image tag
    let imageElement = document.createElement("img");
    // Set the img src and alt to be image.url
    imageElement.src = image.urls.thumb; // Use thumb for smaller file size and faster loading
    imageElement.alt = image.alt_description;

    // Give button listener to set background image
    imageElement.addEventListener("click", function () {
      setDisplayImage(image);
    });

    // Append to thumbnailsContainer
    thumbnailsContainer.appendChild(imageElement);
  });

  // Set background image to first result
  imageIndex = 0;
  setDisplayImage(arrayImages[imageIndex]);
}

// Update display image
function setDisplayImage(image) {
  displayContainer.innerHTML = ""; // Clear previous image

  let largeImage = document.createElement("img");
  largeImage.src = image.urls.raw;
  largeImage.alt = image.alt_description;

  // Set description to image alt text
  descriptionContainer.textContent = image.alt_description;
  //descriptionContainer.textContent = largeImage.alt;

  displayContainer.appendChild(largeImage);
}

// Setup form to read user input
function formListener() {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop page refresh
    console.log(event);
    let query = event.target.input.value;
    // Make sure there is something to search
    if (query != "") {
      search(query);
    }
  });
}

// Setup document to listen to arrow keys and cycle through images
function arrowKeysListener() {
  document.addEventListener("keydown", function (event) {
    // Left or Up (for small window) Key
    if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && images) {
      if (imageIndex > 0) {
        // Previous image
        imageIndex--;
      } else {
        // Go to last image
        imageIndex = images.length - 1;
      }
      // Set display image and move thumbnail scroll bar
      setDisplayImage(images[imageIndex]);
      updateThumbnailScrollbar();
    }
    // Right or Down (for small window) key
    else if ((event.key === "ArrowRight" || event.key === "ArrowDown") && images) {
      if (imageIndex < images.length - 1) {
        // Next image
        imageIndex++;
      } else {
        // Go to first image
        imageIndex = 0;
      }
      // Set display image and move thumbnail scroll bar
      setDisplayImage(images[imageIndex]);
      updateThumbnailScrollbar();
    }
  });
}

// Update scroll bar position when using arrow keys
function updateThumbnailScrollbar() {
  // Using small screen size, so scroll up/down
  if (mediaScreenSize.matches) {
    // Set scroll increment based on image index
    let totalScrollHeight = thumbnailsContainer.scrollHeight - thumbnailsContainer.clientHeight;
    let increment = totalScrollHeight / (images.length - 1);
    thumbnailsContainer.scrollTop = imageIndex * increment;
  }
  // Using large screen size, so scroll left/right
  else {
    // Set scroll increment based on image index
    let totalScrollWidth = thumbnailsContainer.scrollWidth - thumbnailsContainer.clientWidth;
    let increment = totalScrollWidth / (images.length - 1);
    thumbnailsContainer.scrollLeft = imageIndex * increment;
  }
}

formListener();
arrowKeysListener();
