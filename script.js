const centerDiv = document.getElementById("center");

// Function to load content into the center div dynamically
function loadCenterContent(url, clickedLink = null) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load ' + url);
      return response.text();
    })
    .then(html => {
      centerDiv.innerHTML = html;

      // Highlight the active link in the sidebar
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
      centerDiv.innerHTML = "<p>Failed to load content.</p>";
      console.error(err);
    });
}

// Attach click listeners to sidebar links with class 'load-center'
document.querySelectorAll("#left a.load-center").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const href = link.getAttribute("href");

    // Pass the clicked link for highlighting
    loadCenterContent(href, link);
  });
});

// Optional: load default link content and mark it active
const defaultLink = document.querySelector('#left a.load-center[data-default="true"]');
if (defaultLink) {
  defaultLink.classList.add("active");
  loadCenterContent(defaultLink.getAttribute("href"), defaultLink);
}



