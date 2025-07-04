let images = [];
let currentIndex = 0;

const img = document.getElementById("image-viewer");

if (img) {
  fetch('images.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      images = data;
      if (images.length === 0) return;

      // Initialize the image source
      img.src = images[currentIndex];

      // Add click listener to cycle images
      img.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        img.src = images[currentIndex];
      });
    })
    .catch(error => {
      console.error('Failed to fetch images.json:', error);
    });
}
