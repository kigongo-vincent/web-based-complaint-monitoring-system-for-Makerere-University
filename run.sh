#!/bin/bash

# Save current directory
CURRENT_DIR=$(pwd)

# Change directory to /backend
cd "$CURRENT_DIR/backend" || exit

# Run Django server
python manage.py runserver &


# Change directory back to the original
cd "$CURRENT_DIR" || exit

# Change directory to /frontend
cd "$CURRENT_DIR/frontend" || exit

# Run npm dev server
npm run dev
