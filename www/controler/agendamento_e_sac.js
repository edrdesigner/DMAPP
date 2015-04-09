
function gravar_agendamento(){	
	 
	if($("#textarea-desc_agen").val()!=""){		  
		  
		var descricao = $("#textarea-desc_agen").val();
		var datetime = $("#datetime").val();
		var repetir = $("#repetir").val();
	  
		var idFK_login = storage.login;
		var id_cli = storage.cod_cli;   			  	  
		 
		 if(sessionStorage['ctr_agendametno']==0){
			 insere_agendamento(descricao,idFK_login,id_cli,datetime,repetir);				  
		 }if(sessionStorage['ctr_agendametno']==1) {
		//	 alert(sessionStorage['ctr_agendametno']);
			 update_agendamento(descricao,idFK_login,id_cli,datetime,repetir);
		 }
	}
	else { alert('Digite o compomisso');}
  }



function  cria_tabelas_ag_e_sac(){
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);			
    db.transaction(function (tx) {
        //CREATE TABLE IF NOT EXISTS login
        tx.executeSql('CREATE TABLE IF NOT EXISTS  sac(  cod INTEGER PRIMARY KEY ASC unique, numero_protocolo INTEGER ,   idFK_login DEFAULT 0,  id_cli INTEGER ,   ocorrencia TEXT ,   geolocalizacao_abertura,  geolocalizacao_atualizado,  geolocalizacao_fechado, aberto TIMESTAMP,  atualizado TIMESTAMP,    fechado TIMESTAMP,  hierarquia INTEGER DEFAULT 0, status INTEGER DEFAULT 1);');	
        tx.executeSql('CREATE TABLE IF NOT EXISTS  agendamento(  cod INTEGER PRIMARY KEY ASC unique,   idFK_login DEFAULT 0,  id_cli INTEGER ,  decricao TEXT , aberto ,  atualizado ,  fechado , repetir ,    status INTEGER DEFAULT 1);');	
        tx.executeSql('CREATE TABLE IF NOT EXISTS  creditos(  cod INTEGER PRIMARY KEY ASC unique,   idFK_cliente DEFAULT 0,  cred_maximo numeric(10,2) DEFAULT 0,   cred_usado numeric(10,2) DEFAULT 0);');	
    });		
}	


//gravar no sac
//carrega pagina do Perfil do Cliente	
    
function gravar_sac(){	
    
    if($("#textarea-ocorrencia").val()!=""){		
        var ocorrencia = $("#textarea-ocorrencia").val();
        var idFK_login = storage.login;
        var id_cli = storage.cod_cli;		
       											  
        if(sessionStorage['respota'] == 1) {	
            //alert("atualizar"+sessionStorage['respota']);							
            responder_sac(ocorrencia,idFK_login,id_cli,sessionStorage['npro']);
        }else {
            insere_sac(ocorrencia,idFK_login,id_cli);						
        }
        sessionStorage['respota'] = 0;
    }				// fim do if

}

//AGENDAMENTO
function insere_agendamento(descricao,idFK_login,id_cli, datetime,repetir){
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);	  		
    db.transaction(function (tx) {
        //hoje = date('Y-m-d');	
        tx.executeSql("INSERT INTO agendamento (cod, idFK_login, id_cli, decricao, aberto, atualizado,repetir) VALUES (NULL, "+idFK_login+", "+id_cli+", '"+descricao+"', '"+datetime+"', '"+datetime+"','"+repetir+"');");	
    });	
    select_agendamento (id_cli,"nao");	
}	

//UPDATE

function update_agendamento(descricao,idFK_login,id_cli,datetime,repetir){
		
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);	  		
  
    //  descricao,idFK_login,id_cli, datetime,repetir
  
    db.transaction(function (tx) {
        //hoje = date('Y-m-d');	
        update = "UPDATE agendamento SET decricao = '"+descricao+"', atualizado='"+datetime+"', repetir = '"+repetir+"' WHERE cod = "+sessionStorage['id_agendamento'] ;		
        //alert(update);		
        db.transaction(function(tx) {
            tx.executeSql(update);	
        });			
    });	
  	
    select_agendamento (id_cli,"nao");	
}	

function editar_agendamento(id_agendamento) {
    sessionStorage['id_agendamento'] = id_agendamento;		
    sessionStorage['ctr_agendametno'] = 1;			
    // ir para o grade		
    $.mobile.changePage("cli_agendamento.html", {
        transition: "pop",
        role: "dialog"
    });	
    value_agendamento ();	
}



