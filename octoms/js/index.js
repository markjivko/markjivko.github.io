jQuery(document).ready(function() {
    var $ = jQuery;
    var previewObject = $('[data-role="preview"]');

    // Toggle action
    $('.footer > a').click(function(e) {
        e.preventDefault();
        if (!previewObject.hasClass('active')) {
            previewObject.addClass('active');
        }
    });
    $('[data-role="preview"] a').click(function(e) {
        e.preventDefault();
        if (previewObject.hasClass('active')) {
            previewObject.removeClass('active');
        }
    });
    
    // Initialize the UI
    $.dragandscroll.init();
    $.flyingtabs.init();
});