const imageInput = document.getElementById("imageInput");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const resolution = document.getElementById("resolution");
const compressBtn = document.getElementById("compressBtn");
const download = document.getElementById("download");

let imageData = null;

quality.addEventListener("input", () => {
  qualityValue.textContent = quality.value;
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => imageData = reader.result;
  reader.readAsDataURL(file);
});

compressBtn.addEventListener("click", () => {
  if (!imageData) return alert("Select an image first");

  const img = new Image();
  img.src = imageData;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = parseFloat(resolution.value);

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const compressed = canvas.toDataURL(
      "image/jpeg",
      quality.value / 100
    );

    download.href = compressed;
    download.style.display = "block";
  };
});