//AGENDAMENTO
function value_agendamento () {	
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
	
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM agendamento WHERE cod ='+sessionStorage['id_agendamento'] +' order by  atualizado DESC   limit 0,1', [], function (tx, results) {
            var len = results.rows.length, i;		
						  
            $('#textarea-desc_agen').val(results.rows.item(0).decricao);
            $('#datetime').val(results.rows.item(0).atualizado);
            $('#repetir').val(results.rows.item(0).repetir);
			  
        }, null);
    });	
}
		
//AGENDAMENTO
function select_agendamento (id_cli,reposta_ativa) {	
    sessionStorage['ctr_agendametno'] = 0;	
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM agendamento WHERE id_cli ='+id_cli+' order by  atualizado ASC   limit 0,4', [], function (tx, results) {
            var len = results.rows.length, i;
            var lista = '' ;
            //lista_cinza			
            for (i = 0; i < len; i++){	
                
                sessionStorage['id_agendamento'] =  results.rows.item(i).cod;                		
                if(i%2==0) {
                    classe = 'cont_lista_fp';
                } else {
                    classe = 'cont_lista_fp lista_cinza';
                }		
                lista += ' <ul class="'+classe+'"> ';
                lista += ' <a href="#" onClick="editar_agendamento('+results.rows.item(i).cod+')" >';                
                lista += '<li> <img src="../images/calendar.png" width="30" height="27" class="bt_ver"></li>';
               
                // tratapento para deixar data e hora em portugues br
                var datetime = results.rows.item(i).atualizado;              
               /* @todo tramento do datetime estava dando pau e travando o select alteraddo 20/09/2012
                * novoArray = datetime.split("T");	
                var dataArray = novoArray[0].split("-");				
                var data = dataArray[2]+'/'+dataArray[1]+'/'+dataArray[0];
                var hora = novoArray[1];
                hora =hora.substr(0,5);*
                // fim do tratamento
                lista += ' <li class="pad_agenda_data" >  '+data+ ' - '+hora+'</li>';
                */
                lista += ' <li class="pad_agenda_data" >  '+datetime+ ' </li>';
                lista += '<li class="pad_agenda" > <b> '+ results.rows.item(i).decricao;              
                +' </b> </li>      ';		
                lista += '</a>';	
                lista += '</ul>';						                 
                
            }
            $('#recebe_agenda').html(lista);
        }, null);
    });	
}
//FIM AGENDAMENTO
// SAC
function insere_sac(ocorrencia,idFK_login,id_cli){
  
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);			 
    n_protocolo();     
    db.transaction(function (tx) {	 				
        var timeStamp = time();	
        //alert("vou inserir no sac "+timeStamp);
       var insert = "INSERT INTO sac (cod, numero_protocolo, idFK_login, id_cli, ocorrencia, aberto, atualizado) VALUES (NULL, "+storage.numero_protocolo+","+idFK_login+", "+id_cli+", '"+ocorrencia+"', '"+timeStamp+"', '"+timeStamp+"');";
        tx.executeSql(insert);
        //  alert ('Ocorrência Aberta');
        $("#textarea-ocorrencia").val('');
        select_sac (id_cli,"nao");	
    });
 		
}	

function responder_sac(ocorrencia,idFK_login,id_cli,numero_protocolo){
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);			 
 
    db.transaction(function (tx) {
        tx.executeSql("SELECT max(hierarquia) as hierar FROM sac WHERE numero_protocolo="+numero_protocolo, [], function (tx, results) {
            var len = results.rows.length, i; 				
            var hierarquia = results.rows.item(0).hierar + 1;	
            sessionStorage['hierarquia'] = hierarquia;		
        }, null);
    });

    db.transaction(function (tx) {	 	
        // aqui a grande jogada é a hierarquia			
        timeStamp = time();	
        insert = "INSERT INTO sac (cod, numero_protocolo, idFK_login, id_cli, ocorrencia, aberto, atualizado,hierarquia) ";
        insert +=" VALUES (NULL, "+numero_protocolo+","+idFK_login+", "+id_cli+", '"+ocorrencia+"', '"+timeStamp+"', '"+timeStamp+"',"+sessionStorage['hierarquia']+");";
	  
        tx.executeSql(insert);
        //  alert ('Ocorrência Aberta');
        $("#textarea-ocorrencia").val('');	
        select_sac (id_cli,numero_protocolo);	
	 
    });
 		
}	

// pegar ultimo id
function renderResults(tx, rs) {        
    r = rs.rows.item(0);
    protocolo = r['ultimo_id']+1;
    if (protocolo==1) {
        protocolo = 20120001
    }
    storage.numero_protocolo = protocolo;
}
	  
