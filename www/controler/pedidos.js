
// # FECHAR PEDIDO
$(document).on("pagecreate", "#fechar-pedido", function() {  

    $("#preco_total").hide();

    $("#calcular_total").bind("click", function(e) {
        $("#preco_total").slideToggle(120);
        $("#calcular_total").hide();
    });

    $("#preco_total").bind("click", function(e) {
        $("#calcular_total").slideToggle(120);
        $("#preco_total").hide();
    });
    top_meio_rodape('fechar-pedido');

    //para zerar o indice para nao ficar dando pau
    storage.indice = 0;
    storage.total_pedido_desc = 0;

    if (storage.itens > 0) {
        resumo_do_pedido();
    } else {
        $(".salvar_pedido").hide();
        alert("Carrinho de compras vazio.");
    }


    function calc_descont(tipo) {
        var valores;
        var desconto;        
        var total;

        valores = storage.total_pedido; // $("#preco_total").text();         
        valores = parseFloat(valores);

        if ($('input#v_desconto').val() > 0) {
            desconto = $('input#v_desconto').val();
            desconto = (valores * parseFloat(desconto)) / 100;
            total = valores - desconto;
        }

        if ($('input#v_desconto2').val() > 0) {
            desconto= 0;
            desconto = $('input#v_desconto2').val();
            // pego o total anterior e calculo a porcentegem             
            desconto = (total * parseFloat(desconto)) / 100;
            total = total - desconto;          
        }

        total = float2moeda(total);

        return total;
    }

    /*Desconto*/

    $('input#v_desconto').on('focusout', function() {

        var total;
        total = calc_descont();     
        storage.total_pedido_desc = total;

        $('#preco_total_desconto').html('R$ ' + total);

    });

    // pq o desconto 2 é em cima do novo valor do desconto 1
    $('input#v_desconto2').on('focusout', function() {

        var total;
        total = calc_descont();
        storage.total_pedido_desc = total;
        $('#preco_total_desconto').html('R$ ' + total);

    });


    //### INICIO Depois do DOM pronto
    $("#cond_pag .ui-controlgroup-last").css('opacity', 0.6);

    //* INICIO MOSTRAR DICA*/
    $('#cond_pag .tooltip_cli').hide();
    $("#select-preco-especial").click(function() {
        $('.tooltip_cli').show('fast');
        $(".ui-controlgroup-last").css('opacity', 1);
    });
    //* FIM MOSTRAR DICA*/
    // GERAÇÃO DOS VALORES NOS CAMPOS

    function prazos(inicio, nposicoes, id) {
        var prazos;
        var mult = 7;

        if (id !== "#select-choice-month") {
            for (i = inicio; i < 147; i++) {
                inicio = inicio + 7;
                prazos += '<option value="' + inicio + '">' + inicio + '</option>';
                i = i + 6;
            }
        } else {
            for (i = inicio; i <= nposicoes; i++) {
                prazos += '<option value="' + i * mult + '">' + i * mult + '</option>';
            }
        }

        $(id).append(prazos);
    }

    //$("#select-choice-month2").append(prazos);		
    //$("#select-choice-month3").append(prazos);
    prazos(1, 21, "#select-choice-month");
    prazos(0, 21, "#select-choice-month2");

    $('#select-choice-month').change(function() {
        var prazo_anterior = $("#select-choice-month").val();
        prazo_anterior = parseInt(prazo_anterior);
        $("#select-choice-month2").html('');
        prazos(prazo_anterior, 21, "#select-choice-month2");
    });

    $('#select-choice-month2').change(function() {
        var prazo_anterior = $("#select-choice-month2").val();
        prazo_anterior = parseInt(prazo_anterior);
        $("#select-choice-month3").html('');
        prazos(prazo_anterior, 21, "#select-choice-month3");
    });


    // ao selecinar executa validacoes e grava o pedio
    $('#select-choice-month2').change(function() {

        // storage.cond_preco  é a coluna do meio pq apenas ela q influencia no preco
        storage.cond_preco1 = $("#select-choice-month").val();
        storage.cond_preco = $("#select-choice-month2").val();
        storage.cond_preco2 = $("#select-choice-month3").val();
        // se a pessoa marca a ultima opcao ela determina o preco fazer validacao posterior
        storage.cond_preco_especial = $("#select-preco-especial").val();

    });

});

//carrega pagina do novo_pedido
//$('').on('pageshow', function(event, ui) {
$(document).on("pagecreate", "#pedido-realizado", function() {  
    // //verifica_login(); @todo verificar pq nao abre o login
    pedido_realizado(); // grava pedido e limpa os storages
    top_meio_rodape('pedido-realizado');

});