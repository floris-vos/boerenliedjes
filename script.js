document.addEventListener("DOMContentLoaded", function() {
  const musicListContainer = document.getElementById('center'); // The div where songs will be inserted

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
          const audioPath = `muziek/${encodeURIComponent(songName)}.mp3`;
          
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
