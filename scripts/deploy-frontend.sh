$(aws ecr get-login --no-include-email --region us-east-1)
docker build --no-cache -t game-of-life-frontend ../web
docker tag game-of-life-frontend:latest 962168178617.dkr.ecr.us-east-1.amazonaws.com/game-of-life-frontend:latest
docker push 962168178617.dkr.ecr.us-east-1.amazonaws.com/game-of-life-frontend:latest