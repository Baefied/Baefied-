
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function getMimeTypeExtension(mimeType) {
    const extensions = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/webp': 'webp',
        'image/bmp': 'bmp'
    };
    return extensions[mimeType] || 'png';
}

// ===== PAGE DETECTION =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ===================================================
// YOUTUBE DOWNLOADER FUNCTIONALITY
// ===================================================
if (currentPage === 'downloader.html') {
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const extractBtn = document.getElementById('extractBtn');
    const resultSection = document.getElementById('resultSection');
    const errorMessage = document.getElementById('errorMessage');
    const thumbnail = document.getElementById('thumbnail');
    const videoIdElement = document.getElementById('videoId');
    const thumbnailUrl = document.getElementById('thumbnailUrl');
    const qualityGrid = document.getElementById('qualityGrid');

    // Extract Video ID from YouTube URL
    function extractVideoId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    // Generate Thumbnail URLs
    function getThumbnailUrls(videoId) {
        return {
            maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            default: `https://img.youtube.com/vi/${videoId}/default.jpg`
        };
    }

    // Display Results
    function displayResults(videoId) {
        const thumbnails = getThumbnailUrls(videoId);
        
        // Set main thumbnail
        thumbnail.src = thumbnails.maxres;
        videoIdElement.textContent = videoId;
        thumbnailUrl.href = thumbnails.maxres;
        thumbnailUrl.textContent = thumbnails.maxres;

        // Create quality buttons
        qualityGrid.innerHTML = '';
        const qualities = [
            { name: 'Max Resolution', key: 'maxres' },
            { name: 'Standard Def', key: 'sd' },
            { name: 'High Quality', key: 'hq' },
            { name: 'Medium Quality', key: 'mq' },
            { name: 'Default', key: 'default' }
        ];

        qualities.forEach(quality => {
            const btn = document.createElement('button');
            btn.className = 'quality-btn';
            btn.textContent = quality.name;
            btn.onclick = () => {
                thumbnail.src = thumbnails[quality.key];
                thumbnailUrl.href = thumbnails[quality.key];
                thumbnailUrl.textContent = thumbnails[quality.key];
                downloadThumbnail(thumbnails[quality.key], `${videoId}_${quality.key}.jpg`);
            };
            qualityGrid.appendChild(btn);
        });

        resultSection.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    // Download Thumbnail
    function downloadThumbnail(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        a.click();
    }

    // Extract Button Click Handler
    extractBtn.addEventListener('click', () => {
        const url = youtubeUrlInput.value.trim();
        const videoId = extractVideoId(url);

        if (videoId) {
            displayResults(videoId);
        } else {
            errorMessage.textContent = 'Invalid YouTube URL. Please enter a valid video link.';
            errorMessage.style.display = 'block';
            resultSection.style.display = 'none';
        }
    });

    // Enter key support
    youtubeUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            extractBtn.click();
        }
    });
}

