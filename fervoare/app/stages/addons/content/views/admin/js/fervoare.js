/**
 * Copyright &copy; 2011 Mark Jivko
 * 
 */
(function($) {var $div = $('<div style="background-position: 3px 5px">'); $.support.backgroundPosition = $div.css('backgroundPosition') === "3px 5px" ? true : false; $.support.backgroundPositionXY = $div.css('backgroundPositionX') === "3px" ? true : false; $div = null; var xy = ["X", "Y"]; function parseBgPos(bgPos) {var parts = bgPos.split(/\s/), values = {"X": parts[0], "Y": parts[1]}; return values; }if (!$.support.backgroundPosition && $.support.backgroundPositionXY) {$.cssHooks.backgroundPosition = {get: function(elem, computed, extra) {return $.map(xy, function(l, i) {return $.css(elem, "backgroundPosition" + l); }).join(" "); }, set: function(elem, value) {$.each(xy, function(i, l) {var values = parseBgPos(value); elem.style[ "backgroundPosition" + l ] = values[ l ]; }); }}; }if ($.support.backgroundPosition && !$.support.backgroundPositionXY) {$.each(xy, function(i, l) {$.cssHooks[ "backgroundPosition" + l ] = {get: function(elem, computed, extra) {var values = parseBgPos($.css(elem, "backgroundPosition")); return values[ l ]; }, set: function(elem, value) {var values = parseBgPos($.css(elem, "backgroundPosition")), isX = l === "X"; elem.style.backgroundPosition = (isX ? value : values[ "X" ]) + " " + (isX ? values[ "Y" ] : value); }}; $.fx.step[ "backgroundPosition" + l ] = function(fx){$.cssHooks[ "backgroundPosition" + l ].set(fx.elem, fx.now + fx.unit); }; }); }})(jQuery);
        jQuery.cookie = function (key, value, options) {if (arguments.length > 1 && String(value) !== "[object Object]") {options = jQuery.extend({}, options); if (value === null || value === undefined) {options.expires = - 1; }if (typeof options.expires === 'number') {var days = options.expires, t = options.expires = new Date(); t.setDate(t.getDate() + days); }value = String(value); return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join('')); }options = value || {}; var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent; return (result = new RegExp(encodeURIComponent(key) + '=([^;]*)(?!.*slider)').exec(document.cookie)) ? decode(result[1]) : null; };
        (function($){var a = {}, c = "doTimeout", d = Array.prototype.slice; $[c] = function(){return b.apply(window, [0].concat(d.call(arguments)))}; $.fn[c] = function(){var f = d.call(arguments), e = b.apply(this, [c + f[0]].concat(f)); return typeof f[0] === "number" || typeof f[1] === "number"?this:e}; function b(l){var m = this, h, k = {}, g = l?$.fn:$, n = arguments, i = 4, f = n[1], j = n[2], p = n[3]; if (typeof f !== "string"){i--; f = l = 0; j = n[1]; p = n[2]}if (l){h = m.eq(0); h.data(l, k = h.data(l) || {})} else{if (f){k = a[f] || (a[f] = {})}}k.id && clearTimeout(k.id); delete k.id; function e(){if (l){h.removeData(l)} else{if (f){delete a[f]}}}function o(){k.id = setTimeout(function(){k.fn()}, j)}if (p){k.fn = function(q){if (typeof p === "string"){p = g[p]}p.apply(m, d.call(n, i)) === true && !q?o():e()}; o()} else{if (k.fn){j === undefined?e():k.fn(j === false); return true} else{e()}}}})(jQuery);
        var fervoare = {
        toolbox: {
        colored: function(h){

        },
                getHashValue: function()
                {
                var arr = window.location.hash.split("#");
                        var hasValue = arr[1];
                        if (typeof hasValue == "undefined")
                {
                return false;
                }
                var hashLen = hasValue.indexOf("?");
                        if (hashLen > 0)
                {
                hasValue = hasValue.substring(0, hashLen);
                }
                return hasValue;
                },
                onHashChange: function(event) {
                var lastHash = fervoare.toolbox.getHashValue();
                        event(lastHash);
                        (function watchHash()
                        {
                        var hash = fervoare.toolbox.getHashValue();
                                if (hash !== lastHash)
                        {
                        event(hash); lastHash = hash;
                        }
                        var t = setTimeout(watchHash, 100);
                        })();
                },
                redirect: function(h, to) {
                window.location.href = (typeof to != 'string')?window.location.href:to;
                },
                refresh: function() {
                location.reload();
                }
        },
                init:function(){
                $('html').append("<div id='loadingPage'><div>Loading...</div></div>");
                        $(document).ready(function(){
                fervoare.xform().sections().nav().help();
                        var adjust = function(){
                        var w = $(window).width() - $('#sidebar').outerWidth() - 100;
                                if (w > 700){
                        $('body').css('overflowX', 'hidden');
                        } else {
                        $('body').css('overflowX', 'auto');
                        }
                        };
                        $(window).resize(function(){adjust(); });
                        adjust();
                        $('#loadingPage').fadeOut(300, function(){$(this).remove(); });
                });
                },
                nav:function(){
                $('.history .center-button').click(function(){
                var b = $('.history .breadcrumbs');
                        if (b.hasClass('active'))
                {
                $(this).removeClass('active');
                        b.removeClass('active');
                }
                else
                {
                $(this).addClass('active');
                        b.addClass('active');
                }
                });
                        $('.history .refresh-button').click(function(){
                location.reload();
                });
                        return fervoare;
                },
                sections:function(){
                if ($('section').length > 0)
                {
                $('#content').prepend('<div id="sections"><div class="sections"></div></div>');
                        var sections = $('div:first-child', $('#sections'));
                        $.each($('section'), function(){
                        var section = $(this);
                                if (typeof section.attr('name') != 'undefined')
                        {
                        var name = section.attr('name').replace(/[^a-zA-Z0-9-_]/ig, "_");
                                sections.append('<a href="#' + name + '" id="section_' + name + '"><span class="section_icon" ' + (typeof section.attr('icon') != 'undefined'?'style="background-image: url(' + img + '/sections/' + section.attr('icon') + ');"':'') + '></span>' + section.attr('name') + '</a>');
                                $('a:last-child', sections).data('el', section);
                        }
                        section.css({display:'none'});
                        });
                        fervoare.toolbox.onHashChange(function(h){
                        id = ($("#section_" + h).length == 0)?$('.sections :first-child').attr('id'):"section_" + h;
                                $('a', sections).removeClass('current');
                                $('section').css({display:'none'});
                                $("#" + id).addClass('current');
                                $("#" + id).data('el').show();
                        });
                }
                return fervoare;
                },
                xform:function(){
                $.each($('form.x'), function(k, v){
                if ($(this).attr('rel') != 'plain' && typeof $(this).data('events') == 'undefined')$(this).submit(function(){
                fervoare.alert('Loading...', 'loading');
                        var h = $(this);
                        var form = {}; $.each(h.find('[name]'), function(){form[$(this).attr('name')] = $(this).val(); }); form["#*#"] = true;
                        if (typeof $(this).data('*') != 'undefined') $.each($(this).data('*'), function(k, v){form[k] = v; });
                        var ajaxSettings = {type: 'post', data: form, cache: false, async: true, dataType: 'text',
                                success: function(d, s, j){
                                try
                                {
                                d = $.parseJSON(d);
                                        (typeof d._status_ != 'undefined')?fervoare.alert(d._status_[0], d._status_[1]):(typeof d.octoms_error != 'undefined' || typeof d.octoms_help != 'undefined'?fervoare.alert('Error.', false):fervoare.alert('Done.', true));
                                        (typeof d._filters_ != 'undefined')?$.each(d._filters_, function(k, v){(typeof fervoare.toolbox[v] == 'function')?fervoare.toolbox[v](h, (typeof d._content_ != 'undefined'?d._content_:null)):null; }):null;
                                        if (typeof d.octoms_error != 'undefined')
                                {
                                if (typeof d.octoms_error.e != 'undefined' && d.octoms_error.e != null)
                                {
                                fervoare.box('OctoMS PHP Framework <span style="color:darkred">Error</span>', '<div>' + $.parseJSON(d.octoms_error.e) + '</div>');
                                }
                                if (typeof d.octoms_error.x != 'undefined' && d.octoms_error.x != null)
                                {
                                fervoare.box('OctoMS PHP Framework <span style="color:darkred">Exception</span>', '<div>' + $.parseJSON(d.octoms_error.x) + '</div>');
                                }
                                }
                                if (typeof d.octoms_help != 'undefined')
                                {
                                if (typeof d.octoms_help.c != 'undefined' && d.octoms_help.c != null)
                                {
                                fervoare.box('OctoMS PHP Framework <span style="color:darkblue">Variable export</span>', '<div>' + $.parseJSON(d.octoms_help.c) + '</div><br/><h2>Please remove the help() function call from your script.</h2>');
                                }
                                else if (typeof d.octoms_help.s != 'undefined' && d.octoms_help.s != null)
                                {
                                fervoare.box('OctoMS PHP Framework <span style="color:darkblue">Wizard search</span>', '<div>' + d.octoms_help.s + '</div><br/><h2>Please remove the help() function call from your script.</h2>');
                                }
                                }
                                }
                                catch (err)
                                {
                                fervoare.toolbox.refresh();
                                }
                                },
                                error: function(d, s, j){
                                fervoare.toolbox.refresh();
                                }
                        };
                        if (typeof $(v).attr('action') != 'undefined' && $(v).attr('action').length > 0) ajaxSettings.url = $(v).attr('action');
                        $.ajax(ajaxSettings);
                        return false;
                });
                });
                        fervoare.confirm();
                        return fervoare;
                },
                alert:function(text, s, d, t){
                if (typeof text == 'undefined' || typeof text != 'string') text = text.toString();
                        status = (typeof s == 'undefined')?'success':(s == true?'success':(s == false?'error':s));
                        duration = (typeof d == 'undefined')?300:d;
                        timeout = (typeof t == 'undefined')?4000:t;
                        var notif = $('#notif').css('display', 'none').removeClass().addClass('notif_' + status).html(text);
                        (status == 'loading')?notif.css('display', 'block'):notif.show('slide', {direction:'left'}, duration);
                        $.alertTimeout && clearTimeout($.alertTimeout);
                        $.alertTimeout = setTimeout(function(){(status == 'loading')?notif.css('display', 'none'):notif.hide('slide', {direction:'right'}, duration); }, timeout);
                },
                box:function(title, content, actions, event, holder){
                if (typeof actions == 'undefined') actions = {"ok":function(e, h){return true; }, "cancel":function(e, h){return false; }};
                        if (typeof content == 'undefined') content = "";
                        if (typeof title == 'undefined') title = "Fervoare CMS";
                        buttons = ''; $.each(actions, function(k, v){t = k.charAt(0).toUpperCase(); t = t + k.substr(1); buttons += '<div class="action unselectable" rel="' + k + '">' + t + '</div>'; });
                        $('body').prepend('<div class="fervbox"><div><div class="title unselectable">' + title + '<div class="action close">x</div></div><div class="content">' + content + '</div>' + buttons + '</div></div>');
                        var fervbox = $('body :first').fadeIn(600);
                        $('.action', fervbox).click(function(){
                if (typeof actions[$(this).attr('rel')] != 'undefined')actions[$(this).attr('rel')](event, holder);
                        fervbox.fadeOut(500, function(){fervbox.remove(); });
                });
                },
                confirm:function(){
                var handler = function(e){
                var v = $(this);
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        e.preventDefault();
                        fervoare.box(
                                (typeof $(v).attr('title') == 'undefined')?$(v).data('title'):$(v).attr('title'),
                                $(v).attr('confirm'),
                        {
                        "ok":function(e, h){
                        $(h).unbind(e.type);
                                $.each($(h).data('ferv-events'), function(k, v){$(h).bind(v[0], v[1]); });
                                $(h).trigger(e.type);
                                fervoare.confirm();
                        },
                                "cancel":function(e, h){
                                }
                        },
                                e,
                                v
                                );
                        return false;
                };
                        $.each($('[confirm]'), function(_k, _v){
                        if ((typeof $(_v).data('events') != 'undefined' || typeof $(_v).attr('onclick') != 'undefined' || typeof $(_v).attr('onsubmit') != 'undefined') && typeof $(_v).data('ferv-events') == 'undefined')
                        {
                        var data = [];
                                var used = 'click';
                                if (typeof $(_v).data('events') != 'undefined')
                        {
                        $.each($(_v).data('events'), function(k, v){
                        if (k == 'click' || k == 'submit')
                        {
                        $.each(v, function(e_k, e_v){
                        data[e_k] = [k, e_v['handler']];
                        });
                                $(_v).unbind(k);
                                used = k;
                        }
                        });
                        }
                        if (typeof $(_v).attr('onclick') != 'undefined')
                        {
                        data[data.length] = ['click', new Function($(_v).attr('onclick'))];
                                $(_v).removeAttr('onclick');
                        }
                        if (typeof $(_v).attr('onsubmit') != 'undefined')
                        {
                        data[data.length] = ['submit', new Function($(_v).attr('onsubmit'))];
                                $(_v).removeAttr('onsubmit');
                        }
                        $(_v).data('ferv-events', data);
                                $(_v).bind(used, handler);
                        }
                        });
                        return fervoare;
                },
                help:function(){
                if ($('help').length > 0 && $('.history').length > 0)
                {
                $('.history .help-button').css('display', 'block').click(function(e){
                var help = $('help').css('display', 'none');
                        fervoare.box(
                                (typeof help.attr('title') == 'undefined')?(typeof help.data('title') == 'undefined'?'Fervoare CMS Help':help.data('title')):help.attr('title'),
                                help.html(),
                        {
                        "Ok":function(e, h){}
                        },
                                e,
                                help
                                );
                });
                }
                return fervoare;
                }
        };
        fervoare.init();