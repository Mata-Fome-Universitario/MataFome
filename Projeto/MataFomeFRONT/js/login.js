var route = "https://localhost:44373/api/"

$(document).ready ( function () {

    $("#loginBtn").click(function() {
        var email = $("#emailInput").val();
        var senha = $("#senhaInput").val();

        $.ajax({
            url: route + "login?email=" + email + "&senha=" + senha,
            type: "POST",
            contentType: "application/json",
        }).done(function (server_response) {
            console.log(server_response);
        }).fail(function (server_response) {
            console.error("Falha ao realizar login", server_response);
        });
    });
});