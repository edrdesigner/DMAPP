var db;
var carregando = false;

// Instancia as variaveis necessarias
var item  		= new Item();
var catalogo 	= new Catalogo();
var lancamento  = new Lancamento();
var relatorio 	= new Relatorio();
var contato 	= new Contato();
var promocao 	= new Promocao();
var infobras 	= new Infobras();
var videos 		= new Videos();
var config  	= new Configurar();

document.addEventListener("deviceready", setDBBase, false);
function setDBBase() {
	db = window.openDatabase('dimebras', '1.0', 'Jobs', 5 * 1024 * 1024);
	console.log("Banco Setado na navegacao");
}
 
setDBBase();

// Inicia configuracao se zerado
//config.initConfiguracao();
config.iniGA();

storage.per_page = storage.c_iporpagina; //max images per page
storage.page = 0; //initialize page number


// FUNCOES NECESSARIAS
// UTEIS
function checkFileExists(fileName){
    var http = new XMLHttpRequest();
    http.open('HEAD', fileName, false);
    http.send(null);
    return http.status;
}
function checkImage (src, good, bad) {
    var img = new Image(); 
    img.onload = good; 
    img.onerror = bad;
    img. src = src;
}
function ImageExists(selector) {
    var imageFound = $(selector); 
    
    if ( imageFound.height() == 0 ) {
    	console.log('No existe altura');
		imageFound.attr('src','images/semfoto.jpg');
        return false;
    } 
    return true;
}
function checkImages(seletor) {
	$(seletor).each(function(i, e) {
		//ImageExists(e);
		//	console.log($(e).attr('data-src'));
		isImage(e);
		
    });
}
function isImage(e)
{
	var cod = $(e).attr('data-cod');
	var temfoto = $(e).attr('data-temfoto');
	var file = storage.folderImages+'/'+cod+'.jpg';
	
	$(e).attr('src', 'images/ajax-loader.gif');
	
	
	if (cod) {	
		//$(e).hide();
		if (temfoto==1) {
			//$(e).attr('src', storage.folderImages+'/'+cod+'.jpg');	
			checkImage(file,function(){
				
				$(e).attr('src', file);	
				$(e).fadeIn('50');
				
				//$('#btnRecarregaImg').hide();	
				
				 },function(){
					 // Tenta recarregar imagens
					 $(e).attr('src', 'images/semfoto.jpg');
					 $(e).fadeIn('50');					
					recarregaImagem(e);			 
				});
		} else {
			$(e).attr('src', 'images/semfoto.jpg');
			$(e).fadeIn('50');	
		}
	} else {
		$(e).attr('src', 'images/semfoto.jpg');
		$(e).fadeIn('50');		
	}
}
// Funcao para verificar se a imagem do catalogo esta aparecendo ou nao
function validaImagem(e) 
{
	
	/*
	var en  = e;
	
	  sleep(50);
	
	  var cod = $(e).attr('data-cod');
	  var file = storage.folderImages+'/'+cod+'.jpg';
	  var temfoto = $(e).attr('data-temfoto');
	  
	  if (temfoto) {
		  checkImage(file,function(){ 
			$('#btnRecarregaImg').hide();  
		  },function(){ 
				$(e).attr('src', 'images/semfoto.jpg');	
				$('#btnRecarregaImg').show();	
				$('#btnRecarregaImg').click(
					function(){
						recarregaImagem(en);
				 }); 	  
		  });
	  }
	  */
	
}
// FIM UTEIS
// Recarregar Imagem
function recarregaImagem(e)
{	
	var cod = $(e).attr('data-cod');
	var temfoto = $(e).attr('data-temfoto');
	
//	console.log('O Código é '+cod);
	
	if ( connectionStatus == "NoConnection" || connectionStatus == "Unknown" ) {	
		console.log('Você precisa estar conectado para baixar a imagem novamente.');
		$(e).attr('src', 'images/semfoto.jpg');	
		return  false;
	}
	
	
	if (cod) {
		console.log('temfoto = '+temfoto);
		if (temfoto == 1) {
			$.mobile.loading('show',{text: "Carregando imagem. Aguarde",textVisible:true});
			
			var ft = new FileTransfer();
			var uri = encodeURI("http://www.dimebras.com.br/images/produtos/"+cod+".jpg");
			var downloadPath = storage.folderImages + "/"+cod+".jpg";
			
			ft.download(uri, downloadPath, 
			function(entry) {
				$.mobile.loading('hide');
				console.log("Finalizou download de "+entry.fullPath);
				// Altera a imagem 
				$(e).attr('src', storage.folderImages+'/'+cod+'.jpg');
				$(e).fadeIn('50');
				
			}, 
		function(error) {
			$.mobile.loading('hide');
			console.log('Ocorreu um erro... codigo do produto '+cod);	
			
			// Atualiza no banco pra nao dar mais erro
			
		console.log("Atualizou a imagem");	
		db.transaction(function (tx) {
        tx.executeSql("UPDATE item SET temfoto='0' WHERE codBarras ='"+cod+"' and filial ='"+storage.filial+"'", [], function (tx, results) { }, null) } );
			
			$(e).attr('src', 'images/semfoto.jpg');	
			$(e).fadeIn('50');
			
		});
			
			
		} else {
			$(e).attr('src', 'images/semfoto.jpg');	
			$(e).fadeIn('50');
		}
	}
		
}
 function prevItem() {
	console.log("Prev Item");
	item.getPrevNext("<");		
}
 function nextItem() {
 	console.log("NExt Item");
	item.getPrevNext(">");		
} 
// PARA CATALOGO
/**
Faz a busca dos catalogosdsd
*/
function doBuscaCatalogo(form)
{
	 storage.fCategoria = $(form+' #fcategoria').val();
     storage.fLaboratorio = $(form+ ' #flaboratorio').val();
	 storage.fsearch  = $(form + ' #search').val();
	 storage.page = 0; //initialize page number 
	 storage.fordem  = $(form + ' #fordem').val();


	 
	 if ($(form + '#fdestaque').val() != undefined) {
	 	storage.fdestaque  = $(form + '#fdestaque').val();
	 } else {
		 storage.fdestaque = '';
	}
	 
	 if ( $('#ftiporesultado').val() == "catalogoBusca" ) {
	 	 storage.area = "catalogoBusca";
		 $.mobile.changePage("#catalogoBusca", {});
		 
	 } else if ( $('#ftiporesultado').val() == "catalogoGaleria" ) {
		 
		 if ( storage.area != "catalogoGaleria") {
		 	storage.area = "catalogoGaleria";
			 $.mobile.changePage("#catalogoGaleria", {});
		 } else {
			 //$("#pre-loader").fadeIn(60);
			 $("#galeriaC").empty();
			 storage.carregou = 0;
			 console.log("doBuscaCatalogo "+storage.carregou+ " tipo: "+storage.c_tipocatalogo );
			if (storage.c_tipocatalogo== "vertical") {
				console.log("buscar listItems");
			   catalogo.listItems(storage.c_iporpagina, 0); 
			} else {
				console.log("buscar listItemsH");
				console.log("Destruir slick");
				$('.gallery').slick('unslick');
				storage.page  = 0;
				storage.icatalogo = 0;
				catalogo.listItemsH(0); 
			}
			// $("#pre-loader").fadeOut(100);
		 }
	 }
}
function doBuscaDestaque(form)
{
	 storage.fCategoria = $(form+' #fcategoria').val();
     storage.fLaboratorio = $(form+ ' #flaboratorio').val();
	 storage.fsearch  = $(form + ' #search').val();
	 storage.per_page =  storage.c_iporpagina;; //max images per page
	 storage.page = 0; //initialize page number
	 storage.fordem  = $(form + ' #fordem').val();
	 $("#galeriaL div").remove();
	 
	 lancamento.listLancamento(30, 0);	 
}
// ======================================================================================================
// FIM PARA CATALOGO
// FUNCOES NECESSARIAS
// PAGE SHOWS
// ======================================================================================================
$('#catalogo').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
	  storage.area = "catalogo" 
    //  carrega_pagina('_panel.html', '#mypanelC');
      config.sendGAPV(storage.area);
 });
