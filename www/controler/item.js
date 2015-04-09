function Item()
{
	
	/**
	* Retorna dados de um item da tabela item
	*/
	this.getItem = function(id) 
	{
			storage.area = 'catalogoItem';
			
			var sql = "SELECT i.*, m.nome as nomeMarca, pc.nome as nomeCat FROM item as i INNER JOIN marca as m ON m.id = i.marcaId INNER JOIN pcategoria as pc ON pc.id = i.categoriaPid WHERE i.id = "+id; 
			//var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
			// Faz a transacao
			 db.transaction(function (tx) {
				tx.executeSql(sql, [], function (tx, results) {
					var len = results.rows.length, i;	
					
					 storage.iditem =   results.rows.item(0).id; 
					 storage.codigo =   results.rows.item(0).ref; 
					 storage.nome   =   results.rows.item(0).nome;
					 storage.preco  =   results.rows.item(0).preco;
					 storage.pmc  =   results.rows.item(0).pmc;
					 storage.codBarras = results.rows.item(0).codBarras;
					 storage.descricao = results.rows.item(0).descricao;
					 storage.precoLista  = results.rows.item(0).precoLista;
					 storage.desconto    = results.rows.item(0).desconto;
					 storage.descontoPromo	= results.rows.item(0).descontoPromo;
					 storage.promocao  = results.rows.item(0).promocao;
					 storage.destaque  = results.rows.item(0).destaque;
					 storage.unidade  = results.rows.item(0).unidade;
					 storage.status  = results.rows.item(0).status;
					 storage.origem  = results.rows.item(0).origem;
					 storage.vencimento  = results.rows.item(0).vencimento;
					 storage.imagem  = results.rows.item(0).imagem;
					 storage.nomeMarca   = results.rows.item(0).nomeMarca;
					 storage.categoriaP  = results.rows.item(0).nomeCat;
					 storage.temfoto  = results.rows.item(0).temfoto; 	
					
					 setDadosItem();
						
				});				
			});

	}
		
	/**
	* Retorna dados de um item da tabela item
	*/
	this.getPrevNext = function(maiorMenor)
	{
		
		if (storage.iditem >0) {
		
		//$.mobile.loading('show');
		storage.area = 'catalogoItem';
		
		
		// Campos para pesquisa
	    var fCategoria   = storage.fCategoria;
	    var fLaboratorio = storage.fLaboratorio;
	    var filial       = storage.filial;
		var fsearch      = storage.fsearch;  
	    //var fdescontode  = $('#catalogo #fdescontode').val();
	    //var fdescontoate = $('#catalogo #fdescontoate').val();
	    var fordem       = storage.fordem;
	    var fdestaque    = storage.fdestaque;
		
		 
		var wp = ""; 
		var orderby = "";
		
		// Faz busca por texto search
		if ( fsearch ) {
			wp += " AND ( i.nome like '%"+fsearch+"%' OR i.ref like '%"+fsearch+"%' OR i.descricao like '%"+fsearch+"%' ) ";
		}
		
	    if (fCategoria  ) {
	        wp += " AND i.categoriaPid ='"+fCategoria+"' ";
	    }   
	    if (fLaboratorio ) {
	        wp += " AND i.fabricanteId ='"+fLaboratorio+"' ";
	    }  
	    
		 
		orderby = "  order by i.nome ASC";
		
	    ordr = 'name';
	    if ( fdestaque ) {
	         wp += " AND i.destaque ='"+fdestaque+"' ";
	    }
		if (maiorMenor == ">") {
			kind = "ASC";	
		} else {
			kind = "DESC";	
		}
		
		
		if (ordr == 'name') {
			var sql = "SELECT i.*, m.nome as nomeMarca, pc.nome as nomeCat FROM item as i  INNER JOIN marca as m ON m.id = i.marcaId INNER JOIN pcategoria as pc ON pc.id = i.categoriaPid WHERE i.nome "+maiorMenor+" '"+storage.nome+"'  "+wp+" order by i.nome "+kind+" LIMIT 1";
		} else {
			var sql = "SELECT i.*, m.nome as nomeMarca, pc.nome as nomeCat FROM item as i  INNER JOIN marca as m ON m.id = i.marcaId INNER JOIN pcategoria as pc ON pc.id = i.categoriaPid WHERE i.id "+maiorMenor+" "+storage.iditem+"  "+wp+" order by i.id "+kind+" LIMIT 1";
				
		
		}
		//var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
		// Faz a transacao
		 db.transaction(function (tx) {
	        tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				 storage.codigo =   results.rows.item(0).ref; 
				 storage.nome   =   results.rows.item(0).nome;
				 storage.preco  =   results.rows.item(0).preco;
				 storage.pmc  =   results.rows.item(0).pmc;
				 storage.codBarras = results.rows.item(0).codBarras;
				 storage.descricao = results.rows.item(0).descricao;
				 storage.precoLista  = results.rows.item(0).precoLista;
				 storage.desconto    = results.rows.item(0).desconto;
				 storage.descontoPromo	= results.rows.item(0).descontoPromo;
				 storage.promocao  = results.rows.item(0).promocao;
				 storage.destaque  = results.rows.item(0).destaque;
				 storage.unidade  = results.rows.item(0).unidade;
				 storage.status  = results.rows.item(0).status;
				 storage.origem  = results.rows.item(0).origem;
				 storage.vencimento  = results.rows.item(0).vencimento;
				 storage.imagem  = results.rows.item(0).imagem;
				 storage.nomeMarca   = results.rows.item(0).nomeMarca;
				 storage.categoriaP  = results.rows.item(0).nomeCat; 	
				 
				 storage.temfoto  = results.rows.item(0).temfoto; 	
				 
				 setDadosItem();
			});
			
		});
		
		
		
			//$.mobile.loading('hide');
		}
	
	
	}

} 




	function setDadosItem()
	{

		$('#catalogoItem #nome').html(storage.nome);
		$('#catalogoItem #preco').html(storage.preco);
		$('#catalogoItem #pmc').html(storage.pmc);
		////$('#catalogoItem #desconto').html(storage.desconto);
		//$('#catalogoItem #descontoPromo').html(storage.descontoPromo);
		$('#catalogoItem #vencimento').html(storage.vencimento);
		$('#catalogoItem #descricao').html(storage.descricao);
	//	$('#catalogoItem #status').html(storage.status);
		if ( storage.temfoto == 0) {
			$('#catalogoItem #imagem').html('<img data-temfoto="'+storage.temfoto+'" data-cod="'+storage.codBarras+'"   src="images/semfoto.jpg" id="imgitemd" width="95%" />');
		} else {
			$('#catalogoItem #imagem').html('<img data-temfoto="'+storage.temfoto+'" data-cod="'+storage.codBarras+'"   src="'+storage.folderImages+'/'+storage.codBarras+'.jpg"  id="imgitemd" width="95%" />');
		}
		
		$('#catalogoItem #codigo').html(storage.codigo);
		$('#catalogoItem #marca').html(storage.nomeMarca);
		$('#catalogoItem #codBarras').html(storage.codBarras);
		$('#catalogoItem #categoriaP').html(storage.categoriaP);
		$('#catalogoItem #complemento').html(storage.descricao);
		
		storage.area = 'catalogoItem';
		
		/* 
		if ( storage.iditem == 1) {
			$("#catalogoItem .btnPrev").hide();	
		} else {
			$("#catalogoItem .btnPrev").show();	
		}*/
		
		//isImage('#imgitemd');
 
 	  

		// Open directly via API
		/*
		  $.magnificPopup.open({
		    items: {
		     src: '#catalogoItem',
		     type: 'inline'
		    }
		  });  
	*/
	
		// Transiciona pagina
		$.mobile.changePage("#catalogoItem");
		
	}


