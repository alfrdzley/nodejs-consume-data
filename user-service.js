const http = require("http");
const url = require("url");

const users = ["Aras", "Arsy", "Dimas", "Ivan", "Rafy", "Gilang"];
const MISSING = 4;

const server = http.createServer((request, response) => {
  const { pathname } = url.parse(request.url);
  let id = pathname.match(/^\/(\d+)$/);
  if (!id) {
    response.statusCode = 400;
    return void response.end();
  }

  id = Number(id[1]);

  if (id === MISSING) {
    response.statusCode = 404;
    return void response.end();
  }

  response.setHeader("Content-Type", "application/json");

  response.end(
    JSON.stringify({
      id,
      name: users[id % users.length],
    })
  );
});

server.listen(process.env.PORT || 0, () => {
  const { port } = server.address();
  console.log(`User service listening on localhost on port: ${port}`);
});
