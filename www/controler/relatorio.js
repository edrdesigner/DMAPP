function Relatorio() {
	
	this.db = db;
	
	
	// Lista relatorios da base
	this.listRelatorio = function() {
		console.log("listRelatorio");
		storage.area = 'relatorio';
		var flista        =  $('#relatorios #lrelatorios');
		$('#relatorios #lrelatorios li').remove();
		$.mobile.loading('show',{text: "Carregando lista",textVisible:true,theme:"a"});
		db.transaction(function (tx) {			
		var sql = 'SELECT * FROM relatorio  WHERE (filial = \''+storage.filial+'\' or filial = \'\') and (usuario = \''+storage.ref+'\' or usuario = \'\')  ';

        tx.executeSql(sql, [], function (tx, results) {
			
            var len = results.rows.length, i;
            var lista = '' ;    
			   
            for (i = 0; i < len; i++){  
			
                flista.append('<li><a data-pid="'+results.rows.item(i).id+'" href="javascript:relatorio.getRelatorio(\''+results.rows.item(i).id+'\')" class="mpopup">'+decode64(results.rows.item(i).nome)+'<p>'+decode64(results.rows.item(i).descricao)+' </p></a></li>');
				flista.listview('refresh');
            }
            
			}, null);
			
			
		}); 
		
		
		flista.listview('refresh');
		$.mobile.loading('hide');
		
		
	}
	
	
	// Retorna um relatorio da base
	this.getRelatorio = function(id) {
		
		console.log("getRelatorio");
		storage.area = 'relatorioDetail';
	
		var sql = "SELECT * FROM relatorio  WHERE id = "+id;
		
		//var site = "http://dimebras.com.br/consultar-relatorio.html?id=";
		// Faz a transacao
		 db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				
				$('#relatorioDetail #nome').html(decode64(results.rows.item(0).nome));
				
				//$('#relatorioDetail #linkExcel').attr('href',site+results.rows.item(0).id+"&format=xls");
				//$('#relatorioDetail #linkPDF').attr('href',site+results.rows.item(0).id+"&format=pdf");

				$('#relatorioDetail #descricao').html(decode64(results.rows.item(0).descricao));

				$('#relatorioDetail #tabela').html(results.rows.item(0).tabela);

					
			});
			
		});
		
		
		
		$.mobile.changePage("#relatorioDetail",{ transition: "slide" });
			
	}
	
	
	
	this.ativaPop = function() {
	
		 var id = 0;
		 
		 $('.mpopupr').magnificPopup({
          
		 
		  type: 'inline',

          fixedContentPos: false,
          fixedBgPos: true,

          overflowY: 'auto',

          closeBtnInside: true,
          preloader: true,
          
          midClick: true,
          
          mainClass: 'my-mfp-slide-bottom',
		  callbacks: {
			elementParse: function(item) {
			  // Function will fire for each target element
			  // "item.el" is a target DOM element (if present)
			  // "item.src" is a source that you may modify
			 id = item.el.attr('data-pid');
			},
			
			open: function() {
			  // Will fire when this exact popup is opened
			  // this - is Magnific Popup object
			  console.log(id);
			  
			  relatorio.getRelatorio(id);
			},
			close: function() {
			  // Will fire when popup is closed
			   console.log("fechou")
			}
			
		  }
		  
        });
		
		
	}
	
	
		
	
}