/* global fervoare */
$(document).ready(function () {
    var set_slug = function () {
        $('#slug_is_blog').css(
                'display',
                $('[name="type"]').val() === '1' ? 'inline' : 'none'
                );
        $('#slug_link').attr(
                'href',
                $('#slug_before').html()
                + ($('[name="type"]').val() === '1' ? $('#slug_is_blog').html() : '')
                + $('[name="slug"]').val()
                );
    };

    // Set the slug
    set_slug();
    $('[name="type"],[name="slug"]').change(function () {
        set_slug();
        $('#slug_link').css('display', 'none');
    });

    // Append the update functionality
    fervoare.toolbox.post_update = function (h, c) {
        if (typeof c.slug !== 'undefined') {
            $('[name="slug"]').val(c.slug);
            set_slug();
        }
        if (typeof c.title !== 'undefined') {
            $('[name="title"]').val(c.title);
        }
        if (typeof c.status !== 'undefined') {
            $('#slug_link').css('display', c.status === '1' ? 'inline-block' : 'none');
        }
        if (typeof c.content !== 'undefined') {
            $('textarea#content.edit').val(c.content);
        }
    };
});