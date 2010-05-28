/*
 * slideQuery 1.0
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

(function($)
{

    // Declare default options
    var defaults =
        {
            slides: 'li',
            speed: 'slow',
            delay: 5000,
            mouseOverStop: true,
            speedIn: null,
            speedOut: null,
            startIndex: 0,
            easing: 'swing'
        },
        opts = {},
        me = [],
        items = [],
        count = [],
        idx = [],
        interval = [],
        plugin =
        {

            slideQuery: function(options)
            {

                // Combine user passed options with defaults
                opts = $.extend({}, defaults, options);

                // Set slide show and hide event speed depended on "speed" option
                opts.speedIn = opts.speedIn || opts.speed;
                opts.speedOut = opts.speedOut || opts.speed;

                // Chain method and call plugin function
                return this.each(function(sq)
                {

                    // Declare essential variables
                    me[sq] = $(this),
                    items[sq] = $(opts.slides, me[sq]),
                    count[sq] = items[sq].length,
                    idx[sq] = opts.startIndex,
                    interval[sq] = null;

                    // Hide all slides and set opacity to 0
                    items[sq].hide().css('opacity', 0);

                    // Show a index slide with animation
                    items[sq].eq(idx[sq]).addClass('slide-query-active-item').stop().animate({opacity: 1.0}, opts.speedIn, opts.easing).show();

                    // Check if more than 1 slide exists
                    if (count[sq] > 1)
                    {

                        // Start automatic sliding
                        plugin.slideQueryStart(sq);

                        // Check if stopping on mouse over is available
                        if (opts.mouseOverStop)
                        {

                            // Stop slideshow on mouse enter and continue on leave
                            me[sq].hover(function()
                            {

                                // Stop sliding
                                clearInterval(interval[sq]);

                            }, function()
                            {

                                // Continue sliding
                                plugin.slideQueryStart(sq);

                            });

                        }

                    }

                });

            },

            slideQueryStart: function(index)
            {

                // Start sliding
                interval[index] = setInterval(function()
                {
                    plugin.slideQuerySwitch(index);
                },
                opts.delay);

            },

            slideQuerySwitch: function(index)
            {

                // Set new slide index
                idx[index] = idx[index] == (count[index] - 1) ? 0 : idx[index] + 1;

                // Switch to slide pointed as index argument
                items[index].filter('.slide-query-active-item').removeClass('slide-query-active-item').stop().animate({ opacity: 0 }, opts.speedOut, opts.easing).hide(function()
                {
                    items[index].eq(idx[index]).addClass('slide-query-active-item').stop().animate({ opacity: 1.0 }).show();
                });

            }

        };

    $.fn.extend(plugin);

})(jQuery);