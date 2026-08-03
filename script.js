// ==========================================================================
// 1. SMART OPERATING SYSTEM DETECTION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const mainBtn = document.getElementById('main-download-btn');
    const osText = document.getElementById('os-text');
    
    if (!mainBtn || !osText) return;

    const platform = navigator.userAgentData?.platform || navigator.platform || "";
    const lowPlatform = platform.toLowerCase();

    const targets = {
        win: { text: "For Windows 10 or 11", link: "https://github.com/joshhowis2013-ctrl/Whister/releases/download/NEW/WhisterGUIInstaller.exe", card: "card-windows" },
        mac: { text: "For macOS 11 or later", link: "https://github.com/joshhowis2013-ctrl/Whister/releases/download/NEW/WhisterGUIInstaller.dmg", card: "card-macos" },
        lin: { text: "For Linux (64-bit)", link: "https://github.com/joshhowis2013-ctrl/Whister/releases/download/NEW/WhisterGUIInstaller.deb", card: "card-linux" }
    };

    let detected = null;
    if (lowPlatform.includes('win')) detected = targets.win;
    else if (lowPlatform.includes('mac')) detected = targets.mac;
    else if (lowPlatform.includes('lin')) detected = targets.lin;

    if (detected) {
        const osName = detected === targets.win ? "Windows" : detected === targets.mac ? "macOS" : "Linux";
        mainBtn.innerText = `Download for ${osName}`;
        mainBtn.href = detected.link;
        osText.innerText = detected.text;
        
        const targetCard = document.getElementById(detected.card);
        if (targetCard) {
            targetCard.classList.add('highlighted');
        }
    } else {
        osText.innerText = "Choose your operating system below";
    }
});

// ==========================================================================
// 2. SMART BANGS SEARCH ENGINE ROUTER
// ==========================================================================
function performSearch() {
    const searchInput = document.getElementById('browser-search-input');
    if (!searchInput) return;

    let rawQuery = searchInput.value.trim();
    if (!rawQuery) return;

    const terms = rawQuery.split(' ');
    const firstTerm = terms[0].toLowerCase();
    const queryContent = encodeURIComponent(terms.slice(1).join(' '));

    const bangMap = {
        '!yt': `https://youtube.com{queryContent}`,
        '!w': `https://wikipedia.org{queryContent}`,
        '!g': `https://google.com{queryContent}`,
        '!gh': `https://github.com{queryContent}`,
        '!r': `https://reddit.com{queryContent}`
    };

    if (bangMap[firstTerm]) {
        window.open(bangMap[firstTerm], '_blank');
    } else {
        window.open(`https://google.com{encodeURIComponent(rawQuery)}`, '_blank');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('browser-search-input');
    const searchBtn = document.getElementById('browser-search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
});

function insertBang(bangText) {
    const searchInput = document.getElementById('browser-search-input');
    if (searchInput) {
        searchInput.value = bangText;
        searchInput.focus();
    }
}

// ==========================================================================
// 3. AUTOMATED BROWSER SLIDER INTERACTIVE LOGIC (PASTE NEW CODE HERE)
// ==========================================================================
let currentSlideIndex = 0;
let slideInterval;

function switchSlide(index) {
    const slides = document.querySelectorAll('.browser-slide');
    const dots = document.querySelectorAll('.dot-indicator');
    
    if (slides.length === 0 || dots.length === 0) return;

    currentSlideIndex = index;

    slides.forEach(slide => slide.classList.remove('active-slide'));
    dots.forEach(dot => dot.classList.remove('active-dot'));

    slides[index].classList.add('active-slide');
    dots[index].classList.add('active-dot');
}

function startSlideShow() {
    const slides = document.querySelectorAll('.browser-slide');
    if (slides.length === 0) return;

    clearInterval(slideInterval);

    slideInterval = setInterval(() => {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0; 
        }
        switchSlide(nextIndex);
    }, 5000); // 5 seconds duration
}

function manualSwitch(index) {
    switchSlide(index);
    startSlideShow(); 
}

document.addEventListener("DOMContentLoaded", () => {
    startSlideShow();
});
