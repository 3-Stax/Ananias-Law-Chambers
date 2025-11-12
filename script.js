// DOM Elements
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const header = document.querySelector('.main-header');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.prev-button');
const nextBtn = document.querySelector('.next-button');
const indicators = document.querySelectorAll('.indicator');
const testimonialItems = document.querySelectorAll('.testimonial');
const prevTestBtn = document.querySelector('.prev-test');
const nextTestBtn = document.querySelector('.next-test');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('section');

// ADDED FOR COUNT-UP: Select elements with the 'count-target' class from your HTML modification
const countTargets = document.querySelectorAll('.count-target'); 

// State
let currentSlide = 0;
let currentTestSlide = 0;
let autoPlayInterval;
const totalSlides = carouselItems.length;
const totalTests = testimonialItems.length;

// ADDED FOR COUNT-UP: State variable to ensure the count only runs once per page load
let hasCounted = false; 

// --- COUNT-UP EFFECT FUNCTION ---
const runCountUp = (targetElement) => {
    // 1. Get the final number from the data-target attribute
    const finalTarget = +targetElement.getAttribute('data-target');
    let currentCount = 0;
    
    // 2. Define the duration (e.g., 2 seconds = 2000ms) and step size
    const duration = 2000;
    // Calculate increment step based on total target and desired duration (time in ms / interval rate)
    const steps = duration / 20; 
    const increment = finalTarget / steps; 

    const counter = setInterval(() => {
        currentCount += increment;
        
        if (currentCount < finalTarget) {
            // Display the number rounded down
            targetElement.innerText = Math.floor(currentCount);
        } else {
            // Stop the interval and ensure the exact final number is displayed
            clearInterval(counter);
            targetElement.innerText = finalTarget;
        }
    }, 20); // Run update every 20ms
};

// Mobile Menu Toggle
mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Smooth Scrolling
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

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Carousel Functions
function showSlide(index) {
    carouselItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    let newIndex = (currentSlide + 1) % totalSlides;
    showSlide(newIndex);
}

function prevSlide() {
    let newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(newIndex);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
});

// Auto-play Carousel
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// Pause on hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);

startAutoPlay();

// Testimonials Carousel
function showTestSlide(index) {
    testimonialItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    currentTestSlide = index;
}

function nextTestSlide() {
    let newIndex = (currentTestSlide + 1) % totalTests;
    showTestSlide(newIndex);
}

function prevTestSlide() {
    let newIndex = (currentTestSlide - 1 + totalTests) % totalTests;
    showTestSlide(newIndex);
}

nextTestBtn.addEventListener('click', nextTestSlide);
prevTestBtn.addEventListener('click', prevTestSlide);

setInterval(nextTestSlide, 6000);

// Form Validation and Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic validation (already handled by HTML5, but enhance)
    const formData = new FormData(contactForm);
    const honeypot = formData.get('website');
    if (honeypot) {
        return; // Spam
    }
    
    // Simulate AJAX submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Placeholder for actual submission (e.g., fetch to /api/contact)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        alert('Thank you! Your message has been sent. We\'ll respond within 24 hours.');
        contactForm.reset();
    } catch (error) {
        alert('Oops! Something went wrong. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// --- SCROLL ANIMATIONS AND COUNT-UP LOGIC ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Merged the two observer implementations into one
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 1. Activate the standard section visibility class
            entry.target.classList.add('visible');

            // 2. NEW COUNT-UP LOGIC: Check if it's the 'about' section and run the count only once.
            if (entry.target.id === 'about' && !hasCounted) {
                countTargets.forEach(runCountUp);
                hasCounted = true; // Prevents re-running the count
            }
        }
        // If you want sections to disappear when scrolling away, add:
        // else { entry.target.classList.remove('visible'); }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Initial load
showSlide(0);
showTestSlide(0);