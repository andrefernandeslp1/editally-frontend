/* index.js */

function exportarExcel() {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let edital = usuario.editais[indexEdital];
  let auxMateriaCorrente = edital.materiaCorrente;
  if(edital.materias.length > 0){

    edital.materiaCorrente = edital.materias[0].nome;

  }
  // transformar objeto usuario em documento excell
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(edital.info_importantes.topics);
  ws['!cols'] = [];
  ws['!cols'][0] = { width: 50 };
  ws['!cols'][1] = { width: 15 };
  ws['!cols'][2] = { width: 15 };
  XLSX.utils.book_append_sheet(wb, ws, "info_importantes");
  if(edital.materias.length > 0){
    edital.materias.forEach(function(materia) {
      let ws = XLSX.utils.json_to_sheet(materia.topics);
      ws['!cols'] = [];
      ws['!cols'][0] = { width: 100 };
      ws['!cols'][1] = { width: 15 };
      ws['!cols'][2] = { width: 15 };
      if(materia.nome.length > 30) {
        //eliminar caracteres após o 30º caractere
        let materiaAux = materia.nome;
        materia.nome = materia.nome.substring(0,30);
        XLSX.utils.book_append_sheet(wb, ws, materia.nome);
        materia.nome = materiaAux;
      }
      else {
        XLSX.utils.book_append_sheet(wb, ws, materia.nome);
      }
    });
  }

  XLSX.writeFile(wb, edital.nome + ".xlsx");

  if(edital.materias.length > 0){

    edital.materiaCorrente = auxMateriaCorrente;

  }
}

function verificarLocalStorage() {
  if (!localStorage.getItem('token') || !localStorage.getItem('email')) {
    window.location.href = '/login.html';
  }
}

function deslogar() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  usuario = {};
  window.location.href = "login.html";
}

function enviarDadosAoServidor(){
  return new Promise((resolve, reject) => {
    sortEditaisEMaterias();
    const data = usuario;
    console.log("data: ",data);

    fetch('/gravar-dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Dados gravados com sucesso:', result);
      resolve();
    })
    .catch(error => {
      console.error('Erro ao gravar dados:', error);
      reject();
    });
  });
}

function recuperarDados(){
  return new Promise((resolve, reject) => {
    const data = { email: usuario.email };

    fetch('/recuperar-dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
      console.log("usuario: ",usuario);
      console.log('response: ',responseData);
      usuario = responseData;
      console.log("usuario depois: ",usuario);
      resolve();
    })
    .catch(error => {
      console.error('Erro ao recuperar dados:', error);
      reject();
    });
  });
}

//TODO: função para fazer download de arquivo json SEM SOBRESCRITA
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  //document.body.appendChild(element);
  element.click();
  //document.body.removeChild(element);
}

