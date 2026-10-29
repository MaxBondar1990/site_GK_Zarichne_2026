# Load the regular interactive shell settings, then select this project's Node.
if [ -f "$HOME/.bashrc" ]; then
  source "$HOME/.bashrc"
fi
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
  nvm use 24
else
  printf '%s\n' 'Node.js 24 is required. Install nvm and run nvm install 24.'
fi
