var route = "https://localhost:44373/api/"

$(document).ready(function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    if (usuario.cargo == "Vendedor") {
        window.location.href = "cardapio.html";
    }
    else if (usuario.cargo == "Gerente") {
        window.location.href = "usuarios.html";
    }
    else if (usuario.cargo == "Cliente") {
        refreshCarrinho();
    }

    function refreshCarrinho() {
        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));
        $("#tabelaItems").html("");

        if (itensArray != null && itensArray != undefined) {
            if (itensArray.length > 0) {
                let total = 0;
                itensArray.forEach(element => {
                    let itemCarrinho = $("#trDefault").clone();
                    itemCarrinho.find(".imageItemCarrinho").attr('src', element.imagem);
                    itemCarrinho.find(".name-product").html(element.nome);
                    itemCarrinho.find(".price").html(formatMoney(element.preco));
                    itemCarrinho.find(".qty").val(element.quantidade);
                    itemCarrinho.find(".total").html(formatMoney(element.preco * element.quantidade));
                    itemCarrinho.attr('id', element.codigo);
                    $("#tabelaItems").append(itemCarrinho);
                    total += element.preco * element.quantidade;
                });

                $(".price-total").text(formatMoney(total));
            }
            else {
                let carrinhoVazio = $("#carrinhoVazio").clone();
                $("#tabelaItems").html(carrinhoVazio);
                $(".price-total").text(formatMoney(0));
            }
        }
        else {
            let carrinhoVazio = $("#carrinhoVazio").clone();
            $("#tabelaItems").html(carrinhoVazio);
            $(".price-total").text(formatMoney(0));
        }
    }

    $("#clearCartBtn").click(function() {
        window.localStorage.removeItem('itensCarrinho');
        refreshCarrinho();
    });

     $(document).on('click', ".qtyminus", function() {
        let row = this.closest(".modelRow");
        let input = row.getElementsByClassName("qty")[0];
        parseInt(input.value);
        input.value--;
        
        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));
        let preco = 0;
        let quantidade = 0;

        let refresh = false;

        itensArray.forEach(function(element, index, object) {
            if (element.codigo == row.getAttribute('id')) {
                element.quantidade = parseInt(input.value);
                preco = element.preco;
                quantidade = element.quantidade;
                if (quantidade == 0) {
                    object.splice(index, 1);
                    refresh = true;
                }
            }
        });

        row.getElementsByClassName("total")[0].innerHTML = formatMoney(quantidade * preco);
        window.localStorage.setItem('itensCarrinho', JSON.stringify(itensArray));

        if (refresh) {
            refreshCarrinho();
        }
        else {
            calcTotalCarrinho();
        }
     });

     $(document).on('click', ".qtyplus", function() {
        let row = this.closest(".modelRow");
        let input = row.getElementsByClassName("qty")[0];
        parseInt(input.value);
        input.value++;

        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));
        let preco = 0;
        let quantidade = 0;

        itensArray.forEach(element => {
            if (element.codigo == row.getAttribute('id')) {
                element.quantidade = parseInt(input.value);
                preco = element.preco;
                quantidade = element.quantidade;
            }
        });

        row.getElementsByClassName("total")[0].innerHTML = formatMoney(quantidade * preco);
        window.localStorage.setItem('itensCarrinho', JSON.stringify(itensArray));

        calcTotalCarrinho();
    });

    function calcTotalCarrinho() {
        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));
        let total = 0;

        itensArray.forEach(element => { 
            total += element.preco * element.quantidade;
        });

        $(".price-total").text(formatMoney(total));
    }

    function formatMoney(money) {
        return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }
});