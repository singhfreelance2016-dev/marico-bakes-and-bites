// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ========== MOBILE NAVIGATION TOGGLE ==========
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');

            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        const navAnchors = navLinks.querySelectorAll('a');
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }

    // ========== MENU CATEGORY SWITCHING ==========
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                menuCategories.forEach(category => category.classList.remove('active'));

                this.classList.add('active');

                const category = this.getAttribute('data-category');
                const targetCategory = document.getElementById(category);
                if (targetCategory) {
                    targetCategory.classList.add('active');
                }
            });
        });
    }

    // ========== OPEN/CLOSED STATUS BADGE ==========
    const openBadge = document.getElementById('openBadge');

    function updateOpenStatus() {
        if (!openBadge) return;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const openTime = 7 * 60;
        const closeTime = 21 * 60;

        const isOpen = currentTime >= openTime && currentTime < closeTime;

        if (isOpen) {
            openBadge.innerHTML = `
                <span class="badge-dot"></span>
                <span>Open Now · Closes at 9:00 PM</span>
            `;
            openBadge.style.background = '#4CAF50';
        } else {
            openBadge.innerHTML = `
                <span class="badge-dot" style="background: #ff5252;"></span>
                <span>Closed · Opens at 7:00 AM</span>
            `;
            openBadge.style.background = '#757575';
        }
    }

    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) {
                        const icon = menuToggle.querySelector('i');
                        icon.className = 'fas fa-bars';
                    }
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== GALLERY IMAGE MODAL ==========
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const bgStyle = this.style.backgroundImage;
            const imgUrl = bgStyle.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

            if (!imgUrl) return;

            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                cursor: pointer;
            `;

            modal.innerHTML = `
                <img src="${imgUrl}" alt="Gallery image" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 10px;">
                <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">&times;</button>
            `;

            document.body.appendChild(modal);

            const closeModal = function(e) {
                if (e.target === modal || e.target.tagName === 'BUTTON' || e.target.textContent === '×') {
                    document.body.removeChild(modal);
                    document.removeEventListener('keydown', handleEsc);
                }
            };

            modal.addEventListener('click', closeModal);

            const handleEsc = function(e) {
                if (e.key === 'Escape') {
                    closeModal(e);
                }
            };

            document.addEventListener('keydown', handleEsc);
        });
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 4px 20px rgba(139, 69, 19, 0.2)';
                navbar.style.padding = '10px 0';
            } else {
                navbar.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.1)';
                navbar.style.padding = '15px 0';
            }
        }
    });

    window.dispatchEvent(new Event('scroll'));

    // ========== INTERSECTION OBSERVER ANIMATIONS ==========
    const menuItems = document.querySelectorAll('.menu-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    if ('IntersectionObserver' in window) {
        const menuObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        menuItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            menuObserver.observe(item);
        });

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // ========== BUTTON CLICK EFFECT ==========
    const buttons = document.querySelectorAll('.btn, .category-btn, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // ========== ENSURE ACTIVE MENU CATEGORY ==========
    const firstButton = document.querySelector('.category-btn[data-category="croissants"]');
    const firstCategory = document.getElementById('croissants');

    if (firstButton && firstCategory) {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        menuCategories.forEach(category => category.classList.remove('active'));

        firstButton.classList.add('active');
        firstCategory.classList.add('active');
    }
});