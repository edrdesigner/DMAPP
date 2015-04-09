function Promocao() {
	
	this.db = db;
	
	
	// Lista contatos da base
	this.listPromocao = function() {
		
		storage.area = 'promocao';
		
		var flista        =  $('#promocoes #lpromocoes');
		$('#promocoes #lpromocoes li').remove();
	
		db.transaction(function (tx) {
			
			
		var sql = 'SELECT * FROM promocao  WHERE filial = \''+storage.filial+'\' or filial = \'\'  ';
		
        tx.executeSql(sql, [], function (tx, results) {
			
            var len = results.rows.length, i;
            var lista = '' ;    
			   
            for (i = 0; i < len; i++){  
			
                flista.append('<li><a href="javascript:promocao.getPromocao(\''+results.rows.item(i).id+'\')">'+results.rows.item(i).nome+'<p>Ref:'+results.rows.item(i).ref+' Válido até '+results.rows.item(i).expira+'</p></a></li>');
				flista.listview('refresh');
            }
            
			}, null);
			
			
		}); 
		
		
		flista.listview('refresh');
		
		
		
	}
	
	
	// Retorna um contato da base
	this.getPromocao = function(id) {
		
		storage.area = 'promocaoDetail';
	
		var sql = "SELECT * FROM promocao  WHERE id = "+id;
	
		// Faz a transacao
		 db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				
				$('#promocaoDetail #nome').html(results.rows.item(0).nome);
				$('#promocaoDetail #ref').html(results.rows.item(0).ref);
				$('#promocaoDetail #expira').html(results.rows.item(0).expira);
				$('#promocaoDetail #descricao').val(decode64(results.rows.item(0).descricao));

					
			});
			
		});
		
		
		
		$.mobile.changePage("#promocaoDetail",{ transition: "slide" });
			
	}
	
	
		
	
}