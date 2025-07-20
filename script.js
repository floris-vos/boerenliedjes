const centerDiv = document.getElementById("center");

// Function to load content into the center div dynamically
function loadCenterContent(url, clickedLink = null) {
  centerDiv.innerHTML = "<p>Loading...</p>";
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      return response.text();
    })
    .then(html => {
      centerDiv.innerHTML = html;

      // Highlight the active link in the sidebar
      document.querySelectorAll("#left a.load-center").forEach(link => {
        link.classList.remove("active");
        link.style.pointerEvents = "auto";
        link.removeAttribute("aria-current");
        link.tabIndex = 0;
      });

      if (clickedLink) {
        clickedLink.classList.add("active");
        clickedLink.style.pointerEvents = "none";
        clickedLink.setAttribute("aria-current", "page");
        clickedLink.tabIndex = -1;
      }

      // Check if liedjes.html was loaded and initialize music player
      //if (url.includes("liedjes.html")) {
      //  initializeMusicPlayer();
      //}
    })
    .catch(err => {
      centerDiv.innerHTML = `<p>Failed to load ${url}.</p>`;
      console.error(err);
    });
}

// Initialize music player for liedjes.html


// Attach click listeners to sidebar links
document.querySelectorAll("#left a.load-center").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const href = link.getAttribute("href");
    loadCenterContent(href, link);
  });
});

// Load default link content
const defaultLinks = document.querySelectorAll('#left a.load-center[data-default="true"]');
if (defaultLinks.length > 1) {
  console.warn("Multiple links with data-default='true' found. Using the first one.");
}
const defaultLink = defaultLinks[0];
if (defaultLink) {
  defaultLink.classList.add("active");
  defaultLink.setAttribute("aria-current", "page");
  defaultLink.tabIndex = -1;
  loadCenterContent(defaultLink.getAttribute("href"), defaultLink);
}