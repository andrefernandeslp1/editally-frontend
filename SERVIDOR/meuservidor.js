const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');
const jwt = require('jsonwebtoken');

// Caminhos para os arquivos de dados
const DATA_FILE_PATH_USERS = path.join(__dirname, 'users.json');
const DATA_FILE_PATH_USERS_DATA = path.join(__dirname, 'usersData.json');

// Chave secreta usada para assinar e verificar os tokens JWT
const SECRET_KEY = 'your-secret-key';

// Variáveis para armazenar os usuários e dados dos usuários
//let users = [{ nome: 'andre', email: 'andre@gmail.com', senha: '123456'}];
//let usersData = [{ nome: 'andre', email: 'andre@gmail.com', editalCorrente: '', editais: []}];
let users = [];
let usersData = [];

// Função para carregar os dados dos arquivos JSON
function loadJsonData(filePath, array) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(array));
  } else {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const existingData = JSON.parse(fileData);
      array.push(...existingData);
      //array = existingData;
    } catch (err) {
      console.error('Erro ao ler o arquivo JSON', err);
    }
  }
}

function saveJsonData(filePath, array) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(array));
  } catch (err) {
    console.error('Erro ao gravar o arquivo JSON', err);
  }
}

loadJsonData(DATA_FILE_PATH_USERS, users);
loadJsonData(DATA_FILE_PATH_USERS_DATA, usersData);
console.log("users: ",users);//!
console.log("usersData: ",usersData);//!

