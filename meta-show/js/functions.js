$(document).ready(function () {
    // PWA
    (() => {
        var getPath = relativePath => {
            if ("string" !== typeof relativePath) {
                relativePath = "";
            }
            return window.location.origin + (relativePath ? "/" + relativePath : "");
        };

        var workers = () => {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                    .register(getPath("pwa.js"), {
                        scope: getPath(),
                        useCache: true
                    })
                    .then(() => {})
                    .catch(() => {});
            }
        };

        var manifest = () => {
            var linkObject = document.getElementById("pwa_manifest");
            if (null === linkObject) {
                return;
            }
            if (null !== linkObject.getAttribute("href")) {
                return;
            }
            var myDynamicManifest = {
                description: "Live Events 3.0",
                short_name: "MetaShow",
                name: "MetaShow",
                theme_color: "#ffffff",
                background_color: "#0d0519",
                dir: "ltr",
                lang: "en-US",
                start_url: getPath(),
                scope: getPath(),
                icons: [
                    {
                        src: getPath("img/logo/64.png"),
                        sizes: "64x64",
                        type: "image/png",
                        purpose: "maskable any"
                    },
                    {
                        src: getPath("img/logo/192.png"),
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable any"
                    },
                    {
                        src: getPath("img/logo/512.png"),
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable any"
                    }
                ],
                display: "fullscreen",
                orientation: "portrait"
            };
            var manifestURL = URL.createObjectURL(
                new Blob([JSON.stringify(myDynamicManifest)], {
                    type: "application/json"
                })
            );
            linkObject.setAttribute("href", manifestURL);
        };

        workers();
        manifest();
    })();

    // Animate quote
    (() => {
        var quoteObject = $(".quote p");
        var quoteText = quoteObject.text();
        var quoteLength = 0;
        quoteObject.html("");

        // Next letter animation
        var nextLetter = () => {
            quoteObject.html(quoteText.substring(0, ++quoteLength));
            if (quoteLength < quoteText.length) {
                window.setTimeout(nextLetter, 55);
            }
        };
        setTimeout(nextLetter, 500);
    })();

    $(window).scroll(function () {
        if ($(document).scrollTop() > 50) {
            $(".headerCol").addClass("fixedHeader");
        } else {
            $(".headerCol").removeClass("fixedHeader");
        }
    });

    $(".toggle").click(function () {
        $("html").toggleClass("actNav");
    });

    $(".menuBackDrop, .data-scroll").click(function () {
        $("html").removeClass("actNav");
    });

    $(window).on("mousemove", function (e) {
        var w = $(window).width();
        var h = $(window).height();
        var offsetX = 0.5 - e.pageX / w;
        var offsetY = 0.5 - e.pageY / h;

        $(".parallax").each(function (i, el) {
            var offset = parseInt($(el).data("offset"));
            var translate = "translate3d(" + Math.round(offsetX * offset) + "px," + Math.round(offsetY * offset) + "px, 0px)";
            $(el).css({
                "-webkit-transform": translate,
                "transform": translate,
                "moz-transform": translate
            });
        });

        $(".parallax-x").each(function (i, el) {
            var offset = parseInt($(el).data("offset"));
            var translate = "translate3d(" + Math.round(offsetX * offset) + "px," + "0px, 0px)";

            $(el).css({
                "-webkit-transform": translate,
                "transform": translate,
                "moz-transform": translate
            });
        });
    });

    new Swiper(".tokenSwiper", {
        slidesPerView: "auto",
        spaceBetween: 15,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },

        breakpoints: {
            576: {
                slidesPerView: "auto",
                spaceBetween: 15
            },

            768: {
                slidesPerView: 3,
                spaceBetween: 15
            },

            1200: {
                slidesPerView: 3,
                spaceBetween: 24
            }
        }
    });

    new Swiper(".roadmapSwiper", {
        slidesPerView: "auto",
        spaceBetween: 25,

        breakpoints: {
            640: {
                slidesPerView: "auto",
                spaceBetween: 25
            },

            768: {
                slidesPerView: 4,
                spaceBetween: 30
            },

            1200: {
                slidesPerView: 4,
                spaceBetween: 24
            }
        }
    });

    new Swiper(".marqueeSlider2", {
        spaceBetween: 0,
        centeredSlides: true,
        speed: 7000,
        autoplay: {
            delay: 1
        },
        loop: true,
        slidesPerView: "auto",
        allowTouchMove: false,
        disableOnInteraction: true
    });

    new Swiper(".marqueeSlider1", {
        spaceBetween: 0,
        centeredSlides: true,
        speed: 7000,
        autoplay: {
            delay: 1,
            reverseDirection: true
        },
        loop: true,
        loopedSlides: 4,
        slidesPerView: "auto",
        allowTouchMove: false,
        disableOnInteraction: true
    });

    $("[data-scroll-to]").click(function () {
        var $this = $(this),
            $toElement = $this.attr("data-scroll-to"),
            $offset = $this.attr("data-scroll-offset") * 1 || 0,
            $speed = $this.attr("data-scroll-speed") * 1 || 500;
        $("html, body").animate(
            {
                scrollTop: $($toElement).offset().top + $offset
            },
            $speed
        );
    });

    new Swiper(".accordionSlider", {
        effect: "fade",
        mousewheel: {
            mousewheelControl: true,
            releaseOnEdges: true
        },
        speed: 2000
    });

    $(".videoCol").click(function () {
        if ($(this).find(".video").get(0).paused) {
            $(this).find(".video").get(0).play();
            $(this).find(".playpause").fadeOut();
        } else {
            $(this).find(".video").get(0).pause();
            $(this).find(".playpause").fadeIn();
        }
    });
});
