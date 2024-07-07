<!-- markdownlint-disable MD030 -->

# Contributing to MVP WebApp

We appreciate any form of contributions.

## ⭐ Star

Star and share the [Github Repo](https://github.com/openroboticmetaverse/mvp-webapp).

## 🙋 Q&A

Search for any questions in the [Q&A section](https://github.com/openroboticmetaverse/mvp-webapp/discussions/categories/q-a). If you can't find one, create one to help others with similar questions.

## 💡 Ideas

Ideas for new features, improvements, and integrations are welcome. Submit them in the [Ideas section](https://github.com/openroboticmetaverse/mvp-webapp/discussions/categories/ideas).

## 🐞 Report Bugs

Found an issue? [Report it](https://github.com/openroboticmetaverse/mvp-webapp/issues/new/choose).

## 👨‍💻 Contribute to Code

Not sure what to contribute? Here are some ideas:

- Create new components.
- Update existing components by extending functionality or fixing bugs.
- Add new features or improve documentation.

### Developers

MVP WebApp has multiple modules in a single repository.

- `backend`: Node.js backend to serve API logic.
- `frontend`: Vue.js frontend.
- `components`: Custom and third-party integrations.

#### Prerequisite

- Install [PNPM](https://pnpm.io/installation).
    ```bash
    npm i -g pnpm
    ```

#### Step by step

1. Fork the official [MVP WebApp Repository](https://github.com/openroboticmetaverse/mvp-webapp).

2. Clone your forked repository.

3. Create a new branch. Naming conventions:
    - Feature branch: `feature/<Your New Feature>`
    - Bug fix branch: `bugfix/<Your New Bugfix>`

4. Switch to the newly created branch.

5. Navigate to the repository folder:
    ```bash
    cd mvp-webapp
    ```

6. Install all dependencies:
    ```bash
    pnpm install
    ```

7. Build all the code:
    ```bash
    pnpm build
    ```

8. Start the app at [http://localhost:3000](http://localhost:3000):
    ```bash
    pnpm start
    ```

9. For development:
    - Create a `.env` file and specify the necessary environment variables.
    - Run the development server:
    ```bash
    pnpm dev
    ```

    Changes in `frontend` or `backend` will reflect at [http://localhost:3000](http://localhost:3000).

10. After making changes, build and start the app to ensure everything works:
    ```bash
    pnpm build
    pnpm start
    ```

11. Commit code and submit a pull request from your forked branch pointing to the `main` branch of the [MVP WebApp repository](https://github.com/openroboticmetaverse/mvp-webapp/tree/main).

## 🌱 Environment Variables

Specify the following variables in the `.env` file inside the `backend` folder:

| Variable             | Description                                 | Type    | Default |
| -------------------- | ------------------------------------------- | ------- | ------- |
| PORT                 | The HTTP port the app runs on               | Number  | 3000    |
| DATABASE_URL         | Database connection string                  | String  |         |
| JWT_SECRET           | Secret key for JWT                          | String  |         |
| NODE_ENV             | Node environment (`development` or `production`) | String  | development |

You can also specify environment variables when using `npx`:
```bash
npx mvp-webapp start --PORT=3000
