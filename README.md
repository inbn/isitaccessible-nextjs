# Is it accessible?

## Local setup

1. [Generate a new Personal Access Token](https://github.com/settings/tokens) from your GitHub account.
2. Duplicate `.env.example` and call it `.env`. Add your `GITHUB_API_TOKEN`.

## Styling

Sass is used for styling. There are two types of styles used in the app:

1. **Global styles**: These live in the `./styles` folder in the root of the app and apply globally. Use these for CSS resets, global variables, and generic element styles. e.g. headings, lists.

2. **Component styles**: These live alongside each component and use [CSS modules](https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css) (with SCSS syntax). The filename format is: `<component_name>.module.scss`. e.g. `SearchForm.module.scss`. Class names from the CSS module are automatically rewritten to be locally scoped. Instead of using hyphens in class names, use camelCase.

# Readme from Create-next-app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
