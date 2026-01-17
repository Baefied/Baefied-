const imageInput = document.getElementById("imageInput");
const compressBtn = document.getElementById("compressBtn");
const download = document.getElementById("download");
const loader = document.getElementById("loader");

const mode = document.getElementById("mode");
const percentBox = document.getElementById("percentBox");
const sizeBox = document.getElementById("sizeBox");

const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const targetSize = document.getElementById("targetSize");

let imageData = null;

quality.addEventListener("input", () => {
  qualityValue.textContent = quality.value;
});

mode.addEventListener("change", () => {
  percentBox.classList.toggle("hidden", mode.value !== "percent");
  sizeBox.classList.toggle("hidden", mode.value !== "size");
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => imageData = reader.result;
  reader.readAsDataURL(file);
});

compressBtn.addEventListener("click", () => {
  if (!imageData) return alert("Select image first");

  loader.classList.remove("hidden");
  download.style.display = "none";

  const img = new Image();
  img.src = imageData;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let q = quality.value / 100;

    if (mode.value === "size") {
      const targetKB = parseInt(targetSize.value);
      q = Math.min(0.9, targetKB / 2000);
    }

    const output = canvas.toDataURL("image/jpeg", q);

    loader.classList.add("hidden");
    download.href = output;
    download.style.display = "block";
  };
});
