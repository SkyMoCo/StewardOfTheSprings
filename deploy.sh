#!/bin/bash
# Deploy to production VM
set -e

REMOTE="74.208.136.178"
STACK_DIR="/opt/stacks/SaveOurSprings"

echo "Syncing app files..."
rsync -az --delete ./app/ $REMOTE:$STACK_DIR/app/
rsync -az --delete ./frontend/ $REMOTE:$STACK_DIR/frontend/
rsync -az ./mysql/ $REMOTE:$STACK_DIR/mysql/

echo "Rebuilding and restarting containers..."
ssh $REMOTE "cd $STACK_DIR && docker compose up -d --build app frontend"

echo "Done. Site live at https://sos.skymoco.dev"
