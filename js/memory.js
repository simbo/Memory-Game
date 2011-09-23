
// initial options
var initial = {
	i: 36,
	c: 6,
	r: 6
};

// dom ready event
$(document).ready(function(){

	// window resize event
	$(window).resize(function(){
		// center options form and winning msg
		if( $('form#memory,div#solved').length>0 )
			$('form#memory,div#solved').position({
				of: $(window),
				my: 'center center',
				at: 'center center',
				offset: '0 -'+($(window).height()/10)
			});
		// center game
		if( $('div#memory').length>0 )
			$('div#memory').position({
				of: $(window),
				my: 'center top',
				at: 'center top',
				offset: '0 10'
			});
	});
	// trigger resize
	$(window).resize();

	// options form
	if( $('form#memory').length>0 ) {
		// slider
		$('#iSlider').slider({
			min: 4,
			max: 70,
			value: 36,
			step: 2,
			slide: function(ev,ui) {
				// calculate cols and rows
				var i = ui.value,
					c = Math.ceil(Math.sqrt(i)),
					r = Math.ceil(i/c);
				// set options
				setValues(i,c,r);
			}
		});
		// set initial options
		setValues(initial.i,initial.c,initial.r);
	}
	
	// set options
	function setValues( i, c, r ) {
		$('#is').text(i);
		$('#i').val(i);
		$('#cs').text(c);
		$('#c').val(c);
		$('#rs').text(r);
		$('#r').val(r);
	}
	
	
	if( $('div#memory').length>0 ) {
	
		// the game...
		var memory = {
			
			// memory items
			items: $('div#memory li'),
			
			// timer references
			hideTimer: null,
			timer: null,
			startTime: 0,
			
			// initialize
			init: function() {
				var m = this;
				
				// timer
				this.startTime = new Date().getTime();
				this.timer = window.setInterval(function(){
					var d = Math.round( (( new Date().getTime() ) - m.startTime )/1000 ),
						t = '';
					// hours
					if( d>3600 ) {
						t += Math.floor(d/3600)+'h ';
						d = d%3600;
					}
					// minutes
					if( d>60 ) {
						t += Math.floor(d/600)+'m ';
						d = d%600;
					}
					// seconds
					t += d+'s';
					// set time text
					$('#t').text(t);
				},1000);
				
				// click events
				this.items.each(function(i){
					$(this).click(function(){
						if( !$(this).hasClass('solved') ) {
							var v = m.getVisibles();
							// if 2 or more items visible
							if( v.length>=2 ) {
								// hide them
								m.hideItem(v,$(this))
								// clear hideTimer
								clearTimeout(m.hideTimer);
							}
							else
								m.showItem($(this));
						}
					});
				});
			},
			
			// get visible items
			getVisibles: function() {
				return this.items.filter('.visible');
			},
			
			// show item
			showItem: function( item ) {
				var m = this;
				item.addClass('visible').find('img').fadeIn(200,function(){
					var v = m.getVisibles();
					// if 2 items visible
					if( v.length==2 ) {
						// if both have same img
						if( v.filter(':eq(0)').find('img').get(0).src == v.filter(':eq(1)').find('img').get(0).src ) {
							// set solved text
							$('#s').text( parseInt($('#s').text())+1 );
							// fade out solved items
							v.addClass('solved').animate({ opacity:0 },800);
							// if all items solved
							if( m.items.length == m.items.filter('.solved').length ) {
								// stop timer
								window.clearInterval(m.timer);
								// hide game
								$('div#memory').fadeOut(200);
								// show winning screen
								$('<div id="solved"><strong>Congratulations!</strong>'
									+'<p>You found '+$('#s').text()+' pairs with '+$('#a').text()+' attempts in '+$('#t').text()+'.</p>'
									+'<p><a href=".">Play again&hellip;</a></p></div>').hide().appendTo('body').fadeIn(200);
								// trigger window.resize for positioning
								$(window).resize();
							}
						}
						// if item images are different
						else
							// hide visible items after 2 seconds
							m.hideTimer = window.setTimeout(function(){
								m.hideItem(v);
							},2000);
					}							
				});
				// if 2 items visible
				if( this.getVisibles().length==2 )
					// set attempts text
					$('#a').text( parseInt($('#a').text())+1 );
			},
			
			// hide item
			hideItem: function( item, next ) {
				var m = this;
				item.removeClass('visible').find('img').fadeOut(200,function(){
					// if next item set
					if( next!=undefined )
						// show next item
						m.showItem(next);
				});
			}
			
		}
		// initialize
		memory.init();		
		
	}

});
