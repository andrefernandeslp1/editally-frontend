/* cadastro.js */

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  fetch('/cadastro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, email, senha })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error == 'Email já cadastrado') {
      alert('Email já cadastrado');
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