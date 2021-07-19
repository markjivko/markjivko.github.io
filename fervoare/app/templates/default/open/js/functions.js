jQuery.extend({random: function (X) {
        return Math.floor(X * (Math.random() % 1));
    }, randomBetween: function (MinV, MaxV) {
        return MinV + jQuery.random(MaxV - MinV + 1);
    }});
$(document).ready(function () {
    // Egg dialogs
    $.each($('[data-hover], .submenu li'), function (k, v) {
        var hoverType = $(v).is('li') ? $(v).attr('class') : $(v).attr('data-hover');
        var hoverDialog = $('.' + hoverType + '-dialog');
        var listObject = $('.submenu li.' + hoverType);
        $(v).hover(
                function (e) {
                    if (!listObject.hasClass('current')) {
                        listObject.addClass('current');
                    }
                    hoverDialog.css('display', 'block');
                },
                function (e) {
                    if (listObject.hasClass('current')) {
                        listObject.removeClass('current');
                    }
                    hoverDialog.css('display', 'none');
                }
        );
    });

    // Click
    $('.fervoare').click(function () {
        window.location.href = "https://github.com/Stephino/fervoare";
    });

    // The dyno
    var feet = $.randomBetween(1, 10);
    window.setInterval(function () {
        window.setTimeout(function () {
            if (feet % 2 == 0) {
                $('.feet').css({
                    backgroundPosition: 'top right',
                    marginLeft: $.randomBetween(105, 132),
                    marginTop: $.randomBetween(170, 220),
                    display: 'none'
                }).fadeIn(900, function () {
                    $(this).fadeOut(200)
                });
            } else {
                $('.feet').css({
                    backgroundPosition: '0 0',
                    marginLeft: $.randomBetween(10, 40),
                    marginTop: $.randomBetween(102, 150),
                    display: 'none'
                }).fadeIn(900, function () {
                    $(this).fadeOut(200)
                });
            }
            feet = $.randomBetween(1, 10);
        }, $.randomBetween(500, 3000));
    }, 1100);

    // Page shifter
    var shifting = false;
    var shift = function (el) {
        var el = $(el);
        if (el && el.length > 0) {
            var p = el.position();
            shifting = true;
            $('html,body').animate({scrollTop: p.top}, 1500, function () {
                shifting = false;
            });
        }
    };

    // Get the submenu top
    var submenu = $('.submenu');
    var submenuPosition = submenu.position();

    // Use buttons to navigate
    $('.submenu ul li').click(function (e) {
        var cls = $.trim($(this).attr('class').replace(/current/, ''));

        // Navigate to the given element
        shift('.' + cls + '-content');
    });

    $(window).scroll(function (e) {
        if ($(window).scrollTop() >= submenuPosition.top) {
            if (!submenu.hasClass('top-fixed')) {
                submenu.addClass('top-fixed');
            }
            if (!shifting) {
                if ($(window).scrollTop() >= framework.top) {
                    $('.submenu ul li').removeClass('current');
                    $('.submenu ul li.framework').addClass('current');
                }

                if ($(window).scrollTop() >= task.top) {
                    $('.submenu ul li').removeClass('current');
                    $('.submenu ul li.task').addClass('current');
                }
                if ($(window).scrollTop() >= cms.top) {
                    $('.submenu ul li').removeClass('current');
                    $('.submenu ul li.cms').addClass('current');
                }
                if ($(window).scrollTop() >= startup.top) {
                    $('.submenu ul li').removeClass('current');
                    $('.submenu ul li.startup').addClass('current');
                }
            }
        } else {
            submenu.removeClass('top-fixed');
            if (!shifting) {
                $('.submenu ul li').removeClass('current');
            }
        }
    });
});