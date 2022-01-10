/*!
 * Drag and scroll for OctoMS Help
 * 
 * Copyright 2011, Mark Jivko https://markjivko.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * ["init","update"]
 * Depends on libraries: jQuery, jQuery User Interface 1.8.11
 */
jQuery.dragandscroll = {
    init: function (minWidth) {
        if (typeof minWidth == 'undefined') {
            minWidth = 200;
        }
        this.minWidth = minWidth;
        this.left = $('#left');
        this.right = $('#right');
        this.box_left = $('#box-left');
        this.box_right = $('#box-right');
        this.dragBar = $('#drag-bar');
        $(window).resize(function () {
            $.dragandscroll.update();
        });
        $(window).load(function () {
            $.dragandscroll.update();
        });
        this.dragBar.draggable({axis: 'x', scroll: true, opacity: 0.5, helper: 'clone', cursor: 'col-resize', stop: function (event, ui) {
            $.dragandscroll.update(ui.offset.left);
        }});
    },
    update: function (offsetLeft) {
        if (typeof offsetLeft == 'undefined')
            offsetLeft = this.left.outerWidth();
        this.winWidth = $(window).width();
        if (offsetLeft <= this.minWidth)
            offsetLeft = this.minWidth;
        if (this.winWidth - offsetLeft <= this.minWidth)
            offsetLeft = this.winWidth - this.minWidth;
        offset = (this.winWidth - offsetLeft) / this.winWidth * 100;
        this.dragBar.css('left', offsetLeft + 'px');
        this.left.css('width', (100 - offset) + '%');
        this.right.css('width', offset + '%');
        this.box_left.css('width', this.left.css('width'));
        this.box_right.css('width', this.right.css('width'));
    }
};

/*!
 * FlyingTabs for OctoMS Help
 * 
 * Copyright 2011, Mark Jivko https://markjivko.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * ["init","movable","add"]
 * Depends on libraries: jQuery, jQuery User Interface 1.8.11, Drag and scroll for OctoMS Help
 */
jQuery.flyingtabs = {
    init: function (holders) {
        if (typeof holders == 'undefined')
            holders = {1: 'left', 2: 'right'};
        this.holders = holders;
        $.each(this.holders, function (index, value) {
            $.flyingtabs[value] = $('#' + value + ' .full-content');
            $.flyingtabs[value].sortable({placeholder: "ui-state-highlight", axis: 'y', cursor: 'move', scroll: false, tolerance: 'pointer', start: function (event, ui) {
                    ui.placeholder.css('height', ui.item.outerHeight());
                }});
        });
    },
    movable: function () {
        $.each([this.lastPrepend[0].childNodes[1], this.lastPrepend[1].childNodes[0], this.lastPrepend[1].childNodes[1]], function (i, v) {
            $(v).bind('click, mousedown', function (e) {
                e.stopPropagation();
            });
        });
        $('.tab-close').click(function () {
            $(this).parent().parent().slideUp(200, function () {
                $(this).remove();
            });
            setTimeout('$.dragandscroll.update()', 250);
        });
        setTimeout('$.dragandscroll.update()', 50);
    },
    add: function (id, title) {
        if (typeof this.holders[id] == 'undefined')
            return false;
        if (typeof title == 'undefined')
            return false;
        parentName = this.holders[id];
        parentObj = this[parentName];
        this.lastPrepend = $('div:first-child', parentObj.prepend('<div class="tab" style="display:none;"><div class="tab-t"><span class="tab-close">&nbsp;</span><span class="tab-refresh">&nbsp;</span>' + title + '</div><div class="tab-cnt"><div class="tab-l"></div><div class="tab-c"><div class="tab-ic"></div></div><div class="tab-r"></div></div><div class="tab-b"></div></div>'));
        $(this.lastPrepend[0]).slideDown(0, function () {
            $.flyingtabs.movable();
        });
        return $(this.lastPrepend[3]);
    }
};

/*!
 * Toolbox for OctoMS Help
 * 
 * Copyright 2011, Mark Jivko https://markjivko.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * ["h","t","a","t2","tc","ts","x","cls","d"]
 * Depends on libraries: jQuery, jQuery User Interface 1.8.11, Drag and scroll for OctoMS Help, FlyingTabs for OctomsHelp
 */
