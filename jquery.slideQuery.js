/*
 * slideQuery 1.1.1
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
            slides: 'li',
            speed: 'normal',
            delay: null,
            mouseOverStop: true,
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
                return object.each(function(sq)
                {
                    // Declare essential variables
                    me[sq] = $(this),
                    items[sq] = $(opts.slides, me[sq]),
                    count[sq] = items[sq].length,
                    idx[sq] = opts.startIndex,
                    interval[sq] = null;

                    // Check if delay is not set and set it to slides number * 1000 defaultly 
                    delay[sq] = opts.delay == null ? count[sq] * 1000 : opts.delay;

                    // Hide all slides
                    items[sq].hide();

                    // Show a index slide with animation
                    items[sq].eq(idx[sq]).addClass('slide-query-active-item').fadeToggle(opts.speedIn);

                    // Check if more than 1 slide exists
                    if (count[sq] > 1)
                    {
                        // Start automatic sliding
                        plugin.start(sq);

                        // Check if stopping on mouse over is available
                        if (opts.mouseOverStop)
                        {
                            // Stop slideshow on mouse enter and continue on leave
                            me[sq].hover(function(){
                                // Stop sliding
                                clearInterval(interval[sq]);
                            },function()
                            {
                                // Continue sliding
                                plugin.start(sq);
                            });
                        }
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
                // Set new slide index
                idx[index] = idx[index] == (count[index] - 1) ? 0 : idx[index] + 1;

                // Switch to newly indexed slide
                items[index].filter('.slide-query-active-item').removeClass('slide-query-active-item').fadeToggle(opts.speedOut, function()
                {
                    items[index].eq(idx[index]).addClass('slide-query-active-item').fadeToggle(opts.speedIn);
                });
            }
        };

    $.fn.extend({
        slideQuery: function(options)
        {
            plugin.initialize(this, options);
        }
    });

    $.fn.fadeToggle = function(speed, easing, callback) {
        return this.animate({opacity: 'toggle'}, speed, easing, callback);
    };

})(jQuery);