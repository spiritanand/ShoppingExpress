/* global document */

const imageURLInput = document.getElementById('imageURL');
const previewImage = document.getElementById('previewImage');

function handlePreviewImage(e) {
  const imageURL = e.target.value;

  if (imageURL) {
    previewImage.src = imageURL;
    previewImage.style.display = 'block';
  } else {
    previewImage.src = '';
    previewImage.style.display = 'none';
  }
}

imageURLInput.addEventListener('blur', (e) => handlePreviewImage(e));
imageURLInput.addEventListener('keydown', (e) => handlePreviewImage(e));
