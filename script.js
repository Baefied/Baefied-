const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const resolutionSelect = document.getElementById("resolution");
const compressBtn = document.getElementById("compressBtn");
const downloadLink = document.getElementById("download");

let originalImage = null;

qualitySlider.addEventListener("input", () => {
  qualityValue.textContent = qualitySlider.value;
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = "block";
    originalImage = reader.result;
  };
  reader.readAsDataURL(file);
});

compressBtn.addEventListener("click", () => {
  if (!originalImage) return alert("Select an image first");

  const img = new Image();
  img.src = originalImage;

  img.onload = () => {
    const scale = parseFloat(resolutionSelect.value);
    const canvas = document.createElement("canvas");

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const compressed = canvas.toDataURL(
      "image/jpeg",
      qualitySlider.value / 100
    );

    downloadLink.href = compressed;
    downloadLink.style.display = "block";
  };
});
