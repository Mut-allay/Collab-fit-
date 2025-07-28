# FitSpark Testing Setup 🧪

## Quick Start

### Run All Tests

```bash
npm run test:run
```

### Run with Coverage

```bash
npm run test:coverage
```

### Watch Mode (Development)

```bash
npm run test:watch
```

### Test UI

```bash
npm run test:ui
```

## Test Structure

```
src/
├── components/
│   ├── ui/
│   │   └── LoadingSpinner.test.tsx ✅
│   └── auth/
│       └── LoginForm.simple.test.tsx ✅
├── lib/
│   └── utils.test.ts ✅
└── setupTests.ts ✅
```

## Current Status

- ✅ **16/16 tests passing**
- ✅ **2 files with 100% coverage**
- ✅ **Testing framework configured**
- ✅ **Coverage reporting enabled**

## Next Steps

1. Add tests for more components
2. Implement integration tests
3. Add E2E tests with Playwright
4. Increase overall coverage to 80%+

## Test Commands Reference

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run test`          | Start test runner       |
| `npm run test:run`      | Run all tests once      |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:watch`    | Run tests in watch mode |
| `npm run test:ui`       | Open test UI            |

## Coverage Goals

- **Current**: 0.13%
- **Target**: 80%+
- **Fully Covered**: LoadingSpinner, utils

---

📖 **Full Documentation**: See `QA_TESTING_GUIDE.md` for comprehensive testing guidelines.
