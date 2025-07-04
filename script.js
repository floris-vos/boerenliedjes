const images = ["1.jpg", "2.jpg"];
let currentIndex = 0;

const img = document.getElementById("image-viewer");
if (img) {
  img.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex];
  });
}
