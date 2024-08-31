# Next.js Starter App

Use this template to get started with a Next.js application. This boilerplate provides a solid foundation for building web applications with React, TypeScript, and server-side rendering.

## Toolchain

- Next.js 14: bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- css: [`Tailwind`](https://tailwindcss.com/) v3.
- Mail: [`nodemailer`](https://nodemailer.com/).
- Authentication: [`Next.js Auth`](https://next-auth.js.org).
- HTML/css Components: [`shadcn/ui`](https://ui.shadcn.com/).your application.
- `Optional`: Hosting: [`Vercel`](https://vercel.com/).


## Setting up locally

1. Clone this repository:

   ```bash
   git clone https://github.com/goweki/next_starter.git
   ```

2. Navigate into the project directory:

    ```
    cd next_starter
    ```

3. Install dependencies:

    ```
    npm i
    ```

## Running the App

### Development

1. Create a `.env` file and populate the environment variables as templated in the `.env.template` file at root

2. To run the development server, within the cloned repo:

    ```bash
    npm run dev
    ```

    - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production mode

To build the production-ready optimized build.

```bash
npm run build
```

The output of the build process is stored in the .next directory by default.

To start the server in production mode

```bash
npm run start
```

The command serves the previously built and optimized version of your application. Next.js runs the server on port 3000 by default


## Pages

Public Pages

- Home: [`/`]
- Blog: [`/blog`]
- Contacts: [`/contacts`]

Protected Page Segments

- User Home: [`/user`]

## Route Handlers

- Authentication route segment: `/api/auth`