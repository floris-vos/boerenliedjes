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
      if (url.includes("liedjes.html")) {
        initializeMusicPlayer();
      }
    })
    .catch(err => {
      centerDiv.innerHTML = `<p>Failed to load ${url}.</p>`;
      console.error(err);
    });
}

// Initialize music player for liedjes.html
function initializeMusicPlayer() {
  const audioPlayer = document.getElementById("audio-player");
  const audioSource = document.getElementById("audio-source");
  const playPauseButton = document.getElementById("play-pause");
  const songList = document.getElementById("song-list");

  if (!audioPlayer || !audioSource || !playPauseButton || !songList) {
    console.error("Music player elements not found in liedjes.html");
    songList.innerHTML = `<li class="error">Error: Music player setup failed.</li>`;
    return;
  }

  // Fetch songs.json
  fetch("songs.json")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return response.json();
    })
    .then(songs => {
      if (!Array.isArray(songs)) throw new Error("songs.json is not an array");
      songList.innerHTML = ""; // Clear loading message
      if (songs.length === 0) {
        songList.innerHTML = '<li class="error">No songs found in songs.json</li>';
        return;
      }

      // Populate song list
      songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song;
        li.dataset.song = `muziek/${song}.m4a`;
        li.addEventListener("click", () => loadSong(song, li));
        songList.appendChild(li);

        
      });
    })
    .catch(err => {
      songList.innerHTML = `<li class="error">Failed to load songs.json: ${err.message}. Check file path, server, or JSON format.</li>`;
      console.error("Error loading songs.json:", err);
    });

  // Load a song without auto-playing
  function loadSong(songTitle, li) {
    const songUrl = `muziek/${songTitle}.m4a`;
    audioSource.src = songUrl;
    audioPlayer.load();

    // Update active song in list
    document.querySelectorAll(".song-list li").forEach(item => {
      item.classList.remove("active");
    });
    li.classList.add("active");

    // Enable play/pause button and update state
    playPauseButton.disabled = false;
    updatePlayPauseButton();
  }

  // Play/pause button logic
  playPauseButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(err => {
        console.error("Playback failed:", err);
        songList.innerHTML = `<li class="error">Error playing song: ${err.message}. Please try clicking Play again or select another song.</li>`;
      });
    } else {
      audioPlayer.pause();
    }
  });

  // Update play/pause button text
  function updatePlayPauseButton() {
    playPauseButton.textContent = audioPlayer.paused ? "Play" : "Pause";
  }

  // Update button state on play/pause events
  audioPlayer.addEventListener("play", updatePlayPauseButton);
  audioPlayer.addEventListener("pause", updatePlayPauseButton);
  audioPlayer.addEventListener("ended", updatePlayPauseButton);
}

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

  // Defer actual content load
  setTimeout(() => {
    loadCenterContent(defaultLink.getAttribute("href"), defaultLink);
  }, 0);
}
