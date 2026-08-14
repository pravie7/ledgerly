export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Health API
  if (url.pathname === "/api/health") {
    return Response.json({
      app: "Ledgerly",
      status: "online",
    });
  }

  // Get Transactions
  if (
    request.method === "GET" &&
    url.pathname === "/api/transactions"
  ) {
    const { results } = await env.DB.prepare(
      "SELECT * FROM transactions ORDER BY date DESC"
    ).all();

    return Response.json(results);
  }

  // Add Transaction
  if (
    request.method === "POST" &&
    url.pathname === "/api/transactions"
  ) {
    const body = await request.json();

    await env.DB.prepare(`
      INSERT INTO transactions
      (id,merchant,amount,type,category,account,note,date,created_at)
      VALUES (?,?,?,?,?,?,?,?,?)
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

  // Everything else → React app
  return next();
}
