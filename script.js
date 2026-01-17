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
// Toggle Logic
const btnCompress = document.getElementById('mode-compress');
const btnConvert = document.getElementById('mode-convert');
const compressWindow = document.querySelector('.bg-slate-900'); // Your first card
const converterWindow = document.getElementById('converter-window');

btnConvert.addEventListener('click', () => {
    compressWindow.classList.add('hidden');
    converterWindow.classList.remove('hidden');
    btnConvert.className = "px-6 py-2 rounded-full bg-indigo-600 font-bold text-sm transition-all shadow-lg shadow-indigo-500/20";
    btnCompress.className = "px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 font-bold text-sm transition-all";
});

btnCompress.addEventListener('click', () => {
    converterWindow.classList.add('hidden');
    compressWindow.classList.remove('hidden');
    btnCompress.className = "px-6 py-2 rounded-full bg-indigo-600 font-bold text-sm transition-all shadow-lg shadow-indigo-500/20";
    btnConvert.className = "px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 font-bold text-sm transition-all";
});

// Conversion Logic
const convertInput = document.getElementById('convert-input');
const convertDropZone = document.getElementById('convert-drop-zone');
const formatSelect = document.getElementById('format-select');

convertDropZone.addEventListener('click', () => convertInput.click());

convertInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert to selected format
            const targetFormat = formatSelect.value;
            const dataUrl = canvas.toDataURL(targetFormat);
            
            // Auto Download
            const link = document.createElement('a');
            link.download = `baefied-converted.${targetFormat.split('/')[1]}`;
            link.href = dataUrl;
            link.click();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
                                             
