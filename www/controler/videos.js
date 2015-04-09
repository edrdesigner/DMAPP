function Videos() {
	
	this.db = db;
	
	
	// Lista relatorios da base
	this.listVideos = function() {
		
		storage.area = 'videos';
		$.mobile.loading('show',{text: "Carregando lista",textVisible:true,theme:"a"});
		
		var flista        =  $('#videos #lvideos');
		$('#videos #lvideos li').remove();
	
		db.transaction(function (tx) {
		
		var tfilial = 'dimebras';
		if ( storage.filial == 'alfamed' ) {
			tfilial = 'alfamed';		
		}
			
		var sql = 'SELECT * FROM videos  WHERE filial = \''+storage.filial+'\' or filial = \'\' or  filial = \''+tfilial+'\' order by id DESC ';
		
        tx.executeSql(sql, [], function (tx, results) {
			
            var len = results.rows.length, i;
            var lista = '' ;    
			   
            for (i = 0; i < len; i++){  
				var imageml = '';
				
				if (results.rows.item(i).imagemg) {
					imageml = '<img class="videosImagemL"  src="'+results.rows.item(i).imagemg+'" />';
				} else {
					imageml = '<img class="videosImagemL"  src="images/semfoto.jpg" />';
				}
				
                flista.append('<li><a  data-pid="'+results.rows.item(i).id+'" href="javascript:videos.getItem(\''+results.rows.item(i).id+'\')" class="mpopup">'+imageml+'<h2>'+results.rows.item(i).title+'</h2></a></li>');
				
				
				flista.listview('refresh');
            }
            
			}, null);
			
			
		}); 
		
		
		flista.listview('refresh');
		$.mobile.loading('hide');
		
		
	}
	
	
	// Retorna um relatorio da base
	this.getItem = function(id) {
		
		storage.area = 'videoDetail';
	
		var sql = "SELECT * FROM videos  WHERE id = "+id;
	
		// Faz a transacao
		 db.transaction(function (tx) {
			tx.executeSql(sql, [], function (tx, results) {
				var len = results.rows.length, i;	
				
				 storage.iditem =   results.rows.item(0).id; 
				
				$('#videosDetail #titulo').html(results.rows.item(0).title);
				
				/*
				if ( results.rows.item(0).imagemg ) {
					$('#videosDetail #imagem').html('<img class="infobrasImagemD" src="'+results.rows.item(0).imagemg+'" border="0" />');				
				}*/
				
				//$('#infobrasDetail #descricao').html(decode64(results.rows.item(0).introtext));
				
				$('#videoDetail #descricao').html(results.rows.item(0).introtext);
				if ( (connectionStatus != "NoConnection") && ( connectionStatus == "Cell4G" || connectionStatus == "WiFi"  || connectionStatus == "Ethernet" || connectionStatus == "Cell3G" )  )		 {
				
				$('#videoDetail #video').html('<iframe width="100%" height="315" src="https://www.youtube.com/embed/'+results.rows.item(0).alias+'" frameborder="0" allowfullscreen></iframe>');
				
				} else {
					$('#videoDetail #video').html('VOCÊ PRECISA ESTAR CONECTADO A INTERNET PARA ASSITIR ESTE VÍDEO.')
				}

					
			});
			
		});
		
		$.mobile.changePage("#videoDetail",{ transition: "slide" });
			
	}

	
}