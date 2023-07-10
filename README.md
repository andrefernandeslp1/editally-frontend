# Projeto: Portal de controle de estudos.



### Universidade Federal do Rio Grande do Norte

### Disciplina: Desenvolvimento de Sistemas WEB I

#### Professor: Jair C. Leite

#### Aluno: André Augusto Fernandes



## 1. Introdução

Este projeto foi desenvolvido para a disciplina de Desenvolvimento de Sistemas WEB I, como meio de avaliar os conhecimentos adquiridos pelo aluno ao longo da disciplina.



## 2. Objetivo

Os requisitos da avaliação eram desenvolver um sistema WEB composto de Frontend, com a utilização das tecnologias Html, CSS e JavaScript, além de um servidor local, Backend, utilizando Node e Javascript para processar as requisições do cliente.



## 3. Proposta

Da experiência pessoal, veio a ideia para o projeto: a falta de uma tecnologia que permitisse organizar e controlar de forma ágil e eficiente o estudo para concursos.
Foi aí que surgiu o **Editally**, um portal que se propõe a oferecer um ambiente de controle de estudos para processos seletivos, em que se faz necessária a verticalização das principais informações e conteúdo programático objetos do edital. O candidato poderá cadastrar seu edital de forma rápida e eficiente, e acompanhar sua evolução por meio de funcionalidades pensadas para facilitar seu estudo.



## 4. Instruções de uso



#### 4.1. Instalar o Node.js

