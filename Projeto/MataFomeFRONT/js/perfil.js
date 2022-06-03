var route = "https://localhost:44373/api/"

$(document).ready ( function () {
    let usuario = JSON.parse(window.localStorage.getItem('usuario'));
    if (usuario.cargo != "Vendedor") {
        $("#nav_recarga").addClass("hidden");
    }
    
    $("#perfil_title").text(usuario.nome);
    $("#perfil_cargo").text(usuario.cargo);
    $("#perfil_CPF").text(formatCPF(usuario.cpf));
    $("#perfil_nome").text(usuario.nome);
    $("#perfil_email").text(usuario.email);
        

    function formatCPF(text) {
        const badchars = /[^\d]/g
        const mask = /(\d{3})(\d{3})(\d{3})(\d{2})/
        const cpf = new String(text).replace(badchars, "");
        return cpf.replace(mask, "$1.$2.$3-$4");
    }

    function unformatCPF(cpf) {
        let aux = cpf.split('.');
        let cpfNumber = aux[0] + aux[1];
        aux = aux[2].split('-');
        cpfNumber += aux[0] + aux[1];
        return cpfNumber;
    }
});