function validarToken() {

  verificarLocalStorage();

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
        localStorage.setItem('nome', usuario.nome);
        console.log("Token válido!");
        resolve();
      }
      else
      {
        alert("Token inválido!");
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

//window.addEventListener('DOMContentLoaded', validarToken());

window.onload = function() {
  //verificarLocalStorage();

  validarToken().then(() => {

    recuperarDados().then(() => {

      imprimirUsuarioNoCosole();
      console.log(usuario);
      document.getElementById("nome-usuario").innerHTML = "Olá, " + usuario.nome + ".";

      reloadButtonsEditais();
    });
  });
};

function processReloadButtonsEditais() {
  validarToken().then(() => {
    recuperarDados().then(() => {
      reloadButtonsEditais();
    });
  });
}

function reloadButtonsEditais() {
  let editais = usuario.editais;
  //APAGAR BOTÕES DOS EDITAIS
  document.getElementById("nav-editais").innerHTML = "";
  //EXIBE BOTÃO IMPORTAR EDITAL
  let buttonImportar = document.createElement('div');
  buttonImportar.innerHTML = "Importar Edital";
  //button.setAttribute("id", "button-edital");
  buttonImportar.setAttribute("class","button-add");
  buttonImportar.setAttribute("onclick", "importarEdital()");
  document.getElementById("nav-editais").appendChild(buttonImportar);

  //EXIBE BOTÃO ADICIONAR EDITAL
  let button = document.createElement('div');
  button.innerHTML = "Novo Edital";
  //button.setAttribute("id", "button-edital");
  button.setAttribute("class","button-add");
  button.setAttribute("onclick", "criarEdital()");
  document.getElementById("nav-editais").appendChild(button);
  //EXIBE BOTÕES DOS EDITAIS
  if(editais.length > 0) {
    editais.forEach(function(edital) {
      //console.log(edital.nome);
      let button = document.createElement('div');
      button.innerHTML = edital.nome;
      button.setAttribute("id", "btn-edital-" + edital.nome);
      //button.setAttribute("id", edital.nome);
      button.setAttribute("class","button-edital");
      button.setAttribute("onclick", "mostrarEdital('"+ edital.nome +"')");
      document.getElementById("nav-editais").appendChild(button);
    });
    let indexEdital = getIndexEdital(usuario.editalCorrente);
    mostrarEdital(editais[indexEdital].nome);
  }
  else {
    let ContainerEdital = document.getElementById("container-edital");
    ContainerEdital.setAttribute("style","display:none");
  }
}

function processReloadButtonsMaterias() {
  validarToken().then(() => {
    recuperarDados().then(() => {
      reloadButtonsMaterias();
    });
  });
}

function reloadButtonsMaterias() {

  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let materias = usuario.editais[indexEdital].materias;
  //APAGAR BOTÕES DAS MATÉRIAS
  document.getElementById("col-materias").innerHTML = "";
  //EXIBE BOTÃO ADICIONAR MATÉRIA
  let button = document.createElement('div');
  button.innerHTML = "Nova Matéria";
  //button.setAttribute("id", "button-edital");
  button.setAttribute("class","button-add");
  button.setAttribute("onclick", "criarMateria()");
  document.getElementById("col-materias").appendChild(button);
  //EXIBE BOTÕES DAS MATÉRIAS
  if(materias.length > 0) {
    materias.forEach(function(materia) {
      //console.log(edital.nome);
      let button = document.createElement('div');
      button.innerHTML = materia.nome;
      button.setAttribute("id", "btn-materia-" + materia.nome);
      //button.setAttribute("id", edital.nome);
      button.setAttribute("class","button-materia");
      button.setAttribute("onclick", "mostrarMateria('"+ materia.nome +"')");
      document.getElementById("col-materias").appendChild(button);
    });
    let indexMateria = getIndexMateria(usuario.editais[indexEdital].materiaCorrente);
    mostrarMateria(materias[indexMateria].nome);
  }
  else {
    let ContainerMateria = document.getElementById("container-materia");
    ContainerMateria.setAttribute("style","display:none");
  }
}

// ORDENAR POR ORDEM ALFABÉTICA
function sortEditaisEMaterias(){
  //ordenar editais por ordem alfabética
  usuario.editais.sort(function(a, b) {
    return a.nome.localeCompare(b.nome);
  });
  //ordenar matérias por ordem alfabética
  usuario.editais.forEach(function(edital) {
    edital.materias.sort(function(a, b) {
      return a.nome.localeCompare(b.nome);
    });
  });
}

// gravar no localStorage
function gravarUsuarioNoLocalStorage() {
  sortEditaisEMaterias();
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

// ler do localStorage
function lerUsuarioDoLocalStorage() {
  usuario = JSON.parse(localStorage.getItem("usuario"));
  //console.log(usuario);
}

// imprimir no console o conteudo de usuario
function imprimirUsuarioNoCosole() {
  console.log(usuario);
}

//OBJETO USUÁRIO
let usuario = {};
//let usuario = {nome:"andre", email:"andre@gmail.com", editalCorrente:"", editais: []}
/*
let usuario_template =
{
  nome: "",
  email: "",
  editalCorrente: "",
  editais:
  [
    {
      nome: "",
      info_importantes:
      {
        banca: "",
        data_inscricao_inicio: "",
        data_inscricao_fim: "",
        data_prova: "",
        topics:
        [
          {
            item: "",
            checked: false,
            linethrough: false
          }
        ]
      },
      materias:
      [
        {
          nome: "",
          topics:
          [
            {
              item: "",
              checked: false,
              linethrough: false
            }
          ]
        }
      ]
    }
  ],
}
*/

function importarEdital() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.click();
  input.onchange = function() {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      let edital = JSON.parse(reader.result);

      let indexEdital = getIndexEdital(edital.nome);
      if(indexEdital != -1)
      {
        alert("Edital já existe!");
        return;
      }
      usuario.editais.push(edital);
      //gravarUsuarioNoLocalStorage();

      enviarDadosAoServidor().then(() => {
        imprimirUsuarioNoCosole();
        let button = document.createElement('div');
        button.innerHTML = edital.nome;
        button.setAttribute("id", "btn-edital-" + edital.nome);
        //button.setAttribute("id", edital.nome);
        button.setAttribute("class","button-edital");
        button.setAttribute("onclick", "mostrarEdital('"+ edital.nome +"')");
        button.setAttribute("style","display:none");
        document.getElementById("nav-editais").appendChild(button);
        mostrarEdital(edital.nome).then(() => {
          if(usuario.editais.length > 0) {processReloadButtonsEditais();}
        });
      });
    };
  };
}

