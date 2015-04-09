/*
* jQuery Mobile Framework : temporary extension to port jQuery UI's datepicker for mobile
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function($, undefined ) {

    //cache previous datepicker ui method
    var prevDp = $.fn.datepicker;
    
    // inicio data pt-br
        $.datepicker.regional['pt-BR'] = {
            closeText: 'Fechar',
            prevText: '&#x3c;Anterior',
            nextText: 'Pr&oacute;ximo&#x3e;',
            currentText: 'Hoje',
            monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
            'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
            'Jul','Ago','Set','Out','Nov','Dez'],
            dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
            dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional['pt-BR']);
    

    //rewrite datepicker
    $.fn.datepicker = function( options ){
		
        var dp = this;
	
        //call cached datepicker plugin
        prevDp.call( this, options );
		
        //extend with some dom manipulation to update the markup for jQM
        //call immediately
        function updateDatepicker(){            
            $.datepicker.setDefaults($.datepicker.regional['pt-BR']);
            $( ".ui-datepicker-header", dp ).addClass("ui-body-c ui-corner-top").removeClass("ui-corner-all");
            $( ".ui-datepicker-prev, .ui-datepicker-next", dp ).attr("href", "#");
            $( ".ui-datepicker-prev", dp ).buttonMarkup({
                iconpos: "notext", 
                icon: "arrow-l", 
                shadow: true, 
                corners: true
            });
            $( ".ui-datepicker-next", dp ).buttonMarkup({
                iconpos: "notext", 
                icon: "arrow-r", 
                shadow: true, 
                corners: true
            });
            $( ".ui-datepicker-calendar th", dp ).addClass("ui-bar-c");
            $( ".ui-datepicker-calendar td", dp ).addClass("ui-body-c");
            $( ".ui-datepicker-calendar a", dp ).buttonMarkup({
                corners: false, 
                shadow: false
            }); 
            $( ".ui-datepicker-calendar a.ui-state-active", dp ).addClass("ui-btn-active"); // selected date
            $( ".ui-datepicker-calendar a.ui-state-highlight", dp ).addClass("ui-btn-up-e"); // today"s date
            $( ".ui-datepicker-calendar .ui-btn", dp ).each(function(){
                var el = $(this);
                // remove extra button markup - necessary for date value to be interpreted correctly
                el.html( el.find( ".ui-btn-text" ).text() ); 
            });
        };
		
        //update now
        updateDatepicker();
		
        // and on click
        $( dp ).click( updateDatepicker );
		
        //return jqm obj 
        return this;
    };
		
    //bind to pagecreate to automatically enhance date inputs	
    $( ".ui-page" ).on( "pagecreate", function(){	
        // inciio pt-br
       
       
        // fim pt-br	
        $( "input[type='date'], input:jqmData(type='date')" ).each(function(){
            $(this).after( $( "<div />" ).datepicker({
                altField: "#" + $(this).attr( "id" ), 
                showOtherMonths: true
            }) );
              
        });	
        
		
    });
})( jQuery );