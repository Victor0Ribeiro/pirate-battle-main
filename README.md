Pirate Battle
Fala aí! Se você chegou até aqui, bem-vindo ao código fonte do Pirate Battle.

Esse é um jogo 2D de batalha naval que construí inteiramente no front-end. A ideia era criar um shooter divertido, direto ao ponto e que rodasse liso direto no navegador do usuário a 60 frames por segundo, sem precisar instalar nada.

A maior batalha durante o desenvolvimento não foi nem contra os navios inimigos do jogo, mas sim contra o compilador do TypeScript no modo ultra-estrito do Vite. Mas depois de muita briga com tipagens e importações isoladas, o projeto saiu vitorioso e compilando perfeitamente.

Como jogar
O objetivo é sobreviver o máximo de tempo possível, desviar das ilhas e afundar os navios inimigos antes que eles acabem com a sua vida ou o tempo acabe.

Teclas W, A, S, D (ou Setas do teclado): Movimentam e giram o seu navio.

Barra de Espaço: Dispara o canhão frontal.

Teclas Q e E: Disparam os canhões laterais (um tiro triplo para esquerda ou direita). Use com sabedoria, pois o tempo de recarga das laterais é maior que o frontal.

O que roda por baixo do capô
Para fazer tudo isso funcionar sem gargalos de performance, juntei as seguintes ferramentas:

React: Cuida de toda a casca da aplicação, menus, HUD de vida/pontuação e telas de game over.

PixiJS: O verdadeiro motor gráfico do jogo. Ele assume o controle de um Canvas na tela e renderiza os navios, tiros e colisões usando WebGL para garantir a performance.

Zustand: Nosso gerenciador de estado global. É ele quem faz o React e o motor do PixiJS conversarem entre si para atualizar sua pontuação e vida em tempo real.

TypeScript: O guarda-costas do código. Deu dor de cabeça, mas garantiu que o jogo não quebrasse em produção.

Vite: Usado para iniciar o ambiente de desenvolvimento e empacotar a versão final na velocidade da luz.

Como rodar na sua máquina
Se você quiser baixar e modificar o jogo, o processo é bem simples. Você só precisa ter o Node.js instalado.

Faça o clone deste repositório.

Abra o terminal na pasta do projeto e rode "npm install" para baixar as dependências.

Rode "npm run dev" para iniciar o servidor local.

Abra o endereço de localhost que aparecer no seu terminal e bom jogo.





# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