//função para exportar(download) edital em formato JSON
function exportarEdital() {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let edital = usuario.editais[indexEdital];
  let auxMateriaCorrente = edital.materiaCorrente;
  if(edital.materias.length > 0){

    edital.materiaCorrente = edital.materias[0].nome;
  }
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(edital));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", edital.nome + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  if(edital.materias.length > 0){
    edital.materiaCorrente = auxMateriaCorrente;
  }
}

function getIndexEdital(nomeEdital) {
  let indexEdital = usuario.editais.findIndex(edital => edital.nome == nomeEdital);
  return indexEdital;
}

function getIndexMateria(nomeMateria) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = usuario.editais[indexEdital].materias.findIndex(materia => materia.nome == nomeMateria);
  return indexMateria;
}

function getIndexItemMateria(nomeItem) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);
  let indexItem = usuario.editais[indexEdital].materias[indexMateria].topics.findIndex(item => item.item == nomeItem);
  return indexItem;
}

function getIndexItemEdital(nomeItem) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexItem = usuario.editais[indexEdital].info_importantes.topics.findIndex(item => item.item == nomeItem);
  return indexItem;
}

function riscadoItemEdital(textoItem,linethrough) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexItem = getIndexItemEdital(textoItem);
  usuario.editais[indexEdital].info_importantes.topics[indexItem].linethrough = linethrough;
  //gravarUsuarioNoLocalStorage();
  enviarDadosAoServidor();
  imprimirUsuarioNoCosole();
}

function criarLinhaTopicos1(item,operacao){
  /////////////////////
  let li = document.createElement("li");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  //se o checkbox nas informações do edital no objeto usuario estiver marcado, marcar o checkbox na tela
  if(operacao === "ler"){
    if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].info_importantes.topics.length > 0)
    {
      if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].info_importantes.topics[getIndexItemEdital(item)].checked)
      {
        checkbox.checked = true;
      }
    }
  }

  let p1 = document.createElement("span");
  //BOTÃO PARA EDITAR ITEM
  let edit = document.createElement("i");
  edit.setAttribute("onclick","editarItem('"+item+"',this,1)");
  edit.setAttribute("class","material-icons");
  edit.setAttribute("style","color:gray;font-size:20px;padding-left:10px");
  edit.innerHTML = "edit";
  //////
  let lixeira = document.createElement("i");
  lixeira.setAttribute("onclick","removeItem('"+item+"',this,1)");
  lixeira.setAttribute("class","material-icons");
  lixeira.setAttribute("style","color:gray;font-size:20px;padding-left:10px");
  lixeira.innerHTML = "delete";
  p1.innerHTML = item;
  //se o item nas informações do edital no objeto usuario estiver riscado, riscar o item na tela
  if(operacao === "ler"){
    if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].info_importantes.topics.length > 0)
    {
      if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].info_importantes.topics[getIndexItemEdital(item)].linethrough)
      {
        p1.classList.toggle("riscado");
      }
    }
  }

  let botaoRiscar = document.createElement("span");
  botaoRiscar.innerHTML = "abc";
  botaoRiscar.setAttribute("class","riscado");
  botaoRiscar.addEventListener("click", function() {
    p1.classList.toggle("riscado");
    if(p1.classList.contains("riscado"))
    {
      riscadoItemEdital(item,true);
    }
    else
    {
      riscadoItemEdital(item,false);
    }
  });

  li.appendChild(checkbox);
  li.appendChild(p1);
  li.appendChild(botaoRiscar);
  li.appendChild(edit);
  li.appendChild(lixeira);

  checkbox.addEventListener("click", function() {
    if(this.checked)
    {
      setChecked1(item,true);
    }
    else
    {
      setChecked1(item,false);
    }
  });
  return li;
}

