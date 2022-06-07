var route = "https://localhost:44373/api/"

let itemAlreadyHasImage = false;
let itemId = 0;
let itemLastImage = "";

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


    //  FUNÇÕES
    //  ADICIONAR ITEM
    $(".btnAddItem").click(function() {
        itemAlreadyHasImage = false;
        itemId = 0;
        $(".modalFade").removeClass("hidden");
        let formItem = $("#formItem");
        formItem.find("#inputImageDiv").removeClass("hidden");
        formItem.find("#hasImageDiv").addClass("hidden");
        formItem.find("#formItemTitle").text("Adicionar Item");
        formItem.find("#itemNome").val("");
        formItem.find("#itemDescricao").val("");
        formItem.find("#itemPreco").val("");
        formItem.find("#itemAlertNome").addClass("hidden");
        formItem.find("#itemImage").val("");
        formItem.removeClass("hidden");
    });

    //  EXCLUIR ITEM
    $(document).on('click', ".btnExcluirItemCardapio", (function() { 
        deleteItem(this.closest(".cardItem").id);
    }));

    //  EDITAR ITEM
    $(document).on('click', ".btnEditarItemCardapio", (function() { 
        $(".modalFade").removeClass("hidden");

        let card = this.closest(".cardItem");
        itemId = card.getAttribute('id');
        let nome = card.getElementsByClassName("nomeSpan")[0].innerHTML
        let descricao = card.getElementsByClassName("descricaoSpan")[0].innerHTML
        let preco = parseMoneyToDouble(card.getElementsByClassName("precoSpan")[0].innerHTML, true);

        let formItem = $("#formItem");
        formItem.find("#formItemTitle").text("Editar Item");
        formItem.find("#itemNome").val(nome);
        formItem.find("#itemDescricao").val(descricao);
        formItem.find("#itemPreco").val(preco);
        formItem.find("#itemAlertNome").addClass("hidden");
        formItem.find("#itemImage").val("");

        if (card.getElementsByClassName("itemImage")[0].getAttribute('hasImage') == "true") {
            formItem.find("#hasImageDiv").removeClass("hidden");
            formItem.find("#inputImageDiv").addClass("hidden");
            itemAlreadyHasImage = true;
            itemLastImage = card.getElementsByClassName("itemImage")[0].getAttribute('src');
        }
        else {
            formItem.find("#inputImageDiv").removeClass("hidden");
            formItem.find("#hasImageDiv").addClass("hidden");
            itemAlreadyHasImage = false;
        }

        formItem.removeClass("hidden");
    }));

    $("#btnClearImage").click(function() {
        itemAlreadyHasImage = false;
        let formItem = $("#formItem");
        formItem.find("#inputImageDiv").removeClass("hidden");
        formItem.find("#hasImageDiv").addClass("hidden");
    });

    // SALVAR ITEM
    $("#btnSaveItem").click(async function() {
        if ($("#itemNome").val() == "") {
            $("#itemAlertNome").removeClass("hidden");
        }
        else {
            let item = {
                nome: $("#itemNome").val(),
                descricao: $("#itemDescricao").val(),
                preco: parseMoneyToDouble($("#itemPreco").val())
            }

            let newObj = true;
            if ($("#formItemTitle").text() == "Editar Item") {
                newObj = false;
            }

            if (document.querySelector('#itemImage').files.length > 0) {
                getBase64(document.querySelector('#itemImage').files[0], item, newObj);
            }
            else {
                if (newObj) {
                    addItem(item);
                }
                else {
                    updateItem(item);
                }

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

    // ADICIONAR AO CARRINHO
    $(document).on('click', ".cart-button", function() {
        let card = this.closest(".cardItem");
        itemId = card.getAttribute('id');
        let nome = card.getElementsByClassName("nomeSpan")[0].innerHTML
        let descricao = card.getElementsByClassName("descricaoSpan")[0].innerHTML
        let preco = parseMoneyToDouble(card.getElementsByClassName("precoSpan")[0].innerHTML, true);

        let itemCarrinho = {
            codigo: itemId,
            nome: nome,
            descricao: descricao,
            preco: preco,
            quantidade: 1,
            imagem: card.getElementsByClassName("itemImage")[0].getAttribute('src')
        }

        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));

        if (itensArray != null && itensArray != undefined) {
            // VERIFICA SE O ITEM JÁ FOI ADICIONADO AO CARRINHO
            let alreadyExist = false;
            itensArray.forEach(element => {
                if (element.codigo == itemId) {
                    element.quantidade++;
                    alreadyExist = true;
                }
            });

            if (!alreadyExist) {
                itensArray.push(itemCarrinho);
            }
            window.localStorage.setItem('itensCarrinho', JSON.stringify(itensArray));
        }
        else {
            window.localStorage.setItem('itensCarrinho', JSON.stringify([itemCarrinho]));
        }
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
                let cardItem = $("#000").clone();
                cardItem.attr('id', element.codigo);
                cardItem.find(".precoSpan").text(formatMoney(element.preco));
                cardItem.find(".nomeSpan").text(element.nome);
                cardItem.find(".descricaoSpan").text(element.descricao);
                if (element.imagem != "") {
                    cardItem.find(".itemImage").attr('src', (element.imagem));
                    cardItem.find(".itemImage").attr('hasImage', true);
                }
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
        url: route + "Items?nome=" + item.nome + "&descricao=" + item.descricao + "&preco=" + item.preco,
        type: "POST",
        contentType: "application/json",
        data: (item.imagem != undefined ? item.imagem : '""')
    }).done(function (server_response) {
        $(".modalFade").addClass("hidden");
        $("#formItem").addClass("hidden");
        refreshItems();
    }).fail(function (server_response) {
        console.error("Falha de comunicação com o servidor", server_response);
    });
    
}

function deleteItem(id) {
    $.ajax({
        url: route + "Items/" + id,
        type: "DELETE",
        contentType: "application/json",
    }).done(function (server_response) {
        refreshItems();
    }).fail(function (server_response) {
        console.error("Falha de comunicação com o servidor", server_response);
    });
}

function updateItem(item) {
    item.codigo = itemId;

    if (itemAlreadyHasImage) {
        item.imagem = itemLastImage;
    }

    $.ajax({
        url: route + "Items/" + itemId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item)
    }).done(function (server_response) {
        $(".modalFade").addClass("hidden");
        $("#formItem").addClass("hidden");
        refreshItems();
    }).fail(function (server_response) {
        console.error("Falha de comunicação com o servidor", server_response);
    });
}

function formatMoney(money) {
    return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

function parseMoneyToDouble(money, BRFormat) {
    let moneyWithoutReais = money.replace('R$', '');
    let moneyWithoutSpace = moneyWithoutReais.replace(' ', '');
    let moneyWithoutSpecialCaracteres = moneyWithoutSpace.replace('&nbsp;', '');

    let moneyWithoutSeparator = "";
    if (BRFormat) {
        moneyWithoutSeparator = moneyWithoutSpecialCaracteres.replace('.', '');
        moneyWithoutSeparator = moneyWithoutSeparator.replace(',', '.');
    }
    else {
        moneyWithoutSeparator = moneyWithoutSpecialCaracteres.replace(',', '');
    }
    if (moneyWithoutSeparator == "") {
        return parseFloat(0);
    }
    return parseFloat(moneyWithoutSeparator);
}

function getBase64(file, item, newObj) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        if (newObj) {
            item.imagem = '"';
            item.imagem += reader.result;
            item.imagem += '"';
            addItem(item);
        }
        else {
            item.imagem = reader.result;
            updateItem(item);
        }
    };
    reader.onerror = function (error) {
        console.log("ERRO BASE64CONVERT: " + error);
      return "";
    };
}