function uploadDatabase() {
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecione um arquivo JSON.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);

      const usuariosExistentes =
        JSON.parse(localStorage.getItem("usuarios")) || [];
      const clientesExistentes =
        JSON.parse(localStorage.getItem("clientes")) || [];
      const enderecosExistentes =
        JSON.parse(localStorage.getItem("enderecos")) || [];

      const novosUsuarios = [...usuariosExistentes, ...(data.usuarios || [])];
      const novosClientes = [...clientesExistentes, ...(data.clientes || [])];
      const novosEnderecos = [
        ...enderecosExistentes,
        ...(data.enderecos || []),
      ];

      localStorage.setItem("usuarios", JSON.stringify(novosUsuarios));
      localStorage.setItem("clientes", JSON.stringify(novosClientes));
      localStorage.setItem("enderecos", JSON.stringify(novosEnderecos));

      carregarDoLocalStorage();

      alert("Banco de dados carregado e mesclado com sucesso!");
    } catch (error) {
      alert(
        "Erro ao processar o arquivo. Certifique-se de que está no formato JSON."
      );
    }
  };

  reader.onerror = function () {
    alert("Erro ao ler o arquivo. Tente novamente.");
  };

  reader.readAsText(file);
}

function toggleConfiguracoes() {
  const configuracoesDiv = document.getElementById("configuracoes");

  configuracoesDiv.style.display =
    configuracoesDiv.style.display === "none" ? "block" : "none";
}

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = usuarios.find(
      (user) => user.usuario === usuario && user.senha === senha
    );

    if (user) {
      alert("Login realizado com sucesso!");
      window.location.href = "index.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
