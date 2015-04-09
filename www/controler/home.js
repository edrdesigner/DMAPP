
//carrega pagina index
$('#index').on( 'pageshow',function(event, ui){	
   
    // usado para logar	
    //create_table_login();   	
            
    var MISSING = "missing";
    var EMPTY = "";''
    var inputMapVar = $('input[name*="_r"]');	
  
		  
    if (!storage.login) { 
        // usuario não esta logado        
        storage.login = 0;
        storage.login_name = '';
        storage.login_empresa = '';
    }     
    else { //@todo Caso a pessoa estaja logada mais nao esta funcioando certo
        if((!storage.continue_tela) ||  storage.login == 0) {
            storage.continue_tela = "index.html";        
        }         
        else {
            $.mobile.changePage(storage.continue_tela, {
                transition: "flip"
            });
        }
    }
  
    // $('#mensagem').html('<p>É necessário estar logado </p>');  	
	  
    $('#form1').submit(function() {
        var err = false;       
        // limpa a classe de erro             
        inputMapVar.each(function(index){              
            $(this).removeClass(MISSING); 
        });
        
        // Perform form validation
        inputMapVar.each(function(index){ 		 
            if($(this).val()==null || $(this).val()==EMPTY){  
                $(this).addClass(MISSING);   
                // alert('campo vazil');
                err = true;
            }          
        });   
		        
        // Existe campos vazil
        if(err == true){            
            alert('DADOS INVÁLIDOS');
            return false;
        }        
      
        // If validation passes, show Transition content
        logar($('#form1').serialize());
        //alert('deu certo');
        
        return false;      
    }); 
// fim de usado para logar
	

//$('#login_r').val(md5('seta'));
});