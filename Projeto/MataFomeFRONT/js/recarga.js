var route = "https://localhost:44373/api/"

function mascara_cpf() {
    let cpf = $("#inputRecargaCPF").val()

    if (cpf.length == 3 || cpf.length == 7)
        cpf += "."
    else if (cpf.length == 11)
        cpf += "-"
    
    $("#inputRecargaCPF").val(cpf)
}
$(document).ready(function() {
    $("#saldoAdicional").maskMoney();

    $("#btnSearchCPF").click(function() {
        $("#saldoAdicional").val(0)
        $("#alertRecargaCPFDontExist").addClass("hidden")
        $("#alertRecargaCPFCliente").addClass("hidden")
        $("#alertSaldoZerado").addClass("hidden")
        if ($("#inputRecargaCPF").val() == "") {
            $("#alertRecargaCPFEmpty").removeClass("hidden");
        }
        else {
            $("#alertRecargaCPFEmpty").addClass("hidden");
            if (validaCpf($("#inputRecargaCPF").val())) {
                $("#alertRecargaCPFInvalid").addClass("hidden");
                $.ajax({
                    url: route + "Usuarios/" + unformatCPF($("#inputRecargaCPF").val()),
                    type: "GET",
                    contentType: "application/json",
                }).done(function (server_response) {
                    if(server_response == "Usuário não encontrado") {
                        $("#alertRecargaCPFDontExist").removeClass("hidden")
                    }
                    else {
                        if(server_response.cargo != "Cliente") {
                            $("#alertRecargaCPFCliente").removeClass("hidden")
                        }
                        else {
                            $("#titleNomeUsuario").text(server_response.nome)
                            $("#recarga_cpf").html(formatCPF(server_response.cpf))
                            $("#recarga_nome").text(server_response.nome)
                            $("#recarga_email").text(server_response.email)
                            $("#saldoAtualUser").text(formatMoney(server_response.saldo))
                            $("#addSaldoModal").removeClass("hidden")
                        }
                    }
                }).fail(function (server_response) {
                    console.error("Falha de comunicação com o servidor", server_response);
                });
            }
            else {
                $("#alertRecargaCPFInvalid").removeClass("hidden");
            }
        }
    })

    $("#btnCancelAddSaldo").click(function() {
        $("#addSaldoModal").addClass("hidden")
    })

    $("#btnAddSaldo").click(function() {
        let valRecarga = parseMoneyToDouble($("#saldoAdicional").val(), false)
        if ($("#saldoAdicional") <= 0) {
            $("#alertSaldoZerado").removeClass("hidden")
        } else {
            $("#alertSaldoZerado").addClass("hidden")
            let newUser = {
                cargo: "Cliente",
                cpf: unformatCPF($("#recarga_cpf").text()),
                email: $("#recarga_email").text(),
                nome: $("#recarga_nome").text(),
                saldo: (parseMoneyToDouble($("#saldoAtualUser").text(), true) + valRecarga)
            }

            $.ajax({
                url: route + "Usuarios/" + newUser.cpf,
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
                    $("#addSaldoModal").addClass("hidden")
                }
            }).fail(function (server_response) {
                console.error("Falha de comunicação com o servidor", server_response);
            });
        }
    })
})

function validaCpf(cpf) {
    if (cpf == null || cpf == "" || cpf.length != 14)
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

function formatCPF(text) {
    const badchars = /[^\d]/g
    const mask = /(\d{3})(\d{3})(\d{3})(\d{2})/
    const cpf = new String(text).replace(badchars, "");
    return cpf.replace(mask, "$1.$2.$3-$4");
}

function formatMoney(money) {
    return money.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

function parseMoneyToDouble(money, BRFormat) {
    let moneyWithoutReais = money.replace('R$', '');
    let moneyWithoutSpace = moneyWithoutReais.replace(' ', '');
    let moneyWithoutSpecialCaracteres = moneyWithoutSpace.replace('&nbsp;', '');

    let moneyWithoutSeparator = "";
    if (BRFormat) {
        moneyWithoutSeparator = moneyWithoutSpecialCaracteres.replace('.', '');
        moneyWithoutSeparator = moneyWithoutSeparator.replace(',', '.');
    }
    else {
        moneyWithoutSeparator = moneyWithoutSpecialCaracteres.replace(',', '');
    }
    if (moneyWithoutSeparator == "") {
        return parseFloat(0);
    }
    return parseFloat(moneyWithoutSeparator);
}