/* global fervoare */
$(document).ready(function () {
    $('span.online.on').live('click', function () {
        $(this).find('form').submit();
    });

    // Add the logout function
    fervoare.toolbox.logOut = function (h, c) {
        $(h).parents('span.online.on').removeClass('on');
    };

    // Add the user form update function
    fervoare.toolbox.formUpdate = function (h, c) {
        if (typeof c.username !== 'undefined')
            $('[name=username]').val(c.username);
        if (typeof c.name !== 'undefined')
            $('[name=name]').val(c.name);
        if (typeof c.role !== 'undefined')
            $('[name=role]').val(c.role);
        if (typeof c.email !== 'undefined')
            $('[name=email]').val(c.email);
    };
});