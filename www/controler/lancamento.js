function Lancamento() {
	
	this.db = db;
	
	
	// Lista contatos da base
	this.listLancamento = function(per_page, page) {
		carregando = true; 
		var inicio = '';
		//	console.log('getCatalogoItens'+per_page+' '+page);
		//interlock to prevent multiple calls
		$.mobile.loading('show',{text: "Carregando lista",textVisible:true,theme:"a"});
		storage.fdestaque  = 1;
		// Campos para pesquisa
		var fCategoria   = storage.fCategoria;
		var fLaboratorio = storage.fLaboratorio;
		var filial       = storage.filial;
		var fsearch      = storage.fsearch;
		var fordem       = storage.fordem;
		var fdestaque    = storage.fdestaque;
		var orderby   = "order by i.nome ASC";
		var wp = '';
		 
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
		
		wp += " AND i.destaque ='"+fdestaque+"' ";
		
		
		
		
		storage.area = 'destaque';
		
		var lista        =  $('#lancamentos #galeriaL');
	
		
		inicio = (page*per_page) ;
		
		db.transaction(function (tx) {
			
		var sql = 'SELECT i.* FROM item as i INNER JOIN marca as m ON m.id = i.marcaId INNER JOIN pcategoria as pc ON pc.id = i.categoriaPid INNER JOIN fabricante as f ON f.ref = i.fabricanteId WHERE i.filial = \''+filial+'\' '+wp+' and i.temfoto=\'1\' GROUP BY i.id '+ orderby +'  LIMIT '+inicio+','+per_page+'';
		
		
		
        tx.executeSql(sql, [], function (tx, results) {
            var len = results.rows.length, i;
            var itemL = "";
			var ql = 0;      
			var j = 0;          
            for (i = 0; i < len; i++){  
			
			
				if (ql == 0) { 
						itemL += '<div class="gallery-row">'; } 
						itemL += '<div class="gallery-item"><div class="boxP"><a href="javascript:item.getItem(\''+results.rows.item(i).id+'\')" >';
						
						if (results.rows.item(i).temfoto == '1') {
							imagem = '<img data-cod="'+results.rows.item(i).codBarras+'" data-temfoto="'+results.rows.item(i).temfoto+'" src="'+storage.folderImages+'/'+results.rows.item(i).codBarras+'.jpg" alt="'+results.rows.item(i).nome+'"  />';
						} else {
							imagem = '<img data-cod="'+results.rows.item(i).codBarras+'" data-temfoto="'+results.rows.item(i).temfoto+'" src="images/semfoto.jpg" alt="'+results.rows.item(i).nome+'"  />';		
						}

						itemL += imagem+'</a><div class="itemref">#'+results.rows.item(i).ref+'</div><div class="itemtitle">'+results.rows.item(i).nome+'</div></div></div>';
					
				
					
					ql++;
					
					
					
					if ( ql == 3) {
						ql = 0 ;	
						
						
						j++;
						// Quebra a linha
						itemL += '</div>';
						
					}
				
					
				lista.append(itemL);
				itemL = "";
				// Checa imagens da pagina
				//checkImages('.mimaged'+page);
			
			
                
            }
            
			}, null);
			
			
		}); 
		
		
	
		 carregando = false; 
		 $.mobile.loading('hide');
		
	}
	
	
	
	
		
	/*
	* Carrega dados para formulario de pesquisa
	*/
	this.carregaCombos =  function (form)
	{
		var fCategoria   = $(form +' #fcategoria');
		var fLaboratorio = $(form +' #flaboratorio');
	
		$(form + ' #fcategoria option').remove();
		$(form + ' #flaboratorio option').remove();
	
		// Categoria
		fCategoria.append('<option value="">Todas</option>');    
		//var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('SELECT id,nome FROM pcategoria  WHERE id <> 9 order by  nome ASC ', [], function (tx, results) {
				var len = results.rows.length, i;
				var lista = '' ;         
				for (i = 0; i < len; i++){  
					fCategoria.append('<option value="'+results.rows.item(i).id+'">'+results.rows.item(i).nome+'</option>');
				}
				
			}, null);
		}); 
	
		// Laboratorio
	
		fLaboratorio.append('<option value="">Todas</option>');    
		db.transaction(function (tx) {
			tx.executeSql('SELECT f.ref,f.nome FROM fabricante as f INNER JOIN item as i ON i.fabricanteId = f.ref   WHERE f.filial = \''+storage.filial+'\' GROUP BY f.id ORDER BY  f.nome ASC ', [], function (tx, results) {
				var len = results.rows.length, i;
				var lista = '' ;         
				for (i = 0; i < len; i++){  
					fLaboratorio.append('<option value="'+results.rows.item(i).ref+'">'+results.rows.item(i).nome+'</option>');
				}
				
			}, null);
		}); 
		
		
		$(form +' #fcategoria').on("change",function(){
		storage.fCategoria = this.value;
		
		});
		
		$(form + ' #flaboratorio').on("change",function(){
			storage.fLaboratorio = this.value;
			
		});
	
	}
	
	
	
	this.getDetail = function(id) {
			
		
	var sql = "SELECT i.*, m.nome as nomeMarca, pc.nome as nomeCat FROM item as i  INNER JOIN marca as m ON m.id = i.marcaId INNER JOIN pcategoria as pc ON pc.id = i.categoriaPid WHERE i.id = "+id;
	//var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
	// Faz a transacao
	 db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {
			var len = results.rows.length, i;	
			 
			
			$('#lancamentoItem #nome').html(results.rows.item(0).nome);
			$('#lancamentoItem #preco').html(results.rows.item(0).preco);
			$('#lancamentoItem #pmc').html(results.rows.item(0).pmc);
			$('#lancamentoItem #vencimento').html(results.rows.item(0).vencimento);
			$('#lancamentoItem #descricao').html(results.rows.item(0).descricao);
			$('#lancamentoItem #imagem').html('<img data-temfoto="'+results.rows.item(0).temfoto+'" data-cod="'+results.rows.item(0).codBarras+'"  src="images/semfoto.jpg" id="imgitemd" width="95%" />');
			$('#lancamentoItem #codigo').html(results.rows.item(0).ref);
			$('#lancamentoItem #marca').html(results.rows.item(0).nomeMarca);
			$('#lancamentoItem #codBarras').html(results.rows.item(0).codBarras);
			$('#lancamentoItem #categoriaP').html(results.rows.item(0).nomeCat);
			$('#lancamentoItem #complemento').html(results.rows.item(0).descricao);
			 
			 
			 
			 	
		});
		
	});
	
		
		
		$.mobile.changePage("#lancamentoItem", { transition: "pop",role: "dialog" })
		
	}
		
	
	
		
	
}