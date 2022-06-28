var route = "https://localhost:44373/api/"

$(document).ready ( function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    if (usuario.cargo == "Cliente") {
        $(".vendedor_buttons").addClass("hidden");
        $("#nav_recarga").addClass("hidden");
        refreshPedidos();
    }
    else if (usuario.cargo == "Vendedor") {
        $(".vendedor_buttons").removeClass("hidden");
        refreshPedidos();
    }
    else if (usuario.cargo == "Gerente") {
        window.location.href = "usuarios.html";
    }

    function refreshPedidos() {
        $("#pedidosContainer").html("");

        $.ajax({
            url: route + "Pedidos",
            type: "GET",
            contentType: "application/json",
        }).done(function (server_response) { 
            if (server_response.length == 0) {
                let nenhumPedido = $(".pedidoVazio").clone();
                $("#pedidosContainer").html(nenhumPedido);
            }
            else {
                
                    //OBJETO RETORNADO = [{
                    //     "codigo": 0,
                    //     "total": 0.0,
                    //     "status": 0,
                    //     "username": "string",
                    //     "itens": [{
                    //         "nome": "string",
                    //         "quantidade": 0
                    //     }]
                    // }]

                server_response.forEach(pedido => {
                    let cardItem = $("#000").clone();
                    cardItem.attr('id', pedido.codigo);
                    cardItem.find(".codigoSpan").html("Código - " + pedido.codigo);
                    cardItem.find(".totalSpan").html(formatMoney(pedido.total));
                    cardItem.find(".nomeSpan").html(pedido.username);

                    let status = cardItem.find(".statusSpan");
                    if (pedido.status == 0) {
                        status.html("PENDENTE");
                        status.addClass("pendente");
                    } else if (pedido.status == 1) {
                        status.html("ENTREGUE");
                        status.addClass("entregue");
                        cardItem.find(".vendedor_buttons").addClass("hidden");
                    } else {
                        status.html("CANCELADO");
                        status.addClass("cancelado");
                        cardItem.find(".vendedor_buttons").addClass("hidden");
                    }

                    pedido.pedidoItensFront.forEach(item => {
                        let itensTitle = cardItem.find(".itensTitle");
                        let cloneSpan = cardItem.find(".totalSpan").clone();
                        cloneSpan.removeClass("totalSpan");
                        cloneSpan.addClass("itensSpan");
                        cloneSpan.html(item.nome + " - " + item.quantidade + "x");
                        itensTitle.after(cloneSpan);
                    });

                    $("#pedidosContainer").append(cardItem);
                });
            }
        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    }

    $(document).on('click', ".btnCancelarPedido", function() { 
        let codigoPedido = this.closest(".cardPedido").getAttribute("id");

        $.ajax({
            url: route + "Pedidos/" + codigoPedido,
            type: "GET",
            contentType: "application/json",
        }).done(function (server_response) { 
            server_response.status = 2;

            $.ajax({
                url: route + "Pedidos/" + codigoPedido,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(server_response)
            }).done(function (server_response) {
                refreshPedidos();
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });

        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    });

    $(document).on('click', ".btnEntregar", function() { 
        let codigoPedido = parseInt(this.closest(".cardPedido").getAttribute("id"));

        $.ajax({
            url: route + "Pedidos/" + codigoPedido,
            type: "GET",
            contentType: "application/json",
        }).done(function (server_response) { 
            server_response.status = 1;

            $.ajax({
                url: route + "Pedidos/" + codigoPedido,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(server_response)
            }).done(function (server_response) { 
                refreshPedidos();
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });

        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    });
});

function formatMoney(money) {
    return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}