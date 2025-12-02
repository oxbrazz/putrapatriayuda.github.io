$(document).ready(function() {
    new WOW().init();
        $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').addClass('active');
        } else {
            $('.back-to-top').removeClass('active');
        }
    });
    
    $('.back-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
    
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate(
            {
                scrollTop: $($(this).attr('href')).offset().top - 70,
            },
            500,
            'swing'
        );
    });
    
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        
        submitBtn.html('<span class="loading"></span> Mengirim...');
        submitBtn.prop('disabled', true);
        
        setTimeout(function() {
            $('#contactForm').before(
                '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                'Pesan Anda telah berhasil dikirim! Kami akan menghubungi Anda segera.' +
                '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                '</div>'
            );
            
            $('#contactForm')[0].reset();
            
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
            
            setTimeout(function() {
                $('.alert-success').alert('close');
            }, 5000);
        }, 2000);
    });
    
    $('#newsletterForm').submit(function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        
        if (!isValidEmail(email)) {
            showAlert('Masukkan alamat email yang valid!', 'danger');
            return;
        }
        
        submitBtn.html('<span class="loading"></span> Berlangganan...');
        submitBtn.prop('disabled', true);
        
        setTimeout(function() {
            showAlert('Terima kasih! Anda telah berhasil berlangganan newsletter kami.', 'success');
            
            $('#newsletterForm')[0].reset();
            
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
        }, 1500);
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showAlert(message, type) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        
        $('#newsletterForm').before(
            `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`
        );
        
        setTimeout(function() {
            $(`.alert-${type}`).alert('close');
        }, 5000);
    }
    
    function checkScroll() {
        $('.wow').each(function() {
            if (isElementInViewport(this)) {
                $(this).addClass('animated');
            }
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    checkScroll();
    $(window).on('scroll', checkScroll);
    
    function animateCounter() {
        $('.counter').each(function() {
            const $this = $(this);
            const countTo = $this.attr('data-count');
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }
    
    if ($('.counter').length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        $('.counter').each(function() {
            observer.observe(this);
        });
    }
    
    $(window).on('load', function() {
        $('.preloader').fadeOut('slow');
    });
});

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}