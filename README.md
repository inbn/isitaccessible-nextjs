# Is it accessible?

## Local setup

1. [Generate a new Personal Access Token](https://github.com/settings/tokens) from your GitHub account.
2. Duplicate `.env.example` and call it `.env`. Add your `GITHUB_API_TOKEN`.

## Styling

Sass is used for styling. There are two types of styles used in the app:

1. **Global styles**: These live in the `./styles` folder in the root of the app and apply globally. Use these for CSS resets, global variables, and generic element styles. e.g. headings, lists.

2. **Component styles**: These live alongside each component and use [CSS modules](https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css) (with SCSS syntax). The filename format is: `<component_name>.module.scss`. e.g. `SearchForm.module.scss`. Class names from the CSS module are automatically rewritten to be locally scoped. Instead of using hyphens in class names, use camelCase.

### Icons

Use the `Icon` component for rendering icons. To add a new icon, place it in the icons directory then run the command, `npm run generate-svg-sprite`. The `name` prop passed to the `Icon` component should match the name of the original SVG file. e.g. to render the icon, search.svg:

```jsx
<Icon name="search" />
```

## Deploy on Cloudflare Workers

### Manually via command line

To deploy this Next.js app on Cloudflare Workers, follow steps 7 and 8 from the “Deploy an existing NextJS project on Workers” section in the [Cloudflare Next.js deployment guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/#deploy-an-existing-nextjs-project-on-workers):

Test your site with the Cloudflare adapter:

```bash
npm run preview
```

Deploy your project:

```bash
npm run deploy
```

### Automatic Deployment via GitHub Actions

This repository includes a GitHub Actions workflow that automatically deploys to Cloudflare Workers when you push to the `main` branch. To set this up:

1. Get Cloudflare credentials:
   - **API Token**: Go to [Cloudflare API Tokens](https://dash.cloudflare.com/?to=/:account/api-tokens) → Create Token → Use "Edit Cloudflare Workers" template
   - **Account ID**: Found in your [Cloudflare Dashboard](https://dash.cloudflare.com) → Compute (Workers) → Workers & Pages

2. Add GitHub Secrets:
   - Go to Repo Settings → Secrets and variables → Actions
   - Add the following secrets (as ‘Repository Secrets’):
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
     - `CLOUDFLARE_GITHUB_API_TOKEN`: Your GitHub Personal Access Token (for API calls in the app)

3. **Deploy:** Push to the `main` branch and the workflow will automatically build and deploy the app

For the complete setup process, including configuration files and dependencies, see the full [Cloudflare Next.js documentation](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/#deploy-an-existing-nextjs-project-on-workers).

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
