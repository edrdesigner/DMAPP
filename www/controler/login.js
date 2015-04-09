var db;
document.addEventListener("deviceready", setDB, false);


function setDB() {
	db = window.openDatabase('dimebras', '1.0', 'Jobs', 5 * 1024 * 1024);
	console.log("Banco Setado")
}

jQuery(function(){
     if (storage.clogin == 1) {
		initMobileProdutos();	
        $.mobile.changePage("#home", {});
       // $('#dadosUsuario').html(storage.login_name+' <button id="logout"  onclick="logoff()" class="btn btn-info"><i class="fa fa-power-off">x</i></button>');
	   
	   $('#dadosUsuario').html(storage.login_name+'');
	   
	  
     }
	 
     
});
     




// LOGAR
function logar(dados){
    
    var login = $("INPUT#login").val();
    var senha = $("INPUT#senha").val();
    
    // md5 em js =)        
    senha = md5(senha);
    // deix minusculo login = login.toLowerCase();	
    login = login.toUpperCase();	
       
    var sql = "SELECT ref,login, nome,filial,login, password  FROM usuarios WHERE login='"+login+"'";	
    
  
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {
            var len = results.rows.length, i;	
                        
            if (len>0) {						
                var user ;
                var senha_db ;	
                // msg = "<p>Encontrado " + len + " linhas</p>";	   
                // document.querySelector('#status').innerHTML +=  msg;	
             
                storage.login =   results.rows.item(0).login; // id do cara                
                storage.login_name =   results.rows.item(0).nome;	
                storage.filial =  results.rows.item(0).filial; // seta nao valida varias empresas é sempre a mesma
                storage.login_fabrica =  1; // mudar depois o id da fabrigca
                storage.ref     =  results.rows.item(0).ref; // seta nao valida varias empresas é sempre a mesma
				
				//head.js("model/app_item_"+storage.filial+".js"); 
				
				head.js(storage.folderJS+"app_item_"+storage.filial+".js"); 

                
                console.log("Inserindo tabela item apos o login");
				 
                console.log("Ini configuracao");
                config.initConfiguracao();

				// Insere arquivo do recarregaDadosuser relatorio
			//	head.js("userRelatorio.js");  
                console.log("userRelatorio");

                var urlArquivo = "https://www.dimebras.com.br/index.php?option=com_djcatalog2&view=mobile&fn=getRelatorios&ref="+storage.ref;   
                if ( (connectionStatus != "NoConnection") && ( connectionStatus == "Cell4G" || connectionStatus == "WiFi"  || connectionStatus == "Ethernet" )  ) {
                     console.log("urlArquivo");   
                     head.js(urlArquivo);   
                }
            				
				
				
              
			  // head.js("file:///data/data/com.dimebras/com.dimebras/js/app_item_"+storage.filial+".js"); 
			   
			    
				initMobileProdutos();	
				
                storage.clogin = 1; // deletar essa linha pois ela esta burlando o login
                    $.mobile.changePage("#home", {
                        transition: "slide"
                    });	
                
               
                user =   results.rows.item(0).login;		
                senha_db =   results.rows.item(0).senha;					
					
                if( (senha==senha_db)){	
                     storage.clogin = 1;
					 
                    $.mobile.changePage("#home", {
                        transition: "slide"
                    });
					
					
                } 		
			
					
            }	else {
		           storage.clogin = 0;

                    $.mobile.changePage("#login", {
                        transition: "slide"
                    });	
                alert("Usuário não cadastrado ou Senha incorreta ")
            }
										  		
        }, null);
    });		
//alert(dados);
}	// FIMD O USADO PARA LOGAR
	
	  
