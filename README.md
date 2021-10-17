# Serverless CRUD app

### Endpoints:

- /getTodos (GET)
- /getTodo/{id} (GET)
- /postTodo (POST)
- /updateTodo (PUT)
- /deleteTodo/{id} (DELETE)

Post data format:

```
{
    "title": "Task 1"
}
```

Put data format:

```
{
    "id": "6b452a17-c5a7-445f-9a6e-c7d64595c4b1",
    "title": "Updated task 3",
    "isCompleted": true
}
```

## To run it on your local:

Prerequisites:

- A working AWS account
- Same account properly configured on your machine with

```
aws configure
```

- Globally installed serverless framework

```
npm install -g serverless
```

Finally

```
git clone https://github.com/cyproto/awsugnsk-lambda-prac-demo.git todoapp
cd todoapp
npm install
sls deploy
```
