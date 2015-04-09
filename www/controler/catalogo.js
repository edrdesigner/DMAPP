var ci = 0;
function Catalogo() {
	this.db = db;
	this.buildQuery = function() 
	{
	    // Campos para pesquisa
	    var fCategoria   = storage.fCategoria;
	    var fLaboratorio = storage.fLaboratorio;
	    var filial       = storage.filial;
		var fsearch      = storage.fsearch;
	    var fordem       = storage.fordem;
	    var fdestaque    = storage.fdestaque;		
		var orderby  	 = "order by i.nome ASC";
		
		
	    var wp = '';
		
		// Faz busca por texto search
		if ( fsearch ) {
			wp += " AND ( i.nome like '%"+fsearch+"%' OR i.ref like '%"+fsearch+"%' OR i.descricao like '%"+fsearch+"%' OR i.codBarras like '%"+fsearch+"%' ) ";
		}
		
	    if (fCategoria  ) {
	        wp += " AND i.categoriaPid ='"+fCategoria+"' ";
	    }   
	    if (fLaboratorio ) {
	        wp += " AND i.fabricanteId ='"+fLaboratorio+"' ";
	    }  
	    if ( fordem ) {
			
			 if ( fordem == 1 ) {
	         	orderby = "  order by i.nome ASC";
			 } else {
				orderby = "order by f.nome ASC "	 
			 }
	    }
	    if ( fdestaque ) {
	         wp += " AND i.destaque ='"+fdestaque+"' ";
	    }
        var sql = ' SELECT i.* FROM item as i '
        		 +' INNER JOIN marca as m ON m.id = i.marcaId '
        		 +' INNER JOIN pcategoria as pc ON pc.id = i.categoriaPid '
        		 +' INNER JOIN fabricante as f ON f.ref = i.fabricanteId '
        		 +' WHERE i.filial = \''+filial+'\' '+wp+' GROUP BY i.id '
        		 +  orderby;
        return sql;
	}

	this.listItemsH = function(page)
	{
		carregando = true;
		// Remover dados antigos
		var lista        =  $('#galeriaC');
		
		var per_page = storage.c_iporpagina;



	    if ( page == 0 ){

	    	storage.icatalogo = 0;
	    	var sqlt = catalogo.buildQuery();
	    	
	    	
	    	page = 0;

	    	
	    	storage.carregou = 0;
	    	// Se tiver slick eu destruo ele
//	    	console.log("Destruir slick");
//	    	$('.gallery').slick('unslick');

	    	lista.empty();

	    	$('.gallery').slick({
				  dots: false,
				 // lazyLoad: 'ondemand',
				  infinite: false,
				  speed: 200,
				  slidesToShow: 1,
				  adaptiveHeight: true
			}); 

 
			storage.totalItensCatalogo = '';
				db.transaction(function (tx) {
									 
					 tx.executeSql(sqlt, [], function (tx, results) {
						storage.totalItensCatalogo =	 results.rows.length;	

						  totalPaginas = Math.round(storage.totalItensCatalogo/per_page);
						  storage.totalPaginas = totalPaginas;
						  console.log("Total Paginas tx "+totalPaginas);



						  // On edge hit
						$('.gallery').on('edge', function(event, slick, direction){
						  console.log('edge was hit :: '+direction);
						  if ( direction == "left" ) {
						  	  storage.page++;
						  	  	if (storage.totalPaginas >= page) {
						  	  		
							  		catalogo.listItemsH(storage.page);
								}
							}
						});	



					 });
					   
				});

		  

	    }

	    // Calcula inicio
	    inicio = (page*per_page) ;


		//console.log("carregou td "+ storage.carregou);
		if ( storage.carregou == 0 ) {
			
		
		console.log(page+ " total itens "+storage.totalItensCatalogo);
	//	storage.folderImages = "https://s3-sa-east-1.amazonaws.com/s3dimebras/images"
	    db.transaction(function (tx) {
	     	 
	      storage.icatalogo = 1;	
	      var sql  = catalogo.buildQuery() +  ' LIMIT '+inicio+','+per_page+'';
	      //	var sql  = catalogo.buildQuery() ;
	   
	    
	      
	           
	        tx.executeSql(sql, [], function (tx, results) {
	            var len = results.rows.length, i;
	            // Mostra carregando
	           
	            console.log("Carregando...");   
	     	    $(".sts").html("Carregando...");

	            var ql = 0;      
				var j = 0; 
	            var itemL = "";
	            var l = 0;
	            var c = 0;
	            var pg = 0;
				
				var pp = storage.c_ilinhas * storage.c_icolunas;
				
				for (var i = 0; i < len; i++) {  

					
	               
	               if (j == 0 ){
	               	   itemL += '<div>';
	               } else {
	               		itemL += '';	 
	               }
					
					
					
					itemL += '<div class="item"><div class="boxP"><a href="javascript:item.getItem(\''+results.rows.item(i).id+'\')" >';
								
					if (results.rows.item(i).temfoto == '1') {
						imagem = '<img data-cod="'+results.rows.item(i).codBarras+'" class="'+results.rows.item(i).codBarras+' " '
								+'data-temfoto="'+results.rows.item(i).temfoto+'"  src="'+storage.folderImages+'/'+results.rows.item(i).codBarras+'.jpg"   '
								+'alt="'+results.rows.item(i).nome+'"  />';
					} else {
						imagem = '<img data-cod="'+results.rows.item(i).codBarras+'" '
								 +'data-temfoto="'+results.rows.item(i).temfoto+'" src="images/semfoto.jpg"   '
								 +'alt="'+results.rows.item(i).nome+'"  />';		
					}
					itemL += imagem+'</a>';
					if ( storage.c_cmcodigo == "on") {
						itemL += '<p class="itemref">#'+results.rows.item(i).ref+'</p>';
					}
					if ( storage.c_cmtitulo == "on") {
						itemL += '<p class="itemtitle">'+results.rows.item(i).nome+'</p>';
					}
					itemL += '</div></div>'; 
                    j++;
                    c++;
                    if (c == storage.c_icolunas) {
                    	c = 0;
                    	itemL += '<br class="clear" />';	
                    }
                   
				   		
				  
	                 if ( j == (pp)) {
                    	j = 0;
                    	pg = 0; 
                    	 itemL += '</div>'; 
                    	// lista.append(itemL);
                    	
                    	$('.gallery').slick('slickAdd',itemL);
                    	// console.log("Fecha slide");   
                    	//$.mobile.loading('hide');
					
                    	 itemL = '';
                    	// console.log(ci+ ' O catalogo tem ' + storage.totalItensCatalogo);
                    }
                  
					
					if (i >= (len-3))  {
						$(".sts").html("Catalogo");
					}	 
					 
				}



				
				
	            
	        }, null);
			
			 
					
	    }); 
		
		
	
		}
		
	}
	/**
		Lista todos os itens  
	**/
	this.listItems = function(per_page, page) 
	{
			
			console.log("carregando"+carregando);
			var inicio = '';
		    var lista        =  $('#galeriaC');
		    
		    var sqlt = catalogo.buildQuery(); 
		    var tl = 2;
		    // Remover dados antigos
			//lista.remove('div');
			
			if (page == 0 ) {
				storage.totalItensCatalogo = '';
				db.transaction(function (tx) {
									 
					 tx.executeSql(sqlt, [], function (tx, results) {
						storage.totalItensCatalogo =	 results.rows.length;	
					 });
					   
				});
				 // Remover dados antigos
				lista.empty();
					
			}
			
			// Calcula inicio
			inicio = (page*per_page) ;
	
		    db.transaction(function (tx) {
		    	
		        var sql =  catalogo.buildQuery() +'  LIMIT '+inicio+','+per_page+'';
			
				       
		        tx.executeSql(sql, [], function (tx, results) {
		     
		          carregando = true; 
		          // Mostra carregando
		    	  $.mobile.loading('show',{text: "Carregando Itens...",textVisible:true,theme:"a"});		
		            var len = results.rows.length, i;
		            var ql = 0;      
					var j = 0; 
		            var itemL = "";
					
					for (i = 0; i < len; i++) {  
		               
						
						if ( tl == 1 ) {
			                itemL = "<li><a href=\"javascript:item.getItem('"+results.rows.item(i).id+"')\"><img src=\""+storage.folderImages+results.rows.item(i).codBarras+".jpg\" width=\"70\" class=\"imagesl_"+page+"\" />";
			                itemL += "<h2>"+results.rows.item(i).nome+"</h2>";
			                itemL += "<p>Ref: "+results.rows.item(i).ref   +"</p>";
			                itemL += "<p class=\"ui-li-aside\"><strong>"+results.rows.item(i).status+"<br /></strong></p></a></li>";
			                lista.append(itemL);
						
						} else {
							
							if (ql == 0) { itemL = '<div class="gallery-row">'; } 
							
								
								itemL += '<div class="gallery-item"><div class="boxP"><a href="javascript:item.getItem(\''+results.rows.item(i).id+'\')" >';
								
								// Verifica se tem foto
								if (results.rows.item(i).temfoto == '1') {
									imagem = '<img data-cod="'+results.rows.item(i).codBarras+'" class="'+results.rows.item(i).codBarras+' lazy" '
											+'data-temfoto="'+results.rows.item(i).temfoto+'"  src="'+storage.folderImages+'/'+results.rows.item(i).codBarras+'.jpg"   '
											+'alt="'+results.rows.item(i).nome+'"  />';
								} else {
									imagem = '<img data-cod="'+results.rows.item(i).codBarras+'" '
											 +'data-temfoto="'+results.rows.item(i).temfoto+'" src="images/semfoto.jpg"   '
											 +'alt="'+results.rows.item(i).nome+'"  />';		
								}
								itemL += imagem+'</a>';
								if ( storage.c_cmcodigo == "on") {
									itemL += '<p class="itemref">#'+results.rows.item(i).ref+'</p>';
								}
								if ( storage.c_cmtitulo == "on") {
									itemL += '<p class="itemtitle">'+results.rows.item(i).nome+'</p>';
								}
								itemL += '</div></div>';
							
						
							
							ql++;
							// Verifica imagem
							if ( ql == storage.c_icolunas ) {
								ql = 0 ;	
								//console.log('Verificando imagens da linha '+j)
								j++;
								// Quebra a linha
								itemL += '</div>';
								itemL += '<br class="clear" />';
								lista.append(itemL);
								
							}
						} 
							
						
		            }
					
					if ( tl == 1 ) {
						$('#litens').listview('refresh');
						$.mobile.loading('hide');
						 carregando = false;	
					} else {	
		    			$.mobile.loading('hide');
		    			carregando = false;	
					}
		            
		        }, null);
				
				 
				
		    }); 
			
		
		
	}
	
	 
	/*
	* Carrega dados para formulario de pesquisa
	*/
	this.carregaCombos = function(form) 
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
	   // var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
	    db.transaction(function (tx) {
	        tx.executeSql('SELECT ref,nome FROM fabricante WHERE filial = \''+storage.filial+'\' order by  nome ASC ', [], function (tx, results) {
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
		
	} // end carrega combos
}