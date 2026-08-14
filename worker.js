export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health Check
    if (url.pathname === "/api/health") {
      return Response.json({
        app: "Ledgerly",
        status: "online",
      });
    }

    // GET Transactions
    if (
      request.method === "GET" &&
      url.pathname === "/api/transactions"
    ) {
      const { results } = await env.DB.prepare(
        `SELECT * FROM transactions ORDER BY date DESC`
      ).all();

      return Response.json(results, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // POST Transaction
    if (
      request.method === "POST" &&
      url.pathname === "/api/transactions"
    ) {
      const body = await request.json();

      await env.DB.prepare(`
        INSERT INTO transactions
        (id,merchant,amount,type,category,account,note,date,created_at)
        VALUES(?,?,?,?,?,?,?,?,?)
      `)
        .bind(
          body.id,
          body.merchant,
          body.amount,
          body.type,
          body.category,
          body.account,
          body.note,
          body.date,
          new Date().toISOString()
        )
        .run();

      return Response.json({ success: true });
    }

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type",
        },
      });
    }

    return new Response("Ledgerly API");
  },
};
