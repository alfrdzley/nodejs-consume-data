const http = require("http");
const url = require("url");

const menu = ["Nasi goreng", "Mie goreng", "Mie rebus", "Es teh", "Teh tawar"];
const MISSING = 3;

const server = http.createServer((request, response) => {
  const { pathname } = url.parse(request.url);

  let id = pathname.match(/\/(\d+)$/);

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
      menu: menu[id % menu.length],
    })
  );
});

server.listen(process.env.PORT || 0, () => {
  const { port } = server.address();
  console.log(`Order service running on port ${port}`);
});