// ===================================================
// IMAGE COMPRESSOR FUNCTIONALITY
// ===================================================
if (currentPage === 'compressor.html') {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressionSection = document.getElementById('compressionSection');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const maxSizeMB = document.getElementById('maxSizeMB');
    const compressBtn = document.getElementById('compressBtn');
    const resultSection = document.getElementById('resultSection');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const originalDimensions = document.getElementById('originalDimensions');
    const compressedSize = document.getElementById('compressedSize');
    const reductionPercent = document.getElementById('reductionPercent');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;
    let compressedFile = null;

    // Upload Area Click
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });

    // File Input Change
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // Handle Image Upload
    function handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        originalFile = file;
        compressionSection.style.display = 'block';
        resultSection.style.display = 'none';

        // Display original preview
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = formatBytes(file.size);

            // Get dimensions
            const img = new Image();
            img.onload = () => {
                originalDimensions.textContent = `${img.width} x ${img.height}`;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Quality Slider
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
    });

    // Compress Button
    compressBtn.addEventListener('click', async () => {
        if (!originalFile) return;

        loadingSpinner.style.display = 'flex';
        resultSection.style.display = 'none';

        try {
            const options = {
                maxSizeMB: parseFloat(maxSizeMB.value),
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                quality: parseInt(qualitySlider.value) / 100
            };

            compressedFile = await imageCompression(originalFile, options);

            // Display compressed preview
            const reader = new FileReader();
            reader.onload = (e) => {
                compressedPreview.src = e.target.result;
                compressedSize.textContent = formatBytes(compressedFile.size);

                const reduction = ((originalFile.size - compressedFile.size) / originalFile.size * 100).toFixed(1);
                reductionPercent.textContent = `${reduction}% smaller`;

                loadingSpinner.style.display = 'none';
                resultSection.style.display = 'grid';
            };
            reader.readAsDataURL(compressedFile);

        } catch (error) {
            console.error('Compression error:', error);
            alert('Error compressing image. Please try again.');
            loadingSpinner.style.display = 'none';
        }
    });

    // Download Button
    downloadBtn.addEventListener('click', () => {
        if (!compressedFile) return;

        const url = URL.createObjectURL(compressedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${originalFile.name}`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// ===================================================
// FORMAT CONVERTER FUNCTIONALITY
// ===================================================
if (currentPage === 'converter.html') {
    const convertUploadArea = document.getElementById('convertUploadArea');
    const convertImageInput = document.getElementById('convertImageInput');
    const conversionSection = document.getElementById('conversionSection');
    const formatButtons = document.querySelectorAll('.format-btn');
    const qualitySection = document.getElementById('qualitySection');
    const convertQuality = document.getElementById('convertQuality');
    const convertQualityValue = document.getElementById('convertQualityValue');
    const convertBtn = document.getElementById('convertBtn');
    const convertResultSection = document.getElementById('convertResultSection');
    const convertLoadingSpinner = document.getElementById('convertLoadingSpinner');
    const convertOriginalPreview = document.getElementById('convertOriginalPreview');
    const convertedPreview = document.getElementById('convertedPreview');
    const originalFormat = document.getElementById('originalFormat');
    const convertOriginalSize = document.getElementById('convertOriginalSize');
    const convertedFormat = document.getElementById('convertedFormat');
    const convertedSize = document.getElementById('convertedSize');
    const convertDownloadBtn = document.getElementById('convertDownloadBtn');

    let originalConvertFile = null;
    let selectedFormat = null;
    let convertedBlob = null;
    let originalImageData = null;

    // Upload Area Click
    convertUploadArea.addEventListener('click', () => {
        convertImageInput.click();
    });

    // Drag and Drop
    convertUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        convertUploadArea.classList.add('drag-over');
    });

    convertUploadArea.addEventListener('dragleave', () => {
        convertUploadArea.classList.remove('drag-over');
    });

    convertUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        convertUploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleConvertImageUpload(files[0]);
        }
    });

    // File Input Change
    convertImageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleConvertImageUpload(e.target.files[0]);
        }
    });

    // Handle Image Upload
    function handleConvertImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        originalConvertFile = file;
        conversionSection.style.display = 'block';
        convertResultSection.style.display = 'none';

        // Display original preview
        const reader = new FileReader();
        reader.onload = (e) => {
            convertOriginalPreview.src = e.target.result;
            originalImageData = e.target.result;
            originalFormat.textContent = file.type.split('/')[1].toUpperCase();
            convertOriginalSize.textContent = formatBytes(file.size);
        };
        reader.readAsDataURL(file);
    }

    // Format Button Selection
    formatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            formatButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFormat = btn.getAttribute('data-format');
            convertBtn.disabled = false;

            // Show quality slider for JPEG and WebP
            if (selectedFormat === 'image/jpeg' || selectedFormat === 'image/webp') {
                qualitySection.style.display = 'block';
            } else {
                qualitySection.style.display = 'none';
            }
        });
    });

    // Quality Slider
    convertQuality.addEventListener('input', (e) => {
        convertQualityValue.textContent = e.target.value;
    });

    // Convert Button
    convertBtn.addEventListener('click', async () => {
        if (!originalConvertFile || !selectedFormat) return;

        convertLoadingSpinner.style.display = 'flex';
        convertResultSection.style.display = 'none';

        try {
            const quality = parseInt(convertQuality.value) / 100;
            convertedBlob = await convertImage(originalImageData, selectedFormat, quality);

            const url = URL.createObjectURL(convertedBlob);
            convertedPreview.src = url;
            convertedFormat.textContent = getMimeTypeExtension(selectedFormat).toUpperCase();
            convertedSize.textContent = formatBytes(convertedBlob.size);

            convertLoadingSpinner.style.display = 'none';
            convertResultSection.style.display = 'grid';

        } catch (error) {
            console.error('Conversion error:', error);
            alert('Error converting image. Please try again.');
            convertLoadingSpinner.style.display = 'none';
        }
    });

    // Convert Image Using Canvas API
    function convertImage(imageData, targetFormat, quality) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Conversion failed'));
                    }
                }, targetFormat, quality);
            };
            img.onerror = () => reject(new Error('Image load failed'));
            img.src = imageData;
        });
    }

    // Download Button
    convertDownloadBtn.addEventListener('click', () => {
        if (!convertedBlob || !selectedFormat) return;

        const url = URL.createObjectURL(convertedBlob);
        const a = document.createElement('a');
        const extension = getMimeTypeExtension(selectedFormat);
        const originalName = originalConvertFile.name.replace(/\.[^/.]+$/, '');
        a.href = url;
        a.download = `${originalName}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// ===================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================================
// NAVBAR SCROLL EFFECT
// ===================================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.7)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card, .glass-card').forEach(card => {
    observer.observe(card);
});

console.log('🚀 Baefied Media Studio Loaded Successfully!');
