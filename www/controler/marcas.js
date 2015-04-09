function tema_marca () {
    // oucutar do topo o menu linha
    $(".linhas").hide();

    // PEGA O BG DA PAGINA
    var bg_marca1 = "url(../images/bg.jpg)";
    var bg_marca2 = "url(../images/bg_marca2.jpg)";

    var logo = "../images/marca1.png";

    if (!storage.categoria_listar) {
        // se não existe cria com esse padrao
        storage.categoria_listar = 'TENIS FEMININO';
        storage.cor_bg = "#793905"; // essa cor é a azual para bg tenis
        storage.bg_img_linha = bg_marca1;
        storage.logo = logo;
    } else {
        storage.categoria_listar = storage.categoria_listar;
        //colocar nome da linha atual no topo        
        muda_bg(storage.bg_img_linha, "", storage.cor_bg, storage.logo, 0); //o zero india que nao ouve mudança 
    }

    $(".logo").click(function() {
        $(".linhas").toggle(200);

    });


    $('.linhas .marca1').click(function() {
        storage.CarregaCategoria = 1;
        storage.categoria_listar = 'TENIS FEMININO';
        storage.cor_bg = "#793905";
        storage.bg_img_linha = bg_marca1;
        storage.logo = logo;
        muda_bg(bg_marca1, "TÊNIS FEMINIO", "#793905", logo, 1);
        reload();
    });
    $('.linhas .marca2').click(function() {
        storage.CarregaCategoria = 1;
        storage.categoria_listar = 'TENIS MASCULINO';
        storage.cor_bg = "#404040";
        storage.bg_img_linha = bg_marca2;
        muda_bg(bg_marca2, "TÊNIS MASCULINO", storage.cor_bg, logo, 1);
        reload()
    });
}

function muda_bg(bg, categoria, corhex, logo, mudei) {
    //  alert(storage.categoria_listar);		
   
    $(".ui-mobile .type-home .ui-content").css("background-color", corhex);
    $(".ui-mobile .type-home .ui-content").css("background-image", bg);
    $("#linhas").hide('slow');
     // colocar a logo da marca no lugar da logo do repres
    // $('#logo').html('<img src="' + logo + '" /> <br>   <p>' + categoria + '</p>');

    if (mudei == 1) {
        //  $.mobile.changePage( "novo-pedido.html", { transition: "slidedown"} );
        reload();
    }
}