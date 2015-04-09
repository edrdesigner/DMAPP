function Configurar()
{
	this.db = db;




    this.criarTabelas = function() {
       var db = this.db;
       db.transaction(function (tx) {
	        //CREATE TABLE IF NOT EXISTS login
	        tx.executeSql('CREATE TABLE IF NOT EXISTS  config (cod INTEGER PRIMARY KEY ASC unique, 	chave,  valor, login );');	
	    });	

    }

    this.verificaConfig = function () {
    	var db = this.db;
    	var sql = "SELECT * FROM config WHERE login = '"+storage.login+"'";
    	db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				if (len > 0) {
					catalogo.iniConfiguracao();
				} else {
					catalogo.novaConfig();
				}						
			});				
		});
    }


    this.iniConfiguracao = function() {
    	storage.c_tipocatalogo = catalogo.getConfigBD('c_tipocatalogo');
    	storage.c_iporpagina = catalogo.getConfigBD('c_iporpagina');
    	storage.c_ilinhas = catalogo.getConfigBD('c_ilinhas');
    	storage.c_icolunas = catalogo.getConfigBD('c_icolunas');
    	storage.c_cmtitulo = catalogo.getConfigBD('c_cmtitulo');
    	storage.c_cmcategoria = catalogo.getConfigBD('c_cmcategoria');
    	storage.c_cmimagem = catalogo.getConfigBD('c_cmimagem');
    	storage.c_cmcodigo = catalogo.getConfigBD('c_cmcodigo');
    }

    this.novaConfig = function() {
    	 catalogo.insertConfigBD('c_tipocatalogo',storage.c_tipocatalogo);
		 catalogo.insertConfigBD('c_iporpagina',storage.c_iporpagina);
		 catalogo.insertConfigBD('c_ilinhas',storage.c_ilinhas);
		 catalogo.insertConfigBD('c_icolunas',storage.c_icolunas);
		 catalogo.insertConfigBD('c_cmtitulo',storage.c_cmtitulo);
		 catalogo.insertConfigBD('c_cmcategoria',storage.c_cmcategoria);
		 catalogo.insertConfigBD('c_cmimagem',storage.c_cmimagem);
		 catalogo.insertConfigBD('c_cmcodigo',storage.c_cmcodigo);    	
    }

    getConfigBD = function(chave) {
    	var db = this.db;
    	 db.transaction(function (tx) {
	        tx.executeSql("SELECT * FROM config WHERE login = '"+storage.login+"' AND chave = '"+chave+"'  ", [], function (tx, results) {
	            var len = results.rows.length, i;		
				
				return results.rows.item(0).valor;			  
	          
				  
	        }, null);
	    });	
    }


    setConfigBD = function(chave,valor) {
    	var db = this.db;

    	db.transaction(function (tx) {
        update = "UPDATE config SET valor = '"+valor+"' WHERE login = '"+storage.login+"' and chave= '"+chave+"' " ;		
	        //alert(update);		
	        db.transaction(function(tx) {
	            tx.executeSql(update);	
	        });			
	    });	
    }

    insertConfigBD = function(chave,valor) {
    	var db = this.db;
    	db.transaction(function (tx) {
        update = "INSERT INTO config (cod, login, chave, valor) VALUES (NULL,'"+storage.login+"', '"+chave+"','"+valor+"'); " ;		
	        db.transaction(function(tx) {
	            tx.executeSql(update);	
	        });			
	    });	
    }



	this.configurarAPP = function() {
		storage.c_tipocatalogo	= $('#tipocatalogo').val();
		storage.c_iporpagina	= $('#iporpagina').val();
		storage.c_ilinhas		= $('#ilinhas').val();
		storage.c_icolunas		= $('#icolunas').val();
		
		var lista   		    = $('#galeriaC');
		// Geral
		if ($('#cmtitulo').attr('checked') == "checked") {
 			storage.c_cmtitulo		= "on";
 		} else {
 			storage.c_cmtitulo		= "off";
 		}
 		if ($('#cmcategoria').attr('checked') == "checked") {
			storage.c_cmcategoria	= "on"
		} else {
			storage.c_cmcategoria	= "off"
		}
		if ($('#cmimagem').attr('checked') == "checked") {
			storage.c_cmimagem	= "on"
		} else {
			storage.c_cmimagem	= "off"
		}
		if ($('#cmcodigo').attr('checked') == "checked") {
			storage.c_cmcodigo	= "on"
		} else {
			storage.c_cmcodigo	= "off"
		}
		 // Remover dados antigos
		 lista.empty();
		 storage.carregou = 0;
		 storage.icatalogo = 0;
		 storage.page = 0;

		 catalogo.setConfigBD('c_tipocatalogo',storage.c_tipocatalogo);
		 catalogo.setConfigBD('c_iporpagina',storage.c_iporpagina);
		 catalogo.setConfigBD('c_ilinhas',storage.c_ilinhas);
		 catalogo.setConfigBD('c_icolunas',storage.c_icolunas);
		 catalogo.setConfigBD('c_cmtitulo',storage.c_cmtitulo);
		 catalogo.setConfigBD('c_cmcategoria',storage.c_cmcategoria);
		 catalogo.setConfigBD('c_cmimagem',storage.c_cmimagem);
		 catalogo.setConfigBD('c_cmcodigo',storage.c_cmcodigo);


		alert("Configuração efetuada com sucesso!");
	};


	this.getConfiguracao = function(){

		$('#tipocatalogo').val(storage.c_tipocatalogo);
		$('#tipocatalogo').trigger('change');
		$('#iporpagina').val(storage.c_iporpagina);
		$('#iporpagina').trigger('change');
		$('#ilinhas').val(storage.c_ilinhas);
		$('#ilinhas').trigger('change');
		$('#icolunas').val(storage.c_icolunas);
		$('#icolunas').trigger('change');
		if (storage.c_cmtitulo == "on") {
			$('#cmtitulo').trigger('click');
			$('#cmtitulo').attr('checked','true')
		} 
		
		if (storage.c_cmcategoria == "on") {
			$('#cmcategoria').trigger('click');
			$('#cmcategoria').attr('checked','true')
		} 
		if (storage.c_cmimagem == "on") {
			$('#cmimagem').trigger('click');
			$('#cmimagem').attr('checked','true')
		} 
		if (storage.c_cmcodigo == "on") {
			$('#cmcodigo').trigger('click');
			$('#cmcodigo').attr('checked','true')
		}  
	};


	this.initConfiguracao = function(){
		
		console.log("Init Configuracao");
		if ( storage.c_tipocatalogo == undefined)
		{
			storage.c_tipocatalogo = 'horizontal';
		} 
		if ( storage.c_iporpagina == undefined){
			storage.c_iporpagina = '25';
		} 
		if ( storage.c_ilinhas == undefined) {
			storage.c_ilinhas = '3';
		} 
		if ( storage.c_icolunas == undefined) {
			storage.c_icolunas = '3';
		} 
		if ( storage.c_cmtitulo == undefined) {
			storage.c_cmtitulo = "on";
		} 
		if ( storage.c_cmcategoria == undefined) {
			storage.c_cmcategoria = "false";
		} 
		if ( storage.c_cmcategoria == undefined) {
			storage.c_cmcategoria = "off";
		} 
		if ( storage.c_cmimagem == undefined) {
			storage.c_cmimagem = "on";
		} 
		if ( storage.c_cmcodigo == undefined) {
			storage.c_cmcodigo = "on";
		} 

		catalogo.verificaConfig();

		 storage.carregou = 0;
		 storage.icatalogo = 0;
		 storage.page = 0;
	};


	this.iniGA = function() {

		if ( connectionStatus == "Ethernet"  || connectionStatus == "WiFi"  || connectionStatus == "Cell4G" ) {
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  ga('create', 'UA-16920117-18', 'auto');
		  ga('send', 'pageview');
		}
	}

	this.sendGAPV = function(page) {
		if ( connectionStatus == "Ethernet"  || connectionStatus == "WiFi"  || connectionStatus == "Cell4G" ) {
			ga('send', 'pageview', {'page': page});
		}
	}
} 