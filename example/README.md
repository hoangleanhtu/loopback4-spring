# loopback4-spring-example

## Getting Started
```
docker-compose up -d
npm run build
npm run migrate
npm start
```

## Test transaction

```
curl -X POST "http://localhost:3000/user?throwError=true" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"user\":{\"name\":\"Mary\"},\"customer\":{\"firstName\":\"Ann\",\"lastName\":\"Doe\"}}"
```