Para rodar o servidor local, será necessário instalar o Node.js na sua máquina. Prossiga à instalação através do seguinte link: [Node JS](https://nodejs.org/en).



#### 4.2. Baixar arquivos

Após a instalação do Node.js, baixe a pasta `/SERVIDOR` deste repositório para o local de sua preferência em seu computador.



#### 4.3. Inicializar Servidor Local

Abra o Prompt de Comando dentro da pasta `/SERVIDOR` e excecute o seguinte comando: `node meuservidor.js` 

Caso não hajam problemas, seu servidor local estará ativo.



#### 4.4. Acessar Portal

Com o servidor rodando, abra o browser e acesse o seguinte endereço: `http://localhost:3000/`

*Voilá!!!* Caso todos as etapas acima tiverem sido processadas corretamente, você terá acesso ao Portal e poderá iniciar sua jornada de estudos.

A seguir, descreverei as principais funcionalidades do site e falarei sobre sua implementação. Vamos lá!?



## 5. `/`

### 5.1. `/login.html`

Ao acessar o endereço `http://localhost:3000/`, caso não haja uma sessão ativa, o usuário será direcionado à página de `/login.html`, na qual poderá entrar com suas credenciais e acessar a página principal (`/index.html`), ou acessar o link `Criar Conta` para se cadastrar.

![Screenshot 2023-06-23 at 11-28-57 EDITALLY - Login](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/69270ed7-34f7-4469-b80d-7472eb630728)

#### 5.1.1. Implementação

Ao clicar em `Entrar`, a página enviará as credenciais do usuário para conferência no servidor. Caso haja identidade entre a base de dados e os dados passados pelo usuário, o servidor devolverá um Token ao cliente, que será armazenado localmente. Em seguida, a página `/index.html` será chamada. Para gerar o token, foi utilizado módulo **JsonWebToken (JWT)**.



### 5.2. `/cadastro.html`

Ao acessar a página de Cadastro, o usuário poderá se cadastrar e tornar-se membro do portal, passando a ter acesso ao sistema de estudos.

![Screenshot 2023-06-23 at 11-31-08 EDITALLY - Cadastro](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/8dacf754-3191-4010-8d23-019e32d92502)

#### 5.2.1. Implmentação

Ao clicar em Cadastro, as informações do usuário serão enviadas ao servidor, que irá inserir o novo membro na base de dados e devolver um Token válido para ser armazenado localmente.
Em seguida, o usuário será direcionado para a página `/index.html`, na qual se dará efetivamente a utilização da página.



### 5.3. `/index.html`

Uma vez logado no sistema, o usuário dará inicio à sua jornada de estudos, cadastrando um novo edital ou importando um criado anteriormente.

![Screenshot 2023-06-23 at 11-32-24 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/b1076b19-c991-499e-83b2-3190ed98c0cf)

Uma vez cadastrado um novo edital, o usuário poderá proceder a preencher as principais informações sobre o certame e cadastrar as matérias do conteúdo programático.

![Screenshot 2023-06-23 at 11-33-15 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/8fdad165-1e03-4a57-ad6d-21d73b686a33)

Cada matéria terá uma lista que poderá ser preenchida com os tópicos cobrados no edital.

![Screenshot 2023-06-23 at 11-36-59 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/66eb9d82-3cd9-4be1-8a46-e08e6f930171)

O candidato poderá inserir os tópicos um a um, ou deixar o sistema fazer o trabalho "sujo" por ele. Neste sentido, ele poderá simplesmente copiar, a partir do edital, o bloco inteiro de tópicos da matéria e, através do uso de um ou mais delimitadores, transformar o texto em uma lista de tópicos.

![Screenshot 2023-06-23 at 11-53-09 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/3f4ace4a-144c-46df-93fe-f8bfbe8f3d61)

Uma vez completa a criação do edital, ou a qualquer momento, o estudante poderá exportá-lo para um arquivo **JSON** ou **Excel**, através dos ícones à esquerda na barra do edital.

![Screenshot 2023-06-23 at 11-41-03 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/dce18975-43c7-4bae-8ef8-70274ff20c1b)

A importação e exportação de editais permite ao usuário administrar seu ambiente de estudos de forma ágil e eficiente.

![Screenshot 2023-06-23 at 11-50-26 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/5cdb1142-d0e6-42cb-acaa-e0261a047967)

Ao rolar a página para baixo, algumas informações serão ocultadas para facilitar a exibição do conteúdo, enquanto outras de maior relevância, como os cabeçalhos de cada *container*, serão empilhados e mantidos sempre visíveis.

![Screenshot 2023-06-23 at 11-55-56 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/0391d55a-4047-4fdc-a8e3-447ca2e98dc3)

Na imagem abaixo, podemos observar o comportamento ao rolar a página para visualizar os tópicos mais inferiores.  

![Screenshot 2023-06-23 at 11-56-14 EDITALLY](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/709fec0c-38e5-47f7-8f1d-56b73e44319d)

#### 5.3.1. Implementação

A página `/index.html` opera da seguinte maneira:
Ao ser inicialmente invocada, verifica a existência de um Token no armazenamento local. Caso haja um token, o mesmo será enviado ao servidor para validação. Uma vez válido, o usuário terá acesso à página e receberá as informações do usuário contidas no sevidor. Recebidos os dados, o aluno poderá visualizá-los sem que novas requisições sejam feitas ao servidor. No entanto, cada vez que o estudante realizar alterações aos dados, tais mudanças serão enviadas ao servidor para gravação e posterior recuperação.



## 5.4. `/perfil.html`

A página `/perfil.html` poderá ser acessada através do menu 👤 (usuário) em `/index.html`, ou invocada manualmente, caso haja um token válido no cliente.
Aqui, o usuário poderá alterar suas informações de cadastro ou excluir sua conta.

![Screenshot 2023-06-23 at 11-46-09 EDITALLY - Perfil](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/a23cc655-7f74-4311-abeb-c859802edc85)

#### 5.4.1. Implementação

Assim como nas implementações anteriores, aqui, ao processar a operação solicitada, será feita a validação do token enviado pela página ao servidor e, em seguida, o envio das informações para serem registradas.



### 6. Servidor

Para fazer a interação Frontend <-> Backend, foi criado um servidor local utilizando Node.js e Javascript.

O código para criar o servidor está implementado no arquivo `/SERVIDOR/meuservidor.js` e pode ser executado dentro da própria pasta com o seguinte comando: `node meuservidor.js`

![Capturar2](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/be876390-dc53-4090-98b8-2728d062bf1f)

O endereço do servidor local foi configurado como `http://localhost:3000`, que deverá ser utilizado no browser para acessar a página.

### 6.1. `Implementação`

O servidor local foi implementado utilizando Node.js. Aqui o ambiente processa as diversas requisições do cliente e armazena os dados dos usuários em formato JSON. Há um arquivo chamado users.json, que armazena os dados cadastrais do membro, e um chamado usersData.json, que armazena as informações propriamente ditas, 



### 7. Tecnologias utilizadas

Para desenvolver o projeto, foram utilizados Html, CSS, Javascript e Node.js.



#### 7.1. Frameworks

Não foram utilizados frameworks no projeto. Contudo, para continuar desenvolvendo o site, provavelmente será utilizado algum framework para implementar funcionalidades mais sofisticadas.



#### 7.2. Bibliotecas/Módulos

Para implementar o sistema, foram utilizados os seguites módulos pelo lado do servidor:

![code2](https://github.com/andrefernandeslp1/Projeto-WEB1-Enviar/assets/92834067/e97b975b-a0c0-440a-b657-04ec5fd7381d)

Já pelo lado do cliente foram utilizadas algumas bibliotecas de ícones e módulo de conversão de arquivos.



### 8. Em desenvolvimento 🚧

Seguem em desenvolvimento as seguintes funcionalidades para versões futuras:

- Manipulação de listas;

- Medidor de progresso;

- Melhorar Responsividade;

- Recuperação de senha.
  
  

### 9. Conclusão

O projeto se provou de grande utilidade para solidificar os conhecimentos adquiridos durante o curso, proporcionando uma boa base de conhecimento e capacitação em sistemas WEB.
