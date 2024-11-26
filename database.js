alasql(
  "CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nome STRING, usuario STRING, senha STRING)"
);
alasql(
  "CREATE TABLE IF NOT EXISTS clientes (id INT AUTO_INCREMENT PRIMARY KEY, nome STRING, cpf STRING UNIQUE, data_nascimento DATE, telefone STRING, celular STRING)"
);
alasql(
  "CREATE TABLE IF NOT EXISTS enderecos (id INT AUTO_INCREMENT PRIMARY KEY, cliente_id INT, cep STRING, rua STRING, bairro STRING, cidade STRING, estado STRING, pais STRING, principal BOOLEAN)"
);

function cadastrarUsuario(nome, usuario, senha) {
  console.log("Cadastrando usuário:", nome, usuario, senha);
  const usuarioExistente = alasql("SELECT * FROM usuarios WHERE usuario = ?", [
    usuario,
  ]);
  console.log("Usuário existente:", usuarioExistente);
  if (usuarioExistente.length > 0) {
    alert("Usuário já existe!");
    return false;
  }
  alasql("INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)", [
    nome,
    usuario,
    senha,
  ]);
  alert("Usuário cadastrado com sucesso!");
  return true;
}

function autenticarUsuario(usuario, senha) {
  console.log("Autenticando usuário:", usuario, senha);
  const usuarioEncontrado = alasql(
    "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?",
    [usuario, senha]
  );
  console.log("Usuário encontrado:", usuarioEncontrado);
  return usuarioEncontrado.length > 0;
}

function cadastrarCliente(nome, cpf, dataNascimento, telefone, celular) {
  console.log(
    "Cadastrando cliente:",
    nome,
    cpf,
    dataNascimento,
    telefone,
    celular
  );
  const clienteExistente = alasql("SELECT * FROM clientes WHERE cpf = ?", [
    cpf,
  ]);
  console.log("Cliente existente:", clienteExistente);
  if (clienteExistente.length > 0) {
    alert("Cliente com este CPF já está cadastrado!");
    return false;
  }
  alasql(
    "INSERT INTO clientes (nome, cpf, data_nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)",
    [nome, cpf, dataNascimento, telefone, celular]
  );
  console.log("Clientes após inserção:", alasql("SELECT * FROM clientes"));
  alert("Cliente cadastrado com sucesso!");
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
  console.log(
    "Cadastrando endereço:",
    clienteId,
    cep,
    rua,
    bairro,
    cidade,
    estado,
    pais,
    principal
  );
  if (principal) {
    alasql("UPDATE enderecos SET principal = FALSE WHERE cliente_id = ?", [
      clienteId,
    ]);
    console.log(
      "Endereços após atualização:",
      alasql("SELECT * FROM enderecos WHERE cliente_id = ?", [clienteId])
    );
  }
  alasql(
    "INSERT INTO enderecos (cliente_id, cep, rua, bairro, cidade, estado, pais, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [clienteId, cep, rua, bairro, cidade, estado, pais, principal]
  );
  console.log(
    "Endereços após inserção:",
    alasql("SELECT * FROM enderecos WHERE cliente_id = ?", [clienteId])
  );
  alert("Endereço cadastrado com sucesso!");
}

function exportarBanco() {
  const usuarios = alasql("SELECT * FROM usuarios");
  const clientes = alasql("SELECT * FROM clientes");
  const enderecos = alasql("SELECT * FROM enderecos");

  console.log("Exportando banco de dados:", { usuarios, clientes, enderecos });

  const bancoExportado = JSON.stringify(
    { usuarios, clientes, enderecos },
    null,
    2
  );

  const blob = new Blob([bancoExportado], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "banco_de_dados.json";
  a.click();

  URL.revokeObjectURL(url);
}

function carregarDoLocalStorage() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const enderecos = JSON.parse(localStorage.getItem("enderecos")) || [];

  usuarios.forEach((user) => {
    const existe = alasql("SELECT * FROM usuarios WHERE id = ?", [user.id]);
    if (existe.length === 0) {
      alasql(
        "INSERT INTO usuarios (id, nome, usuario, senha) VALUES (?, ?, ?, ?)",
        [user.id, user.nome, user.usuario, user.senha]
      );
    }
  });

  clientes.forEach((cliente) => {
    const existe = alasql("SELECT * FROM clientes WHERE id = ?", [cliente.id]);
    if (existe.length === 0) {
      alasql(
        "INSERT INTO clientes (id, nome, cpf, data_nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?, ?)",
        [
          cliente.id,
          cliente.nome,
          cliente.cpf,
          cliente.data_nascimento,
          cliente.telefone,
          cliente.celular,
        ]
      );
    }
  });

  enderecos.forEach((endereco) => {
    const existe = alasql("SELECT * FROM enderecos WHERE id = ?", [
      endereco.id,
    ]);
    if (existe.length === 0) {
      alasql(
        "INSERT INTO enderecos (id, cliente_id, cep, rua, bairro, cidade, estado, pais, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          endereco.id,
          endereco.cliente_id,
          endereco.cep,
          endereco.rua,
          endereco.bairro,
          endereco.cidade,
          endereco.estado,
          endereco.pais,
          endereco.principal,
        ]
      );
    }
  });
}