$('#catalogoBusca').on('pageshow', function(event, ui) {
      //deletar essa linha pois vem do login depois
      // para o continue
	  storage.area = "catalogoBusca" 
      storage.continue_tela = urlSite();
      //carrega_pagina('_panel.html', '#mypanelCB');
      config.sendGAPV(storage.area);
	
 });
 
 
$('#catalogoItem').on('pageshow', function(event, ui) {
      //deletar essa linha pois vem do login depois
      // para o continue
	  
	  storage.area = "catalogoItem" 
      storage.continue_tela = urlSite();
     // carrega_pagina('_panel.html', '#mypanelCI');
	   
	 // Valida a imagem e mostra/esconde botao de recarregar imagems
	//validaImagem('#imgitemd'+storage.iditem);


	  config.sendGAPV(storage.area);

 });
 
 
 /*
$('#catalogoGaleria').on( "pagecontainershow", function( event, ui ) {
  console.log( "This page was just hidden: " + ui.prevPage );

    storage.area = "catalogoGaleria" 
	  storage.page = 0;
      storage.continue_tela = urlSite();

});*/

 
$('#catalogoGaleria').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
	  storage.area = "catalogoGaleria" 
	  //storage.page = 0;
      storage.continue_tela = urlSite();

      console.log("pageshow "+storage.area+" "+ storage.c_tipocatalogo+" ctd "+ storage.carregou);


    
	  config.sendGAPV(storage.area);


      if ( storage.c_tipocatalogo == "horizontal") {
      		console.log(" listItemsH voltando/indo para listagem");
      		 console.log('Pagina '+ storage.page);
      		if ( storage.page == 0 && (storage.icatalogo == 0 || storage.icatalogo == undefined)   ) {
      			console.log("Iniciando listagem");
				catalogo.listItemsH(storage.page);
			}
		}

      //carrega_pagina('_panel.html', '#mypanelCG');
});
$('#promocoes').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
	  
	   storage.area = "promocoes" 
		
	//  carrega_pagina('_panel.html', '#mypanelPromo');
	  console.log(storage.area);
	  promocao.listPromocao();	

	  storage.area = "configuracoes";
	  config.sendGAPV(storage.area);
	  
	 
  });
  
  


  
