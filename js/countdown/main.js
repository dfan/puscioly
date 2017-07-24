/*
	Metronic by TEMPLATE STOCK
	templatestock.co @templatestock
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/


(function($) {
	"use strict";
	
		/*====================================
		 Bootstrap Fix For WinPhone 8 And IE10
		======================================*/
		
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			var msViewportStyle = document.createElement("style");
			msViewportStyle.appendChild(
				document.createTextNode(
					"@-ms-viewport{width:auto!important}"
				)
			);
			document.getElementsByTagName("head")[0].
				appendChild(msViewportStyle);
		}	
		
		
		/*====================================
					Android stock browser
		======================================*/
		
		$(function () {
		  var nua = navigator.userAgent
		  var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
		  if (isAndroid) {
			$('select.form-control').removeClass('form-control').css('width', '100%')
		  }
		})	



		/*====================================
					Preloader
		======================================*/

		$(window).on('load', function() {
		
			var preloaderDelay = 350,
				preloaderFadeOutTime = 800;
	
			function hidePreloader() {
				var loadingAnimation = $('#loading-animation'),
					preloader = $('#preloader');
	
				loadingAnimation.fadeOut();
				preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
			}
	
			hidePreloader();
	
		});
		
		
		
		/*====================================
					Background
		======================================*/
		
		//Image Background 
		$(".image-background").backstretch("img/sherrerd.jpg");
		
		
		/*====================================
					Clock Countdown
		======================================*/

		$('#clock-countdown').countdown('2018/2/10 6:00:00').on('update.countdown', function(event) {
			var $this = $(this).html(event.strftime(''
				+ '<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div><span>Day%!d</span></div>'
				+ '<div class="counter-box"><div class="number">%H</div><span>Hours</span></div>'
				+ '<div class="counter-box"><div class="number">%M</div><span>Minutes</span></div>'
				+ '<div class="counter-box last"><div class="number">%S</div><span>Seconds</span></div></div>'
			));
		});

})(jQuery);