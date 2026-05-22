
document.addEventListener('DOMContentLoaded', () => {

    // Navbar 
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            nav.style.padding = '10px 0';
        } else {
            nav.style.background = 'transparent';
            nav.style.boxShadow = 'none';
            nav.style.padding = '20px 0';
        }
    });

    // Smooth Scroll
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

    //Counter Animation
    const statsSection = document.querySelector(".stats-section");
    const nums = document.querySelectorAll(".num");
    let started = false; // 

    function startCount(el) {
        let goal = parseInt(el.dataset.goal);
        if (isNaN(goal)) return; 
        let duration = 2000; 
        let increment = goal / (duration / 16); 
        let current = 0;

        let counter = setInterval(() => {
            current += increment;
            if (current >= goal) {
                el.textContent = goal; 
                clearInterval(counter);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16); 
    }

    // Start counting when the stats section is in view
    window.addEventListener('scroll', () => {
        if (statsSection) {
            // Start counting when the section 
            if (window.scrollY >= statsSection.offsetTop - 600) {
                if (!started) {
                    nums.forEach((num) => startCount(num));
                    started = true;
                }
            }
        }
    });

    // Booking Form Submission
    const BOOKING_ENDPOINT = '/api/appointments';

    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = bookingForm.querySelector('input[type="email"]');
            const phoneInput = bookingForm.querySelector('input[type="tel"]');
            const nameInput  = bookingForm.querySelector('input[type="text"]');
            const dateInput  = bookingForm.querySelector('input[type="date"]');
            const timeInput  = bookingForm.querySelector('input[type="time"]');
            const selectInput = bookingForm.querySelector('select');

            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            if (email === '' || phone === '') {
                alert('Please enter your details to complete the booking.');
                return;
            }

            const btn = bookingForm.querySelector('.book-now-btn');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            const payload = {
                name: nameInput ? nameInput.value.trim() : '',
                email,
                phone,
                service: selectInput ? selectInput.value : '',
                date: dateInput ? dateInput.value : '',
                time: timeInput ? timeInput.value : '',
            };

            fetch(BOOKING_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            .then((res) => {
                if (!res.ok) throw new Error('Server responded with ' + res.status);
                return res.json().catch(() => ({}));
            })
            .then(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Booked Successfully';
                btn.style.background = '#28a745';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    bookingForm.reset();
                }, 3000);
            })
            .catch((err) => {
                console.error('Booking error:', err);
                btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed, try again';
                btn.style.background = '#dc3545';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }


    const revealElements = document.querySelectorAll('.about-card, .service-card, .blog-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});