$('#promocaoDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
	  
	   storage.area = "promocaoDetail" 
	   config.sendGAPV(storage.area );
     // carrega_pagina('_panel.html', '#mypanelPromoD');
  });
$('#contatos').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
     // carrega_pagina('_panel.html', '#mypanelCo');
	  storage.area = "contatos";
	  config.sendGAPV(storage.area);
	  contato.listContatos();
	  
});
$('#contatoDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
       storage.area = "contatoDetail";
	   config.sendGAPV(storage.area);
     // carrega_pagina('_panel.html', '#mypanelCoD');
});
$('#cadastro').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();

       storage.area = "cadastro";
	   config.sendGAPV(storage.area);
      //carrega_pagina('_panel.html', '#mypanelCa');
});
$('#relatorios').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
     // carrega_pagina('_panel.html', '#mypanelRe');
	  relatorio.listRelatorio();

	   storage.area = "relatorios";
	   config.sendGAPV(storage.area);

	  console.log('voce esta aqui'+storage.area);
	 	
});
$('#relatorioDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();

       storage.area = "relatorioDetail";
	   config.sendGAPV(storage.area);
      //carrega_pagina('_panel.html', '#mypanelReD');
});
$('#videos').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
	  
	  videos.listVideos();

	   storage.area = "videos";
	   config.sendGAPV(storage.area);
     // carrega_pagina('_panel.html', '#mypanelVi');
});
$('#videoDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();

      storage.area = "videoDetail";
	  config.sendGAPV(storage.area);
     // carrega_pagina('_panel.html', '#mypanelViD');
});
$('#lancamentos').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
	  storage.page = 0;
	  carregando = false;
	  
    //  carrega_pagina('_panel.html', '#mypanelLa');
	  

      storage.area = "lancamentos";
	  config.sendGAPV(storage.area);

	  lancamento.carregaCombos('#formCatalogoLancamento');
	  
	  // Ja inicia o listLancamento
	    
	  lancamento.listLancamento(storage.per_page, storage.page);
});
$('#recados').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
     // carrega_pagina('_panel.html', '#mypanelRec');

      storage.area = "recados";
	  config.sendGAPV(storage.area);

});
$('#recadoDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
     // carrega_pagina('_panel.html', '#mypanelRecD');

      storage.area = "recadoDetail";
	  config.sendGAPV(storage.area);

});
$('#financeiro').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
   //   carrega_pagina('_panel.html', '#mypanelFi');
      storage.area = "financeiro";
	  config.sendGAPV(storage.area);

});
$('#financeiroDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
    //  carrega_pagina('_panel.html', '#mypanelFiD');

      storage.area = "financeiroDetail";
	  config.sendGAPV(storage.area);

});
$('#infobras').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();
    //  carrega_pagina('_panel.html', '#mypanelIn');
      storage.area = "infobras";
      infobras.listInfobras();	
	  config.sendGAPV(storage.area);

});
$('#infobrasDetail').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();

      storage.area = "infobrasDetail";
	  config.sendGAPV(storage.area);
	
    //  carrega_pagina('_panel.html', '#mypanelInD');
});