jQuery.toolbox = {
    // Accordions 
    // Use: <span class="a">Title<span class="b">Content<span/><span/>
    h: function (h) {
        var holder = $(h[0]).find('.a');
        $.each(holder, function (k, v) {
            v = $(v);
            v.html('<span class="symbol">&#8659;</span>' + v.html());
            v.click(function () {
                $.each($(this).children('.b'), function (_k, _v) {
                    if ($(_v).hasClass('adjust')) {
                        $(_v).css('width', v.innerWidth() - 10);
                    }
                });
                $(this).children('.b').bind('click.sortable, mousedown.sortable', function (e) {
                    e.stopPropagation();
                });
                if ($(this).children('.b').css('display') == 'none') {
                    $(this).children('.b').slideDown(500, function () {
                        $.dragandscroll.update();
                    });
                    $(this).children('.symbol').html('&#8657;');
                } else {
                    $(this).children('.b').slideUp(500, function () {
                        $.dragandscroll.update();
                    });
                    $(this).children('.symbol').html('&#8659;');
                }
            });
        });
    },

    // Titles for tooltips
    // Use: <span class="tip" title="Title"></span>
    t: function (h) {
        var xOffset = 25;
        var yOffset = 25;
        $.each(h.find('.tip'), function (k, t) {
            $(t).hover(function (e) {
                this.t2 = this.title;
                this.title = '';
                $('body').prepend('<div class="tooltip">' + this.t2 + '</div>');
                this.tip = $('body').children(":first");
                this.tip.css("display", "none").css("position", "absolute").css("top", (e.pageY - yOffset) + "px").css("left", (e.pageX + xOffset) + "px").fadeIn(50);
                var tip = this.tip;
                setTimeout(function () {
                    tip.remove();
                }, 3000);
            }, function () {
                this.title = this.t2;
                this.tip.remove();
            }).mousemove(function (e) {
                $(this.tip).css("top", (e.pageY - yOffset) + "px").css("left", (e.pageX + xOffset) + "px");
            });
        });
    },

    // Anchors to actions
    // Use: <a href="search:text" class="stop"></a> OR <a href="debug:text" class="stop"></a>
    a: function (h) {
        $.each(h.find('a.stop'), function () {
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                call = this.href.split(':');
                c = $('#' + call[0]);
                ic = $('#input-' + call[0]);
                c.val(unescape(call[1]));
                ic.click();
                c.val(call[0].charAt(0).toUpperCase() + call[0].substr(1) + '...').blur;
            });
        });
    },

    // Task To; Call a task and load the contents to the designated element (by ID)
    // Use: <a href="todo:t_u" rel='{"id":216}' class="t2" to="49a55e01466fcada5fda235c1e3a3902">Modify</a>; .close will remove the element
    t2: function (h) {
        var attr = new Array();
        $.each(h.find('a.t2'), function () {
            var h = $(this).parent().parent().parent().find('#' + $(this).attr('to'));
            var parent = $(this).parent();
            var call = $(this).attr('href').split(':');
            var arg = (typeof $(this).attr('rel') == 'undefined') ? null : $(this).attr('rel');
            $(h).data('rel', arg);
            $(this).removeAttr('rel').removeAttr('to').removeClass('t2');
            if ($.inArray(h.attr('id'), attr) < 0)
                attr[attr.length] = h.attr('id');
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                parent.removeClass('create');
                $.dispatch.fetch('task/' + call[0] + '/' + call[1], arg, h, true);
            });
        });
        $.each(h.find('a.close'), function () {
            var h = $(this).parent().parent();
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                h.slideUp(500, function () {
                    h.remove();
                });
            });
        });
        $.each(h.find('.drag'), function () {
            $(this).click(function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        });
        $.each(attr, function (k, v) {
            $('#' + v).removeAttr('id');
        });
    },

    // Task Create; Call a task and load the contents in a <div/> element right after the current one
    // Use: <a class="tc" href="todo:t_c" rel='{"foo":"bar"}' title="Add a new task">Add</a> ; .close will remove the element
    tc: function (h) {
        $.each(h.find('a.tc'), function () {
            var call = $(this).attr('href').split(':');
            var arg = (typeof $(this).attr('rel') == 'undefined') ? null : $(this).attr('rel');
            $(this).removeAttr('rel');
            $(this).removeClass('tc');
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                h = $('<div></div>').insertAfter(this);
                $.dispatch.fetch('task/' + call[0] + '/' + call[1], arg, h, true);
            });
            $.each(h.find('a.close'), function () {
                var h = $(this).parent().parent();
                $(this).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    h.slideUp(500, function () {
                        h.remove();
                    });
                });
            });
            $.each(h.find('.drag'), function () {
                $(this).click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            });
        });
    },

    // Task Save; Call a task with sibling inputs' values and load the contents to the designated element (by ID)
    // Use: <input type=text id=title /><textarea id=desc ></textarea><a class="ts" href="todo:t_c" to="49a55e01466fcada5fda235c1e3a3902">Save task</a> 
    ts: function (h) {
        $.each(h.find('a.ts'), function () {
            var h = $(this).parent().parent().find('#' + $(this).attr('to'));
            var parent = $(this).parent();
            var call = $(this).attr('href').split(':');
            var arg = new Object();
            $.each(parent.find(':input,textarea'), function () {
                arg[$(this).attr('id')] = $(this);
                $(this).removeAttr('id');
            });
            $(this).removeClass('ts').removeAttr('to');
            if (!h.find('a.t2'))
                h.removeAttr('id');
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                parent.removeClass('create');
                $.each(arg, function (k, v) {
                    arg[k] = v.attr('value');
                });
                $.dispatch.fetch('task/' + call[0] + '/' + call[1], arg, h);
            });
        });
    },

    // Task done button; task todo/t_x, load the contents to the designated element (by ID)
    // Use: <input type=checkbox class=x rel='{"foo":"bar"}' to="49a55e01466fcada5fda235c1e3a3902"/>
    x: function (h) {
        $.each(h.find('input:checkbox.x'), function () {
            var h = $(this).parent().parent().parent().find('#' + $(this).attr('to'));
            var arg = new Object();
            arg['id'] = $(this).attr('rel');
            $(this).removeAttr('rel').removeAttr('to');
            h.removeAttr('id');
            $(this).click(function (e) {
                e.stopPropagation();
                arg['status'] = $(this).attr('checked') ? 1 : 0;
                $.dispatch.fetch('task/todo/t_x', arg, h);
            });
        });
    },

    // Auto close
    // Use: No special HTML; the element will be automatically removed
    cls: function (h) {
        var h = $(h);
        setTimeout(function () {
            h.slideUp(500, function () {
                h.remove();
            });
        }, 2000);
    },

    // Drag and drop sortable
    // Use: <div class="a">Text<div class="drag"></div></div>
    d: function (h) {
        var top = h.position().top;
        var dif = h.children('div.a').outerHeight();
        var arg = new Object();
        $.each(h.find('.drag'), function () {
            $(this).click(function (e) {
                e.stopPropagation();
                e.preventDefault();
            })
        });
        h.sortable({placeholder: "ui-state-highlight", items: 'div.a', delay: 200, handle: '.drag', axis: 'y', cursor: 'move', scroll: false, tolerance: 'pointer', start: function (event, ui) {
                arg.start = parseInt((ui.item.position().top - top - 4) / dif + 1);
                ui.placeholder.css('height', ui.item.outerHeight()).css('width', ui.item.outerWidth());
            }, stop: function (event, ui) {
                arg.end = parseInt((ui.item.position().top - top - 4) / dif + 1);
                arg.id = JSON.parse(ui.item.data('rel')).id;
                $(ui.item).append('<div/>');
                div = $(ui.item[0].lastChild);
                if (arg.start != arg.end)
                    $.dispatch.fetch('task/todo/t_u', arg, div);
                div.remove();
            }});
    }
};