//! SERVIDOR COMEÇA AQUI
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const filePath = `./public${pathname}`;

  // Função para carregar uma página
  const loadPage = (pageName) => {
    fs.readFile(path.join(__dirname, 'public', pageName), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  };

  // Função para retornar um arquivo JSON
  const returnJSON = (data) => {
    console.log(JSON.stringify(data));//!
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Função para retornar um arquivo HTML/JS/CSS
  const returnFile = (filePath) => {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor');
      } else {
        const getContentType = (filePath) => {
          const extname = path.extname(filePath);
          if (extname === '.js') {
            return 'text/javascript';
          } else if (extname === '.css') {
            return 'text/css';
          } else if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.ico') {
            return 'image/png';

          } else {
            return 'text/html';
          }
        };
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        res.end(content);
      }
    });
  };

  // Função para processar o login
  const processLogin = (formData) => {
    const { email, senha } = formData;

    console.log("users: ",users);//!
    console.log("email: ",email,"\nsenha: ",senha);//!

    const user = users.find((user) => user.email === email && user.senha === senha);

    if (user) {
      //todo: GERAR TOKEN JWT
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
      console.log("token: ",token);//!
      returnJSON(token);
    } else {
      returnJSON({ error: 'Email ou senha inválidos' });
    }
  };

  // Função para processar o cadastro
  const processCadastro = (formData) => {
    const { nome, email, senha } = formData;

    console.log(users);//!

    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      returnJSON({ error: 'Email já cadastrado' });
    } else {
      // Cria um novo usuário
      const newUser = {
        nome,
        email,
        senha,
        // outros dados do usuário
      };
      const newUserData = {
        nome,
        email,
        editalCorrente: '',
        editais: [],
        // outros dados do usuário
      };

      users.push(newUser);
      usersData.push(newUserData);

      //! Salvar os dados no arquivo JSON
      try {
        fs.writeFileSync(DATA_FILE_PATH_USERS, JSON.stringify(users));
        fs.writeFileSync(DATA_FILE_PATH_USERS_DATA, JSON.stringify(usersData));
      } catch (err) {
        console.error('Erro ao gravar o arquivo JSON', err);
      }

      //todo: GERAR TOKEN JWT
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
      console.log("token: ",token);//!
      returnJSON(token);
    }
  };

  // Função para processar a atualização de perfil
  const processPerfil = (formData) => {
    const { nome, email, senha, novoNome, novoEmail, novaSenha } = formData;

    const user = users.find((user) => user.email === email && user.senha === senha);
    const userData = usersData.find((userData) => userData.email === email);

    if (user) {
      //const userData = usersData.find((userData) => userData.email === email);
      const vefificaUser = users.find((vefificaUser) => vefificaUser.email === novoEmail);

      if (vefificaUser) {
        returnJSON({ error: 'Email já cadastrado' });
      }
      else {
        if(novoNome != ''){user.nome = novoNome; userData.nome = novoNome;}
        if(novaSenha != ''){user.senha = novaSenha}
        if(novoEmail != ''){user.email = novoEmail; userData.email = novoEmail;}

        console.log("user.email: ",user.email);//!
        console.log("userData.email: ",userData.email);//!
        console.log("novoEmail: ",novoEmail);//!

        //! Salve os dados no arquivo JSON
        try {
          saveJsonData(DATA_FILE_PATH_USERS, users);
          saveJsonData(DATA_FILE_PATH_USERS_DATA, usersData);
        } catch (err) {
          console.error('Erro ao gravar o arquivo JSON', err);
        }
        console.log("users: ",users);//!
        console.log("usersData: ",usersData);//!
        const token = jwt.sign({ email : user.email }, SECRET_KEY, { expiresIn: '1h' });
        console.log("token: ",token);//!
        returnJSON(token);
      }
    } else {
      returnJSON({ error: 'Email ou senha inválidos' });
    }
  };

  // Função para processar a gravação de dados
  const processGravarDados = (formData) => {
    const { email } = formData;

    const userData = usersData.find((userData) => userData.email === email);

    if (userData) {
      // Atualiza os dados do usuário
      //userData = formData;
      //userData.email = email;
      userData.editalCorrente = formData.editalCorrente;
      userData.editais = formData.editais;
      saveJsonData(DATA_FILE_PATH_USERS_DATA, usersData);

      console.log("formData em processGravarDados: ", formData);//!
      console.log("userData em processGravarDados: ", userData);//!
      returnJSON({ message: 'Dados gravados com sucesso' });
    } else {
      returnJSON({ error: 'Email não cadastrado' });
    }
  };
  //TODO: OK!!
  // Função para processar a recuperação de dados
  const processRecuperarDados = (formData) => {
    const { email } = formData;
    console.log("email em processRecuperarDados: ", email);//!
    const user = users.find((user) => user.email === email);
    console.log("user em processRecuperarDados: ", user);//!
    if (user){

      const userData = usersData.find((userData) => userData.email === email);

      returnJSON(userData);

    } else {
      returnJSON({ error: 'Email não cadastrado' });
    }
  };

  const processarValidacao = (formData) => {
    //loadJsonData(DATA_FILE_PATH_USERS_DATA, usersData);
    const fileData = fs.readFileSync(DATA_FILE_PATH_USERS_DATA, 'utf8');
    usersData = JSON.parse(fileData);

    console.log("usersData em processarValidacao: ", usersData);//!
    const { token } = formData;
    console.log("token em processarValidacao: ", token);//!
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("err em processarValidacao: ", err);//!
        returnJSON({ error: 'Token inválido' });
      } else {
        console.log("decoded em processarValidacao: ", decoded);//!
        const userData = usersData.find((userData) => userData.email === decoded.email);
        console.log("userData1: ",userData);//!
        returnJSON(userData);
        //returnJSON({ message: 'Token válido' });
      }
    });
  };

  if (req.method === 'GET') {
    const PATHS = {
      HOME: '/',
      INDEX: '/index.html',
      LOGIN: '/login.html',
      CADASTRO: '/cadastro.html',
      PROFILE: '/perfil.html',
    }

    if (pathname === PATHS.HOME) {

      loadPage('login.html');
    } else if (pathname === PATHS.INDEX) {

      loadPage('index.html');
    } else if (pathname === PATHS.LOGIN) {

      loadPage('login.html');
    } else if (pathname === PATHS.CADASTRO) {

      loadPage('cadastro.html');
    } else if (pathname === PATHS.PROFILE) {

      loadPage('perfil.html');
    } else {
      console.log(filePath);
      returnFile(filePath);
    }

  } else if (req.method === 'POST') {
    if (pathname === '/login') {
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk;
      });

      req.on('end', () => {
        const parsedFormData = JSON.parse(formData);
        console.log("parsedFormData: ",parsedFormData);//!
        processLogin(parsedFormData);
      });
    } else if (pathname === '/cadastro') {
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk;
      });

      req.on('end', () => {
        const parsedFormData = JSON.parse(formData);
        processCadastro(parsedFormData);
      });
    } else if (pathname === '/perfil') {
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk;
      });

      req.on('end', () => {
        const parsedFormData = JSON.parse(formData);
        processPerfil(parsedFormData);
      });
    } else if (pathname === '/gravar-dados') {
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk;
      });

      req.on('end', () => {
        const parsedFormData = JSON.parse(formData);
        processGravarDados(parsedFormData);
      });
    } else if (pathname === '/recuperar-dados') {
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk.toString();
      });

      req.on('end', () => {
        const parsedFormData = JSON.parse(formData);
        processRecuperarDados(parsedFormData);
      });
    } else if (pathname === '/validar-token'){
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk.toString();
      });

      req.on('end', () => {
        console.log("formData: ",formData);//!
        const parsedFormData = JSON.parse(formData);
        processarValidacao(parsedFormData);

      });

    } else if (pathname === '/excluir-conta'){
      let formData = '';

      req.on('data', (chunk) => {
        formData += chunk.toString();
      });

      req.on('end', () => {
        console.log("formData: ",formData);//!
        const parsedFormData = JSON.parse(formData);
        const { email, senha } = parsedFormData;
        const user = users.find((user) => user.email === email && user.senha === senha);
        const userData = usersData.find((userData) => userData.email === email);
        if (user) {
          users.splice(users.indexOf(user), 1);
          usersData.splice(usersData.indexOf(userData), 1);
          saveJsonData(DATA_FILE_PATH_USERS, users);
          saveJsonData(DATA_FILE_PATH_USERS_DATA, usersData);
          returnJSON({ message: 'Conta excluída com sucesso' });
        } else {
          returnJSON({ error: 'Senha inválida!' });
        }
      });

    } else {
      res.writeHead(404);
      res.end('Endpoint não encontrado');
    }
  } else {
    res.writeHead(405);
    res.end('Método não permitido');
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
