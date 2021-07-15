jQuery(document).ready(function() {
    var $ = jQuery;
    var previewObject = $('[data-role="preview"]');

    // Toggle action
    $('.footer > a').click(function(e) {
        e.preventDefault();
		if (!$(this).hasClass('visited')) {
			$(this).addClass('visited').html('Visit repository');
			if (!previewObject.hasClass('active')) {
				previewObject.addClass('active');
			}
		} else {
			window.location.href = "https://github.com/Stephino/octoms";
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