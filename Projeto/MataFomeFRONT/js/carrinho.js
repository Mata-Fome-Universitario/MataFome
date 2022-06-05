var route = "https://localhost:44373/api/"

$(document).ready ( function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    if (usuario.cargo == "Vendedor") {
        window.location.href = "cardapio.html";
    }
    else if (usuario.cargo == "Gerente") {
        window.location.href = "usuarios.html";
    }
    else if (usuario.cargo == "Cliente") {
        // refreshCarrinho();
    }

    function refreshCarrinho() {
        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));
        $("#tabelaCarrinho").html("");

        if (itensArray != null && itensArray != undefined) {
            itensArray.forEach(element => {
                let itemCarrinho = $("#000").clone();
                itemCarrinho.find(".imageItemCarrinho").attr('src', element.imagem);
                itemCarrinho.find(".name-product").html(element.nome);
                itemCarrinho.find(".price").html(formatMoney(element.preco));
                itemCarrinho.find(".qty").val(element.quantidade);
                itemCarrinho.find(".total").html(formatMoney(element.preco * element.quantidade));
                itemCarrinho.attr('id', element.codigo);
                $("#tabelaCarrinho").append(itemCarrinho);
            });
        }
        else {
            let carrinhoVazio = $("#carrinhoVazio").clone();
            $("#tabelaCarrinho").html(carrinhoVazio);
        }
    }

    function formatMoney(money) {
        return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }
});