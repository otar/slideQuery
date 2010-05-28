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

function debug(data)
{
    console.log(data);
}

(function($){

    // Declare default options
    var defaults = {
          slides: 'li',
          speedIn: 'slow',
          speedOut: 'slow',
          delay: 3000,
          startIndex: 0,
          easing: 'swing',
        },
        opts = {},
        me = [],
        items = [],
        count = [],
        idx = [],
        interval = [];

    $.fn.slideQuery = function(options)
    {
        // Combine user passed options with defaults
        opts = $.extend({}, defaults, options);

        // Chain method and call plugin function
        return this.each(function(sq) {

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

            // Start automatic sliding if more than 1 slide exists
            if (count[sq] > 1)
            {
                interval[sq] = setInterval(function(){
                    idx[sq] = idx[sq] == (count[sq] - 1) ? 0 : idx[sq] + 1;
                    items[sq].filter('.slide-query-active-item').removeClass('slide-query-active-item').stop().animate({ opacity: 0 }, opts.speedOut, opts.easing).hide(function(){
                        items[sq].eq(idx[sq]).addClass('slide-query-active-item').stop().animate({ opacity: 1.0 }).show();
                    });
                }, opts.delay);
            }

        });
    }

})(jQuery);