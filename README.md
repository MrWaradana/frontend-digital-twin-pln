This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, clone this repository:


Choose either option below
```bash
FROM GITEA
git clone https://git.reliabilityindonesia.com/DigitalTwin/fe-front-end
```
```bash
FROM GITLAB
git clone https://gitlab.com/tjb-digital-twin/fe-front-end.git
```

Second, install the package dependencies:

```bash
npm install
# all packages name and version can be seen
# on package.json or package-lock.json
```

Third, create auth secret key, and move it from `.env.local` to your `.env` file

```bash
npx auth secret
```

Fourth, configure your `.env` file following the `.env.example` file

```bash
ENVIRONTMENT="development"

NEXT_PUBLIC_EFFICIENCY_APP_URL=""
NEXT_PUBLIC_AUTH_APP_URL=""
NEXT_AUTH_URL=""

AUTH_SECRET="" # Added by `npx auth secret`. Read more: https://cli.authjs.dev
```

Fifth, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`Typescript`](https://www.typescriptlang.org/docs/handbook/basic-types.html). Basically Javascript but with types like string and number so that you can easily detect rendered data type error and following the best practice.

## Structure of The Pages

All page is on `src/app/`. Here are the list of the pages:

1. Login &rarr; `app/(auth)/login/page.tsx`
1. Admin &rarr; `app/admin/page.tsx`
1. Efficiency App &rarr; `app/efficiency-app/page.tsx`
1. Other Application &rarr; `app/[app_name]/page.tsx`

## Notable Dependencies

All of the dependencies can be look at package.json. Some of the notable dependencies are:

1. [Next UI](https://nextui.org/docs/guide/introduction)
1. [ShadCN UI](https://ui.shadcn.com/charts)
1. [Tailwind CSS](https://tailwindcss.com/)
1. [TANStack for React](https://tanstack.com/)
1. [Mantine](https://mantine.dev/)
1. [Mantine React Table](https://www.mantine-react-table.com/)


