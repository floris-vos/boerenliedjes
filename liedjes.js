document.addEventListener("DOMContentLoaded", function () {
  const musicListContainer = document.getElementById("song-list");
  const playPauseButton = document.getElementById("play-pause");
  const stopButton = document.getElementById("stop");
  const seekSlider = document.getElementById("seek-slider");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");

  if (!musicListContainer) {
    console.error("Error: #song-list div not found");
    document.getElementById("music").innerHTML = "<p>Error: Song list container not found.</p>";
    return;
  }

  let audio = null; // Audio element for the current song
  let currentSong = null; // Track the currently loaded song

  // Format time in mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Update slider and time display
  function updatePlayer() {
    if (audio) {
      seekSlider.value = (audio.currentTime / audio.duration) * 100 || 0;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
      durationDisplay.textContent = formatTime(audio.duration);
    }
  }

  // Load and play a song
  function loadSong(songName) {
    if (audio) {
      audio.pause(); // Pause any currently playing song
      audio.currentTime = 0;
    }
    const audioPath = `muziek/${encodeURIComponent(songName)}.m4a`;
    console.log(`Loading song: ${audioPath}`);
    audio = new Audio(audioPath);
    currentSong = songName;

    // Update duration when metadata is loaded
    audio.addEventListener("loadedmetadata", () => {
      durationDisplay.textContent = formatTime(audio.duration);
      seekSlider.max = audio.duration;
      seekSlider.value = 0;
    });

    // Update slider and time during playback
    audio.addEventListener("timeupdate", updatePlayer);

    // Reset player when song ends
    audio.addEventListener("ended", () => {
      playPauseButton.textContent = "Play";
      seekSlider.value = 0;
      currentTimeDisplay.textContent = "0:00";
      audio.currentTime = 0;
    });

    // Play the song
    audio.play().catch(err => {
      console.error(`Audio playback failed for ${audioPath}:`, err);
      musicListContainer.innerHTML += `<p>Error playing ${songName}: ${err.message}</p>`;
    });
    playPauseButton.textContent = "Pause";
  }

  // Play/pause button handler
  playPauseButton.addEventListener("click", () => {
    if (!audio) return; // No song loaded
    if (audio.paused) {
      audio.play().catch(err => console.error("Playback error:", err));
      playPauseButton.textContent = "Pause";
    } else {
      audio.pause();
      playPauseButton.textContent = "Play";
    }
  });

  // Stop button handler
  stopButton.addEventListener("click", () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      playPauseButton.textContent = "Play";
      seekSlider.value = 0;
      currentTimeDisplay.textContent = "0:00";
    }
  });

  // Seek slider handler
  seekSlider.addEventListener("input", () => {
    if (audio) {
      audio.currentTime = (seekSlider.value / 100) * audio.duration;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  });

  // Fetch and populate song list
  console.log("Fetching songs.json");
  fetch("songs.json")
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load songs.json: ${response.status}`);
      return response.json();
    })
    .then(musicList => {
      console.log("songs.json loaded:", musicList);
      if (!Array.isArray(musicList)) {
        throw new Error("songs.json is not a valid array");
      }
      musicListContainer.innerHTML = ""; // Clear existing content
      musicList.forEach(songName => {
        const item = document.createElement("div");
        item.classList.add("music-item");

        const nameElement = document.createElement("span");
        nameElement.textContent = songName;
        nameElement.classList.add("music-name");
        nameElement.style.cursor = "pointer"; // Indicate clickable
        nameElement.addEventListener("click", () => {
          loadSong(songName);
          // Highlight selected song
          document.querySelectorAll(".music-item").forEach(i => i.classList.remove("active-song"));
          item.classList.add("active-song");
        });

        item.appendChild(nameElement);
        musicListContainer.appendChild(item);
      });

      // Load the first song by default
      if (musicList.length > 0) {
        loadSong(musicList[0]);
        musicListContainer.firstChild.classList.add("active-song");
      }
    })
    .catch(error => {
      console.error("Error loading songs:", error);
      musicListContainer.innerHTML = `<p>Error loading songs: ${error.message}</p>`;
    });
});