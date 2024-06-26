const Hapi = require("@hapi/hapi");
const got = require("got");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  server.route({
    method: "GET",
    path: "/{id}",
    handler: async (request, h) => {
      const { id } = request.params;

      try {
        const [order, user] = await Promise.all([
          got(`${orderService}/${id}`).json(),
          got(`${userService}/${id}`).json(),
        ]);
        return {
          id: order.id,
          menu: order.menu,
          user: user.name,
        };
      } catch (error) {
        if (!error.response) throw error;
        if (error.response.statusCode === 404) {
          return h.response({ message: "Bad Request" }).code(400);
        }
        if (error.response.statusCode === 400) {
          return h.response({ message: "Not Found" }).code(404);
        }

        throw error;
      }
    },
  });
};

const { ORDER_SERVICE_PORT = 4000, USER_SERVICE_PORT = 5000 } = process.env;

const orderService = `http://localhost:${ORDER_SERVICE_PORT}`;
const userService = `http://localhost:${USER_SERVICE_PORT}`;

init();