function setChecked1(item,checked) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexItem = getIndexItemEdital(item);
  usuario.editais[indexEdital].info_importantes.topics[indexItem].checked = checked;
  //gravarUsuarioNoLocalStorage();
  enviarDadosAoServidor();
  imprimirUsuarioNoCosole();
}

function reloadItens1() {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let topics = usuario.editais[indexEdital].info_importantes.topics;
  let ul = document.getElementById("list");
  ul.innerHTML = "";
  if(topics.length > 0) {
    topics.forEach(function(topic) {
      let li = criarLinhaTopicos1(topic.item,"ler");
      ul.appendChild(li);
    });
  }
  else {
    document.getElementById("list").innerHTML = "";
  }
}

function reloadItens2() {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);
  let topics = usuario.editais[indexEdital].materias[indexMateria].topics;
  let ul = document.getElementById("list-2");
  ul.innerHTML = "";
  if(topics.length > 0) {
    topics.forEach(function(topic) {
      let li = criarLinhaTopicos2(topic.item,"ler");
      ul.appendChild(li);
    });
  }
  else {
    document.getElementById("list-2").innerHTML = "";
  }
}

function editarItem(textoItem,elemento,n) {

  if(n == 1)
  {
    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
    let indexItem = getIndexItemEdital(elemento.parentNode.childNodes[1].innerHTML);
    let item = usuario.editais[indexEdital].info_importantes.topics[indexItem].item;
    let novoItem = prompt("Editar item:", item);
    if (novoItem != null) {
      elemento.parentNode.childNodes[1].innerHTML = novoItem;
      usuario.editais[indexEdital].info_importantes.topics[indexItem].item = novoItem;
      //gravarUsuarioNoLocalStorage();
      enviarDadosAoServidor().then(() => {
        imprimirUsuarioNoCosole();
        //window.location.reload();
        //processReloadButtonsEditais();
        //mostrarEdital(document.getElementById("nome-edital").innerHTML);
        reloadItens1();
      });
    }

  }
  if(n == 2)
  {
    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
    let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);
    let indexItem = getIndexItemMateria(textoItem);

    console.log(usuario);
    //console.log(usuario.editais[indexEdital].materias[indexMateria].topics[indexItem].item);

    let item = usuario.editais[indexEdital].materias[indexMateria].topics[indexItem].item;
    let novoItem = prompt("Editar item:", item);
    if (novoItem != null) {
      //elemento.parentNode.childNodes[1].innerHTML = novoItem;
      usuario.editais[indexEdital].materias[indexMateria].topics[indexItem].item = novoItem;
      //gravarUsuarioNoLocalStorage();////
      enviarDadosAoServidor().then(() => {
        imprimirUsuarioNoCosole();////
        //window.location.reload();
        //processReloadButtonsMaterias();
        reloadItens2();
      });
    }
  }
}

