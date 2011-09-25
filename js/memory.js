
// the game...
var memory = {

	// memory items
	items: null,
	
	// text elements (solved, attempts, time)
	s: null, a: null, t: null,
	
	// timer reference for hiding items automatically
	hideTimer: null,
	// timer reference for elapsed time
	timer: null,
	// start time for elapsed time
	startTime: 0,
	
	// initialize
	init: function() {
	
		// set items
		this.items = $('div#memory li');
		
		// set text elements
		this.s = $('#s');
		this.a = $('#a');
		this.t = $('#t');
		
		// set game container width relative to column count
		$('div#memory').width( $('div#memory ul:first li').length*109 );
	
		// set start time
		this.startTime = new Date().getTime();
		// set interval to update timer
		this.timer = window.setInterval(function(){
			// time difference
			var d = Math.round( ((new Date().getTime())-memory.startTime)/1000 ),
			// timer text
				t = '';
			// hours
			d>=3600 && (t+=Math.floor(d/3600)+'h ') && (d%=3600)>=0;
			// minutes
			d>=60 && (t+=Math.floor(d/60)+'m ') && (d%=60)>=0;
			// seconds
			t += d+'s';
			// set timer text
			memory.t.text(t);
		},1000);
		
		// each item
		this.items.each(function(i){
			// set click event
			$(this).click(function(){
				// if not solved
				if( !$(this).hasClass('solved') ) {
					// get visible items
					var v=memory.getVisible();
					// if 2 or more items visible
					if( v.length>=2 ) {
						// hide them and set next item to show
						memory.hideItem( v, $(this) )
						// clear hideTimer
						clearTimeout( memory.hideTimer );
					}
					else
						// show item
						memory.showItem( $(this) );
				}
			});
		});
	},
	
	// get visible items
	getVisible: function() {
		return this.items.filter('.visible');
	},
	
	// show item
	showItem: function( item ) {
		// add class 'visible' to item, find img, fade in
		item.addClass('visible').find('img').fadeIn(200,function(){
			// get visible items
			var v = memory.getVisible();
			// if 2 items visible
			if( v.length==2 ) {
				// if both have same img
				if( v.filter(':eq(0)').find('img').get(0).src == v.filter(':eq(1)').find('img').get(0).src ) {
					// set solved text
					memory.s.text( parseInt($('#s').text())+1 );
					// add class 'solved' to items and fade out
					v.addClass('solved').animate({ opacity:0 },800);
					// if all items are solved
					if( memory.items.length == memory.items.filter('.solved').length ) {
						// stop timer
						window.clearInterval(memory.timer);
						// hide game
						$('div#memory').fadeOut(200);
						// show winning screen
						$('<div id="solved"><strong>Congratulations!</strong>'
							+'<p>You found '+memory.s.text()+' pairs with '+memory.a.text()+' attempts in '+memory.t.text()+'.</p>'
							+'<p><a href=".">Play again&hellip;</a></p></div>').hide().appendTo('body').fadeIn(200);
						// trigger window.resize for positioning
						$(window).resize();
					}
				}
				// if item images are different
				else
					// hide visible items after 2 seconds
					memory.hideTimer = window.setTimeout(function(){
						memory.hideItem(v);
					},2000);
			}							
		});
		// if 2 items visible
		if( this.getVisible().length==2 )
			// set attempts text
			this.a.text( parseInt(this.a.text())+1 );
	},
	
	// hide item
	hideItem: function( item, next ) {
		// remove class 'visible' from item, find img, fade out
		item.removeClass('visible').find('img').fadeOut(200,function(){
			// if next item set
			if( next!=undefined )
				// show next item
				memory.showItem(next);
		});
	}
}

// options handler
var options = {

	// element references
	i:null, c: null, r: null,
	
	// initialize
	init: function() {
		// set elements
		this.i = $('#i');
		this.c = $('#c');
		this.r = $('#r');
		// set default values
		this.set(36);
	},

	// set values
	set: function(i) {
		// calculate cols and rows
		var c = Math.ceil(Math.sqrt(i));
		this.i.val(i);
		this.c.text(c);
		this.r.text( Math.ceil(i/c) );
		
	}
}

// dom ready event
$(document).ready(function(){

	// reference for element operations
	var e = null;

	// window resize event
	$(window).resize(function(){
		// center options form and/or winning msg
		(e=$('form#memory,div#solved')) && e.length>0 && e.position({
			of: $(window),
			my: 'center center',
			at: 'center center',
			offset: '0 -'+($(window).height()/10)
		});
	});

	// trigger resize
	$(window).resize();

	// if slider element present, add slider and initialize options
	(e=$('#iSlider')) && e.length>0 && e.slider({
		min: 12,
		max: 72,
		value: 36,
		step: 2,
		slide: function(ev,ui) {
			options.set(ui.value);
		}
	// initialize options
	}) && options.init();
	
	// if game container present, intialize game
	$('div#memory').length>0 && memory.init();

});
