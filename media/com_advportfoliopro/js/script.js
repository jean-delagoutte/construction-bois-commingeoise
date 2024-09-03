/**
 * @copyright    Copyright (c) 2013 Skyline Technology Ltd (http://extstore.com). All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

if (!ExtStore) {
	var ExtStore = {};
}

ExtStore.AdvPortfolioPro = {
	live_site: null,

	init: function() {
		jQuery(function() {

			jQuery('.portfolio-list, .portfolio-module').each(function() {

				var container   = jQuery(this);
				var displayType	= container.data('display_type');
				var gutterWidth = container.data('gutter-width');
				var columnWidth = get_colunm_width(container);

				if (displayType == 1) {
					// module carousel
					var $this = jQuery('.portfolio-module');
					var columnWidth = $this.width() / $this.data('max-items');
					$this.flexslider({
						animation: $this.data('animation'),
						animationLoop: true,
						direction: 'horizontal',
						slideshowSpeed: $this.data('speed'),
						controlNav: $this.data('show-navigation'),
						directionNav: $this.data('show-direction-navigation'),
						itemWidth: columnWidth,
						itemMargin: 5,
						minItems: 1,
						maxItems: $this.data('max-items')
					});

				} else if (displayType == 0) {

						jQuery(".module-projects-wrapper .isotope-item").css ({
							"width": Math.floor(columnWidth - gutterWidth) + "px",
							"margin-bottom": gutterWidth
						});

						jQuery(".module-projects-wrapper .isotope-item.featured").css ({
							"width": Math.floor((2*columnWidth) - gutterWidth) + "px",
							"margin-bottom": gutterWidth
						});
						// initialize isotope
						jQuery('.module-projects-wrapper').isotope({
							itemSelector: '.isotope-item',
							resizable: false,
							masonry: {
								columnWidth:  Math.floor(columnWidth)
							}
						});
						// isotop
						var $optionSets = jQuery('.module-projects-filter .option-set');
						var $optionLinks = $optionSets.find('a');

						$optionLinks.click(function() {
							var $this = jQuery(this);
							$this.stop();

							// don't proceed if already selected
							if ($this.hasClass('selected')) {
								return false;
							}

							var $optionSet = $this.parents('.option-set');
							$optionSet.find('.selected').removeClass('selected');
							$this.addClass('selected');

							// make option object dynamically, i.e. { filter: '.my-filter-class' }
							var options = {},
									key = $optionSet.attr('data-option-key'),
									value = $this.attr('data-option-value');

							// parse 'false' as false boolean
							value = value === 'false' ? false : value;
							options[key] = value;

							// otherwise, apply new options
							jQuery('.module-projects-wrapper').isotope(options);

							return false;

						});
					} else {
						jQuery(".container-isotop .isotope-item").css ({
							"width": Math.floor(columnWidth - gutterWidth) + "px",
							"margin-bottom": gutterWidth
						});

						jQuery(".container-isotop .isotope-item.featured").css ({
							"width": Math.floor((2*columnWidth) - gutterWidth) + "px",
							"margin-bottom": gutterWidth
						});
						// initialize isotope
						jQuery('#projects-wrapper').isotope({
							itemSelector: '.isotope-item',
							resizable: false,
							masonry: {
								columnWidth:  Math.floor(columnWidth)
							}
						});
						// isotop
						var $optionSets = jQuery('#projects-filter .option-set');
						var $optionLinks = $optionSets.find('a');

						$optionLinks.click(function() {
							var $this = jQuery(this);
							$this.stop();

							// don't proceed if already selected
							if ($this.hasClass('selected')) {
								return false;
							}

							var $optionSet = $this.parents('.option-set');
							$optionSet.find('.selected').removeClass('selected');
							$this.addClass('selected');

							// make option object dynamically, i.e. { filter: '.my-filter-class' }
							var options = {},
									key = $optionSet.attr('data-option-key'),
									value = $this.attr('data-option-value');

							// parse 'false' as false boolean
							value = value === 'false' ? false : value;
							options[key] = value;

							// otherwise, apply new options
							jQuery('#projects-wrapper').isotope(options);

							return false;

						});

					}

				// gallery button
				jQuery('a.gallery-icon').click(function(event) {
					var $this = jQuery(this);

					event.preventDefault();

					jQuery.ajax({
						url: ExtStore.AdvPortfolioPro.live_site + '/?option=com_advportfoliopro&view=project&format=raw&id=' + $this.data('project-id')
					}).done(function (data) {
								jQuery.fancybox.open(jQuery.parseJSON(data));
							});
				});

				// hover dir
				var overlayEffect 		= container.data('overlay_effect');
				var hoverdirEasing 		= container.data('hoverdir_easing');
				var hoverdirSpeed 		= container.data('hoverdir_speed');
				var hoverdirHoverDelay 	= container.data('hoverdir_hover_delay');
				var hoverdirInverse 	= container.data('hoverdir_inverse');

				if (overlayEffect == 'hoverdir') {
					var projectImg = container.find('.project-img');

					projectImg.each(function() {
						jQuery(this).hoverdir({
							speed : hoverdirSpeed,
							easing : hoverdirEasing,
							hoverDelay : hoverdirHoverDelay,
							inverse : hoverdirInverse,
							hoverElem : 'div'
						});
					});
				}
			});

			jQuery(window).smartresize(function() {
				jQuery('.portfolio-list, .portfolio-module').each(function() {
					var container   = jQuery(this);
					var gutterWidth = container.data('gutter-width');
					var columnWidth = get_colunm_width(container);

					jQuery(".container-isotop .isotope-item").css ({
						"width": Math.floor(columnWidth - gutterWidth) + "px",
						"margin-bottom": gutterWidth
					});

					jQuery(".container-isotop .isotope-item.featured").css ({
						"width": Math.floor((2*columnWidth) - gutterWidth) + "px",
						"margin-bottom": gutterWidth
					});
					jQuery('.projects-wrapper').isotope({
						// update columnWidth to a percentage of container width
						masonry: {columnWidth: Math.floor(columnWidth)}
					});
				});

			});

			function get_colunm_width($container) {
				var view_port_w;

				var columnWidth = $container.width() / $container.data('columns');

				if (self.innerWidth !== undefined) {
					view_port_w = self.innerWidth;
				} else {
					var D = document.documentElement;
					if (D) view_port_w = D.clientWidth;
				}

				if ($container.data('columns') == 6 || $container.data('columns') == 5) {
					if (view_port_w >= 768 && view_port_w <= 979) {
						columnWidth = $container.width() / 4;
					} else if (view_port_w >= 640 && view_port_w <= 767) {
						columnWidth = $container.width() / 4;
					} else if (view_port_w >= 600 && view_port_w <= 639) {
						columnWidth = $container.width() / 3;
					} else if (view_port_w >= 480 && view_port_w <= 599) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w >= 360 && view_port_w <= 479) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w <= 359) {
						columnWidth = $container.width() / 1;
					}

					return columnWidth;
				}

				if ($container.data('columns') == 4 || $container.data('columns') == 3) {
					if (view_port_w >= 768 && view_port_w <= 979) {
						columnWidth = $container.width() / 3;
					} else if (view_port_w >= 640 && view_port_w <= 767) {
						columnWidth = $container.width() / 3;
					} else if (view_port_w >= 600 && view_port_w <= 639) {
						columnWidth = $container.width() / 3;
					} else if (view_port_w >= 480 && view_port_w <= 599) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w >= 360 && view_port_w <= 479) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w <= 359) {
						columnWidth = $container.width() / 1;
					}

					return columnWidth;
				}

				if ($container.data('columns') == 2) {
					if (view_port_w >= 768 && view_port_w <= 979) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w >= 640 && view_port_w <= 767) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w >= 600 && view_port_w <= 639) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w >= 480 && view_port_w <= 599) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w >= 360 && view_port_w <= 479) {
						columnWidth = $container.width() / 2;
					} else if (view_port_w <= 359) {
						columnWidth = $container.width() / 1;
					}

					return columnWidth;
				}
			}

		});

	}
};

jQuery(window).load(function() {
	ExtStore.AdvPortfolioPro.init();
});


