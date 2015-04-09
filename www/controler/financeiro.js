function Financeiro() {
	
	this.db = db;
	
	
	// Lista relatorios da base
	this.listFinanceiro = function() {
		
		storage.area = 'financeiro';
		$.mobile.loading('show',{text: "Carregando lista",textVisible:true,theme:"a"});
		var flista        =  $('#financeiro #lfinanceiro');
		$('#financeiro #lfinanceiro li').remove();
	
		db.transaction(function (tx) {
			
			
		var sql = 'SELECT * FROM financeiro  WHERE filial = \''+storage.filial+'\' or filial = \'\'  ';
		
        tx.executeSql(sql, [], function (tx, results) {
			
            var len = results.rows.length, i;
            var lista = '' ;    
			   
            for (i = 0; i < len; i++){  
			
                flista.append('<li><a  data-pid="'+results.rows.item(i).id+'" href="javascript:financeiro.getItem(\''+results.rows.item(i).id+'\')" class="mpopup">'+results.rows.item(i).nome+'</a></li>');
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
	
		var sql = "SELECT * FROM financeiro  WHERE id = "+id;
	
		// Faz a transacao
		 db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				
				$('#financeiroDetail #titulo').html(results.rows.item(0).nome);
				
				$('#financeiroDetail #descricao').val(decode64(results.rows.item(0).descricao));

					
			});
			
		});
		
		$.mobile.changePage("#financeiroDetail",{ transition: "slide" });
			
	}

	
}