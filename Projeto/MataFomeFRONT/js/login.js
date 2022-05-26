var route = "https://localhost:44373/api/"

$(document).ready ( function () {

    Cookies.json = true;

    $("#loginBtn").click(function() {
        var email = $("#emailInput").val();
        var senha = $("#senhaInput").val();

        $.ajax({
            url: route + "Usuarios/" + "login?email=" + email + "&senha=" + senha,
            type: "POST",
            contentType: "application/json",
        }).done(function (server_response) {
            if(server_response == "Email incorreto!") {
                $("#alertEmail").removeClass("hidden");
                $("#alertSenha").addClass("hidden");
            }
            else if(server_response == "Senha incorreta!") {
                $("#alertSenha").removeClass("hidden");
                $("#alertEmail").addClass("hidden");
            }
            else {
                Cookies.set('usuario', JSON.stringify(server_response), { expires: 7, path: '/' });
                window.location.href = "home.html";
            }
        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    });
});