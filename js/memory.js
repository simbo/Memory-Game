
var initial = {
	i: 36,
	c: 6,
	r: 6
};

$(document).ready(function(){

	// center on screen
	$(window).resize(function(){
		if( $('form.memory').length>0 )
			$('form.memory').position({
				of: $(window),
				my: 'center center',
				at: 'center center',
				offset: '0 -'+($(window).height()/10)
			});
		if( $('div.memory').length>0 )
			$('div.memory').position({
				of: $(window),
				my: 'center top',
				at: 'center top',
				offset: '0 10'
			});
	});
	$(window).resize();

	// options form slider
	if( $('#iSlider').length>0 ) {
		$('#iSlider').slider({
			min: 2,
			max: 70,
			value: 36,
			step: 2,
			slide: function(ev,ui) {
				var i = ui.value,
					c = Math.ceil(Math.sqrt(i)),
					r = Math.ceil(i/c);
				$('#iV').text(i);
				$('#i').val(i);
				$('#cV').text(c);
				$('#c').val(c);
				$('#rV').text(r);
				$('#r').val(r);
			}
		});
		$('#iV').text(initial.i);
		$('#i').val(initial.i);
		$('#cV').text(initial.c);
		$('#c').val(initial.c);
		$('#rV').text(initial.r);
		$('#r').val(initial.r);
	}
	
	
	if( $('div.memory').length>0 ) {
	
		// the game
		var memory = {
			
			items: $('div.memory li'),
			timer: null,
			startTime: 0,
			
			init: function() {
				var m = this;
				this.startTime = new Date().getTime();
				this.timer = window.setInterval(function(){
					var d = Math.round( (( new Date().getTime() ) - m.startTime )/100 ),
						t = '';					
					if( d>36000 ) {
						t += Math.floor(d/36000)+'h ';
						d = d%36000;
					}
					if( d>600 ) {
						t += Math.floor(d/600)+'m ';
						d = d%600;
					}
					d = (d/10).toString();
					t += (d.length<3?d+'.0':d)+'s';
					$('#t').text(t);
				},100);
				this.items.each(function(i){
					$(this).click(function(){
						if( !$(this).hasClass('solved') ) {
							var v = m.getVisibles();
							if( v.length>=2 ) {
								m.hideItem(v,$(this));
							}
							else
								m.showItem($(this));
				
						}
					});
				});
			},
			
			getVisibles: function() {
				return this.items.filter('.visible');
			},
			
			showItem: function( item ) {
				var m = this;
				item.addClass('visible').find('img').fadeIn(200,function(){
					var v = m.getVisibles();
					if( v.length==2 ) {
						if( v.filter(':eq(0)').find('img').get(0).src == v.filter(':eq(1)').find('img').get(0).src ) {
							$('#s').text( parseInt($('#s').text())+1 );
							v.addClass('solved').animate({
								opacity:0
							},{
								duration: 800,
								complete: function(){
								}
							});
							if( m.items.length == m.items.filter('.solved').length ) {
								window.clearInterval(m.timer);
							}
						}							
					}
				});
				if( this.getVisibles().length==2 )
					$('#a').text( parseInt($('#a').text())+1 );
			},
			
			hideItem: function( item, next ) {
				var m = this;
				item.removeClass('visible').find('img').fadeOut(200,function(){
					if( next!=undefined )
						m.showItem(next);
				});
			}
			
		}
		memory.init();		
		
	}

});
