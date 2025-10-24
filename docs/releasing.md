# Releasing a New Version

This document outlines the process for publishing a new version of `rst.js` to the npm registry. The process is automated using GitHub Actions.

## Publishing Workflow

The repository is configured with a release workflow defined in `.github/workflows/release.yml`. This workflow automatically builds and publishes the package to npm whenever a new version tag is pushed to the repository.

### How It Works

1.  **Trigger**: The workflow is triggered when a tag matching the pattern `v*.*.*` (e.g., `v1.0.1`, `v2.3.0`) is pushed to the `main` branch.
2.  **Checkout**: The workflow checks out the code from the repository.
3.  **Setup Node.js**: It sets up a Node.js environment and configures it to use the npm registry.
4.  **Install Dependencies**: It installs the project's dependencies using `npm ci` for a clean, reproducible build.
5.  **Build Project**: It compiles the TypeScript source code into JavaScript using the `npm run build` command.
6.  **Publish to npm**: It publishes the package to the npm registry using `npm publish --access public`.

### Prerequisites

For the publishing workflow to succeed, the following must be configured in the GitHub repository:

-   **`NPM_TOKEN` Secret**: An npm access token must be created and added as a secret to the repository with the name `NPM_TOKEN`. This token is used to authenticate with the npm registry. The token should have "publish" permissions.

## Steps to Release a New Version

1.  **Ensure `main` is Up-to-Date**: Make sure your local `main` branch has all the latest changes from the remote repository.

    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Update `package.json`**: Manually update the `version` field in `package.json` to the new version number. Follow [Semantic Versioning](https://semver.org/) guidelines.

3.  **Commit the Version Change**: Commit the updated `package.json` file.

    ```bash
    git add package.json
    git commit -m "chore: bump version to vX.Y.Z"
    ```

4.  **Tag the Release**: Create a new Git tag with the same version number, prefixed with `v`.

    ```bash
    git tag vX.Y.Z
    ```

5.  **Push Changes and Tags**: Push the commit and the new tag to the `main` branch on GitHub.

    ```bash
    git push origin main
    git push origin vX.Y.Z
    ```

Once the tag is pushed, the "Release Package" GitHub Actions workflow will automatically trigger, and if it succeeds, the new version will be available on npm.
