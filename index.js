document.addEventListener("DOMContentLoaded", () => {
  carregarDoLocalStorage();

  console.log("Usuários carregados:", alasql("SELECT * FROM usuarios"));
  console.log("Clientes carregados:", alasql("SELECT * FROM clientes"));
  console.log("Endereços carregados:", alasql("SELECT * FROM enderecos"));

  const exportarButton = document.getElementById("exportarButton");
  if (exportarButton) {
    exportarButton.addEventListener("click", exportarBanco);
  }

  const btnSair = document.getElementById("btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  }
});

function exportarBanco() {
  try {
    const usuarios = alasql("SELECT * FROM usuarios");
    const clientes = alasql("SELECT * FROM clientes");
    const enderecos = alasql("SELECT * FROM enderecos");

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

    console.log("Banco de dados exportado com sucesso!");
  } catch (error) {
    console.error("Erro ao exportar o banco de dados:", error);
    alert(
      "Ocorreu um erro ao exportar o banco de dados. Confira o console para mais detalhes."
    );
  }
}
