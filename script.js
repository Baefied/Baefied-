const urlInput = document.getElementById('url-input');
const fetchBtn = document.getElementById('download-trigger');
const resultCard = document.getElementById('result-card');
const videoTitle = document.getElementById('video-title');

fetchBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();

    if (url === "") {
        urlInput.classList.add('border-red-500/50');
        setTimeout(() => urlInput.classList.remove('border-red-500/50'), 2000);
        return;
    }

    // Change button state to loading
    fetchBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>`;
    fetchBtn.disabled = true;

    // Simulate API Fetching (In a real app, you'd connect to a RapidAPI or custom backend)
    setTimeout(() => {
        fetchBtn.innerHTML = `<span>Fetch</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
        fetchBtn.disabled = false;

        // Show the Result Card with animation
        resultCard.classList.remove('hidden');
        videoTitle.innerText = "Baefied Media: " + (url.substring(0, 30) + "...");
        
        // Scroll to result smoothly
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
});

// Clear result when input is emptied
urlInput.addEventListener('input', (e) => {
    if (e.target.value === "") {
        resultCard.classList.add('hidden');
    }
});
