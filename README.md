# SENAC-RS Gestão de Usuários

Este projeto consiste em uma plataforma de gerenciamento de contas do SENAC/RS. Uma aplicação para cadastro e controle de usuários, onde cada usuário possui um nível de permissão definido, podendo ou não executar determinadas ações dentro da plataforma.

Ao informar CPF e senha válidos, o usuário tem acesso ao sistema. Dependendo do seu nível de permissão:

Administrador: pode visualizar, editar e excluir usuários.

Moderador: pode visualizar e editar usuários, mas não pode excluir.

Leitor: pode apenas visualizar os usuários.

Durante o cadastro, algumas informações obrigatórias são validadas, como CPF e e-mail, que precisam estar em formato válido e não podem já existir na base de dados. No momento da criação do usuário, também é possível definir seu nível de permissão.

### 🔑 Fluxo de primeiro acesso e segurança
Quando um administrador cadastra um novo usuário, ele define uma **senha padrão** para o primeiro acesso. Ao fazer login pela primeira vez, o novo usuário é **obrigatoriamente redirecionado** para uma tela de troca de senha, onde ele deve:

1. **Criar uma nova senha pessoal** — substituindo a senha padrão definida pelo administrador.
2. **Escolher uma pergunta de segurança** — selecionando entre opções como *"Qual o nome da empresa do seu primeiro emprego?"*, *"Qual o nome do seu primeiro animal de estimação?"*, entre outras perguntas.
3. **Responder a pergunta de segurança** — essa resposta fica armazenada de forma segura no banco de dados.

Somente após completar esses três passos o usuário consegue acessar à plataforma pela primeira vez (isso serve para novos usuários criados).

### 🔓 Recuperação de senha
Caso esqueça a senha, ele pode recuperar diretamente pela tela de login:

1. Clicar em **"Esqueci meu login ou senha"**.
2. Informar seu **CPF**.
3. Responder corretamente à **pergunta de segurança** definida no primeiro acesso.
4. Definir uma **nova senha**.


## Visão geral 
- ✉️ **Login seguro:** autenticação via API REST (Laravel Sanctum), feedback imediato para erros e proteção de rotas.
- 👤 **Cadastro e edição:** formulário inteligente com validação de CPF, máscara automática e modal exclusivo para editar usuários.
- 🧠 **Permissões contextuais:** ações (criar, editar, excluir) são exibidas conforme o nível de acesso do usuário.
- 📋 **Listagem reativa:** tabela/grade atualiza automaticamente após cada operação, sem recarregar a página.
- ♻️ **Componentização:** inputs, selects, botões e mensagens são componentes reutilizáveis.

## 🛠️ Tecnologias utilizadas

### Backend
- PHP 8.3+
- Laravel 12
- SQLite como banco padrão
- Laravel Sanctum para autenticação
- API REST com form requests, resources e seeders

### Frontend
- React 19 com Vite
- TypeScript
- Axios pra chamadas HTTP
- React Router DOM
- Componentização de inputs e modais reutilizáveis
- CSS Modules

### Infraestrutura
- Docker e docker compose (serviços frontend/backend)
- Volumes persistentes para `storage/` e `database/`
- Scripts `npm`, `composer` e `artisan`

```
repository/
├─ backend/      # API Laravel (artisan, composer, migrations, seeders)
├─ frontend/     # SPA React/Vite
├─ docker-compose.yml
└─ README.md
```

> **Banco de dados:** o projeto usa SQLite. O arquivo `backend/database/database.sqlite` é criado automaticamente pelos scripts/migrations.

## 🚀 Como executar o projeto

<details>
<summary><strong>🐳 Rodar com Docker</strong></summary>

Pré-requisitos: **Docker** e **Git** instalados.

### 1. Clonar o repositório

```bash
git clone https://github.com/Mathluiz23/testeDevFullStackSENAC.git
cd testeDevFullStackSENAC
```

### 2. Renomear o arquivo de configuração

```bash
mv backend/.env.example backend/.env
```

O projeto já vem com um arquivo `.env.example` pronto. Basta renomeá-lo para `.env` removendo o `.example`. As configurações padrão já funcionam, não precisa alterar nada.

### 3. Subir os containers

dentro do projeto execute:

```bash
docker compose up --build
```

Isso vai contruir  as imagens do backend (PHP) e frontend (Node), instalar as dependências, criar o banco de dados, roda as migrations e inicia os servidor.

### 4. Popular o banco de dados

Com  container rodando, abra **outro terminal** e execute:

```bash
docker compose exec backend php artisan db:seed
```

Insere os usuários de teste no banco de dados. Só precisa rodar uma vez.

Antes de rodar o seed, confira se o banco foi criado corretamente verificando se existe o arquivo `database.sqlite` dentro da pasta database no backend.

### 5. Acessar o sistema

Abra o navegador em **http://localhost:5173**

</details>

<details>
<summary><strong>💻 Rodar localmente (sem Docker)</strong></summary>

Pré-requisitos: **PHP 8.2+**, **Composer**, **Node.js 18+**, **Git** e **SQLite** instalados.

### 1. Clonar o repositório

```bash
git clone https://github.com/Mathluiz23/testeDevFullStackSENAC.git
cd testeDevFullStackSENAC
```

### 2. Configurar o backend

```bash
cd backend
mv .env.example .env
composer install
touch database/database.sqlite
php artisan migrate --seed
```

O projeto já vem com um arquivo `.env.example` pronto. Basta renomeá-lo para `.env` removendo o `.example`. As configurações padrão já funcionam, não precisa alterar nada.


### 3. Inicie o backend

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

### 4. Configure e inicie o frontend

Abra **outro terminal**:

```bash
cd frontend
npm install
npm run dev
```

### 5. Para Acessar:

Abra o navegador em **http://localhost:5173**

</details>

## 🛡️ Níveis de permissão de usuários
| Nível | Papel | Pode visualizar | Pode criar | Pode editar | Pode excluir |
| --- | --- | --- | --- | --- | --- |
| 1 | Administrador | ✅ | ✅ | ✅ | ✅ |
| 2 | Moderador | ✅ | ❌ | ✅ | ❌ |
| 3 | Leitor | ✅ | ❌ | ❌ | ❌ |


## 📋 Dados padrão para login
| Perfil | Nome | CPF | Senha | Pergunta de segurança | Resposta |
| --- | --- | --- | --- | --- | --- |
| Administrador | Administrador | `00011122233` | `senhaAdmin123` | Qual o nome da empresa do seu primeiro emprego? | `senac` |
| Moderador | moderador 1 | `03333333333` | `moderador123` | Qual o nome da empresa do seu primeiro emprego? | `senac` |
| Moderador | Moderador Teste | `22233344455` | `moderador123` | Qual o nome do seu primeiro animal de estimação? | `thor` |
| Leitor | Matheus Luiz | `00000000001` | `senhaLeitor123` | Qual o nome do seu primeiro animal de estimação? | `rex` |
| Leitor | Matheus Luiz da Silva | `02222222222` | `senhaLeitor123` | Qual o nome da sua primeira escola? | `senac` |
| Leitor | Leitor Teste | `33344455566` | `leitor123` | Qual a sua comida favorita? | `churrasco` |

> **Nota:** A resposta da pergunta de segurança não diferencia maiúsculas de minúsculas.