function n_protocolo(){	
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);		
    db.transaction(function(tx) {          
        tx.executeSql('SELECT max(numero_protocolo) as ultimo_id FROM sac limit 0 ,1', [], renderResults);   	 	      	   
    }); 		
 
}	
// fim pegar ultimo id
function select_sac (id_cli,reposta_ativa) {	
    var db = openDatabase('repres', '1.0', 'Test DB', 3 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM sac WHERE id_cli ='+id_cli+' order by  numero_protocolo DESC,hierarquia   limit 0,28', [], function (tx, results) {
            var len = results.rows.length, i;
            var lista = '' ;			
            //msg = "<p>Encontrado " + len + " linhas</p>";   
            //document.querySelector('#status').innerHTML +=  msg;				
            var classe ;
            var contahierar = 0; 
            for (i = 0; i < len; i++){				
				
                timeStamp = results.rows.item(i).aberto; 
                ocorrencia = results.rows.item(i).ocorrencia; 								
                numero_protocolo = results.rows.item(i).numero_protocolo;
                ; 	
						
                hora = date('H:i', timeStamp);	
                data = date('d/m/Y',timeStamp);
				
                if(results.rows.item(i).hierarquia==0) {										
                    if(contahierar%2==0) {
                        classe = 'class="expandir"';
                    } else {
                        classe = 'class="expandir azul"';
                    }					
                    lista += '<li '+classe+'  id="li'+numero_protocolo+'" npro="'+numero_protocolo+'" >'; 	
                    lista += '<strong>'+data+'  '+hora+'</strong> - '+ocorrencia+' <br>  ';
                    lista += 'Nº Protocolo: '+numero_protocolo+'<br>';	
					
                    lista += '<dl id="ex'+numero_protocolo+'" class="exp_show_resp" npro="'+numero_protocolo+'" > <span  class="btns_sac">Expandir </span> </dl>';
                    lista += '<dl class="btns_responder action_resp" id="res'+numero_protocolo+'" npro="'+numero_protocolo+'" > <img src="../images/responder_sac.png" width="12" height="9"><span  class="btns_sac" >Responder </span> </dl>';
                    lista += '<dl class="btns_responder" id="pri'+numero_protocolo+'" npro="pri'+numero_protocolo+'"> <img src="../images/priorisar_sac.png" width="10" height="10"> <span  class="btns_sac">Priorizar </span></dl>';		
                    lista += '<div class="clear" > </div> ';					
					
                    contahierar++;
					
                    if(contahierar>0 || len ==1) {
                        lista += '</li> '; // fecha o anterior e abre um novo li	
                    }
                }
                else if(results.rows.item(i).hierarquia>0){ // aqui vai as respostas 
                    classe = 'responder'+numero_protocolo;					
                    lista += '<div  class="reposta_texto '+classe+'" >';	
                    lista += '<strong>'+data+'  '+hora+'</strong> - '+ocorrencia+' <br>  ';
                    lista += 'Nº Protocolo: '+numero_protocolo+'<br>';	
                    lista += '</div>';					
                }		
            }  			
			
            $('#retorno_sac').html(lista);
			
			
			
            if(reposta_ativa=="nao") {					
                $(".reposta_texto").hide();
                $(".btns_responder").hide();		
            }else { 
				
                $(".reposta_texto").hide();
                $(".btns_responder").hide();		
                // mostrar os botoes de um chamado e deixar a cor azul
                mostrar_bts  = "#li"+reposta_ativa+" .btns_responder";		
                $(mostrar_bts).show(120);	
                mudacor  = "#li"+reposta_ativa+" .btns_sac";	
                $(mudacor).css("color","#0083b3");	
                // mostrar as reposta de um chamado
                mostrar_resp  = ".responder"+reposta_ativa;											
                $(mostrar_resp).show(120);	
            }
			
            // MOSTRA E OUCUTA OS BOTOES						
            $(".expandir").click(function(){
                // inico reset
                $(".btns_responder").hide();
                $("#retorno_sac .btns_sac").css("color","#999");	
                // fim reset
				
                id = $(this).attr("id");	
                mostrar  = "#"+id+" .btns_responder";		
                //alert(id);	
                $(mostrar).show(120);				
                mudacor  = "#"+id+" .btns_sac";	
                $(mudacor).css("color","#0083b3");					
            });
			
            $(".exp_show_resp").click(function(){
                mostrar_resp  = ".responder"+$(this).attr("npro");				
                $(mostrar_resp).toggle(120);				
				
            });
			
            // RESPONDER
            $(".action_resp").click(function(){
                npro = $(this).attr("npro");	
                mensagem = "responda o protocolo "+npro;
                $("#textarea-ocorrencia").val(mensagem);
                $("#textarea-ocorrencia").focus();		
                sessionStorage['respota'] = 1;		
                sessionStorage['npro'] = npro;		
            });		
				
        }, null);
    });
	
}