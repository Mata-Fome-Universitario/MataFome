var route = "https://localhost:44373/api/"

$(document).ready ( function () {

    $("#btnCadastrar").click(function() {
        if (validaCadastro()) {
            let usuario = {
                cpf: unformatCPF($("#cadastroCpf").val()),
                nome: $("#cadastroNome").val(),
                email: $("#cadastroEmail").val(),
                senha: $("#cadastroConfirmarSenha").val(),
                cargo: "Cliente",
                saldo: 0
            }

            $.ajax({
                url: route + "Usuarios",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(usuario)
            }).done(function (server_response) {
                if(server_response == "Já existe um usuário cadastrado com esse CPF") {
                    $("#alertCadastroCPFExists").removeClass("hidden");
                }
                else if(server_response == "Já existe um usuário cadastrado com esse Email") {
                    $("#alertCadastroEmailExists").removeClass("hidden");
                }
                else {
                    window.location.href = "login.html";
                }
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        }
    });

    function validaCadastro() {
        let valid = true;
        if (validaCpf($("#cadastroCpf").val())) {
            $("#cadastroAlertCPF").addClass("hidden");
        }
        else {
            $("#cadastroAlertCPF").removeClass("hidden");
            valid = false;
        }

        if (validateEmail($("#cadastroEmail").val())) {
            $("#cadastroAlertEmail").addClass("hidden");
        }
        else {
            $("#cadastroAlertEmail").removeClass("hidden");
            valid = false;
        }

        if ($("#cadastroNome").val() == "") {
            $("#cadastroAlertNome").removeClass("hidden");
            valid = false;
        }
        else {
            $("#cadastroAlertNome").addClass("hidden");
        }

        if ($("#cadastroSenha").val().length < 5 || $("#cadastroSenha").val().length > 12) {
            $("#cadastroAlertSenha").removeClass("hidden");
            valid = false;
        }
        else {
            $("#cadastroAlertSenha").addClass("hidden");
        }
            
        if ($("#cadastroSenha").val() != $("#cadastroConfirmarSenha").val()) {
            $("#cadastroAlertConfirmarSenha").removeClass("hidden");
            valid = false;
        }
        else {
            $("#cadastroAlertConfirmarSenha").addClass("hidden");
        }

        return valid;
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

});

function mascara_cpf() {
    let cpf = $("#cadastroCpf").val()

    if (cpf.length == 3 || cpf.length == 7)
        cpf += "."
    else if (cpf.length == 11)
        cpf += "-"
    
    $("#cadastroCpf").val(cpf)
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
