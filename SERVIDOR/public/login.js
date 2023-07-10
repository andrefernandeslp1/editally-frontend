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
          window.location.href = "index.html";
          resolve();
        }
        else
        {
          console.log("Token inválido!");
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

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, senha })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error == 'Email ou senha inválidos') {
      alert('Credenciais inválidas');
    } else {

      // Salvar o token no armazenamento local
      localStorage.setItem('token', data);
      localStorage.setItem('email', email);

      // Redirecionar para a página principal
      window.location.href = '/index.html';
    }
  })
  .catch(error => {
    console.error(error);
  });
});

function validar() {
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;

  if (email == "" || senha == "") {
    alert("Preencha todos os campos!");
    return false;
  }
}

//prompt para recuperar senha
function recuperarSenha() {
  let emailRecuperar = prompt("Digite seu email para recuperar a senha:");
  if (emailRecuperar != null && emailRecuperar != "") {
    //enviar emailRecuperar para servidor com email digitado
  }
}