$('#configuracoes').on('pageshow', function(event, ui) {
        //deletar essa linha pois vem do login depois
      // para o continue
      storage.continue_tela = urlSite();

      storage.area = "configuracoes";
	  config.sendGAPV(storage.area);
    //  carrega_pagina('_panel.html', '#mypanelConfig');
	
});


// The 'pagechange' event is triggered after the changePage() request has finished loading the page into the DOM 
// and all page transition animations have completed.
// See: https://gist.github.com/1336327 for some other page events
$(document).bind('pagechange', function(event){
    // grab a list of all the divs's found in the page that have the attribute "role" with a value of "page"
    var pages = $('div[data-role="page"]'),
        // the current page is always the last div in the Array, so we store it in a variable
        currentPage = pages[pages.length-1],
        // grab the url of the page the  was loaded from (e.g. what page have we just ajax'ed into view)
        attr = $.mobile.activePage.attr('id')
		//alert($.mobile.activePage.attr('id'));
    // basic conditional checks for the url we're expecting
    if (attr == "catalogo") {
        // now we know what page we're on we can insert the required scripts.
        // In this case i'm inserting a 'script.js' file.
        // I do this by passing through the name of the file and the 'currentPage' variable
        catalogo.carregaCombos('#formCatalogo');
		
		storage.fCategoria   = '';
		storage.fLaboratorio = '';
		
       // insertScript('model/app_item', currentPage);
	
    }
	
	
	if (attr=='catalogoItem') {
		// checkImages('.imgitemd');
	}

	if (attr=='configuracoes') {
		config.getConfiguracao();
	}
	
	
	
	// Verifica se e pagina de lancamento
	if (attr == "lancamentos") {
	
		
		storage.area = "catalogoLancamento";
		
		if ( storage.area == "catalogoLancamento") {
			//$("#galeriaC div").remove();
			console.log(storage.page);
			if (storage.page == 0){
        		lancamento.listLancamento(storage.per_page, storage.page);
			}
			//Handler for scrolling toward end of document
			$(window).scroll(function () {
				if ($(window).scrollTop() >= $(document).height() - $(window).height() - 500) {
					//End of page, load next content here
					if (!carregando) loadNextPageL();
				}
			});
			
			//Load content for next page
			function loadNextPageL() {
				storage.page = ++storage.page;
				lancamento.listLancamento(storage.per_page, storage.page);
			}
			
				
		}
		
	}
	
	
	
	
   if (attr == "catalogoGaleria" ) {
	   // Carrega os combos
	   catalogo.carregaCombos('#formCatalogoGaleria');
	   
	    storage.area = "catalogoGaleria";
		if ( storage.area == "catalogoGaleria") {
			

			console.log("1 carregou td"+ storage.carregou);
			
			//$("#galeriaC div").remove();
			console.log("Pag"+storage.page);
			console.log("PorPag"+storage.per_page);

			console.log(storage.c_tipocatalogo);


			if (storage.c_tipocatalogo== "vertical") {

				if (storage.page == 0){
					
					
					catalogo.listItems(storage.per_page, storage.page);
				}
	/*	
				 $(document).on("scrollstart",function(){
				 	console.log("scrollStart");
	    			if (!carregando)  {
	    				loadNextPage();
	    				console.log("loadNextPage");
	    			}
				  });   */
				

				console.log("listItems");
				//Handler for scrolling toward end of document
				$(window).scroll(function () {
					if ($(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
						//End of page, load next content here
						if (!carregando) {
							console.log("loadNextPage");
							loadNextPage();
						}
					}
				});
				
				//Load content for next page
				function loadNextPage() {
					storage.page = ++storage.page;
					if (storage.c_tipocatalogo== "vertical") {
						catalogo.listItems(storage.per_page, storage.page);
					}
				}
			} else {
			
				
				
			}
				
		} // fim storage galeria
	}
	
   if (attr == "catalogoBusca" ) {
        // now we know what page we're on we can insert the required scripts.
        // In this case i'm inserting a 'script.js' file.
        // I do this by passing through the name of the file and the 'currentPage' variable
		//storage.area = "catalogoBusca"
		if (storage.area == "catalogoBusca") {
			
			
			
		}
    
    }
	
	
    if (attr.indexOf('home') !== -1) {
        verifica_login();
    }
	
	if ( attr == "contatos") {
		// Lista os contatos			
	}
	
	if (attr =='promocoes') {
		
	}
	
	if (attr == 'login') {
		
		document.addEventListener("backbutton", function () { 
            
                setTimeout( function() { navigator.app.exitApp(); });
          
          
        }, true);  
		
	}
});
// FIM PAGESHOWS
