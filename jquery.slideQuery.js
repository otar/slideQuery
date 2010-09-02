/*
 * slideQuery 1.2
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
        mouseOverStop: true,
        mouseOutInstantStart: true,
        speedIn: null,
        speedOut: null,
        startIndex: 0
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
                idx[index] = opts.startIndex,
                interval[index] = null;

                // Check if less than 1 slide exists
                if (count[index] <= 1) {
                    // Do not animate if there are no slides
                    return;
                }

                // Check if delay is not set and set it to slides number * 1000 defaultly
                delay[index] = opts.delay === null ? count[index] * 1000 : opts.delay;

                // Make slideshow container relatively positioned
                me[index].css('position', 'relative');

                // Set CSS attributes to slides
                items[index].each(function(indexZeta){
                    $(this).css({
                        position: 'absolute',
                        top: 'auto',
                        left: 'auto',
                        zIndex: String((count[index] * 10) - (indexZeta * 10))
                    });
                });

                // Hide all slides
                items[index].hide();

                // Show a index slide with animation
                //items[index].eq(idx[index]).addClass('slide-query-active-item').slideQueryAnimate(opts.speedIn);
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
                        if (opts.mouseOutInstantStart) {
                            // Change slide instantly
                            plugin.change(index);
                        }

                        // Continue sliding
                        plugin.start(index);
                    });
                }
            });
        },
        start: function(index)
        {
            // Start sliding
            interval[index] = setInterval(function(){
                plugin.change(index);
            }, delay[index]);
        },
        change: function(index)
        {
            // Check direction option
            switch (opts.direction)
            {
                default:
                case 'right':
                    // Set new slide index to the next one
                    idx[index] = idx[index] == (count[index] - 1) ? 0 : idx[index] + 1;
                    break;
                case 'left':
                    // Set new slide index to the previous one
                    idx[index] = idx[index] == 0 ? (count[index] - 1) : idx[index] - 1;
                    break;
            }

            // Switch to newly indexed slide
            plugin.animation(items[index].filter('.slide-query-active-item').removeClass('slide-query-active-item'), opts.speedOut);
            plugin.animation(items[index].eq(idx[index]).addClass('slide-query-active-item'), opts.speedIn);
        },
        animation: function(element, speed, callback)
        {
            switch (opts.type)
            {
                default:
                case 'none':
                    return element.toggle(0, callback);
                case 'fade':
                    return element.animate({
                        opacity: 'toggle'
                    }, speed, function(){
                        // Callback hack
                        if ($.isFunction(callback)) {
                            callback.call(element);
                        }

                        // Fix IE oppacity fiilter issue with jQuery
                        if (element[0].style.removeAttribute) {
                            element[0].style.removeAttribute('filter');
                        }
                    });
                case 'slide':
                    return element.slideToggle(speed, callback);
            }
        }
    };

    $.fn.extend({
        slideQuery: function(options)
        {
            plugin.initialize(this, options);
        }
    });

})(jQuery);
