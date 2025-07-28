# FitSpark

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo/fit-app/actions)

## Description

FitSpark is an AI-powered fitness tracking and coaching platform built as a monorepo application. It helps users track workouts, follow plans, monitor progress, and achieve fitness goals using modern web technologies and Firebase backend.

Key features include:

- User authentication and profile management
- Workout plan selection and viewing
- Interactive workout sessions with logging
- Progress tracking with charts
- Dashboard for quick actions and overviews

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Monorepo Tools**: Turborepo, PNPM Workspaces
- **Testing**: Vitest, React Testing Library
- **Deployment**: Firebase Hosting, GitHub Actions CI/CD

## Prerequisites

- Node.js >=18
- PNPM >=8 (install via `npm install -g pnpm`)
- Firebase account and CLI (`npm install -g firebase-tools`)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/fit-app.git
   cd fit-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up Firebase:
   - Create Firebase projects (fitspark-dev and fitspark-prod)
   - Run `firebase login`
   - Configure .env files in apps/web with your Firebase config (see deploy.md for details)

4. Seed data (optional):
   ```bash
   cd packages/seeding
   node scripts/seed-firestore.js
   ```

## Usage

### Development

```bash
pnpm dev
```

Open http://localhost:5173

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
pnpm test:coverage
```

### Deploy

- Staging: `pnpm deploy:staging`
- Production: `pnpm deploy:production`

See deploy.md for full deployment guide.

## Project Structure

```
fit-app/
├── apps/web/         # React frontend
├── packages/shared/  # Shared types/schemas
├── packages/seeding/ # Data seeding scripts
├── docs/             # Documentation
├── firebase.json     # Firebase config
└── README.md
```

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See docs/branches/README.md for branching strategy.

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-repo/fit-app](https://github.com/your-repo/fit-app)
