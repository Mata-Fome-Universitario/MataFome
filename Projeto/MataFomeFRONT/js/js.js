var route = "https://localhost:44373/api/"

$(document).ready ( function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    let saldoTexto = formatMoney(usuario.saldo);
    $("#saldo").children().text(saldoTexto);

    //AJUSTANDO NAV BAR
    if (usuario.cargo == "Gerente") {
        $("#saldo").addClass("hidden");
        $("#nav_cardapio").addClass("hidden");
        $("#nav_carrinho").addClass("hidden");
        $("#nav_pedidos").addClass("hidden");
    }
    else if (usuario.cargo == "Vendedor") {
        $("#saldo").addClass("hidden");
        $("#nav_carrinho").addClass("hidden");
        $("#nav_usuarios").addClass("hidden");
    }
    else if (usuario.cargo == "Cliente") {
        $("#nav_usuarios").addClass("hidden");
    }
    
    function formatMoney(money) {
        return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }

    $("#btn-ok-alert").click(function() {
        $("#formItem").addClass("hidden");
        $(".modalFade").addClass("hidden");
    });

    $(document).on('click', ".modalFade", function() { 
        $("#formItem").addClass("hidden");
        $(".modalFade").addClass("hidden");
    });
});