function riscadoItemMateria(textoItem,linethrough) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);
  let indexItem = getIndexItemMateria(textoItem);
  usuario.editais[indexEdital].materias[indexMateria].topics[indexItem].linethrough = linethrough;
  //gravarUsuarioNoLocalStorage();
  enviarDadosAoServidor();
  imprimirUsuarioNoCosole();
}

function criarLinhaTopicos2(item,operacao)
{

  let li = document.createElement("li");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  //se o checkbox na materia no objeto usuario estiver marcado, marcar o checkbox na tela
  if(operacao === "ler"){
    if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].materias[getIndexMateria(document.getElementById("nome-materia").innerHTML)].topics.length > 0)
    {
      if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].materias[getIndexMateria(document.getElementById("nome-materia").innerHTML)].topics[getIndexItemMateria(item)].checked)
      {
        checkbox.checked = true;
      }
    }
  }
  //BOTÃO PARA EDITAR ITEM
  let edit = document.createElement("i");
  edit.setAttribute("onclick","editarItem('"+item+"',this,2)");
  edit.setAttribute("class","material-icons");
  edit.setAttribute("style","color:gray;font-size:20px;padding-left:10px");
  edit.innerHTML = "edit";

  let lixeira = document.createElement("i");
  lixeira.setAttribute("onclick","removeItem('"+item+"',this,2)");
  lixeira.setAttribute("class","material-icons");
  lixeira.setAttribute("style","color:gray;font-size:20px;padding-left:10px");
  lixeira.innerHTML = "delete";
  //li.setAttribute("style","background-color:whitesmoke;border-radius:5px;margin:3px");

  let p1 = document.createElement("span");
  p1.textContent = item.trim();
  //se o item na materia no objeto usuario estiver riscado, riscar o item na tela
  if(operacao === "ler"){
    if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].materias[getIndexMateria(document.getElementById("nome-materia").innerHTML)].topics.length > 0)
    {
      if(usuario.editais[getIndexEdital(document.getElementById("nome-edital").innerHTML)].materias[getIndexMateria(document.getElementById("nome-materia").innerHTML)].topics[getIndexItemMateria(item)].linethrough)
      {
        p1.classList.toggle("riscado");
      }
    }
  }

  let botaoRiscar = document.createElement("span");
  botaoRiscar.innerHTML = "abc";
  botaoRiscar.setAttribute("class","riscado");
  botaoRiscar.addEventListener("click", function() {
    p1.classList.toggle("riscado");
    if(p1.classList.contains("riscado"))
    {
      riscadoItemMateria(item,true);
    }
    else
    {
      riscadoItemMateria(item,false);
    }
  });

  //p1.setAttribute("onclick","setRiscado2(this)");
  li.appendChild(checkbox);
  li.appendChild(p1);
  li.appendChild(botaoRiscar);
  li.appendChild(edit);
  li.appendChild(lixeira);

  checkbox.addEventListener("click", function() {
    if(this.checked)
    {
      setChecked2(item,true);
    }
    else
    {
      setChecked2(item,false);
    }
  });

  return li;
}

function setChecked2(textoItem,checked) {
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);
  let indexItem = getIndexItemMateria(textoItem);
  usuario.editais[indexEdital].materias[indexMateria].topics[indexItem].checked = checked;
  //gravarUsuarioNoLocalStorage();
  enviarDadosAoServidor();
  imprimirUsuarioNoCosole();
}

function addItem(lista_n)
{
  if (lista_n == 1)
  {
    let item = document.getElementById("item").value;
    if (item === "") {
      alert("Por favor, insira um item");
      return;
    }

    let li =  criarLinhaTopicos1(item,"criar");
    document.getElementById("list").appendChild(li);
    document.getElementById("item").value = "";

    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
    usuario.editais[indexEdital].info_importantes.topics.push({
      item: item,
      checked: false,
      linethrough: false
    });
    //console.log(usuario.editais);
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor();
    imprimirUsuarioNoCosole();
  }
}

