# FitCalculator

Plataforma de cálculos de composição corporal e necessidades energéticas (IMC, TMB/BMR, TDEE, meta calórica e macronutrientes), com histórico e perfil corporal compartilhado entre as calculadoras.

O site estático original (HTML/CSS/JS puro) foi movido para [`legacy/`](legacy/) e permanece apenas como referência durante a migração para esta nova base.

## Stack

- [Next.js](https://nextjs.org) (App Router) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) para formulários e validação
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) para testes
- Persistência local via `localStorage` no MVP; PostgreSQL é planejado para uma fase futura

## Arquitetura

O domínio (regras de cálculo de IMC, BMR, TDEE, macros, etc.) não conhece React, DOM ou `localStorage`. A interface apenas coleta e exibe dados; o armazenamento fica atrás de repositories.

```text
src/
├── app/              # rotas (Next.js App Router)
├── features/         # composição de UI por funcionalidade
├── domain/           # entidades e motor de cálculos (puro, sem I/O)
├── application/       # casos de uso que orquestram domínio + infraestrutura
├── infrastructure/    # implementações concretas (ex: localStorage)
├── schemas/           # validação com Zod
├── types/             # tipos compartilhados
└── lib/                # utilitários genéricos
```

## Desenvolvimento

```bash
npm run dev            # servidor de desenvolvimento
npm run build           # build de produção
npm run lint             # ESLint
npm run format            # Prettier (escreve)
npm run format:check       # Prettier (checa sem escrever)
npm run test                 # roda os testes uma vez
npm run test:watch            # testes em modo watch
npm run test:coverage          # testes com cobertura (domain/ e application/)
```

Abra [http://localhost:3000](http://localhost:3000) para ver o resultado.
