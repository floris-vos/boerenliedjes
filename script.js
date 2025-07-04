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
function loadCenterContent(url, clickedLink = null) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load ' + url);
      return response.text();
    })
    .then(html => {
      centerDiv.innerHTML = html;
      initImageCycling();

      // 🔸🔸🔸 NEW: Highlight the active link
      document.querySelectorAll("#left a.load-center").forEach(link => {
        link.classList.remove("active");
        link.style.pointerEvents = "auto"; // re-enable others
      });

      if (clickedLink) {
        clickedLink.classList.add("active");
        clickedLink.style.pointerEvents = "none"; // disable current
      }
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

    // 🔸🔸🔸 Pass the clicked link for highlighting
    loadCenterContent(href, link);
  });
});