function removeItem(textoItem,elemento,list_n) {
  let li = elemento.parentNode;
  li.parentNode.removeChild(li);

  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  if(list_n == 1)
  {
    let indexItem = usuario.editais[indexEdital].info_importantes.topics.findIndex(item => item.item == textoItem);
    let spliced = usuario.editais[indexEdital].info_importantes.topics.splice(indexItem, 1);
    console.log("SPLICED 1: " + spliced);
  }

  if(list_n == 2)
  {
    let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);
    //let indexItem = usuario.editais[indexEdital].materias[indexMateria].topics.findIndex(item => item.item == elemento.parentNode.childNodes[1].innerHTML);
    let indexItem = getIndexItemMateria(textoItem);
    let spliced = usuario.editais[indexEdital].materias[indexMateria].topics.splice(indexItem, 1);
    console.log("SPLICED 2: " + spliced);
  }

  //console.log(usuario.editais);
  //gravarUsuarioNoLocalStorage();
  enviarDadosAoServidor();
  imprimirUsuarioNoCosole();
}

//CONVERTE TEXTO PARA LISTA:
function createList() {
  const inputText = document.getElementById('item-2').value;

  if (inputText === "") {
      alert("Por favor, insira um item");
      return;
  }

  const delimiters = document.getElementById('delimiters').value.split(' ');
  const regex = new RegExp('[' + delimiters.join('') + ']', 'g');
  const items = inputText.split(regex);

  const outputList = document.getElementById('list-2');

  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = getIndexMateria(document.getElementById("nome-materia").innerHTML);

  items.forEach(function(item) {
    const li = criarLinhaTopicos2(item,"criar");
    outputList.appendChild(li);

    usuario.editais[indexEdital].materias[indexMateria].topics.push({
      item: item,
      checked: false,
      linethrough: false
    });
  });
  //console.log(usuario.editais);
  //gravarUsuarioNoLocalStorage();
  enviarDadosAoServidor().then(() => {
    imprimirUsuarioNoCosole();
    document.getElementById("item-2").value = "";
    document.getElementById("delimiters").value = "";
  });
}

function mostrarPrompt(id) {
  const outputInfo = document.getElementById(id);
  let informacao = prompt("Digite aqui:",outputInfo.innerHTML);
  if (informacao != null)
  {
    let p = document.createElement('p');
    p.innerHTML = informacao;
    outputInfo.innerHTML = informacao;

    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
    if(id == "nome-banca")
    {
      usuario.editais[indexEdital].info_importantes.banca = informacao;
    }
    if(id == "data-inscricao-inicio")
    {
      usuario.editais[indexEdital].info_importantes.data_inscricao_inicio = informacao;
    }
    if(id == "data-inscricao-fim")
    {
      usuario.editais[indexEdital].info_importantes.data_inscricao_fim = informacao;
    }
    if(id == "data-prova")
    {
      usuario.editais[indexEdital].info_importantes.data_prova = informacao;
    }
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor();
    imprimirUsuarioNoCosole();
  }
}

function criarEdital() {
  //gravarUsuarioNoLocalStorage();
  //let usuario = JSON.parse(localStorage.getItem("usuario"));
  //imprimirUsuarioNoCosole();

  const outputEditais = document.getElementById('nav-editais');
  let nomeEdital = prompt("Digite nome do edital:");
  if (nomeEdital != null && nomeEdital != "")
  {
    let button = document.createElement('div');
    button.innerHTML = nomeEdital;
    button.setAttribute("id", "btn-edital-" + nomeEdital);
    button.setAttribute("class","button-edital");
    button.setAttribute("onclick", "mostrarEdital('" + nomeEdital + "')");

    button.setAttribute("style","display:none");//!

    outputEditais.appendChild(button);

    usuario.editais.push({
      nome: nomeEdital,
      materiaCorrente: "",
      info_importantes:
      {
        banca: "",
        data_inscricao_inicio: "",
        data_inscricao_fim: "",
        data_prova: "",
        topics:
        []
      },
      materias:
      []
    });

    usuario.editalCorrente = nomeEdital;

    mostrarEdital(nomeEdital).then(() => {
      if(usuario.editais.length > 0) {processReloadButtonsEditais();}
    });
  }
}

