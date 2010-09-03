/*
 * slideQuery 1.3
 * Slideshow plugin for jQuery
 *
 * Copyright (c) 2010 Otar Chekurishvili
 * http://twitter.com/ochekurishvili
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function($){

    // Declare default options and variables
    var defaults =
    {
        slides: null,
        type: 'fade',
        speed: 'slow',
        delay: null,
        direction: 'right',
        switcher: true,
        switcherTextLeft: '<<',
        switcherStyleLeft: {
            position: 'absolute',
            bottom: 0,
            left: 0
        },
        switcherTextRight: '>>',
        switcherStyleRight: {
            position: 'absolute',
            bottom: 0,
            right: 0
        },
        mouseOverStop: true,
        mouseOutInstantStart: false,
        speedIn: null,
        speedOut: null,
        startIndex: 'first'
    },
    opts = {},
    me = [],
    items = [],
    count = [],
    idx = [],
    interval = [],
    delay = [],
    plugin =
    {
        initialize: function(object, options)
        {
            // Combine user set options with defaults is arguments passed
            opts = options ? $.extend({}, defaults, options) : defaults;

            // Set slide show and hide event speed depended on "speed" option
            opts.speedIn = opts.speedIn || opts.speed;
            opts.speedOut = opts.speedOut || opts.speed;

            // Chain method and call plugin function
            return object.each(function(index)
            {
                // Declare essential variables
                me[index] = $(this),
                items[index] = me[index].children(opts.slides),
                count[index] = items[index].length,
                interval[index] = null;

                // Set starting slide index
                switch (opts.startIndex)
                {
                    default:
                        // Set starting index to the passed number
                        idx[index] = opts.startIndex;
                        break;
                    case 'first':
                        // Set starting index to the first slide
                        idx[index] = 0;
                        break;
                    case 'last':
                        // Set starting index to the last slide
                        idx[index] = count[index] - 1;
                        break;
                    case 'random':
                        // Set starting index to the random slide
                        idx[index] = Math.floor(Math.random() * count[index]);
                        break;
                }

                // Check if less than 1 slide exists
                if (count[index] <= 1)
                {
                    // Do not animate if there are no slides
                    return;
                }

                // Check if delay is not set and set it to slides number * 1000 defaultly
                delay[index] = opts.delay === null ? count[index] * 1000 : opts.delay;

                // Make slideshow container relatively positioned
                me[index].css('position', 'relative');

                // Set CSS attributes to slides
                items[index].each(function(slideIndex)
                {
                    // Assign CSS properties to the current slide
                    $(this).css({
                        position: 'absolute',
                        top: 'auto',
                        left: 'auto',
                        zIndex: (count[index] * 10) - (slideIndex * 10)
                    });
                });

                // Check if slideshow must have switcher
                if (opts.switcher)
                {
                    // Wrap slideshow in a container and append slide switcher container to it
                    me[index].append('<div class="slide-query-switcher"><div class="slide-query-switcher-left">' + String(opts.switcherTextLeft) + '</div><div class="slide-query-switcher-right">' + String(opts.switcherTextRight) + '</div></div>');

                    // Set the most top zIndex to the switchers
                    var zIndexTop = (count[index] + 1) * 10;
                    $.extend(opts.switcherStyleLeft, {zIndex: zIndexTop});
                    $.extend(opts.switcherStyleRight, {zIndex: zIndexTop});

                    // Customize left switcher
                    $('.slide-query-switcher-left', me[index]).css(opts.switcherStyleLeft).bind('click', function()
                    {
                        // Switch slide to the previous one
                        plugin.change(index, 'left');
                    });

                    // Customize right switcher
                    $('.slide-query-switcher-right', me[index]).css(opts.switcherStyleRight).bind('click', function()
                    {
                        // Switch slide to the next one
                        plugin.change(index, 'right');
                    });
                }

                // Hide all slides
                items[index].hide();

                // Show a index slide with animation
                plugin.animation(items[index].eq(idx[index]).addClass('slide-query-active-item') , opts.speedIn);

                // Start automatic sliding
                plugin.start(index);

                // Check if stopping on mouse over is available
                if (opts.mouseOverStop)
                {
                    // Stop slideshow on mouse enter and continue on leave
                    me[index].hover(function()
                    {
                        // Stop sliding
                        clearInterval(interval[index]);
                    }, function()
                    {
                        // Check if animation must continue instantly
                        if (opts.mouseOutInstantStart)
                        {
                            // Change slide instantly
                            plugin.change(index, opts.direction);
                        }

                        // Continue sliding
                        plugin.start(index);
                    });
                }
            });
        },
        start: function(index)
        {
            // Start sliding with the specified delay
            interval[index] = setInterval(function()
            {
                // Change slide to the specified direction
                plugin.change(index, opts.direction);
            }, delay[index]);
        },
        change: function(index, direction)
        {
            // Count number of slides starting with zero-index
            var lastSlide = count[index] - 1;

            // Detect direction
            switch (direction)
            {
                default:
                case 'right':
                    // Set new slide index to the next one
                    idx[index] = idx[index] == lastSlide ? 0 : idx[index] + 1;
                    break;
                case 'left':
                    // Set new slide index to the previous one
                    idx[index] = idx[index] == 0 ? lastSlide : idx[index] - 1;
                    break;
                case 'random':
                    // Set new slide index to the random one
                    idx[index] = Math.floor(Math.random() * count[index]);
                    break;
            }

            // Switch to newly indexed slide
            plugin.animation(items[index].filter('.slide-query-active-item').removeClass('slide-query-active-item'), opts.speedOut);
            plugin.animation(items[index].eq(idx[index]).addClass('slide-query-active-item'), opts.speedIn);
        },
        animation: function(element, speed, callback)
        {
            // Detect animation type
            switch (opts.type)
            {
                default:
                case 'none':
                    // Instantly display slide without animation
                    return element.toggle(0, callback);
                case 'fade':
                    // Animate slide with fading animation
                    return element.animate({
                        opacity: 'toggle'
                    }, speed, function()
                    {
                        // Callback hack
                        if ($.isFunction(callback))
                        {
                            // Call callback
                            callback.call(element);
                        }

                        // Fix IE oppacity fiilter issue with jQuery
                        if (element[0].style.removeAttribute)
                        {
                            // Remove MS filter from CSS
                            element[0].style.removeAttribute('filter');
                        }
                    });
                case 'slide':
                    // Animate slide with sliding animation
                    return element.slideToggle(speed, callback);
            }
        }
    };

    // Add plugin to the jQuery core
    $.fn.extend({
        slideQuery: function(options)
        {
            // Initialize plugin
            plugin.initialize(this, options);
        }
    });

})(jQuery);
