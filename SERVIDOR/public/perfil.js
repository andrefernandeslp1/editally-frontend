/* perfil.js */

window.addEventListener('DOMContentLoaded', validarToken);

function validarToken() {

  if (localStorage.getItem('token') && localStorage.getItem('email')) {
    let token = localStorage.getItem("token");
    console.log("token: ",token);
    let email = localStorage.getItem("email");
    console.log("email: ",email);

    return new Promise((resolve, reject) => {
      const data = { token: token };

      fetch('/validar-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(responseData => {
        console.log('responseX: ',responseData);
        if(responseData.email == email)
        {
          usuario = responseData;
          console.log("Token válido!");
          //window.location.href = "index.html";
          resolve();
        }
        else
        {
          console.log("Token inválido!");
          window.location.href = "login.html";
          reject();
        }
      })
      .catch(error => {
        console.error('Erro ao recuperar dados:', error);
        reject();
      });
    });
  }
}

function voltar() {
  window.location.href = "index.html";
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var nome = localStorage.getItem("nome");
  var email = localStorage.getItem("email");
  var senha = document.getElementById("senha").value;
  var novoNome = document.getElementById("novoNome").value;
  var novoEmail = document.getElementById("novoEmail").value;
  var novaSenha = document.getElementById("novaSenha").value;

  //if(novoNome != "") {localStorage.setItem("nome", novoNome);}
  //if(novoEmail != "") {localStorage.setItem("email", novoEmail);}

  fetch('/perfil', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, email, senha, novoNome, novoEmail, novaSenha })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
    } else {
      if (novoNome != "") {localStorage.setItem("nome", novoNome);}
      if (novoEmail != "") {localStorage.setItem("email", novoEmail); localStorage.setItem('token', data);}

      window.location.href = '/index.html';
    }
  })
  .catch(error => {
    console.error(error);
  });
});

function excluirConta() {
  if (confirm("Tem certeza que deseja excluir sua conta?")) {
    var senha = document.getElementById("senha").value;
    let email = localStorage.getItem("email");

    fetch('/excluir-conta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("nome");
        window.location.href = '/login.html';
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

}