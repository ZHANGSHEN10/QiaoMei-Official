// 導航欄滾動效果
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// 顯示當前時間
function updateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        timeEl.innerHTML = `<i class="fas fa-clock"></i>${timeStr}`;
    }
}

updateTime();
setInterval(updateTime, 1000);

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 漢堡選單
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 點擊選單連結後關閉選單
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// 滾動監聽 - 更新導航 active 狀態
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-download)');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// 載入動畫
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 卡片懸停效果 - 添加動畫類
const cards = document.querySelectorAll('.character-card, .feature-card, .about-card');

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

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// 星空背景動態效果
function createStar() {
    const stars = document.querySelector('.stars');
    if (!stars) return;
    
    const star = document.createElement('div');
    star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
    `;
    stars.appendChild(star);
}

// 初始化一些星星
for (let i = 0; i < 50; i++) {
    createStar();
}

// 按鈕點擊漣漪效果
document.querySelectorAll('.btn, .download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// 添加漣漪動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 角色卡片懸停音效提示（可選）
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// 滾動時顯示/隱藏回到頂部按鈕
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 500) {
        if (currentScroll > lastScroll) {
            // 向下滾動
        } else {
            // 向上滾動
        }
    }
    lastScroll = currentScroll;
});

// 媒體網格 hover 效果
document.querySelectorAll('.media-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const placeholder = this.querySelector('.media-placeholder');
        if (placeholder) {
            placeholder.style.borderColor = 'var(--primary)';
            placeholder.style.color = 'var(--primary-light)';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const placeholder = this.querySelector('.media-placeholder');
        if (placeholder) {
            placeholder.style.borderColor = '';
            placeholder.style.color = '';
        }
    });
});

// 監聽動畫
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-header, .about-card, .feature-card');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
            el.style.opacity = '1';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// 初始化動畫狀態
document.querySelectorAll('.section-header, .about-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});
