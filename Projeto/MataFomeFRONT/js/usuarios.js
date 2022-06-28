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
        $.ajax({
            url: route + "Usuarios",
            type: "GET",
            contentType: "application/json",
        }).done(function (server_response) {
            server_response.forEach(element => {
                if (element.cargo != "Cliente") {
                    let trClone = $("#trClone").clone()
                    trClone.find(".trCPF").html(formatCPF(element.cpf))
                    trClone.find(".trNome").html(element.nome)
                    trClone.find(".trEmail").html(element.email)
                    trClone.find(".trCargo").html(element.cargo)
                    trClone.removeAttr('id')
                    $("#tableHead").after(trClone)
                }
            });
        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    }

    $("#addUser").click(function() {
        $(".textAlert").addClass("hidden");
        $("#divNewUser").removeClass("hidden")
        $("#divOldUser").addClass("hidden")
        $("#inputEmail").val("")
        $("#inputNome").val("")
        $("#inputCPF").val("")
    })

    $(document).on('click', ".editBtn", (function() { 
        $(".textAlert").addClass("hidden");
        $("#divNewUser").addClass("hidden")
        $("#divOldUser").removeClass("hidden")

        let tr = this.closest(".trCloneClass");
        let cpf = tr.getElementsByClassName("trCPF")[0].innerHTML
        let nome = tr.getElementsByClassName("trNome")[0].innerHTML
        let email = tr.getElementsByClassName("trEmail")[0].innerHTML
        let cargo = tr.getElementsByClassName("trCargo")[0].innerHTML

        $("#inputEmail").val(email)
        $("#inputNome").val(nome)
        $("#inputCPF").val(cpf)
        $("#selectCargo").val(cargo)
        $("#saveOldUser").attr('userid', unformatCPF(cpf))
    }))

    $(document).on('click', ".deleteBtn", (function() { 
        let tr = this.closest(".trCloneClass");
        let nome = tr.getElementsByClassName("trNome")[0].innerHTML
        let cpf = tr.getElementsByClassName("trCPF")[0].innerHTML
        $("#userName").html(nome)
        $("#userName").attr('userid', unformatCPF(cpf))
    }))

    $("#saveNewUser").click(function() {
        if (validaCadastro()) {

            let usuario = {
                cpf: unformatCPF($("#inputCPF").val()),
                nome: $("#inputNome").val(),
                email: $("#inputEmail").val(),
                senha: "matafome@123",
                cargo: $("#selectCargo").val(),
                saldo: 0
            }

            $.ajax({
                url: route + "Usuarios",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(usuario)
            }).done(function (server_response) {
                if(server_response == "Já existe um usuário cadastrado com esse CPF") {
                    $("#alertPerfilCPFExist").removeClass("hidden");
                }
                else if(server_response == "Já existe um usuário cadastrado com esse Email") {
                    $("#alertPerfilEmailExist").removeClass("hidden");
                }
                else {
                    window.location.href = "usuarios.html";
                }
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        }
    })

    $("#saveOldUser").click(function() {
        if (validaCadastro()) {

            let usuario = {
                cpf: unformatCPF($("#inputCPF").val()),
                nome: $("#inputNome").val(),
                email: $("#inputEmail").val(),
                senha: "matafome@123",
                cargo: $("#selectCargo").val(),
                saldo: 0
            }

            $.ajax({
                url: route + "Usuarios/" + $("#saveOldUser").attr('userid'),
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(usuario)
            }).done(function (server_response) {
                if(server_response == "Já existe um usuário cadastrado com esse CPF") {
                    $("#alertPerfilCPFExist").removeClass("hidden");
                }
                else if(server_response == "Já existe um usuário cadastrado com esse Email") {
                    $("#alertPerfilEmailExist").removeClass("hidden");
                }
                else {
                    window.location.href = "usuarios.html";
                }
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        }
    })

    $("#confirmDeleteUser").click(function() {
        $.ajax({
            url: route + "Usuarios/" + $("#userName").attr('userid'),
            type: "DELETE",
            contentType: "application/json",
        }).done(function (server_response) {
            window.location.href = "usuarios.html"
        }).fail(function (server_response) {
            console.error("Falha de comunicação com o servidor", server_response);
        });
    })
});

function formatCPF(text) {
    const badchars = /[^\d]/g
    const mask = /(\d{3})(\d{3})(\d{3})(\d{2})/
    const cpf = new String(text).replace(badchars, "");
    return cpf.replace(mask, "$1.$2.$3-$4");
}

function mascara_cpf() {
    let cpf = $("#inputCPF").val()

    if (cpf.length == 3 || cpf.length == 7)
        cpf += "."
    else if (cpf.length == 11)
        cpf += "-"
    
    $("#inputCPF").val(cpf)
}

function unformatCPF(cpf) {
    let aux = cpf.split('.');
    let cpfNumber = aux[0] + aux[1];
    aux = aux[2].split('-');
    cpfNumber += aux[0] + aux[1];
    return cpfNumber;
}

function validaCadastro() {
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

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}