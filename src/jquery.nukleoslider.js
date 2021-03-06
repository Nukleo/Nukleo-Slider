/*
 * jQuery nukleo slider 0.1
 * Copyright (c) 2011 Erik Berman (nukleo.fr)
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Slider that animates each slide's inner elements independently. Based on jQuery's animate() function
 *
 * For nicer animation transitions this plugin can use George Smith's easing plugin found at http://gsgd.co.uk/sandbox/jquery/easing/
 * but this is optional. If you don't use the easing plugin, you need to set the easing option to "swing" or "linear" which are included in jQuery
 *
 * @USAGE
 * The slideshow is meant to be in a UL on which the plugin is applied (could be a div).
 * Each slide is meant to be in a LI element (could be a div) with a class of ".slide"
 * Within each slide are the elements (with a class of ".slide-content) that will be animated. Each element needs to declare through the data-x attributes how and what will be animated.
 * You can use any properties that are compatible with jQuery's animate function.
 *
 * To use the plugin do this:
 * <script>
 *		$(function(){
 *			$('#slider').nukleoslider();
 *		});
 * </script>
 *
 * Of course the plugin must be included in the page :)
 *
 * @SETTINGS On each individual element
 * data-base	(mandatory) :	the element's base properties before any animation occurs
 * data-in		(mandatory) :	the animation properties for incoming animation (ie: becoming visible)
 * data-out		(optional) :	Outgoing animation properties (ie: going out of view before the next slide animates in). If this is not set then the data-base settings will be used
 * data-speed	(optional) :	the speed for the animation (in milliseconds). Play with this setting to get nice parallax effects (for position animating). If not set, defaults to the plugin's options
 *
 * For example :
 * <img src="img/myImage.png" data-base='{"bottom":"0","left":"600"}' data-in='{"bottom":"0","left":"0"}' data-out='{"left":"600"}' data-speed="700" class="slide-content" />
 *
 *
 * @TODO Add previous and next controls
 * @TODO Add controler to jump to any slide
 * @TODO Add pause on hover option and function
 * @TODO Make data-base optional -> compute positions based on the container's size. Maybe add a default animation option (fade or position)
*/
;(function($){

	"use strict";

	$.fn.nukleoslider = function(options) {

		// default options
		var defaults = {
			speed:			500,				// Default animation speed if not set on an element
			pauseDelay:		4000,				// How long each slide stays visible. Play with this if you have long speed settings as they are substracted from this
			easing:			"easeInOutExpo",	// easing. if easing plugin is being used, if not change to swing or linear
			slideClass:		".slide",			// class used for a single slide
			animatedClass:	".slide-content"	// class used for the animated content within a slide
		};

		var opts = $.extend(defaults, options);


		// variables
		var $slides = this.find(opts.slideClass);	// cache the slides
		var numSlides = $slides.length;				// number of slides
		var currentSlide = 0;						// which slide is currently active
		var animationSettings = [];					// array containing all animation settings
		var timer = 0;								// on first run we need to start animating right away, aftwards we use the pauseDelay

// ---- FUNCTIONS --------------------------------------------------------------------------------------------- //

		// Initialize the plugin on page load.
		// Position the 1st slide's elements and trigger the "out" animation
		function init(){
			$slides.hide();

			// get all animation settings
			buildAnimationSettings();
			
			// trigger the automatic slide rotation
			rotate();

		};


		// Retrieve an element's animation settings and build the object that will be passed on to animate()
		function getSettings(elem){
			var settings = {};
			settings.basePos = elem.data('base');
			settings.animIn = elem.data('in');
			settings.animOut = elem.data('out') || settings.basePos;
			settings.speed = elem.data('speed') || opts.speed;
			settings.easing = elem.data('easing') || opts.easing;
			return settings;
		};


		// retrieve all animation settings once (used on init of plugin)
		// this avoids having to get individual settings each time around
		function buildAnimationSettings(){

			// build array of slides
			$slides.each(function(){
				var $this = $(this);
				var slideArray = [];
				var $slideElems = $this.find(opts.animatedClass);

				// build array of elements of each slide
				$slideElems.each(function(){
					slideArray.push( getSettings( $(this) ) );
				});

				animationSettings.push(slideArray);
			});
		};


		// automatically rotate the slides
		function rotate(){
			setTimeout(function(){
				timer = opts.pauseDelay; // on first run animate with no delay then reset the timer to the correct delay
				$slides.hide(); // hide all slides
				var obj = $slides.eq(currentSlide).show(); // show the current slide
				animateSlide(obj); // animate its contents
				currentSlide = ( currentSlide+1 === numSlides ) ? 0 : currentSlide+1; // If we reach the last slide, next slide is the first
				
				rotate(); // call self
			}, timer);
		};


		// Main animation routine
		function animateSlide(container) {

			// all elements to be animated
			var $elements = container.find(".slide-content");

			// animate each element independently
			$elements.each(function(idx){

				// retrieve animation settings
				var $elem = $(this);
				var settings = animationSettings[currentSlide][idx];

				// position the element to it's starting position
				$elem.animate(settings.basePos, 0);

				// animate!
				$elem.animate(settings.animIn, settings.speed, settings.easing);

				// wait for the slide's duration then animate out
				setTimeout(function(){
					$elem.animate(settings.animOut, settings.speed, settings.easing);
				}, opts.pauseDelay - settings.speed);

			});

		};// end of main animation routine


		// Initialize the animation
		init();

		return this;

	};// end of plugin... bye bye :)

}(jQuery));