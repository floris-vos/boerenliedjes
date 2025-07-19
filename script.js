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




document.addEventListener("DOMContentLoaded", function() {
  const musicListContainer = document.getElementById('music'); // The div where songs will be inserted

  // Fetch the JSON file with song names
  fetch('songs.json')
    .then(response => response.json())  // Parse the JSON file
    .then(musicList => {
      // Loop through the music list (now an array of strings) and generate HTML dynamically
      musicList.forEach(songName => {
        const item = document.createElement('div');
        item.classList.add('music-item');
        
        // Create a play button
        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.classList.add('play-button');
        
        // Create the name element
        const nameElement = document.createElement('span');
        nameElement.textContent = songName;
        nameElement.classList.add('music-name');
        
        // Append play button and name to the item
        item.appendChild(playButton);
        item.appendChild(nameElement);
        
        // Append the item to the music list container
        musicListContainer.appendChild(item);
        
        // Add play functionality
        playButton.addEventListener('click', () => {
          // Dynamically generate the path based on the song name and encode the filename
          const audioPath = `muziek/${encodeURIComponent(songName)}.m4a`;
          
          // Create an audio element only when play is clicked
          const audio = new Audio(audioPath);
          
          // Start playing the audio
          audio.play();
          
          // Disable the button to prevent multiple clicks while audio is playing
          playButton.disabled = true;
          playButton.textContent = 'Playing...';
          
          // Re-enable the button after the audio finishes
          audio.addEventListener('ended', () => {
            playButton.disabled = false;
            playButton.textContent = 'Play'; // Reset button text
          });
        });
      });
    })
    .catch(error => {
      console.error('Error loading the music list:', error);
    });
});
