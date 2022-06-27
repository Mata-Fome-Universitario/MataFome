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
                $("#finalizarPedido").removeClass("hidden");
                $("#clearCartBtn").removeClass("hidden");
            }
            else {
                let carrinhoVazio = $("#carrinhoVazio").clone();
                $("#tabelaItems").html(carrinhoVazio);
                $(".price-total").text(formatMoney(0));
                $("#finalizarPedido").addClass("hidden");
                $("#clearCartBtn").addClass("hidden");
            }
        }
        else {
            let carrinhoVazio = $("#carrinhoVazio").clone();
            $("#tabelaItems").html(carrinhoVazio);
            $(".price-total").text(formatMoney(0));
            $("#finalizarPedido").addClass("hidden");
            $("#clearCartBtn").addClass("hidden");
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

    $("#finalizarPedido").click(function() {
        let itensArray = JSON.parse(window.localStorage.getItem('itensCarrinho'));
        let total = 0;

        itensArray.forEach(element => {
            total += element.preco * element.quantidade
        });

        let pedido = {
            "cpF_Usuario": usuario.cpf,
            "status": 0,
            "total": total
        }

        $.ajax({
            url: route + "Pedidos",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(pedido),
        }).done(function (server_response) {
            if(server_response == "Usuário não encontrado") {
                //ALERT INCONSISTENCIA NOS DADOS DO USUÁRIO, E PEDE PRA LOGAR DNV
            }
            else if(server_response == "Saldo insuficiente") {
                $("#formItem").removeClass("hidden");
                $(".modalFade").removeClass("hidden");
            }
            else {
                registraItensPedido(server_response.codigo, itensArray);
                refreshUser(pedido.cpF_Usuario);
            }
        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    });

    function registraItensPedido(codigo_pedido, itensArray) {
        let pedidoItens = [];
        let total = 0;
        itensArray.forEach(element => {
            let item = {
                "codigo_Pedido": codigo_pedido,
                "codigo_Item": parseInt(element.codigo),
                "quantidade": element.quantidade,
                "total": element.preco * element.quantidade
            }
            total += item.total

            pedidoItens.push(item);
        });

        pedidoItens.forEach(element => {
            $.ajax({
                url: route + "PedidoItens",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(element),
            }).done(function (server_response) {
                window.localStorage.removeItem('itensCarrinho');
                window.location.href = "pedido.html"
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        });
    }

    function refreshUser(cpf) {
        $.ajax({
            url: route + "Usuarios/" + cpf,
            type: "GET",
            contentType: "application/json",
        }).done(function (server_response) {
            if(server_response == "Usuário não encontrado") {
                //ALERT USUARIO NÃO ENCONTRADO, PEDE PRA LOGAR DNV
            }
            else {
                window.localStorage.setItem('usuario', JSON.stringify(server_response));
                let saldoTexto = formatMoney(server_response.saldo);
                $("#saldo").children().text(saldoTexto);
            }
        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    }
});