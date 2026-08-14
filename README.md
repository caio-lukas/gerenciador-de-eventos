# Gerenciador de Eventos

Aplicação full stack para administradores gerenciarem seus próprios eventos: cadastro/login de administrador com autenticação via JWT, e CRUD de eventos (nome, descrição, data/hora, localização e imagem), com listagem sempre restrita ao administrador autenticado.

Projeto desenvolvido como Desafio de Residência.

## Tecnologias

**Backend**
- Java + Spring Boot
- Spring Security + JWT (JJWT)
- Spring Data JPA
- PostgreSQL
- Swagger / OpenAPI (springdoc)
- BCrypt (hash de senha)

**Frontend**
- React Native (Expo) + TypeScript
- React Navigation
- Axios
- AsyncStorage
- react-native-toast-message

**Banco de Dados**
- PostgreSQL 15 (via Docker)

## Funcionalidades

### Administrador
- Cadastro de administrador, com senha armazenada de forma criptografada
- Login com retorno de token JWT
- Opção "Gravar Senha" para preencher e-mail/senha automaticamente nos próximos acessos

### Eventos
- Listagem dos eventos vinculados exclusivamente ao administrador autenticado
- Cadastro de evento (nome, descrição, data/hora, localização e imagem de capa)
- Edição de evento (data e localização)
- Exclusão de evento
- Layout responsivo: lista em coluna única no mobile, grid no web

## Segurança

- Autenticação via **JWT Bearer Token** em todos os endpoints, exceto `/auth/login` e `/auth/register`
- Senhas armazenadas com hash **BCrypt**, nunca em texto plano
- Verificação de posse em toda operação sobre evento: cada administrador só consegue listar, editar ou excluir os **próprios** eventos, prevenindo acesso cruzado entre contas (proteção contra IDOR)
- CORS configurado no Spring Security

## 🗄️ Banco de Dados

O PostgreSQL sobe via Docker Compose:

```bash
docker-compose up -d
```

Isso cria um container com:
- Banco: `evento_db`
- Usuário: `admin`
- Senha: `adminpassword`
- Porta: `5432`

> Os dados persistem no volume `pgdata`, então o banco não é perdido ao reiniciar o container.

## Como Executar

### 1. Banco de dados
```bash
docker-compose up -d
```

### 2. Backend
1. Configure em `application.properties` a conexão com o banco (mesmas credenciais do `docker-compose.yml`) e o segredo do token (o exemplo foi utilizado no desenvolvimento):
   ```properties
   api.security.token.secret=chave-secreta-para-protecao-segura-neki-eventos-2026
   ```
2. Suba a aplicação:
   ```bash
   ./gradlew bootRun
   ```
3. API disponível em `http://localhost:8080`

### 3. Frontend
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure a URL base da API em `src/services/api`
3. Rode o projeto:
   ```bash
   npx expo start
   ```

## Documentação da API

Swagger UI disponível em:
```
http://localhost:8080/swagger-ui.html
```

## Principais Endpoints

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|:---:|
| POST | `/auth/login` | Login do administrador | Não |
| POST | `/auth/register` | Cadastro de administrador | Não |
| GET | `/eventos/admin/{adminId}` | Lista eventos do admin autenticado | Sim |
| POST | `/eventos` | Cria evento | Sim |
| PUT | `/eventos/{id}` | Atualiza data e localização do evento | Sim |
| DELETE | `/eventos/{id}` | Exclui evento | Sim |

## Melhorias Futuras

> Espaço reservado para anotar próximos passos e pontos de evolução identificados durante o desenvolvimento.

- [ O projeto verifica o id do administrador para gerenciar seu escopo; ainda assim, ele utiliza o LocalStorage por conveniência. Uma melhoria para a eficiência do código seria fazer a verificação exclusivamente pelo token, barrando qualquer tentativa de mexer com o LocalStorage. ] 
- [ Para sistemas de login, a possibilidade de recuperar a senha da conta é sempre bem-vinda. Neste projeto, poderia ser implementada uma verificação por senha de uso único (OTP), que seria enviada ao e-mail cadastrado para possibilitar a troca da senha. ] 
- [ Como extensão do item acima, poderia ser implementada uma validação de e-mail a fim de garantir que o e-mail utilizado exista (o sistema já checa se a estrutura do e-mail é válida). ] 
- [ Para manter a simplicidade, optou-se por utilizar URLs de imagem em vez de arquivos em si. Contudo, haveriam maneiras de agregar a funcionalidade de submeter arquivos de imagem de forma direta na hora de cadastrar o evento, bem como armazená-las. ] 

## Autor

Desenvolvido por Caio Lukas .
