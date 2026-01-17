const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const previewArea = document.getElementById('preview-area');
const originalPreview = document.getElementById('original-preview');
const compressedPreview = document.getElementById('compressed-preview');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('download-btn');

// Trigger file input
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Validate if it's actually an image
    if (!file.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }

    // 2. Setup UI
    dropZone.classList.add('hidden');
    previewArea.classList.remove('hidden');
    originalPreview.src = URL.createObjectURL(file);
    document.getElementById('old-size').innerText = `(${formatBytes(file.size)})`;

    // 3. Compression Logic
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    loader.classList.remove('hidden');

    try {
        // Use imageCompression.default for CDN compatibility
        const compressedFile = await imageCompression(file, options);
        
        const url = URL.createObjectURL(compressedFile);
        compressedPreview.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `baefied_${file.name}`;
        
        const savings = Math.round(((file.size - compressedFile.size) / file.size) * 100);
        document.getElementById('new-size').innerText = `(${formatBytes(compressedFile.size)})`;
        document.getElementById('savings-badge').innerText = `SAVED ${savings}%`;
        
    } catch (error) {
        console.error("Detailed Error:", error);
        alert('Compression failed. Please ensure the page is fully loaded and try again.');
        location.reload(); // Refresh to reset state
    } finally {
        loader.classList.add('hidden');
    }
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
