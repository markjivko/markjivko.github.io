(function($) {
    "use strict";
    $(window).on('load', function() {
        $('#status').fadeOut(); 
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({'overflow':'visible'});
    })

    skrollr.init({smoothScrolling: true});

    var videoObject = $('.video');
    if (videoObject.length > 0) {
        videoObject.magnificPopup({
            type: 'iframe',
                iframe: {
                    markup: '<div class="mfp-iframe-scaler" >' +
                        '<div class="mfp-close"></div>' +
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                    '</div></div>'
                }
        });
    }

    var counterObject = $('.counter');
    if (counterObject.length > 0) {
        counterObject.counterUp({
            delay: 20,
            time: 3000
        });
    }

    var swiperObject = $('.swiper-container');
    if (swiperObject.length > 0) {
        var swiper = new Swiper(swiperObject, {
            effect: 'coverflow',
            loop: true,
            centeredSlides: true,
            autoplay: 2000,
            speed: 2000,
            slidesPerView: 'auto',
            coverflow: {
                rotate: 0,
                stretch: 80,
                depth: 200,
                modifier: 1,
                slideShadows : false
            }
        });
    }

    var parallaxObject = $('.parallaxie');
    if (parallaxObject.length > 0) {
        parallaxObject.parallaxie({
            speed: .975
        });
    }

    var quoteCarousel = $('.quote-wrapper')
    if (quoteCarousel.length > 0) {
        quoteCarousel.owlCarousel({
            loop:true,
            autoplayTimeout:3500,
            nav: false,
            margin:20,
            responsive:{
                320:{
                    items:1
                },
                681:{
                    items:2
                },
                991:{
                    items:3
                },
                1200:{
                    items:4
                },
                1920:{
                    items:5
                }
            }
        })
    }

    var toolsCarousel = $('.tools-carousel')
    if (toolsCarousel.length > 0) {
        toolsCarousel.owlCarousel({
            loop:true,
            autoplay:true,
            autoplayTimeout:1000,
            autoWidth:true,
            nav: false,
            responsive:{
                320:{
                    items:2
                },
                681:{
                    items:4
                },
                991:{
                    items:6
                },
                1200:{
                    items:8
                }
            }
        })
    }
    
    new WOW().init();

    var navItemObjects = $('.right-nav a, .demo a');
    if (navItemObjects.length > 0 ) {
        navItemObjects.on('click', function (e) {
            $(document).off("scroll");
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
                || location.hostname == this.hostname) {

                var target = $(this.hash),
                headerHeight = $(".navbar").height()-2; // Get fixed header height

                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                if (target.length) {
                    $('html,body').animate({
                      scrollTop: target.offset().top - headerHeight
                    }, 1000);
                    return false;
                }
            }
        });
    }

    var toggleIcon = function(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('glyphicon-plus glyphicon-minus');
    };
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

})(jQuery); 