/*!
 * Dispatcher for OctoMS Help
 * 
 * Copyright 2011, Mark Jivko https://markjivko.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * Depends on libraries: jQuery, jQuery User Interface 1.8.11, Drag and scroll for OctoMS Help, FlyingTabs for OctomsHelp
 */
jQuery.dispatch = {
    init: function (api) {
        if (typeof api != 'undefined')
        {
            var api = api;
        } else
        {
            if (typeof API_URL != 'undefined')
                api = API_URL;
            else
            {
                $('.noscript p').html('The HTML template has been broken. This application needs the API_URL javascript variable in order to function.<br/> Fix the template and refresh this page.');
                return false;
            }
        }
        $('.noscript').css('display', 'none');
        $.dragandscroll.init();
        $.flyingtabs.init();
        var s = $('#search');
        var d = $('#debug');
        var t = $('#title');
        var is = $('#input-search');
        var id = $('#input-debug');
        s.keyup(function (e) {
            if (e.keyCode == 13)
            {
                is.click();
            }
        });
        d.keyup(function (e) {
            if (e.keyCode == 13)
            {
                id.click();
            }
        });
        s.focus(function () {
            if (s.val() == 'Search...')
                s.val('');
        });
        s.blur(function () {
            if (s.val().length == 0)
                s.val('Search...');
        });
        d.focus(function () {
            if (d.val() == 'Debug...')
                d.val('');
        });
        d.blur(function () {
            if (d.val().length == 0)
                d.val('Debug...');
        });
        is.click(function () {
            if (s.val().length > 0 && s.val() != 'Search...')
            {
                $.dispatch.req(api + 'search', {'search': s.val()}, 1, 'Search for "' + s.val() + '"');
                s.val('');
                s.focus();
            }
        });
        id.click(function () {
            if (d.val().length > 0 && d.val() !== 'Debug...')
            {
                $.dispatch.req(api + 'debug', {'debug': d.val()}, 2, 'Debug info on "' + d.val() + '"');
                d.val('');
                d.focus();
            }
        });
        if (SEARCH.length > 0)
        {
            s.val(SEARCH);
            setTimeout(function () {
                is.click();
                s.val('Search...').blur;
            }, 10);
        }
        if (DEBUG.length > 0) {
            d.val(DEBUG);
            setTimeout(function () {
                id.click();
                d.val('Debug...').blur();
            }, 250);
        }
        if (EXPORT.length > 0) {
            setTimeout(function () {
                $.flyingtabs.add(2, 'Variable export').html('<div>' + EXPORT + '</div>');
            }, 250);
        }
        if (ERROR.length > 0) {
            setTimeout(function () {
                $.flyingtabs.add(2, 'Error').html('<div>' + ERROR + '</div>');
            }, 500);
        } else if (EXCEPTION.length > 0) {
            setTimeout(function () {
                $.flyingtabs.add(2, 'Exception').html('<div>' + EXCEPTION + '</div>');
            }, 500);
        }
    },
    req: function (u, d, w, t, h) {
        if (typeof u == 'undefined' || typeof d == 'undefined' || typeof w == 'undefined' || typeof t == 'undefined')
            return false;
        $.ajax(
            {
                data: d,
                type: 'post',
                url: u,
                async: true,
                cache: false,
                dataType: 'json',
                beforeSend: function ()
                {
                    this.h = (typeof h == 'undefined' || h.length == 0)
                            ?
                            $.flyingtabs.add(w, t)
                            :
                            h;
                    this.h.html('<div class="loading">Loading...</div>');
                    return true;
                },
                success: function (data)
                {
                    var self = this.h.html('');
                    self.parent().parent().parent().find('.tab-refresh').click(function (e) {
                        $.dispatch.req(u, d, '', '', self);
                        $(this).unbind('click');
                    });
                    $.each(data, function (k, v) {
                        if (v.status == 'success')
                        {
                            self.append(v.content);
                        } else
                        {
                            self.append('<div class="error_title warning"></div>' + v.content);
                        }
                        if (typeof v.script == 'object')
                        {
                            $.each(v.script, function (_k, _v) {
                                if (typeof $.toolbox[_v] == 'function')
                                {
                                    $.toolbox[_v]($(self));
                                }
                            });
                        }
                    });
                    $.dragandscroll.update();
                },
                error: function (o, e)
                {
                    var myregexp = /ERROR = "(.*)";\r\n?/i;
                    var match = myregexp.exec(o.responseText);
                    var err = (match != null) ? eval('"' + match[1] + '"') : '<div>' + o.responseText + '</div>';
                    var self = this.h.html(err);
                    self.parent().parent().parent().find('.tab-refresh').click(function (e) {
                        $.dispatch.req(u, d, '', '', self);
                        $(this).unbind('click');
                    });
                    $.dragandscroll.update();
                }
            });
    },
    fetch: function (a, d, h, s) {
        $.dispatch.req(
            API_URL + a,
            {'data': ((typeof s == 'undefined') ? JSON.stringify(d) : d)},
            null,
            null,
            h
        );
    }
};

/* Bootstrapper */
$(document).ready(function () {
    $.dispatch.init();
});