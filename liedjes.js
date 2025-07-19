(function () {
  function initMusicPlayer() {
    const musicListContainer = document.getElementById("song-list");
    const playPauseButton = document.getElementById("play-pause");
    const stopButton = document.getElementById("stop");
    const seekSlider = document.getElementById("seek-slider");
    const currentTimeDisplay = document.getElementById("current-time");
    const durationDisplay = document.getElementById("duration");

    if (!musicListContainer || !playPauseButton || !seekSlider) {
      console.error("Error: Required elements (#song-list, #play-pause, #seek-slider) not found");
      const musicDiv = document.getElementById("music");
      if (musicDiv) {
        musicDiv.innerHTML = "<p>Error: Music player elements not found.</p>";
      }
      return;
    }

    let audio = null;
    let currentSong = null;

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    function updatePlayer() {
      if (audio) {
        seekSlider.value = (audio.currentTime / audio.duration) * 100 || 0;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        durationDisplay.textContent = formatTime(audio.duration);
      }
    }

    function loadSong(songName) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      const audioPath = `muziek/${encodeURIComponent(songName)}.m4a`;
      console.log(`Loading song: ${audioPath}`);
      audio = new Audio(audioPath);
      currentSong = songName;

      audio.addEventListener("loadedmetadata", () => {
        durationDisplay.textContent = formatTime(audio.duration);
        seekSlider.max = audio.duration;
        seekSlider.value = 0;
      });

      audio.addEventListener("timeupdate", updatePlayer);

      audio.addEventListener("ended", () => {
        playPauseButton.textContent = "Play";
        seekSlider.value = 0;
        currentTimeDisplay.textContent = "0:00";
        audio.currentTime = 0;
      });

      audio.play().catch(err => {
        console.error(`Audio playback failed for ${audioPath}:`, err);
        musicListContainer.innerHTML += `<p>Error playing ${songName}: ${err.message}</p>`;
      });
      playPauseButton.textContent = "Pause";
    }

    playPauseButton.addEventListener("click", () => {
      if (!audio) return;
      if (audio.paused) {
        audio.play().catch(err => console.error("Playback error:", err));
        playPauseButton.textContent = "Pause";
      } else {
        audio.pause();
        playPauseButton.textContent = "Play";
      }
    });

    stopButton.addEventListener("click", () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        playPauseButton.textContent = "Play";
        seekSlider.value = 0;
        currentTimeDisplay.textContent = "0:00";
      }
    });

    seekSlider.addEventListener("input", () => {
      if (audio) {
        audio.currentTime = (seekSlider.value / 100) * audio.duration;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
      }
    });

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
        musicListContainer.innerHTML = "";
        musicList.forEach(songName => {
          const item = document.createElement("div");
          item.classList.add("music-item");

          const nameElement = document.createElement("span");
          nameElement.textContent = songName;
          nameElement.classList.add("music-name");
          nameElement.style.cursor = "pointer";
          nameElement.addEventListener("click", () => {
            loadSong(songName);
            document.querySelectorAll(".music-item").forEach(i => i.classList.remove("active-song"));
            item.classList.add("active-song");
          });

          item.appendChild(nameElement);
          musicListContainer.appendChild(item);
        });

        if (musicList.length > 0) {
          loadSong(musicList[0]);
          musicListContainer.firstChild.classList.add("active-song");
        }
      })
      .catch(error => {
        console.error("Error loading songs:", error);
        musicListContainer.innerHTML = `<p>Error loading songs: ${error.message}</p>`;
      });
  }

  // Run immediately and listen for dynamic loads
  initMusicPlayer();
  document.addEventListener("DOMNodeInserted", function (event) {
    if (event.target.id === "center" && event.target.querySelector("#music")) {
      console.log("Detected #music div inserted into #center");
      initMusicPlayer();
    }
  });
})();