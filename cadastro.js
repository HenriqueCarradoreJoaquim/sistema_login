function salvarNoLocalStorage() {
  const usuarios = alasql("SELECT * FROM usuarios");
  const clientes = alasql("SELECT * FROM clientes");
  const enderecos = alasql("SELECT * FROM enderecos");

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("enderecos", JSON.stringify(enderecos));
}

function carregarDoLocalStorage() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const enderecos = JSON.parse(localStorage.getItem("enderecos")) || [];

  alasql(
    "CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT, nome STRING, usuario STRING, senha STRING)"
  );
  alasql(
    "CREATE TABLE IF NOT EXISTS clientes (id INT AUTO_INCREMENT, nome STRING, cpf STRING, dataNascimento STRING, telefone STRING, celular STRING)"
  );
  alasql(
    "CREATE TABLE IF NOT EXISTS enderecos (id INT AUTO_INCREMENT, clienteId INT, cep STRING, rua STRING, bairro STRING, cidade STRING, estado STRING, pais STRING, principal BOOLEAN)"
  );

  if (usuarios.length > 0) {
    usuarios.forEach((user) => {
      alasql(
        "INSERT INTO usuarios (id, nome, usuario, senha) VALUES (?, ?, ?, ?)",
        [user.id, user.nome, user.usuario, user.senha]
      );
    });
  }

  if (clientes.length > 0) {
    clientes.forEach((cliente) => {
      alasql(
        "INSERT INTO clientes (id, nome, cpf, dataNascimento, telefone, celular) VALUES (?, ?, ?, ?, ?, ?)",
        [
          cliente.id,
          cliente.nome,
          cliente.cpf,
          cliente.dataNascimento,
          cliente.telefone,
          cliente.celular,
        ]
      );
    });
  }

  if (enderecos.length > 0) {
    enderecos.forEach((endereco) => {
      alasql(
        "INSERT INTO enderecos (id, clienteId, cep, rua, bairro, cidade, estado, pais, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          endereco.id,
          endereco.clienteId,
          endereco.cep,
          endereco.rua,
          endereco.bairro,
          endereco.cidade,
          endereco.estado,
          endereco.pais,
          endereco.principal,
        ]
      );
    });
  }
}

window.onload = function () {
  carregarDoLocalStorage();
};

function getFormData() {
  return {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    dataNascimento: document.getElementById("dataNascimento").value,
    telefone: document.getElementById("telefone").value,
    celular: document.getElementById("celular").value,
    usuario: document.getElementById("usuario").value,
    senha: document.getElementById("senha").value,
    cep1: document.getElementById("cep1").value,
    rua1: document.getElementById("rua1").value,
    bairro1: document.getElementById("bairro1").value,
    cidade1: document.getElementById("cidade1").value,
    estado1: document.getElementById("estado1").value,
    pais1: document.getElementById("pais1").value,
    principal1: document.getElementById("principal1").checked,
    cep2: document.getElementById("cep2").value,
    rua2: document.getElementById("rua2").value,
    bairro2: document.getElementById("bairro2").value,
    cidade2: document.getElementById("cidade2").value,
    estado2: document.getElementById("estado2").value,
    pais2: document.getElementById("pais2").value,
    principal2: document.getElementById("principal2").checked,
  };
}

function cadastrarUsuario(nome, usuario, senha) {
  const userExists = alasql("SELECT * FROM usuarios WHERE usuario = ?", [
    usuario,
  ]);
  if (userExists.length > 0) {
    alert("Usuário já existe! Escolha outro nome de usuário.");
    return false;
  }

  alasql("INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)", [
    nome,
    usuario,
    senha,
  ]);

  return true;
}

function cadastrarCliente(nome, cpf, dataNascimento, telefone, celular) {
  const clienteExists = alasql("SELECT * FROM clientes WHERE cpf = ?", [cpf]);
  if (clienteExists.length > 0) {
    alert("Cliente já cadastrado com este CPF!");
    return false;
  }

  alasql(
    "INSERT INTO clientes (nome, cpf, dataNascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)",
    [nome, cpf, dataNascimento, telefone, celular]
  );

  return true;
}

function cadastrarEndereco(
  clienteId,
  cep,
  rua,
  bairro,
  cidade,
  estado,
  pais,
  principal
) {
  alasql(
    "INSERT INTO enderecos (clienteId, cep, rua, bairro, cidade, estado, pais, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [clienteId, cep, rua, bairro, cidade, estado, pais, principal]
  );
}

document
  .getElementById("cadastroForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = getFormData();

    if (cadastrarUsuario(formData.nome, formData.usuario, formData.senha)) {
      if (
        cadastrarCliente(
          formData.nome,
          formData.cpf,
          formData.dataNascimento,
          formData.telefone,
          formData.celular
        )
      ) {
        const clienteId = alasql("SELECT id FROM clientes WHERE cpf = ?", [
          formData.cpf,
        ])[0].id;

        cadastrarEndereco(
          clienteId,
          formData.cep1,
          formData.rua1,
          formData.bairro1,
          formData.cidade1,
          formData.estado1,
          formData.pais1,
          formData.principal1
        );

        cadastrarEndereco(
          clienteId,
          formData.cep2,
          formData.rua2,
          formData.bairro2,
          formData.cidade2,
          formData.estado2,
          formData.pais2,
          formData.principal2
        );

        salvarNoLocalStorage();

        console.log("Usuários:", alasql("SELECT * FROM usuarios"));
        console.log("Clientes:", alasql("SELECT * FROM clientes"));
        console.log("Endereços:", alasql("SELECT * FROM enderecos"));

        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      }
    }
  });
