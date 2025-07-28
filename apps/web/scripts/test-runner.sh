#!/bin/bash

# FitSpark Test Runner Script
# Usage: ./scripts/test-runner.sh [option]

echo "🚀 FitSpark Test Runner"
echo "========================"

case "$1" in
  "unit")
    echo "Running Unit Tests..."
    npm run test:run -- --reporter=verbose
    ;;
  "coverage")
    echo "Running Tests with Coverage..."
    npm run test:coverage
    ;;
  "watch")
    echo "Running Tests in Watch Mode..."
    npm run test:watch
    ;;
  "ui")
    echo "Opening Test UI..."
    npm run test:ui
    ;;
  "quick")
    echo "Running Quick Test Suite..."
    npm run test:run -- --reporter=basic
    ;;
  *)
    echo "Available options:"
    echo "  unit     - Run unit tests with verbose output"
    echo "  coverage - Run tests with coverage report"
    echo "  watch    - Run tests in watch mode"
    echo "  ui       - Open test UI"
    echo "  quick    - Run quick test suite"
    echo ""
    echo "Example: ./scripts/test-runner.sh unit"
    ;;
esac 