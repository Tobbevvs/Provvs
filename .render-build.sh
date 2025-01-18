#!/usr/bin/env bash
echo "Rensar gamla node_modules..."
rm -rf node_modules
echo "Installerar beroenden med korrekt byggmiljö..."
npm install --build-from-source sqlite3

