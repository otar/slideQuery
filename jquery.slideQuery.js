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
          events: {
              init: null,
              index: null,
              start: null,
              hide: null,
              show: null
          }
        },
        opts = {},
        idx = 0;

    $.fn.slideQuery = function(options)
    {
        // Combine user passed options with defaults
        opts = $.extend({}, defaults, options);

        // Chain method and call plugin function
        return this.each(function(ss){

            // Declare essential variables
            var me = $(this),
                items = $(opts.slides, me),
                count = items.length,
                interval = null;

            // Set slide counter index
            idx = opts.startIndex;

            // Call "init" event if exists
            if ($.isFunction(opts.events.init)) {
                opts.events.init.call(me);
            }

            // Hide all slides and set opacity to 0
            items.hide().css('opacity', 0);

            // Show a index slide with animation and attach an event
            items.eq(idx).addClass('slide-query-active-item').stop().animate({opacity: 1.0}, opts.speedIn, opts.easing).show($.isFunction(opts.events.index) ? opts.events.index : null);

            // Start automatic sliding if more than 1 slide exists
            if (count > 1)
            {
                interval = setInterval(function(){
                    idx = (idx == (count - 1)) ? 0 : idx + 1;
                    items.filter('.slide-query-active-item').removeClass('slide-query-active-item').stop().animate({ opacity: 0 }, opts.speedOut, opts.easing).hide(function(){
                        items.eq(idx).addClass('slide-query-active-item').stop().animate({ opacity: 1.0 }).show();
                    });
                }, opts.delay);
            }

        });
    }

})(jQuery);