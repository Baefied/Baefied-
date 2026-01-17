// --- TOOL SWITCHING LOGIC ---
const tabCompress = document.getElementById('tab-compress');
const tabConvert = document.getElementById('tab-convert');
const compressSection = document.getElementById('compress-section');
const convertSection = document.getElementById('convert-section');

tabCompress.addEventListener('click', () => {
    compressSection.classList.remove('hidden');
    convertSection.classList.add('hidden');
    tabCompress.className = "active-tab px-6 py-2.5 rounded-xl font-bold text-sm transition-all";
    tabConvert.className = "px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-slate-400 hover:text-white";
});

tabConvert.addEventListener('click', () => {
    convertSection.classList.remove('hidden');
    compressSection.classList.add('hidden');
    tabConvert.className = "active-tab px-6 py-2.5 rounded-xl font-bold text-sm transition-all";
    tabCompress.className = "px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-slate-400 hover:text-white";
});

// --- COMPRESSOR LOGIC ---
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const previewArea = document.getElementById('preview-area');
const originalPreview = document.getElementById('original-preview');
const compressedPreview = document.getElementById('compressed-preview');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('download-btn');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dropZone.classList.add('hidden');
    previewArea.classList.remove('hidden');
    originalPreview.src = URL.createObjectURL(file);
    document.getElementById('old-size').innerText = `(${formatBytes(file.size)})`;

    loader.classList.remove('hidden');

    try {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        
        compressedPreview.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `baefied_optimized_${file.name}`;
        
        const savings = Math.round(((file.size - compressedFile.size) / file.size) * 100);
        document.getElementById('new-size').innerText = `(${formatBytes(compressedFile.size)})`;
        document.getElementById('savings-badge').innerText = `SAVED ${savings}%`;
    } catch (err) { alert("Compression error. Try again."); }
    finally { loader.classList.add('hidden'); }
});

// --- CONVERTER LOGIC ---
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
            
            const targetFormat = formatSelect.value;
            const extension = targetFormat.split('/')[1];
            const dataUrl = canvas.toDataURL(targetFormat);
            
            const link = document.createElement('a');
            link.download = `baefied_converted.${extension}`;
            link.href = dataUrl;
            link.click();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB'][i];
      }
