var route = "https://localhost:44373/api/"

$(document).ready ( function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    if (usuario.cargo == "Cliente") {
        $(".cliente_buttons").removeClass("hidden");
        $(".vendedor_buttons").addClass("hidden");
        $("#nav_recarga").addClass("hidden");
    }
    else if (usuario.cargo == "Vendedor") {
        $(".vendedor_buttons").removeClass("hidden");
        $(".cliente_buttons").addClass("hidden");
    }
    else if (usuario.cargo == "Gerente") {
        window.location.href = "usuarios.html";
    }

    refreshItems();

    $("#itemPreco").maskMoney();


    //FUNÇÕES
    $(".btnAddItem").click(function() {
        $(".modalFade").removeClass("hidden");
        let formItem = $("#formItem");
        formItem.find("#itemNome").val("");
        formItem.find("#itemDescricao").val("");
        formItem.find("#itemPreco").val("");
        formItem.find("#itemAlertNome").addClass("hidden");
        formItem.find("#itemImage").val("");
        formItem.removeClass("hidden");
    });

    $("#btnSaveItem").click(function() {
        if ($("#itemNome").val() == "") {
            $("#itemAlertNome").removeClass("hidden");
        }
        else {
            let item = {
                nome: $("#itemNome").val(),
                descricao: $("#itemDescricao").val(),
                preco: parseMoneyToDouble($("#itemPreco").val())
            }

            if (document.querySelector('#itemImage').files.length > 0) {
                item.imagem = getBase64(document.querySelector('#itemImage').files[0]);
            }

            if ($("#formItemTitle").text() == "Adicionar Item") {
                addItem(item);
            }
            else if ($("#formItemTitle").text() == "Editar Item") {
                // item.codigo =
                updateItem(item);
            }
        }
    });

    $("#btnCancelarItem").click(function() {
        $(".modalFade").addClass("hidden");
        $("#formItem").addClass("hidden");
    });

    $(".modalFade").click(function() {
        $(".modalFade").addClass("hidden");
        $("#formItem").addClass("hidden");
    });

});

function refreshItems() {
    $.ajax({
        url: route + "Items",
        type: "GET",
        contentType: "application/json",
    }).done(function (server_response) {
        $(".divItems").html("");

        if (server_response.length > 0) {
            server_response.forEach(element => {
                let cardItem = $(".cardItem").clone();
                cardItem.attr('id', element.codigo);
                cardItem.find(".precoSpan").text(formatMoney(element.preco));
                cardItem.find(".nomeSpan").text(element.nome);
                cardItem.find(".descricaoSpan").text(element.descricao);
                cardItem.find(".itemImage").attr('src', (element.imagem));
                $(".divItems").append(cardItem);
            });
        }
        else {
            let cardapioVazio = $(".cardapioVazio").clone();
            $(".divItems").html(cardapioVazio);
        }
    }).fail(function (server_response) {
        console.error("Falha de comunicação com o servidor", server_response);
    });
}

function addItem(item) {
    $.ajax({
        url: route + "Items",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(item)
    }).done(function (server_response) {
        
    }).fail(function (server_response) {
        console.error("Falha de comunicação com o servidor", server_response);
    });
    
}

function formatMoney(money) {
    return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

function parseMoneyToDouble(money) {
    let moneyWithoutReais = money.replace('R$', '');
    let moneyWithoutSpace = moneyWithoutReais.replace(' ', '');
    let moneyWithoutSeparator = moneyWithoutSpace.replace(',', '');
    return parseFloat(moneyWithoutSeparator);
}

function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
}