# Short Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [Git Workflows](#git-workflows)
- [Structure of the Pages](#structure-of-the-pages)
- [Notable Dependencies](#notable-dependencies)

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
NEXT_PUBLIC_ENVIRONMENT="development"

NEXT_PUBLIC_EFFICIENCY_APP_URL=""
NEXT_PUBLIC_OH_APP_URL=""
NEXT_PUBLIC_LCCA_APP_URL=""
NEXT_PUBLIC_AUTH_APP_URL=""
NEXT_PUBLIC_AUTH_URL=""

AUTH_URL=""

AUTH_SECRET="" # Added by `npx auth`. Read more: https://cli.authjs.dev

```

Fifth, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`Typescript`](https://www.typescriptlang.org/docs/handbook/basic-types.html). Basically Javascript but with types like string and number so that you can easily detect rendered data type error and following the best practice.

## Git Workflows

<details>
<summary>How To Clone From Git Remote</summary>

Choose Gitea For Main Remote Repository 
```bash
FROM GITEA
git clone https://git.reliabilityindonesia.com/DigitalTwin/fe-front-end
```
```bash
FROM GITLAB
git clone https://gitlab.com/tjb-digital-twin/fe-front-end.git
```
</details>

<details>
<summary>How To Commit After Making Changes</summary>

Follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary), but if you are too lazy to read, basically use these commit messages:

**New Feature Update**
``` bash
git commit -m "feat: <short description of new feature added>"
```

**Fix After Main Production Push**
```bash
git commit -m "fix: <short description of fix>"
```

**Updates On Old Codes Or Refactoring Codes**
```bash
git commit -m "refactor: <short description of code refactor>"
```

**Style, Classnames, Or CSS only changes**
```bash
git commit -m "style: <short description of style changes>"
```

</details>

<details>
<summary>How To Avoid Merge Conflicts and Merge Commits</summary>
If you see a warning like: 

> This merge has conflicts that must be resolved before it can be committed. To manually merge these changes into master run the following commands:

Or

If you see a commit like: `Merge branch 'main' of https://git.reliabilityindonesia.com/DigitalTwin/fe-front-end`

Here is one of the solutions:

1. Undo your local commits
```bash
git reset --soft HEAD~1
```
2. Add your changes
```bash
git add .
```
3. Stash your changes
```bash
git stash
```
4. Pull the conflict commits
```bash
git pull 
# or
git pull --rebase
```
5. If there is no more conflict, apply your stash changes
```bash
git stash pop
```
6. Verify the commits 
```bash
git log
```
7. Commit your changes again and push
```bash
git commit -m "<commit message>"
git push origin main
```

*Communicate with your teammates about what kind of changes you want to commit and discuss when to commit and push the changes.*
</details>

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


