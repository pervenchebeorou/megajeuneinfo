/**
 * MegaJeune - Carousel d'affiches avec navigation WhatsApp
 * Fonctionnalités :
 * - Navigation précédent/suivant
 * - Indicateurs cliquables
 * - Navigation au clavier
 * - Auto-défilement optionnel
 * - Gestion responsive
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.affiche-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.querySelector('.indicators');
    
    // Variables d'état
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoScrollInterval;
    let isAutoScrollPaused = false;
    const autoScrollDelay = 5000; // 5 secondes

    // Initialisation
    function init() {
        createIndicators();
        setupEventListeners();
        updateCarousel();
        startAutoScroll(); // Décommentez pour activer l'auto-défilement
    }

    // Création des indicateurs
    function createIndicators() {
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.classList.add('indicator');
            indicator.setAttribute('aria-label', `Aller à l'affiche ${index + 1}`);
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetAutoScroll();
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }

    // Mise à jour du carousel
    function updateCarousel() {
        // Déplacement des slides
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Mise à jour des indicateurs
        document.querySelectorAll('.indicator').forEach((ind, idx) => {
            ind.classList.toggle('active', idx === currentIndex);
            ind.setAttribute('aria-current', idx === currentIndex);
        });
        
        // Mise à jour de l'accessibilité
        updateAriaLabels();
    }

    // Navigation
    function goToSlide(index) {
        currentIndex = (index + slideCount) % slideCount;
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Auto-défilement
    function startAutoScroll() {
        if (!autoScrollInterval) {
            autoScrollInterval = setInterval(() => {
                if (!isAutoScrollPaused) nextSlide();
            }, autoScrollDelay);
        }
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        startAutoScroll();
    }

    function pauseAutoScroll() {
        isAutoScrollPaused = true;
    }

    function resumeAutoScroll() {
        isAutoScrollPaused = false;
    }

    // Accessibilité
    function updateAriaLabels() {
        carousel.setAttribute('aria-live', isAutoScrollPaused ? 'polite' : 'off');
    }

    // Gestion des événements
    function setupEventListeners() {
        // Boutons de navigation
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoScroll();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoScroll();
        });
        
        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoScroll();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoScroll();
            }
        });
        
        // Pause au survol
        carousel.addEventListener('mouseenter', pauseAutoScroll);
        carousel.addEventListener('mouseleave', resumeAutoScroll);
        carousel.addEventListener('focusin', pauseAutoScroll);
        carousel.addEventListener('focusout', resumeAutoScroll);
        
        // Tactile (évite le conflit avec le swipe)
        carousel.addEventListener('touchstart', pauseAutoScroll);
        carousel.addEventListener('touchend', () => {
            setTimeout(resumeAutoScroll, autoScrollDelay);
        });
    }

    // Démarrer l'application
    init();

    // Exposer les fonctions pour le débogage (optionnel)
    window.carouselAPI = {
        nextSlide,
        prevSlide,
        goToSlide,
        pauseAutoScroll,
        resumeAutoScroll
    };
});