//  Define os dados no item
	function setDadosItemOld()
	{
		$('#catalogoItem #nome').html(storage.nome);
		$('#catalogoItem #preco').html(storage.preco);
		$('#catalogoItem #pmc').html(storage.pmc);
		////$('#catalogoItem #desconto').html(storage.desconto);
		//$('#catalogoItem #descontoPromo').html(storage.descontoPromo);
		$('#catalogoItem #vencimento').html(storage.vencimento);
		$('#catalogoItem #descricao').html(storage.descricao);
	//	$('#catalogoItem #status').html(storage.status);
		if ( storage.temfoto == 0) {
			$('#catalogoItem #imagem').html('<img data-temfoto="'+storage.temfoto+'" data-cod="'+storage.codBarras+'"   src="images/semfoto.jpg" id="imgitemd" width="95%" />');
		} else {
			$('#catalogoItem #imagem').html('<img data-temfoto="'+storage.temfoto+'" data-cod="'+storage.codBarras+'"   src="'+storage.folderImages+'/'+storage.codBarras+'.jpg"  id="imgitemd" width="95%" />');
		} 
		
		$('#catalogoItem #codigo').html(storage.codigo);
		$('#catalogoItem #marca').html(storage.nomeMarca);
		$('#catalogoItem #codBarras').html(storage.codBarras);
		$('#catalogoItem #categoriaP').html(storage.categoriaP);
		$('#catalogoItem #complemento').html(storage.descricao);
		
		storage.area = 'catalogoItem';
		
		if ( storage.iditem == 1) {
			$("#catalogoItem .btnPrev").hide();	
		} else {
			$("#catalogoItem .btnPrev").show();	
		}
		
		//isImage('#imgitemd');

 	    

		// Transiciona pagina
		$.mobile.changePage("#catalogoItem");
		
	}





 function removeFile(cod)
 {

 	console.log("Deletar arquivo "+cod);
 	 window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;



	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
         	function(fileSystem) {
         			window.FS = fileSystem;
					var root = window.FS.root;

					root.getFile("imagens/"+cod+".jpg",{create:false},function(fileEntry) {

				    fileEntry.remove(function() {
				      console.log('File removed. '+cod);
				    }, errorHandler);

				  },errorHandler);


         	}, 
            null);

 }


 function errorHandler(event){
 	  console.log('file error: ' + event.target.error.code);

 }




