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

(function($){

    $.fn.extend({

        slideQuery: function(options)
        {

            var opts = $.extend({slides: 'li', speed: 'slow', delay: 3000}, options),
                el = this,
                items = $(opts.slides, el),
                interval = null,
                idx = 0,
                num = items.length;
            return this.each(function(){
                items.hide().css('opacity', 0);
                items.eq(0).addClass('slideQueryActive').stop().animate({opacity: 1.0}, opts.speed).show();
                if (num > 1) {
                    interval = setInterval(function(){
                        idx = (idx == (num - 1)) ? 0 : idx + 1;
                        items.removeClass('slideQueryActive').stop().animate({opacity: 0}, opts.speed, null, function(){
                            $(this).hide();
                            items.eq(idx).addClass('slideQueryActive').stop().animate({opacity: 1.0}, opts.speed).show();
                        });
                    }, opts.delay)
                }
            });

        }

    });

})(jQuery);