/*
 * jQuery parallax slider 0.1
 * Copyright (c) 2011 Erik Berman (nukleo.fr)
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * Slider that animates each slide's inner elements independently
 *
 * For nicer animation transitions this plugin can use xxxx's easing plugin found at http://xxx.com
 * but this is optional. If you don't use the easing plugin, you need to set the easing option to "swing" or "linear" which are included in jQuery
*/
;(function($){
	$.fn.paraslider = function(options) {
		
		// default options
		var defaults = {
			speed:		500,			// vitesse d'animation des éléments
			pauseDelay:	4000,			// delai entre chaque slide
			easing:		"easeInOutExpo"	// easing. si plugin easing non utilisé -> swing ou linear
		};
		
		var opts = $.extend(defaults, options);

		
		// variables
		var $slides = $(this).find('.slide');	// mise en cache des slides
		var countSlides = $slides.length;		// nombre de slides
		var currentSlide = 0;					// compteur pour boucler


// ---- FUNCTIONS --------------------------------------------------------------------------------------------- //

		// recup des reglages sur chaque élément a animer et construction des parametres qu'on passera à animate()
		function getSettings(elem){
			var settings = {};
			settings.basePos = elem.data('base');
			settings.animIn = elem.data('in');
			settings.animOut = ( elem.data('out') ) ? elem.data('out') : elem.data('base');
			settings.speed = ( elem.data('speed') ) ? elem.data('speed') : opts.speed;
			settings.easing = ( elem.data('easing') ) ? elem.data('easing') : opts.easing;
			return settings;
		};

		// initialisation lancée lors du chargement de la page.
		// on place les éléments du 1er slide puis on l'anim avec l'anim de sortie
		function init(){
			$slides.hide();
			var firstSlide = $slides.eq(0).show();

			// animation de chaque élément
			firstSlide.find('.slide-content').each(function(){
				var $elem = $(this);
				
				// recup les réglages d'anim de l'element
				var settings = getSettings($elem);

				// place l'element à sa position initiale, attend la durée d'affichage du slide puis anim en sortie
				$elem.animate(settings.animIn, 0)
				.delay(opts.pauseDelay - settings.speed)
				.animate(settings.animOut, settings.speed, settings.easing);
				
			});

			currentSlide++; // slide suivant
			rotate();		// lancement de l'anim en boucle

		};
		

		// animation en boucle
		function rotate(){
			setInterval(function(){
				$slides.hide(); // masque les slides
				var obj = $slides.eq(currentSlide).show(); // affiche le slide qui est concerné
				animateSlide(obj); // anime le contenu du slide
				currentSlide = ( currentSlide+1 == countSlides ) ? 0 : currentSlide+1; // permet de revenir au debut de la boucle
			}, opts.pauseDelay);
		};

		
		// fonction principale d'animation
		function animateSlide(container) {

			// nombre d'éléments
			var elements = container.find(".slide-content")

			// animation de chaque élément
			$(elements).each(function(){
			
				// on recup les infos d'anim dans les attributs data
				var $elem = $(this);
				var settings = getSettings($elem);

				// positionne l'élément à sont point de départ
				$elem.animate(settings.basePos, 0);

				// on anime
				$elem.animate(settings.animIn, settings.speed, settings.easing);

				setTimeout(function(){
					$elem.animate(settings.animOut, settings.speed, settings.easing);
				}, opts.pauseDelay - settings.speed);
				
			}); // fin anim de chaque element
			
		};// fin fonction principale

// ---- LAUNCH! --------------------------------------------------------------------------------------------- //
		// On lance tout au chargement de la page !
		init();

	};// fin plugin
	
})(jQuery);