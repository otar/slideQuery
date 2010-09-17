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
        swapDirection: 'left',
        speed: 'slow',
        delay: null,
        direction: 'right',
        switcher: true,
        switcherTextLeft: '<<',
        switcherTextRight: '>>',
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
    lastIdx = [],
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
                        // Check if passed option is a number
                        if (opts.startIndex.toString().search(/^-?[0-9]+$/) != 0)
                        {
                            // Set starting index to the first slide
                            idx[index] = 0;
                            break;
                        }

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

                // Assign starting index to the last index variable
                lastIdx[index] = idx[index];

                // Check if less than 1 slide exists
                if (count[index] <= 1)
                {
                    // Do not animate if there are no slides
                    return;
                }

                // Check if delay is not set and set it to slides number * 1000 defaultly
                delay[index] = opts.delay === null ? count[index] * 1000 : opts.delay;

                // Make slideshow container relatively positioned
                me[index].css({
                    position: 'relative',
                    overflow: 'hidden'
                });

                // Set CSS attributes to slides
                items[index].each(function(slideIndex)
                {
                    var styles = {
                        position: 'absolute',
                        zIndex: (count[index] * 10) - (slideIndex * 10)
                    };
                    if (opts.type == 'swap')
                    {
                        styles = $.extend({}, styles, {
                            left: (opts.swapDirection == 'right' ? -me[index].width() : me[index].width()) + 'px'
                        });
                    }

                    // Assign CSS properties to the current slide
                    $(this).css(styles);
                });

                // Check if slideshow must have switcher
                if (opts.switcher)
                {
                    // Wrap slideshow in a container and append slide switcher container to it
                    me[index].append('<div class="slide-query-switcher"><div class="slide-query-switcher-left"></div><div class="slide-query-switcher-right"></div></div>');

                    // Set the most top zIndex to the switchers
                    var zIndexTop = (count[index] + 1) * 10;

                    // Customize left switcher
                    $('.slide-query-switcher-left', me[index]).html(opts.switcherTextLeft).css({
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: zIndexTop
                    }).bind('click', function(event)
                    {
                        event.preventDefault();
                        // Switch slide to the previous one
                        plugin.change(index, 'left');
                    });

                    // Customize right switcher
                    $('.slide-query-switcher-right', me[index]).html(opts.switcherTextRight).css({
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        zIndex: zIndexTop
                    }).bind('click', function(event)
                    {
                        event.preventDefault();
                        // Switch slide to the next one
                        plugin.change(index, 'right');
                    });
                }

                // Show a index slide with animation
                plugin.animation(index, items[index].eq(idx[index]).addClass('slide-query-active-item').data('swapped', true), opts.swapDirection, opts.speedIn);

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
            var lastSlide = count[index] - 1,
            swapDirection = opts.swapDirection;

            // Detect direction
            switch (direction)
            {
                default:
                case 'right':
                    // Set new slide index to the next one
                    idx[index] = idx[index] == lastSlide ? 0 : idx[index] + 1;

                    swapDirection = 'left';

                    break;
                case 'left':
                    // Set new slide index to the previous one
                    idx[index] = idx[index] == 0 ? lastSlide : idx[index] - 1;

                    swapDirection = 'right';

                    break;
                case 'random':
                    // Random the slide index
                    var random = Math.floor(Math.random() * count[index]);

                    // Check if random slide index is matching the latest one
                    if (lastIdx[index] == random)
                    {
                        // Regenerate random slide index
                        plugin.change(index, 'random');
                        break;
                    }

                    // Set new slide index to the random one
                    idx[index] = random;
                    break;
            }

            // Set last slide index to the recently generated one
            lastIdx[index] = idx[index];

            // Switch to newly indexed slide
            plugin.animation(index, items[index].filter('.slide-query-active-item').removeClass('slide-query-active-item').data('swapped', true), swapDirection, opts.speedOut);
            plugin.animation(index, items[index].eq(idx[index]).addClass('slide-query-active-item').data('swapped', true), swapDirection, opts.speedIn);
        },
        animation: function(index, element, direction, speed)
        {
            // Detect animation type
            switch (opts.type)
            {
                default:
                case 'none':
                    // Instantly display slide without animation
                    return element.toggle(0);
                case 'fade':
                    // Animate slide with fading animation
                    return element.animate({
                        opacity: 'toggle'
                    }, speed, function()
                    {
                        // Fix IE oppacity fiilter issue with jQuery
                        if (element[0].style.removeAttribute)
                        {
                            // Remove MS filter from styles
                            element[0].style.removeAttribute('filter');
                        }
                    });
                case 'slide':
                    // Animate slide with sliding animation
                    return element.slideToggle(speed);
                case 'swap':

                    var slidePosition = 0,
                    containerWidth = me[index].width(),
                    startPosition = direction == 'right' ? -containerWidth : containerWidth;

                    // Swapping
                    if (element.data('swapped') === true)
                    {
                        items[index].not(element.removeData('swapped')).css('left', startPosition + 'px');
                    }
                    else
                    {
                        items[index].css('left', (direction == 'right' ? -containerWidth : containerWidth) + 'px');
                    }

                    slidePosition = direction == 'right' ? (element.css('left') == -containerWidth + 'px' ? 0 : containerWidth) : (element.css('left') == '0px' ? -containerWidth : 0);
                    return element.animate({left: slidePosition + 'px'}, speed);

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
