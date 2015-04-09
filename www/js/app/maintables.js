//Global instance of DirectoryEntry for our data
var DATADIRJS;
var knownfilesjs = [];   
var totalJS = 0;
function getMainTables() {
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
var sleep = function(milliseconds) {
  // noprotect
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};
//Loaded my file system, now let's get a directory entry for where I'll store my crap    
function onFSSuccessJS(fileSystem) {
	
	//$("#pre-loader").show();
	window.FS = fileSystem;
	var root = window.FS.root;
	
	console.log("Verificando as pastas JS");
	
    root.getDirectory("js",{create:true,exclusive:false},gotDir,onError);
	
}
//The directory entry callback
function gotDir(d){

    console.log("criou o diretorio das tabelas JS");
    DATADIRJS = d;
    var reader = DATADIRJS.createReader();
	
	console.log(d.fullPath+" e a pasta de destino");
	
	storage.folderJS = d.fullPath+"/";
	
    reader.readEntries(function(d){
        gotFiles(d);

        console.log("Voce esta "+connectionStatus);
		
		if ( (connectionStatus != "NoConnection") && ( connectionStatus == "Cell4G" || connectionStatus == "WiFi"  || connectionStatus == "Ethernet" ) && knownfilesjs.length == 0  ) {
			
			//knownfilesjs = [];   
        	appReady();
		} 
		
		if ( connectionStatus == "Cell3G" || connectionStatus == "Unknown") {
			 navigator.notification.alert(
				'Conexões 3G são baixas para sincronizar os arquivos.',  // message
				'',         // callback
				'Conexão muito baixa',            // title
				'OK'                  // buttonName
			)
		}
			
		if (knownfilesjs.length == 0 && connectionStatus == "NoConnection" ) {
			//alert("Voce precisa estar conectado para baixar as tabelas");
			 navigator.notification.alert(
				'Para sincronizar os dados você precisa estar com a internet (WiFi, 4G, Ethernet) ligada.',  // message
				'',         // callback
				'Falha na conexão',            // title
				'OK'                  // buttonName
			);
		}


		if (connectionStatus== "WiFi" && knownfilesjs.length > 0) {
			$.mobile.loading('hide');	
			$('.loginform').fadeIn('300');	
			
		}
		
    },onError);
}
//Result of reading my directory
function gotFiles(entries) {
    console.log("O diretorio de JS tem "+entries.length+" arquivos js.");
	
	for (var i=0; i<entries.length; i++) {
		//console.log(entries[i].name+' dir? '+entries[i].isDirectory);
		knownfilesjs.push(entries[i].name);
		renderJavascript(entries[i].fullPath);
		
	}
	
	if (entries.length > 0)  {
		fpath = entries[0].fullPath
		folder = fpath.replace(entries[0].name,'');
		storage.folderJS = folder;
		
		console.log(folder);
	}
}
function renderJavascript(path) {
	
	if ( path.indexOf('item_') == -1) {
		console.log("Inserindo o arquivo "+path);
		head.js(path);
	}
}
function onError(e){
    console.log("ERROR");
    console.log(JSON.stringify(e));
    $.mobile.loading('hide');	
	$('.loginform').fadeIn('300');		
}
function onDeviceReady() {
    //what do we have in cache already?
    $("#status").html("Checando arquivos do js cache...");    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccessJS, null);  
	
	console.log("Voce esta "+ connectionStatus);  
	//$('#loginform').show();		
}
function appReady(){
   // $("#status").html("Pronto para baixar tabelas do servidor...");
	
	//$("#pre-loader").show();
	$.mobile.loading('show',{text: "Carregando tabelas",textVisible:true,theme:"a"});
	//$.mobile.loading('show');
	$('.loginform').hide();
	var fi = 0;
	
	// Verifica as tabelas do mobile
    $.get("http://www.dimebras.com.br/mobile?fn=getTables", {}, function(res) {
        if (res.length > 0) {
        	totalJS = res.length;
			
            $("#status").html("Baixando tabelas de dados...");
            for (var i = 0; i < res.length; i++) {
				
				
				
                if (knownfilesjs.indexOf(res[i]) == -1) {
                    console.log("Fazendo download de " + i);
					
                    var ft = new FileTransfer();
                    var dlPath = DATADIRJS.fullPath + "/" + res[i];
                    //console.log("downloading model js to " + dlPath);
					
					sleep(100);
					
					ft.download("http://www.dimebras.com.br/app_dimebras/model/" + escape(res[i]), dlPath, function(e){
						//renderPicture(e.fullPath);
						
						console.log('Sleep');
						
						renderJavascript(e.fullPath);
						fi++;
						console.log("Baixou o arquivo " +i);
						if ( fi >=  (res.length-1) ) {
							//alert("O valod do i Ã© download"+fi);
							console.log("O Valor do fi em download é "+fi);
							$.mobile.loading('hide');	
							$('.loginform').fadeIn('300');		
							
							sleep(10);
						}
						 
						 sleep(10);
						
						// console.log("Successful download of "+e.fullPath);
					}, onError);
                } else {
                	fi++;
					console.log("Ja tenho o arquivo " +fi);
					if ( fi >= (res.length-1) ) {
						console.log("O Valor do i em arquivo baixado é "+i);
						$.mobile.loading('hide');	
						$('.loginform').fadeIn('300');		
					}
					
				}
				
				
				
				
            }
        }
       
		
    }, "json").done(function(){
		
	});
	
	
    if ( fi >= (totalJS-1) ) {
		console.log("O Valor do i em arquivo baixado é "+i);
		$.mobile.loading('hide');	
		$('.loginform').fadeIn('300');		
	}
	
	 
	 
	 
}
document.addEventListener("deviceready", onDeviceReady, true);
}
