let images = [];
let currentIndex = 0;

const centerDiv = document.getElementById("center");

// Function to initialize image cycling on an image with id "image-viewer"
function initImageCycling() {
  const img = document.getElementById("image-viewer");
  if (!img) return;

  fetch('images.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      images = data;
      if (images.length === 0) return;

      currentIndex = 0;
      img.src = images[currentIndex];

      img.onclick = () => {
        currentIndex = (currentIndex + 1) % images.length;
        img.src = images[currentIndex];
      };
    })
    .catch(error => {
      console.error('Failed to fetch images.json:', error);
    });
}

// Load HTML into center div and initialize gallery if needed
function loadCenterContent(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load ' + url);
      return response.text();
    })
    .then(html => {
      centerDiv.innerHTML = html;

      // After inserting new content, init image cycling if image-viewer exists
      initImageCycling();
    })
    .catch(err => {
      centerDiv.innerHTML = "<p>Fehler beim Laden der Seite.</p>";
      console.error(err);
    });
}

// Attach click listeners to sidebar links with class 'load-center'
document.querySelectorAll("#left a.load-center").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const href = link.getAttribute("href");
    loadCenterContent(href);
  });
});

// Optional: on page load, you can load one of them by default
// loadCenterContent('gallery.html');
