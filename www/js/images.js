//Global instance of DirectoryEntry for our data
var DATADIR;
var knownfiles = [];  
var fi = 0;

var imageLoader;


//Loaded my file system, now let's get a directory entry for where I'll store my crap    
function onFSSuccess(fileSystem) {
	
	$("#pre-loader").show();
	
	window.FS = fileSystem;
	
	var root = window.FS.root;
	
	console.log(root);
    root.getDirectory("zipfiles",{create:true,exclusive:false},gotDir,onError);
}

//The directory entry callback
function gotDir(d){
    console.log("criou o diretorio de imagens");
    DATADIR = d;
	
	console.log(d.fullPath+" e a pasta de destino imagens");
	
	storage.folderZip = d.fullPath+"/";
	
	
    var reader = DATADIR.createReader();
    reader.readEntries(function(d){
        gotFiles(d);
		if ( connectionStatus == "online" ) {
        	appReady();
		}
		
		if (knownfiles.length == 0 && connectionStatus == "offline" ) {
			alert("Voce precisa estar conectado para baixar as imagens");
		}
		
    },onError);
}

//Result of reading my directory
function gotFiles(entries) {
    console.log("A pasta imagens contem "+entries.length+" arquivos.");
	var folder = "";
	for (var i=0; i<entries.length; i++) {
			//console.log(entries[i].name+' dir? '+entries[i].fullPath); 
			knownfiles.push(entries[i].name);
			console.log (entries[i].name);
			//renderPicture(entries[i].fullPath);
	}
	
	if (entries.length > 0)  {
		fpath = entries[0].fullPath
		folder = fpath.replace(entries[0].name,'');
		storage.folderImages = folder;
		console.log(folder);
	}


}


function onError(e){
    console.log("ERROOOOO no na imagem ");
    console.log(JSON.stringify(e));
	$.mobile.loading('hide');
	
	$('.chome .row').fadeIn('400');
}

function onDeviceReady() {
    //what do we have in cache already?
    $("#status").html("Checando arquivos do cache...");    
	console.log("chegando arquivos");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);  
	
	console.log("Voce esta onDeviceReady"+ connectionStatus);  
}



function appReady(){
	
	$.mobile.loading('show',{text: "Carregando imagens aguarde",textVisible:true});
	
  //  $("#status").html("Baixando imagens do servidor...");
	
	//$("#pre-loader").show();
	//var fi = 0;
	
	var statusDom = $("#status");
	
	$('.chome .row').hide();
	
	if (knownfiles.indexOf("produtos_"+storage.filial+".zip") == -1) {
		
		
		
		var ft = new FileTransfer();
	    var uri = encodeURI("http://www.dimebras.com.br/produtos_"+storage.filial+".zip");
	 
		//var downloadPath = fileSystem.root.fullPath + "/download.mp3";
		
		var downloadPath = DATADIR.fullPath + "/produtos_"+storage.filial+".zip"
	 	
		console.log(downloadPath);
		
		ft.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
				statusDom.innerHTML = perc + "% carregando...";
				console.log(perc + "% carregando...");
			} else {
				  console.log("Carregando arquivo no computable =T")
				if(statusDom.innerHTML == "") {
					statusDom.innerHTML = "Carregando";
				} else {
					statusDom.innerHTML += ".";
				}
			}
		};
							
		ft.download(uri, downloadPath, 
		function(entry) {
			statusDom.innerHTML = "";
			//var media = new Media(entry.fullPath, null, function(e) { alert(JSON.stringify(e));});
			//media.play();
			$.mobile.loading('hide');
			$('.chome .row').show();
			console.log("Finalizou download de "+e.fullPath);
			
			imageLoader =  new ZipLoader(storage.folderZip+'produtos_'+storage.filial+'.zip');
			
			extractFile(storage.folderZip+'produtos_'+storage.filial+'.zip');
			
		}, 
		function(error) {
			alert('Ocorreu um erro...');	
		});
		
	} else {
		$.mobile.loading('hide');
		$('.chome .row').show();
		console.log(storage.folderZip+'produtos_'+storage.filial+'.zip arquivo zipado');
	
		imageLoader =  new ZipLoader(storage.folderZip+'produtos_'+storage.filial+'.zip');
		extractFile(storage.folderZip+'produtos_'+storage.filial+'.zip');
		
		
	}
	
	
	
	console.log(imageLoader);

}

/*
function appReady(){
    $("#status").html("Ready to check remote files...");
    $.get("http://www.raymondcamden.com/demos/2012/jan/17/imagelister.cfc?method=listimages", {}, function(res) {
        if (res.length > 0) {
            $("#status").html("Going to sync some images...");
            for (var i = 0; i < res.length; i++) {
                if (knownfiles.indexOf(res[i]) == -1) {
                    console.log("need to download " + res[i]);
                    var ft = new FileTransfer();
                    var dlPath = DATADIR.fullPath + "/" + res[i];
                    console.log("downloading crap to " + dlPath);
					ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(e){
						renderPicture(e.fullPath);
						console.log("Successful download of "+e.fullPath);
					}, onError);
                }
            }
        }
        $("#status").html("Finalizado");
    }, "json");

}
*/

function initMobileProdutos() {
	document.addEventListener("deviceready", onDeviceReady, true);
} 