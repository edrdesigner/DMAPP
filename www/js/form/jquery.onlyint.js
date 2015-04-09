(function($){
	$.fn.onlyint = function(){
		this.keypress(function(e){
			if(!e.ctrlKey){
				var code = e.keyCode;			
				var permitidas = [8,9,13,27,33,34,35,36,37,38,39,40,45,46,112,113,114,115,116,117,118,119,1];	
				if( permitidas.indexOf(code) == -1){
					var key = e.which;
					var s = String.fromCharCode(key);
					var digito = /\D+/.test(s);		
					if (digito == true){
						return false;
					}
				}
			}
		}).keyup(function(e){
			if(!e.ctrlKey && !e.altKey && !e.shiftKey){
				$(this).val($(this).val().replace(/\D+|\W+|\s+/gi,""));	
			}
		});		
	}
})(jQuery);