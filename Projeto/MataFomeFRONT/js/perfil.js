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

    $("#editarPerfilBtn").click(function() {
        $("#inputNome").val(usuario.nome);
        $("#inputEmail").val(usuario.email);
        $("#inputCPF").val(formatCPF(usuario.cpf));

        $(".textAlert").addClass("hidden");
    });

    $("#changePasswordBtn").click(function() {
        $("#inputOldPassword").val("");
        $("#inputNewPassword").val("");
        $("#inputNewPasswordConfirm").val("");

        $(".textAlert").addClass("hidden");
    });

    $("#saveUserUpdate").click(function(){
        if (validaEdit()) {

            let newUser = {
                cargo: usuario.cargo,
                cpf: unformatCPF($("#inputCPF").val()),
                email: $("#inputEmail").val(),
                nome: $("#inputNome").val(),
            }

            $.ajax({
                url: route + "Usuarios/" + usuario.cpf,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(newUser)
            }).done(function (server_response) {
                if(server_response == "Já existe um usuário cadastrado com esse CPF") {
                    $("#alertPerfilCPFExist").removeClass("hidden");
                }
                else if(server_response == "Já existe um usuário cadastrado com esse Email") {
                    $("#alertPerfilEmailExist").removeClass("hidden");
                }
                else {
                    window.localStorage.setItem('usuario', JSON.stringify(server_response));
                    window.location.href = "perfil.html";
                }
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        }
    });

    $("#saveChangePassword").click(function() {
        if (validaChangePassword()) {
            $.ajax({
                url: route + "Usuarios/changePassword?cpf=" + usuario.cpf + "&oldPassword=" + $("#inputOldPassword").val() + "&newPassword=" + $("#inputNewPasswordConfirm").val(),
                type: "POST",
                contentType: "application/json",
            }).done(function (server_response) {
                if(server_response == "Senha incorreta") {
                    $("#alertPerfilOldPassword").removeClass("hidden");
                }
                else {
                    window.location.href = "perfil.html";
                }
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        }
    });
});

function mascara_cpf() {
    let cpf = $("#inputCPF").val()

    if (cpf.length == 3 || cpf.length == 7)
        cpf += "."
    else if (cpf.length == 11)
        cpf += "-"
    
    $("#inputCPF").val(cpf)
}

function validaEdit() {
    let valid = true;
    $(".textAlert").addClass("hidden");
    if ($("#inputNome").val() == "") {
        $("#alertPerfilNome").removeClass("hidden");
        valid = false;
    }
    else {
        $("#alertPerfilNome").addClass("hidden");
    }

    if ($("#inputEmail").val() == "") {
        $("#alertPerfilEmailEmpty").removeClass("hidden");
        valid = false;
    }
    else {
        $("#alertPerfilEmailEmpty").addClass("hidden");
        if (validateEmail($("#inputEmail").val())) {
            $("#alertPerfilEmailInvalid").addClass("hidden");
        }
        else {
            $("#alertPerfilEmailInvalid").removeClass("hidden");
            valid = false;
        }
    }

    if ($("#inputCPF").val() == "") {
        $("#alertPerfilCPFEmpty").removeClass("hidden");
        valid = false;
    }
    else {
        $("#alertPerfilCPFEmpty").addClass("hidden");
        if (validaCpf($("#inputCPF").val())) {
            $("#alertPerfilCPFInvalid").addClass("hidden");
        }
        else {
            $("#alertPerfilCPFInvalid").removeClass("hidden");
            valid = false;
        }
    }

    return valid;
}

function validaChangePassword() {
    let valid = true;

    if ($("#inputOldPassword").val() == "") {
        $("#alertPerfilOldPassword").removeClass("hidden");
        valid = false;
    }
    else {
        $("#alertPerfilOldPassword").addClass("hidden");
    }

    if ($("#inputNewPassword").val() == "") {
        $("#alertPerfilNewPassword").removeClass("hidden");
        valid = false;
    }
    else {
        $("#alertPerfilNewPassword").addClass("hidden");
    }

    if ($("#inputNewPasswordConfirm").val() != $("#inputNewPassword").val()) {
        $("#alertPerfilNewPasswordConfirm").removeClass("hidden");
        valid = false;
    }
    else {
        $("#alertPerfilNewPasswordConfirm").addClass("hidden");
    }

    return valid;
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validaCpf(cpf) {
    if (cpf == null || cpf == "")
        return false;
    cpf = unformatCPF(cpf)
    var Soma;
    var Resto;
    Soma = 0;
    if (cpf == "00000000000") return false;
    
    for (i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(cpf.substring(9, 10)) ) return false;
    
    Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(cpf.substring(10, 11) ) ) return false;
        return true;
}

function unformatCPF(cpf) {
    let aux = cpf.split('.');
    let cpfNumber = aux[0] + aux[1];
    aux = aux[2].split('-');
    cpfNumber += aux[0] + aux[1];
    return cpfNumber;
}