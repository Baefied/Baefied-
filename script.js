const urlInput = document.getElementById('url-input');
const fetchBtn = document.getElementById('fetch-btn');
const resultDisplay = document.getElementById('result-display');
const vidThumb = document.getElementById('vid-thumb');
const vidTitle = document.getElementById('vid-title');
const btnIcon = document.getElementById('btn-icon');

// Function to extract YouTube ID
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

fetchBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const videoId = getYouTubeID(url);

    if (!videoId) {
        alert("Please enter a valid YouTube link!");
        return;
    }

    // Start Loading Animation
    fetchBtn.disabled = true;
    btnIcon.innerHTML = `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4" stroke-dashoffset="0" class="animate-spin"></circle>`;
    fetchBtn.style.opacity = "0.7";

    // Simulate API delay
    setTimeout(() => {
        // Reset Button
        fetchBtn.disabled = false;
        btnIcon.innerHTML = `<path d="m9 18 6-6-6-6"/>`;
        fetchBtn.style.opacity = "1";

        // Update UI with ACTUAL YouTube Data
        vidThumb.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        vidTitle.innerText = "Video Successfully Extracted";
        
        // Show Result Window
        resultDisplay.classList.remove('hidden');
        resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Dynamic success colors
        document.querySelector('.background-glow').style.background = 
            `radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`;
    }, 1500);
});

// Real functionality note: To actually download the file, 
// you would usually redirect the user to a download server.
// For example: window.location.href = `https://api.vevioz.com/@download/stream/${videoId}`;