function mostrarEdital(nomeEdital){
  return new Promise((resolve, reject) => {
    usuario.editalCorrente = nomeEdital;
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor().then(() => {
      imprimirUsuarioNoCosole();
      usuario.editais.forEach(function(edital) {
        if(edital.nome != nomeEdital)
        {
          document.getElementById("btn-edital-"+edital.nome).setAttribute("class","button-edital");
        }
        else
        {
          document.getElementById("btn-edital-"+edital.nome).setAttribute("class","button-selecionado");
        }
      });

      //CAPTURAR OBJETOS DO OBJETO USUÁRIO
      let indexEdital = getIndexEdital(nomeEdital);
      let edital = usuario.editais[indexEdital];
      let materias = edital.materias;
      let info_importantes = edital.info_importantes;
      console.log(edital);

      let banca = info_importantes.banca;
      let data_inscricao_inicio = info_importantes.data_inscricao_inicio;
      let data_inscricao_fim = info_importantes.data_inscricao_fim;
      let data_prova = info_importantes.data_prova;
      let topics = info_importantes.topics;

      //EXIBE INFORMAÇÕES DO EDITAL
      document.getElementById("nome-edital").innerHTML = nomeEdital;
      document.getElementById('nome-banca').innerHTML = info_importantes.banca;
      document.getElementById('data-inscricao-inicio').innerHTML = info_importantes.data_inscricao_inicio;
      document.getElementById('data-inscricao-fim').innerHTML = info_importantes.data_inscricao_fim;
      document.getElementById('data-prova').innerHTML = info_importantes.data_prova;
      //EXIBE LISTA DE TOPICOS DO POST-IT
      if(topics.length > 0){
        let outPutList = document.getElementById('list');
        outPutList.innerHTML = '';
        topics.forEach(function(item) {
          const li = criarLinhaTopicos1(item.item,"ler");
          outPutList.appendChild(li);
        });
      }
      else{
        let outPutList = document.getElementById('list');
        outPutList.innerHTML = '';
      }

      reloadButtonsMaterias();

      let containerEdital = document.getElementById('container-edital');
      containerEdital.setAttribute("style","display:static");

      //if(usuario.editais.length > 0) {window.location.reload();}
      resolve();
    });
  });
}

function criarMateria() {
  const outputMaterias = document.getElementById('col-materias');
  let nomeMateria = prompt("Digite nome da matéria:");
  if (nomeMateria != null && nomeMateria != "")
  {
    let button = document.createElement('div');
    button.innerHTML = nomeMateria;
    button.setAttribute("id", "btn-materia-" + nomeMateria);
    button.setAttribute("class","button-materia");
    button.setAttribute("onclick", "mostrarMateria('" + nomeMateria + "')");

    button.setAttribute("style","display:none");

    outputMaterias.appendChild(button);

    //COLOCAR NOME DA MATÉRIA NO OBJETO USUÁRIO
    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);

    usuario.editais[indexEdital].materiaCorrente = nomeMateria;
    usuario.editais[indexEdital].materias.push({
      nome: nomeMateria,
      topics:
      []
    });

    enviarDadosAoServidor().then(() => {
      imprimirUsuarioNoCosole();

      mostrarMateria(nomeMateria).then(() => {
        //window.location.reload();
        if(usuario.editais[indexEdital].materias.length > 0) {processReloadButtonsMaterias();}
      });
    });
  }
}

