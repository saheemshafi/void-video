# Void Video Monorepo

Void video is a online video sharing platform in which you can share videos, manage playlists, go live and much more.

## What's inside?

This Monorepo includes the following packages/apps:

### Apps and Packages

- `web`: an [Angular](https://angular.dev/) app for the main application where people can watch, go live and explore.
- `studio`: another [Angular](https://angular.dev/) app for managing the channel and displaying analytics.
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Build

To build all apps and packages, run the following command:

```bash
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```bash
cd my-turborepo
pnpm dev
```

### Applications and Packages

- [Server](/apps/server/) - A [NodeJS](https://nodejs.org/en) application faciliating backend.
- [Web](/apps/web/) - An [Angular](https://angular.dev/) application for the end users.
- [Studio](/apps/studio/) - Another [Angular](https://angular.dev/) application for managing channel and tracking analytics.
