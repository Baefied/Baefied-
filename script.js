// TAB SWITCHING
function switchTab(tab) {
    const sections = ['downloader', 'compressor', 'converter'];
    sections.forEach(s => {
        document.getElementById(`sec-${s}`).classList.add('hidden');
        document.getElementById(`btn-${s === 'downloader' ? 'dl' : s === 'compressor' ? 'comp' : 'conv'}`).classList.remove('active-tab');
    });
    
    document.getElementById(`sec-${tab}`).classList.remove('hidden');
    document.getElementById(`btn-${tab === 'downloader' ? 'dl' : tab === 'compressor' ? 'comp' : 'conv'}`).classList.add('active-tab');
}

// 1. DOWNLOADER LOGIC (Real YT Data Simulation)
async function handleDownload() {
    const url = document.getElementById('yt-url').value;
    const btn = document.getElementById('dl-main-btn');
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        alert("Enter valid YouTube Link"); return;
    }

    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('.be/')[1];
    
    btn.innerText = "Extracting...";
    btn.style.opacity = "0.5";

    setTimeout(() => {
        document.getElementById('vid-img').src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        document.getElementById('vid-name').innerText = "Media Successfully Extracted";
        document.getElementById('dl-result').classList.remove('hidden');
        btn.innerText = "Extract Media";
        btn.style.opacity = "1";
    }, 1500);
}

// 2. COMPRESSOR LOGIC
const compInput = document.getElementById('comp-input');
const compDrop = document.getElementById('comp-drop');

compDrop.onclick = () => compInput.click();

compInput.onchange = async (e) => {
    const file = e.target.files[0];
    const options = { maxSizeMB: 0.7, maxWidthOrHeight: 1920 };
    
    try {
        const compressed = await imageCompression(file, options);
        const url = URL.createObjectURL(compressed);
        
        document.getElementById('comp-preview').src = url;
        document.getElementById('comp-dl').href = url;
        document.getElementById('comp-dl').download = "baefied_" + file.name;
        document.getElementById('comp-saved').innerText = "Saved " + Math.round((1 - compressed.size/file.size)*100) + "%";
        document.getElementById('comp-result').classList.remove('hidden');
    } catch (err) { console.error(err); }
};

// 3. CONVERTER LOGIC
const convInput = document.getElementById('conv-input');
const convDrop = document.getElementById('conv-drop');

convDrop.onclick = () => convInput.click();

convInput.onchange = (e) => {
    const file = e.target.files[0];
    const format = document.getElementById('conv-format').value;
    const reader = new FileReader();

    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            
            const link = document.createElement('a');
            link.download = `baefied_converted.${format.split('/')[1]}`;
            link.href = canvas.toDataURL(format);
            link.click();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};
