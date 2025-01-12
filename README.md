# Next.js Husky Template

![Build Status](https://github.com/harshsoni-harsh/nextjs-husky-template/actions/workflows/build.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)


## Overview

The **Next.js Husky Template** is a starter template for building Next.js applications with pre-installed linting packages and configurations. This template integrates Husky for Git hooks, ESLint for JavaScript linting, Prettier for code formatting, and Stylelint for CSS linting. It also includes Continuous Integration (CI) for commit linting to ensure that all commits adhere to defined conventions.

## Features

- **Next.js**: Version 15.1.4
- **React**: Version 19.x
- **Linting**: ESLint and Stylelint configured
- **Formatting**: Prettier integrated
- **Git Hooks**: Managed with Husky
- **TypeScript Support**: Type definitions included
- **Tailwind CSS**: Integrated for styling
- **Commit Linting**: Ensures commit messages follow conventional standards
- **Continuous Integration (CI)**: Automated checks for code quality on commits

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 14.x)
- [pnpm](https://pnpm.io/) (recommended package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nextjs-husky-template.git
   cd nextjs-husky-template
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Scripts

The following scripts are available in this template:

| Script          | Description                                   |
|-----------------|-----------------------------------------------|
| `dev`           | Start the development server with TurboPack  |
| `build`         | Build the application for production          |
| `start`         | Start the production server                   |
| `lint`          | Run ESLint to check for linting errors       |
| `format`        | Format code using Prettier                    |
| `lint-format`   | Run both linting and formatting               |

### Linting and Formatting

This template uses **lint-staged** to run linters on staged files before committing. The configurations are set up as follows:

- JavaScript and TypeScript files are processed by ESLint and Prettier.
- CSS files are processed by Stylelint and Prettier.

### Git Hooks

Husky is configured to ensure that your code is linted and formatted before each commit, helping maintain code quality.

### Commit Linting

This project includes commit linting to enforce conventional commit messages. The CI pipeline will automatically check commit messages against the defined rules, ensuring consistency and clarity in your project's history.

## Continuous Integration (CI)

This repository is set up with a CI pipeline that runs automated checks on every push and pull request. The CI workflow includes:

- Running tests (if applicable).
- Checking code style with ESLint.
- Validating commit messages using Commitlint.

Make sure to configure your CI environment according to your preferred service (e.g., GitHub Actions, CircleCI).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a pull request.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Husky](https://typicode.github.io/husky/#/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Stylelint](https://stylelint.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Commitlint](https://commitlint.js.org/)
