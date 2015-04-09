
function Contato() {
	
	this.db = db;
	this.carregando = false;
	
	var flista        =  $('#contatos #lcontatos');
	 
	
	
	// Lista contatos da base
	this.listContatos = function() {
		
		storage.area = 'contato';
		
		$('#contatos #lcontatos li').remove();
		
	
		db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM contato  order by  nome ASC ', [], function (tx, results) {
            var len = results.rows.length, i;
            var lista = '' ;         
            for (i = 0; i < len; i++){  
			
                flista.append('<li><a href="javascript:contato.getContato(\''+results.rows.item(i).id+'\')">'+results.rows.item(i).nome+'<p>'+results.rows.item(i).telefone+'</p></a></li>');
				flista.listview('refresh');
            }
            
			}, null);
			
			
		}); 
		
		
		flista.listview('refresh');
		
		
		
	}
	
	
	// Retorna um contato da base
	this.getContato = function(id) {
		
		storage.area = 'contatoDetail';
	
		var sql = "SELECT * FROM contato  WHERE id = "+id;
	
		// Faz a transacao
		 db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				
				$('#contatoDetail #nome').html(results.rows.item(0).nome);
				$('#contatoDetail #telefone').html(results.rows.item(0).telefone);
				$('#contatoDetail #extra').html(results.rows.item(0).extra);
				 
				
					
			});
			
		});
		
		
		
		$.mobile.changePage("#contatoDetail");
			
	}
	
	
		
	
}