function mostrarMateria(nomeMateria){
  return new Promise((resolve, reject) => {
    //CAPTURAR OBJETOS DO OBJETO USUÁRIO
    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
    let indexMateria = getIndexMateria(nomeMateria);
    let materia = usuario.editais[indexEdital].materias[indexMateria];
    let topics = materia.topics;
    console.log(materia);

    usuario.editais[indexEdital].materiaCorrente = nomeMateria;
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor().then(() => {
      imprimirUsuarioNoCosole();

      usuario.editais[indexEdital].materias.forEach(function(materia) {
        if(materia.nome != nomeMateria)
        {
          document.getElementById("btn-materia-" + materia.nome).setAttribute("class","button-materia");
        }
        else
        {
          document.getElementById("btn-materia-" + materia.nome).setAttribute("class","button-selecionado");
        }
      });

      //EXIBE INFORMAÇÕES DA MATÉRIA
      let outPutNomeMateria = document.getElementById("nome-materia");
      outPutNomeMateria.innerHTML = nomeMateria;
      let containerMateria = document.getElementById('container-materia');
      containerMateria.setAttribute("style","display:static");

      //EXIBE LISTA DE TOPICOS DA MATÉRIA
      if(topics.length > 0){
        let outPutList = document.getElementById('list-2');
        outPutList.innerHTML = '';
        topics.forEach(function(item) {
          const li = criarLinhaTopicos2(item.item,"ler");
          outPutList.appendChild(li);
        });
      }
      else{
        let outPutList = document.getElementById('list-2');
        outPutList.innerHTML = '';
      }

      //if(usuario.editais[indexEdital].materias.length > 0) {window.location.reload();}
      resolve();
    });
  });
}

function excluirEdital() {
  if(confirm("Tem certeza que deseja excluir este edital?"))
  {
    let nomeEdital = document.getElementById("nome-edital").innerHTML;
    let indexEdital = getIndexEdital(nomeEdital);
    usuario.editais.splice(indexEdital, 1);
    if(usuario.editais.length > 0)
    {
      usuario.editalCorrente = usuario.editais[0].nome;
    }
    else
    {
      usuario.editalCorrente = "";
    }
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor().then(() => {

      imprimirUsuarioNoCosole();
      //window.location.reload();
      processReloadButtonsEditais();
    });
  }
}

function excluirMateria() {
  if(confirm("Tem certeza que deseja excluir esta matéria?"))
  {
    let nomeMateria = document.getElementById("nome-materia").innerHTML;
    let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
    let indexMateria = getIndexMateria(nomeMateria);
    usuario.editais[indexEdital].materias.splice(indexMateria, 1);
    if(usuario.editais[indexEdital].materias.length > 0)
    {
      usuario.editais[indexEdital].materiaCorrente = usuario.editais[indexEdital].materias[0].nome;
    }
    else
    {
      usuario.editais[indexEdital].materiaCorrente = "";
    }

    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor().then(() => {
      imprimirUsuarioNoCosole();
      //window.location.reload();
      processReloadButtonsMaterias();
    });
  }
}

function renomearEdital() {
  let nomeEdital = document.getElementById("nome-edital").innerHTML;
  let indexEdital = getIndexEdital(nomeEdital);
  let novoNomeEdital = prompt("Digite novo nome do edital:");
  if (novoNomeEdital != null && novoNomeEdital != "")
  {
    document.getElementById("nome-edital").innerHTML = novoNomeEdital;
    usuario.editais[indexEdital].nome = novoNomeEdital;
    usuario.editalCorrente = novoNomeEdital;
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor().then(() => {
      imprimirUsuarioNoCosole();
      //window.location.reload();
      processReloadButtonsEditais();
    });
  }
}

function renomearMateria() {
  let nomeMateria = document.getElementById("nome-materia").innerHTML;
  let indexEdital = getIndexEdital(document.getElementById("nome-edital").innerHTML);
  let indexMateria = getIndexMateria(nomeMateria);
  let novoNomeMateria = prompt("Digite novo nome da matéria:");
  if (novoNomeMateria != null && novoNomeMateria != "")
  {
    document.getElementById("nome-materia").innerHTML = novoNomeMateria;
    usuario.editais[indexEdital].materias[indexMateria].nome = novoNomeMateria;
    usuario.editais[indexEdital].materiaCorrente = novoNomeMateria;
    //gravarUsuarioNoLocalStorage();
    enviarDadosAoServidor().then(() => {
      imprimirUsuarioNoCosole();
      //window.location.reload();
      processReloadButtonsMaterias();
    });
  }
}

