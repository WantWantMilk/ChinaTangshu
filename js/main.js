// 浏览器检测（跳转简易模式）
(function detectLegacyBrowser() {
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    const isOldEdge = window.navigator.userAgent.indexOf('Edge/') > -1 && window.navigator.userAgent.indexOf('Edg/') === -1;
    if (isIE || isOldEdge) {
        alert('您正在使用 Internet Explorer 或舊版 Microsoft Edge，為獲得最佳體驗，建議升級至現代瀏覽器。');
        if (window.location.pathname !== '/legacy.html' && !window.location.pathname.endsWith('legacy.html')) {
            window.location.href = 'legacy.html';
        }
    }
})();

// 菜单控制
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuButton');
    const sideMenu = document.getElementById('sideMenu');
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('active');
    }

    function openMenu() {
        sideMenu.classList.add('open');
        overlay.classList.add('active');
    }

    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (sideMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);
    document.addEventListener('click', function(e) {
        if (sideMenu.classList.contains('open') && !sideMenu.contains(e.target) && e.target !== menuBtn) {
            closeMenu();
        }
    });
});

// 轮播图（仅当页面存在轮播容器时初始化）
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoInterval;

    // 创建指示点
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function goToSlide(index) {
        const total = slides.length;
        currentIndex = (index + total) % total;
        const offset = -currentIndex * 100;
        document.querySelector('.carousel').style.transform = `translateX(${offset}%)`;
        updateDots();
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        autoInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoInterval);
        startAutoPlay();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    startAutoPlay();
});

// 语言切换与国际化（i18n）
document.addEventListener('DOMContentLoaded', function() {
    const langSelect = document.getElementById('languageSelect');
    if (!langSelect) return;

    // 从 localStorage 或浏览器语言获取初始语言
    let currentLang = localStorage.getItem('preferredLang') || 'zh-TW';
    // 确保语言选项存在
    const availableLangs = ['zh-TW', 'zh-CN', 'en-US', 'en-GB', 'ja'];
    if (!availableLangs.includes(currentLang)) {
        currentLang = 'zh-TW';
    }
    langSelect.value = currentLang;

    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = window.i18n?.[lang]?.[key];
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else if (el.tagName === 'IMG') {
                    el.alt = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });
        localStorage.setItem('preferredLang', lang);
    }

    langSelect.addEventListener('change', function(e) {
        setLanguage(e.target.value);
    });

    // 等待 i18n 加载完成（i18n.js 在 main.js 之前加载，但为确保安全，用 setTimeout 或检查）
    if (window.i18n) {
        setLanguage(currentLang);
    } else {
        // 如果 i18n 尚未加载，等待它
        window.addEventListener('i18nLoaded', function() {
            setLanguage(currentLang);
        });
    }
});