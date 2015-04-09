<?php

$url=  $_SERVER["REQUEST_URI"]."<br/>";
$url = substr($url, 0,-17);
//$sql = "UPDATE jos_guia_anunciantes SET logo = '".$url."logo-7cliques-m.png',

//echo $sql."<hr/>";
// pega o endereço do diretório
$diretorio = getcwd();

// abre o diretório
$ponteiro  = opendir($diretorio);
// monta os vetores com os itens encontrados na pasta
while ($nome_itens = readdir($ponteiro)) {
    $itens[] = $nome_itens;
}

//O que fizemos aqui, foi justamente, pegar o diretório, abri-lo e lê-lo.

//Continuando, vamos usar:
//sort: ordena os vetores (arrays), de acordo com os parâmetros informados. Aqui estou ordenando por pastas e depois arquivos

// ordena o vetor de itens
sort($itens);
// percorre o vetor para fazer a separacao entre arquivos e pastas 
foreach ($itens as $listar) {
// retira "./" e "../" para que retorne apenas pastas e arquivos
   if ($listar!="." && $listar!=".."){ 

// checa se o tipo de arquivo encontrado é uma pasta
   		if (is_dir($listar)) { 
// caso VERDADEIRO adiciona o item à variável de pastas
			$pastas[]=$listar; 
		} else{ 
// caso FALSO adiciona o item à variável de arquivos
			$arquivos[]=$listar;
		}
   }
}

/*
Vimos acima, a expressão is_dir, indicando que as ações devem esntão ser executadas, ali mesmo, no diretório que já foi aberto e lido. As ações que executamos ali, foram: ver se tem pastas, listar. Ver se tem arquivos, listar.

Agora, se houverem pastas, serão apresentadas antes dos arquivos, em odem alfabética.
Se não houverem, serão apresentados apenas os arquivos, na mesma ordem.
E se houverem os dois, serão mostrados igualmente.*/

// lista as pastas se houverem
if ($pastas != "" ) { 
foreach($pastas as $listar){
   print "Pasta: <a href='$listar'>$listar</a><br>";}
   }
// lista os arquivos se houverem
if ($arquivos != "") {
	$i = 0;
	$classe = "" ;
foreach($arquivos as $listar){
	if($i%2==0) { $classe =   "class='grande'" ; } else  { $classe =   "class='grande cinza'" ; }
   print " <li ".$classe."><a href='$listar'>js/plugins/$listar</a> </li>";}
   }
?>
<style> 
*{border:0; padding:0; margin:0; list-style:none }
.grande {
	border:1px solid #ccc;		
	padding:15px;	
	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
	font-size:16px;
	font-weight:bold
}
.cinza { background-color:#f5f5f5; }

.grande a{ color:#333 }

.grande:hover { background-image: linear-gradient(bottom, rgb(224,224,224) 36%, rgb(255,255,255) 84%);
background-image: -o-linear-gradient(bottom, rgb(224,224,224) 36%, rgb(255,255,255) 84%);
background-image: -moz-linear-gradient(bottom, rgb(224,224,224) 36%, rgb(255,255,255) 84%);
background-image: -webkit-linear-gradient(bottom, rgb(224,224,224) 36%, rgb(255,255,255) 84%);
background-image: -ms-linear-gradient(bottom, rgb(224,224,224) 36%, rgb(255,255,255) 84%);

background-image: -webkit-gradient(
	linear,
	left bottom,
	left top,
	color-stop(0.36, rgb(224,224,224)),
	color-stop(0.84, rgb(255,255,255))
); }
</style>