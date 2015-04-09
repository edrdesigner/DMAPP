//Global instance of DirectoryEntry for our data
var DATADIR;
var knownfiles = [];  
var errorimg = [];
var imagemBaixando = []

var totalItens = 0;
var sleep = function(milliseconds) {
  // noprotect
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};
function onConfirm(button) {
    alert('You selected button ' + button);
}
var showConfirm = function(message) {
    navigator.notification.confirm(
        message,  // message
        onConfirm,              // callback to invoke with index of button pressed
        'Carregando imagens',            // title
        'Cancelar,Continuar'          // buttonLabels
    );
}
//Loaded my file system, now let's get a directory entry for where I'll store my crap    
function onFSSuccess(fileSystem) {
	
	//$("#pre-loader").show();
	
	window.FS = fileSystem;
	
	var root = window.FS.root;
	
	
  //  root.getDirectory("imagens",{create:true,exclusive:false},gotDir,onFileSystemError);
  root.getDirectory("imagens",{create:true},gotDir,onFileSystemError);
}
//The directory entry callback
function gotDir(d){
    console.log("criou o diretorio de imagens");
    DATADIR = d;
	
	console.log(d.fullPath+" e a pasta de destino imagens");
	
	storage.folderImages = d.fullPath+"/";
	
	console.log('Voce esta '+connectionStatus);
	
    var reader = DATADIR.createReader();
    reader.readEntries(function(d){
        gotFiles(d);
		//alert(connectionStatus);
		if ( connectionStatus == "Ethernet"  || connectionStatus == "WiFi"  || connectionStatus == "Cell4G" ) {
        	appReady();
		}
		
		if ( connectionStatus == "Cell3G" || connectionStatus == "Unknown") {
			 navigator.notification.alert(
				'Conexões 3G são baixas para sincronizar as imagens',  // message
				'',         // callback
				'Falha na conexão',            // title
				'OK'                  // buttonName
			);
		}
		
		if (knownfiles.length == 0 && connectionStatus == "NoConnection" ) {
			//alert("Voce precisa estar conectado para baixar as imagens");
			 navigator.notification.alert(
				'Para sincronizar os dados você precisa estar com a internet (WiFi, 4G, Ethernet) ligada.',  // message
				'',         // callback
				'Falha na conexão',            // title
				'OK'                  // buttonName
			);
		}
		
    },onError);
}
//Result of reading my directory
function gotFiles(entries) {
    console.log("A pasta imagens contem "+entries.length+" arquivos.");
	var folder = "";
	for (var i=0; i<entries.length; i++) {
		//	console.log(entries[i].name+' dir? '+entries[i].fullPath); 
			knownfiles.push(entries[i].name);
			
			
	}
	
	if (entries.length > 0)  {
		fpath = entries[0].fullPath
		folder = fpath.replace(entries[0].name,'');
		storage.folderImages = folder;
		console.log(folder);
	}
}
function renderPicture(path){
    $("#photos").append("<img src='file://"+path+"'>");
	
	//console.log(path);  
}
function onError(e){
	//console.log("Imagem "+storage.cod+" nao encontrada na amazonaws. Baixando do site.");
	 var ft2 = new FileTransfer();
     

    $.mobile.loading('hide');	
	$("#mstatus").html('');
	$('#home .container').show();
   
    //console.log(downloadPath);
    //var code  = JSON.stringify(e);
	
	var imagemResgatar = e.source;   
	if ( imagemResgatar.length ) {
		imagemResgatar = imagemResgatar.replace("https://s3-sa-east-1.amazonaws.com/s3dimebras/images/",""); 
	    console.log('Erro na imagem ::: '+imagemResgatar);
  
	   // console.log('Imagem'+imagemResgatar.replace("https://s3-sa-east-1.amazonaws.com/s3dimebras/images/",""));
	    var uri = encodeURI("http://dimebras.com.br/images/produtos/"+imagemResgatar);
	    var downloadPath = storage.folderPath + "/"+imagemResgatar; 
	                        
		ft2.download(uri, downloadPath, 
	        function(entry) {
	            console.log("Finalizou download pelo site de  "+entry.fullPath);
	        },  
	   		 function(error) {
	           console.log("Imagem nao existe mesmo atualizar BD");  
	        	db.transaction(function (tx) {
	       	  	 tx.executeSql("UPDATE item SET temfoto='0' WHERE codBarras ='"+storage.cod+"' and filial ='"+storage.filial+"'", [], function (tx, results) { }, null) 
	       	  	});
	        
	    });
	    
    }	 
//	console.log(imagemBaixando);
//	$('.chome .row').fadeIn('400');
}
function onDeviceReady() {
    //what do we have in cache already?
	console.log("chegando arquivos");
   // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);  	
   window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
         	onFSSuccess, 
            null);
	console.log("Voce esta onDeviceReady"+ connectionStatus);  
}
// file system error handler
function onFileSystemError(error) {
    var msg = 'file system error: ' + error.code;
    navigator.notification.alert(msg, null, 'File System Error');
}
// logs file events
function onFileEvent(event) {
    console.log('file event: ' + event.target.fileName + ' ' + event.type);
}
// called when error reading file
function onFileError(event) {
    console.log('file error: ' + event.target.error.code);
}
function appReady(){
	
	$.mobile.loading('show',{text: "Carregando imagens aguarde",textVisible:true,theme:"a"});
  //  $("#status").html("Baixando imagens do servidor...");
	
	//$("#pre-loader").show();
	//var fi = 0;

	$('#home .container').hide();
	var fi = 0;
	// Verifica filial pois alfamed esta em outra
	var folderImg = "images"
	
	if ( storage.filial == "ALFAMED" ) {
		folderImg = "alfamed";
	}
	
	
	
	//$('.chome .row').hide();
	var i2 =0;
	
	console.log(storage.filial);
	
    $.get("http://www.dimebras.com.br/mobile?fn=getImagesProdutos&filial="+ storage.filial, {}, function(res) {
        if (res.length > 0) {
			totalItens = res.length;
			
			$.mobile.loading('show',{text: "Carregando imagens aguarde",textVisible:true});
			
            console.log("Sincronizando imagens");
			console.log("Temos "+res.length+" para sincronizar")
            for (var h = 0; h < res.length; h++) {
				
				 	
				// $('.ui-loader H1').html('Verificando imagem n'+h);	
				
                if (knownfiles.indexOf(res[h]) == -1) {
                   // console.log("Fazendo download de " + h);
					
					//$("#mstatus").html("Carregando Imagem "+h+" de "+totalItens);

					 console.log("Carregando Imagem " + h+ " de "+totalItens);
					
					i2++;
					sleep(20);		
					if ( i2 > 450) {
						
						
						console.log('Sleep');
						sleep(100);				
						i2 = 0;	
						
						navigator.notification.beep(1);	
						if(confirm(h +" Imagens carregadas de "+totalItens+". Deseja Carregar mais?")) {
							console.log('Sleep 2');
							sleep(500);	
						} else {
							console.log("hide")
							$.mobile.loading('hide');
							$('#home .container').fadeIn('400');	
							sleep(10);	
							//	$('.chome .row').fadeIn('400');	
						}
					}
					
					
					//console.log("Baixou a imagem " +h);
                   
                   
                    sleep(50);
					var ft = new FileTransfer();
                    var dlPath = DATADIR.fullPath + "/" + res[h];
                    storage.folderPath = DATADIR.fullPath;
					
				
					
						
					ft.download("https://s3-sa-east-1.amazonaws.com/s3dimebras/images/" + escape(res[h]), dlPath, function(e){
		
						console.log("Carregou a imagem "+fi);	
						fi++;	
						if ( fi >= (totalItens)) {
							
							console.log("hide")
							$.mobile.loading('hide');
							$('#home .container').fadeIn('400');
							$("#mstatus").html('');
							sleep(10);
						}
					}, onError);
					sleep(50);
					
					 
                } else {
                	// Incrementa o fi
                	fi++;
                	
					//console.log("Ja tenho a imagem " +fi);
					 // $('.ui-loader H1').html('Verificando imagem n'+h);	
					if ( fi >= (totalItens-1)) {
						console.log("totalItens "+ totalItens);
						console.log("O Valor do fi em imagem baixado é "+fi);
						$.mobile.loading('hide');	
						$("#mstatus").html('');
						$('#home .container').fadeIn('400');
						//$('.chome .row').fadeIn('400');
					}
				}
				
				
            }
        }
       
		
    }, "json").done(function() {
	
	    if ( fi >= (totalItens-10)) {
	    	console.log("totalItens "+ totalItens);
			console.log("O valor de fi no "+fi);
			$.mobile.loading('hide');
			$('#home .container').fadeIn('400');
		}	
		
	});

	 /*
    // Verifico novamente 
    if ( fi >= (totalItens-1)) {
    	console.log("totalItens "+ totalItens);
		console.log("O valor de fi no "+fi);
		$.mobile.loading('hide');
		$('#home .container').fadeIn('400');
	}*/

	
}
function initMobileProdutos() {
	document.addEventListener("deviceready", onDeviceReady, true);
} 