Cookies.json = true;

$(document).ready ( function () {
    var usuario = JSON.parse(Cookies.get('usuario'));
    var saldoTexto = "R$" + usuario.saldo;
    $("#saldo").children().text(saldoTexto);
});