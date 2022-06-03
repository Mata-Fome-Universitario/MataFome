var route = "https://localhost:44373/api/"

$(document).ready ( function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    if (usuario.cargo == "Cliente") {
        window.location.href = "cardapio.html";
    }
    else if (usuario.cargo == "Vendedor") {
        window.location.href = "cardapio.html";
    }
    else if (usuario.cargo == "Gerente") {
        
    }

});