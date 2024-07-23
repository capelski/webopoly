npm i --workspaces=false --package-lock-only
docker build -f Dockerfile -t l3bowski/webopoly ..
rm -rf package-lock.json