/*INCIO DO CARRINHO*/
var itens;
var pares;
var storage = window.localStorage;
function datapTous(data_ped){
    var dataArray = data_ped.split("/");				
    data_ped = dataArray[2]+'-'+dataArray[1]+'-'+dataArray[0];
    return data_ped;
}
// da reload
function reload() {
   location.reload();    
   /* $.mobile.changePage( "recarregar.html", {
        transition: "fade"
    } );
*/
}
// da reload
function reload_com_efeito(efeito) {
    
    $.mobile.changePage( "#novo_pedido", {
        transition: efeito
    } );
    
    /* Efeitos que podem ser usados
    
        fade
        pop
        flip
        turn
        flow
        slidefade
        slide
        slideup
        slidedown
        none
     */
}
function goBack(){
    var previousPage =$.mobile.activePage.data('ui.prevPage');	
    $.mobile.changePage(previousPage, 'slide', true, true);
}
// cria função
// url inteira
function urlSite(){
    // pega a url e coloca na variavel url
    var url = window.location;
    // converte em String
    url = url.toString(); 
    return url;
    
    	
}
function urlpart(){
    // pega a url e coloca na variavel url 
    
    var pathname = window.location.pathname;	
    return pathname;	
}
function doLogoOFF(button){
	if ( button == 1 ) {
		storage.clogin = 0;	
		storage.clear() ;
		$.mobile.changePage("index.html", {});
		// Sai do aplicativo
		navigator.app.exitApp();
	}	
}
function showConfirm(message, callback, buttonLabels, title){
    //Set default values if not specified by the user.
    buttonLabels = buttonLabels || 'OK,Cancel';
    title = title || "default title";
    //Use Cordova version of the confirm box if possible.
    if(navigator.notification && navigator.notification.confirm){
            var _callback = function(index){
                if(callback){
                    callback(index == 1);
                }
            };
            navigator.notification.confirm(
                message,      // message
                _callback,    // callback
                title,        // title
                buttonLabels  // buttonName
            );
    //Default to the usual JS confirm method.
    }else{
        invoke(callback, confirm(message));
    }
}
// sai do sistema
function logoff() {    
    
    /*
    // LIMPAR todo storage
    if(typeof(window.localStorage) != 'undefined'){ 
        
		navigator.notification.alert(
			"Você deseja sair do aplicativo?",  // message
			doLogoOFF,              // callback to invoke with index of button pressed
			'Sair',            // title
			'Sim, Não'          // buttonLabels
		 );
					
    } 
    else{ 
        throw "window.localStorage, not defined"; 
    }
    */
    var message = "Você deseja sair do aplicativo?";
    var title = "Sair";
    //The first element of this list is the label for positive 
    //confirmation i.e. Yes, OK, Proceed.
    var buttonLabels = "Sim,Não";
    var callback = function(buttonIndex){
        if(buttonIndex == 1){
            doLogoOFF('1');
        }else{
           
        }
    };
    showConfirm(message, callback, buttonLabels, title);
}
function doRecarregaDados(button)
{
	console.log('Recarregando Tabelas 	1');
	$('#menu').trigger("close");
	button = 1;
	console.log('O botao foi '+button);
	
	
	if ( button == 1 ) {
		
		
		
		console.log('Recarregando Tabelas');
		//getMainTables();
		
		
		if ( (connectionStatus != "NoConnection") && ( connectionStatus == "Cell4G" || connectionStatus == "WiFi"  || connectionStatus == "Ethernet" )  ) {
		
			$.get("http://www.dimebras.com.br/mobile?fn=getTables", {}, function(res) {
			if (res.length > 0) {
				totalJS = res.length;
				
				$.mobile.loading('show',{text: "Carregando tabelas",textVisible:true,theme:"a"});
				
				$("#status").html("Baixando tabelas de dados...");
				for (var i = 0; i < res.length; i++) {
					
						console.log("Fazendo download de " + i);
						
						var ft = new FileTransfer();
						var dlPath = DATADIRJS.fullPath + "/" + res[i];
						//console.log("downloading model js to " + dlPath);
						
						sleep(100);
						
						ft.download("http://www.dimebras.com.br/app_dimebras/model/" + escape(res[i]), dlPath, function(e){
							//renderPicture(e.fullPath);
							
							console.log('Sleep');
							
							
							if ( e.fullPath.indexOf('item_') == -1) {
								console.log("Inserindo o arquivo "+e.fullPath);
								head.js(e.fullPath);
							} else {
								if (e.fullPath.indexOf('item_'+storage.filial) != -1) {
									console.log("Inserindo o arquivo "+e.fullPath);
									head.js(e.fullPath);
								}
							}
							
							fi++;
							console.log("Baixou o arquivo " +i);
							if ( i >=  (res.length-1) ) {
								//alert("O valod do i Ã© download"+fi);
								console.log("O Valor do fi em download é "+fi);
								$.mobile.loading('hide');	
								
								sleep(10);
							}
							
							 sleep(10);
							
							// console.log("Successful download of "+e.fullPath);
						}, onError);
				   
					
					 
					
					 
				}
			}
		   
			
		}, "json").done(function(){
            console.log("Tenta fazer de novo infobras");
            geraTableInfobras();
			
		});
	
		}
		
	}
}
function recarregaDados()
{
	navigator.notification.alert(
			"Recarregando dados",  // message
			doRecarregaDados(),              // callback to invoke with index of button pressed
			'Recarregar dados',            // title
			'OK'          // buttonLabels
	);
}
// se o cara nao ta logado volta pra index
function verifica_login() {
    if (!storage.clogin) { 
        // usuario não esta logado
        storage.clogin = 0;			
        //colocar apenas nas internas
        $.mobile.changePage("index.html", {
            transition: "slide"
        });	    
    }
    
    if (storage.clogin==0) { 
        //colocar apenas nas internas
        $.mobile.changePage("index.html", {
            transition: "slide"
        });	
    } else {
         //$('#dadosUsuario').html(storage.login_name+' <button id="logout"  onclick="logoff()" class="btn btn-info"><i class="icon-remove"></i></button>
		 $('#dadosUsuario').html(storage.login_name);
    }
}
function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 1); 
}
// sem uso se nao funcionar deleta	
function carrega_pagina(arquivo, div) {	
  //  alert('carrega_pagina');
    $.ajax({
        url: arquivo,
        dataType: "html",
        timeout: 5000,
        beforeSend: function() {
         loading('show');
        },
        complete: function() {
          loading('hide');
        },
        success: function(data){
            $(div).html(data);
            $(div).trigger("create") ;           
        },
        error: function(xhr, err) {
          //  $.mobile.hidePageLoadingMsg();
            $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>-</h1></div>")
            .css({
                "display": "block", 
                "opacity": 0.96
            })
            .appendTo(div)
            .delay(800)
            .fadeOut(400, function() {
                $(this).remove();
            });
        }
    });				
}
/*FUNCAO PARA PEGAR VARIAVEIS DO GET
EXMPLO DE COMO USAR
		alert(getUrlVars()); // mostra todas as variaveis
		var mostarvalue = getUrlVars()["nomevar"];
		alert(mostarvalue);
*/
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function lpad(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = strToPad + originalstr;
    return originalstr;
}
 
