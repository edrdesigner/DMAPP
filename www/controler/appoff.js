(function(){
    var webappCache = window.applicationCache,
    simulateDownload,
    pollingCacheStatus,
    contador_load = 0,				
    connectionStatus = ((navigator.onLine) ? 'online' : 'offline');						
    //$("h2").html(" - você está: " + connectionStatus);
				
    document.title = document.title.replace(" | "," - você está: " + connectionStatus + " | ");
	
	
	
	window.webkitStorageInfo.requestQuota( 
		window.PERSISTENT,
		7000000,
		function( bytes ) {
			alert( "Quota is available: " + bytes );
		},
		function( e ) {
			alert( "Error allocating quota: " + e );
	});
	
	
						
    //alert(webappCache.status);
			
    switch (webappCache.status) {
        case 0:
            console.log("Cache status: deu pau");
            break;
        case 1:
            console.log("Cache status: Idle");
            break;
        case 2:
            console.log("Cache status: Checking");
            break;
        case 3:
            console.log("Cache status: Downloading");
            break;
        case 4:
            console.log("Cache status: Updateready");
            break;
        case 5:
            console.log("Cache status: Obsolete");
            break;
        default:
            console.log("Cache status: unknown");
    }
			
    // INICO DE IMAGEM Q FICA GIRANDO ATE CARREGAR O CONTEUDO
    function noupdateCache() {				
        $("#loader").hide(120);
        console.log("Nenhuma atualização de cache encontrada");
    }
			
    function doneCache() {
        $("#loader").hide(120);
        console.log("Cache terminar o download");
    }
			
    function progressCache() {
        
        $("#pre-loader").show(120);
                var totalarq = 600;
		var cont = contador_load++ ; 
                
		var status = "Baixando arquivos... ";		
		if(cont<150) {
		 status = "Baixando arquivos... ";
		}else if(cont<200 || cont>150 ) {
		 status = "Baixando produtos... ";	
		}  		
		if(cont>300) {
		 status = "Criando base de dados... ";	
		}  		
                var perct = (cont * 100)/totalarq;
		msg = status + Math.round(perct,2)+" % - Baixando agora... "+cont+" / "+totalarq ;
        $("#contador_load").text(msg);
        console.log("Downloading cache...");
    }
    // FIM DA MAGEM Q FICA GIRANDO ATE CARREGAR O CONTEUDO
			
    // INICIO DO VERIFICADOR SE MUDORU ALGO NO CACHE
    function updateCache() {
        webappCache.swapCache();
        console.log("Cache foi actualizado devido a uma mudança encontrada na manifest");
       $("#pre-loader").fadeOut(400);	
    }
    function errorCache() {
        console.log("Você está offline ou algo deu terrivelmente errado.");
        $("#pre-loader").fadeOut(400);	
    }
			
    // IMAGEM Q FICA GIRANDO ATE CARREGAR O CONTEUDO
    webappCache.addEventListener("progress", progressCache, false);
    webappCache.addEventListener("cached", doneCache, false);
    webappCache.addEventListener("noupdate", noupdateCache, false);
			
    // apara atulizar cache
    webappCache.addEventListener("updateready", updateCache, false);
    webappCache.addEventListener("error", errorCache, false);
			
})();