export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        app: "Ledgerly",
        status: "online",
      });
    }

    if (url.pathname === "/api/transactions") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM transactions ORDER BY date DESC"
      ).all();

      return Response.json(results);
    }

    return env.ASSETS.fetch(request);
  },
};
