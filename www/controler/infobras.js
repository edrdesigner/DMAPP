function Infobras() {
	
	this.db = db;
	
	
	// Lista relatorios da base
	this.listInfobras = function() {
		
		storage.area = 'infobras';
		$.mobile.loading('show',{text: "Carregando lista",textVisible:true,theme:"a"});
		
		var flista        =  $('#infobras #linfobras');
		$('#infobras #linfobras li').remove();
	
		db.transaction(function (tx) {
		
		var tfilial = 'dimebras';
		if ( storage.filial == 'alfamed' ) {
			tfilial = 'alfamed';		
		}
			
		var sql = 'SELECT * FROM infobras  WHERE filial = \''+storage.filial+'\' or filial = \'\' or  filial = \''+tfilial+'\' order by id DESC ';
		
        tx.executeSql(sql, [], function (tx, results) {
			
            var len = results.rows.length, i;
            var lista = '' ;    
			   
            for (i = 0; i < len; i++){  
				var imageml = '';
				
				if (results.rows.item(i).imagemg) {
					imageml = '<img class="infobrasImagemL"  src="'+results.rows.item(i).imagemg+'" />';
				}
				
                flista.append('<li><a  data-pid="'+results.rows.item(i).id+'" href="javascript:infobras.getItem(\''+results.rows.item(i).id+'\')" class="mpopup">'+imageml+'<h2>'+results.rows.item(i).title+'</h2></a></li>');
				
				
				flista.listview('refresh');
            }
            
			}, null);
			
			
		}); 
		
		
		flista.listview('refresh');
		$.mobile.loading('hide');
		
		
	}
	
	
	// Retorna um relatorio da base
	this.getItem = function(id) {
		
		storage.area = 'financeiroDetail';
	
		var sql = "SELECT * FROM infobras  WHERE id = "+id;
	
		// Faz a transacao
		 db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				
				$('#infobrasDetail #titulo').html(results.rows.item(0).title);
				
				if ( results.rows.item(0).imagemg ) {
					$('#infobrasDetail #imagem').html('<img class="infobrasImagemD" src="'+results.rows.item(0).imagemg+'" border="0" />');				
				}
				
				//$('#infobrasDetail #descricao').html(decode64(results.rows.item(0).introtext));
				$('#infobrasDetail #descricao').html(results.rows.item(0).introtext);

					
			});
			
		});
		
		$.mobile.changePage("#infobrasDetail",{ transition: "slide" });
			
	}

	
}