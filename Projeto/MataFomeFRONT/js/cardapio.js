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

});