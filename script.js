const imageContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let imageLoadCount = 5;
const apiKey = "";
let apiUrl = `https://api.unsplash.com/photos/random/?count=${imageLoadCount}&client_id=${apiKey}`;

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    imagesLoaded = 0;
    imageLoadCount = 30;
    ready = true;
    loader.hidden = true;
    apiUrl = `https://api.unsplash.com/photos/random/?count=${imageLoadCount}&client_id=${apiKey}`;
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links & photos, add to DOM
function displayPhotos() {
  totalImages = photosArray.length;
  // Create elements for each photo
  photosArray.forEach((photo) => {
    // create <a> link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event listener, check when each image has finished loading.
    img.addEventListener("load", imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    console.log(error);
  }
}

// Check to see if scrolling near bottom of page and load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    console.log(apiUrl);
    getPhotos();
  }
});

getPhotos();
