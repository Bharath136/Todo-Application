const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

module.exports = app;

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http:localhost:4000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
  }
};

initializeDBAndServer();

app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getStatusQuery = `
        SELECT * FROM todo WHERE status LIKE "%${status}%";
    `;
  const statusArray = await db.all(getStatusQuery);
  response.send(statusArray);
});

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getStatusQuery = `
        SELECT * FROM todo WHERE priority LIKE "%${priority}%";
    `;
  const priorityArray = await db.all(getStatusQuery);
  response.send(priorityArray);
});

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const getStatusQuery = `
        SELECT * FROM todo WHERE priority LIKE "%${priority}%" AND status LIKE "%${status}%";
    `;
  const priorityArray = await db.all(getStatusQuery);
  response.send(priorityArray);
});

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const getStatusQuery = `
        SELECT * FROM todo WHERE todo LIKE "%${search_q}%";
    `;
  const priorityArray = await db.all(getStatusQuery);
  response.send(priorityArray);
});

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const getStatusQuery = `
        SELECT * FROM todo WHERE id = ${todoId};
    `;
  const priorityArray = await db.get(getStatusQuery);
  response.send(priorityArray);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const getStatusQuery = `
        INSERT INTO todo(id,todo,priority,status) 
        VALUES (
            ${id},
            "${todo}",
            "${priority}",
            "${status}"
        );
    `;
  await db.run(getStatusQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;
  const getStatusQuery = `
        UPDATE
            todo
        SET
            status = '${status}'
        WHERE
            id = ${todoId};

    `;
  await db.run(getStatusQuery);
  response.send("Status Updated");
});

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.body;
  const getStatusQuery = `
        UPDATE
            todo
        SET
            priority = '${priority}'
        WHERE
            id = ${todoId};

    `;
  await db.run(getStatusQuery);
  response.send("Priority Updated");
});

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const getStatusQuery = `
        UPDATE 
            todo
        SET 
            todo = '${todo}'
        WHERE 
            id = ${todoId};

    `;
  await db.run(getStatusQuery);
  response.send("Todo Updated");
});

app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const getStatusQuery = `
        DELETE FROM todo WHERE id = ${todoId};
    `;
  await db.run(getStatusQuery);
  response.send("Todo Deleted");
});