// Funcao para recarregar foto
// Recarregar Imagem
// Verifica se tem imagem e atualiza
function atualizaFoto()
{   
    var cod     = storage.codBarras;
    var temfoto = 1;
    
   console.log('O Código do produto: '+cod);
    
    if ( connectionStatus == "NoConnection" || connectionStatus == "Unknown" ) {    
        console.log('Você precisa estar conectado para baixar a imagem novamente.');
        alert("Você precisa estar conectado para baixar a imagem novamente.");
        //$(e).attr('src', 'images/semfoto.jpg'); 
        return  false;
    }
    
    
    if (cod) {
        console.log('temfoto = '+temfoto);
        if (temfoto == 1) {
            $.mobile.loading('show',{text: "Carregando imagem. Aguarde",textVisible:true});
            
            var ft = new FileTransfer();
            var uri = encodeURI("http://www.dimebras.com.br/images/produtos/"+cod+".jpg");
            var downloadPath = storage.folderImages + "/"+cod+".jpg";
            
            removeFile(cod);

            ft.download(uri, downloadPath, 
            function(entry) {
                $.mobile.loading('hide');
                console.log("Finalizou download de "+entry.fullPath);
                // Altera a imagem
               // $('#imagem').html('<img data-temfoto="'+storage.temfoto+'" data-cod="'+storage.codBarras+'"  src="'+storage.folderImages+'/'+cod+'.jpg" id="imgitemd" width="95%" />');

               	$('#imagem').html('<img data-temfoto="'+storage.temfoto+'" data-cod="'+storage.codBarras+'"  src="http://www.dimebras.com.br/images/produtos/'+cod+'.jpg" id="imgitemd" width="95%" />');


				// Atualizo o src da imagem no catalogo
				// $('.'+cod).attr('src',storage.folderImages+'/'+cod+'.jpg');

				 $('.'+cod).attr('src',"http://www.dimebras.com.br/images/produtos/"+cod+".jpg");

                
            },  
        function(error) {
            $.mobile.loading('hide');
            console.log('Ocorreu um erro... codigo do produto '+cod);   
            
            alert("Este produto não contem imagem no momento!");
            // Atualiza no banco pra nao dar mais erro
            
            console.log("Atualizou a imagem");  
            db.transaction(function (tx) {
            tx.executeSql("UPDATE item SET temfoto='0' WHERE codBarras ='"+cod+"' and filial ='"+storage.filial+"'", [], function (tx, results) { }, null) } );
            
        });
            
            
        } else {
           
        }
    }
        
}
