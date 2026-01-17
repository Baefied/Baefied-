const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const previewArea = document.getElementById('preview-area');
const originalPreview = document.getElementById('original-preview');
const compressedPreview = document.getElementById('compressed-preview');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('download-btn');

// Trigger file input when clicking drop zone
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview area, hide drop zone
    dropZone.classList.add('hidden');
    previewArea.classList.remove('hidden');
    
    // Set Original Stats
    originalPreview.src = URL.createObjectURL(file);
    document.getElementById('old-size').innerText = `(${formatBytes(file.size)})`;

    // Compression Settings
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };

    loader.classList.remove('hidden');

    try {
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        
        compressedPreview.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `baefied_${file.name}`;
        
        // Update stats
        const savings = Math.round(((file.size - compressedFile.size) / file.size) * 100);
        document.getElementById('new-size').innerText = `(${formatBytes(compressedFile.size)})`;
        document.getElementById('savings-badge').innerText = `SAVED ${savings}%`;
        
    } catch (error) {
        console.error(error);
        alert('Compression failed!');
    } finally {
        loader.classList.add('hidden');
    }
});

// Utility to format file sizes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