function rpad(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = originalstr + strToPad;
    return originalstr;
}
/*		
$(document).bind("mobileinit", function() {
	$.mobile.loadingMessage = "carregando...";
	$.mobile.pageLoadErrorMessage = "erro ao carregar a página";
	$.mobile.listview.prototype.options.filterPlaceholder = "Filtrar itens...";		
});*/
function data_hoje () {
    mydate = new Date();
    myday = mydate.getDay();
    mymonth = mydate.getMonth();
    myweekday= mydate.getDate();
    myano= mydate.getFullYear();
    weekday= myweekday; 
	
    if(myday == 0)
        day = " Domingo, " 
	
    else if(myday == 1)
        day = " Segunda-Feira, " 
	
    else if(myday == 2)
        day = " Terça-Feira, " 
	
    else if(myday == 3)
        day = " Quarta-Feira, " 
	
    else if(myday == 4)
        day = " Quinta-Feira, " 
	
    else if(myday == 5)
        day = " Sexta-Feira, " 
	
    else if(myday == 6)
        day = " Sábado, " 
	
    if(mymonth == 0)
        month = "Janeiro " 
	
    else if(mymonth ==1)
        month = "Fevereiro " 
	
    else if(mymonth ==2)
        month = "Março " 
	
    else if(mymonth ==3)
        month = "Abril " 
	
    else if(mymonth ==4)
        month = "Maio " 
	
    else if(mymonth ==5)
        month = "Junho " 
	
    else if(mymonth ==6)
        month = "Julho " 
	
    else if(mymonth ==7)
        month = "Agosto " 
	
    else if(mymonth ==8)
        month = "Setembro " 
	
    else if(mymonth ==9)
        month = "Outubro " 
	
    else if(mymonth ==10)
        month = "Novembro " 
	
    else if(mymonth ==11)
        month = "Dezembro " 
    //TERÇA-FEIRA, 13 DE MARÇO DE 2012 
	
    $(".data_hora").html(day +" "+myweekday+" de "+ month +" de "+ myano);
}
//Formatação para tinheiro
function roundNumber (rnum) {
    return Math.round(rnum*Math.pow(10,2))/Math.pow(10,2);
}
//A partir de um valor float ela retorna o valor formatado com separador de milhar e vírgula nos centavos.
function float2moeda(num) {
    num  = num.toFixed(2);
   
    x = 0;
    if(num<0) {
        num = Math.abs(num);
        x = 1;
    }
    if(isNaN(num)) num = "0";
    cents = Math.floor((num*100+0.5)%100);
    num = Math.floor((num*100+0.5)/100).toString();
    if(cents < 10) cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+'.'
        +num.substring(num.length-(4*i+3));
    ret = num + ',' + cents;
    if (x == 1) ret = ' - ' + ret;
    return ret;
}
//Pega um valor formatado com virgula e separador de milha e o transforma em float
function moeda2float(moeda){
    moeda = moeda.replace(".","");
    moeda = moeda.replace(",",".");
    return parseFloat(moeda);
}
 

 function checkIfFileExists(path){
    console.log(path);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem
}

function fileExists(fileEntry){
    console.log("File " + fileEntry.fullPath + " exists!");
}
function fileDoesNotExist(){
    console.log("file does not exist");
    return false;
}
function getFSFail(evt) {
    console.log(evt.target.error.code);
    return false;
}