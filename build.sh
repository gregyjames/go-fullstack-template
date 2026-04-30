docker build . -t gorm-app --no-cache
docker run -p=3000:3000 -v "$(pwd)/data:/data" gorm-app