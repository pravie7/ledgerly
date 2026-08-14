const cors = {
  "Access-Control-Allow-Origin":
    "https://ledgerly.praveenmdu127.workers.dev",
  "Access-Control-Allow-Methods":
    "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // Health
    if (url.pathname === "/api/health") {
      return Response.json(
        {
          app: "Ledgerly",
          status: "online",
        },
        { headers: cors }
      );
    }

    // Get all transactions
    if (
      request.method === "GET" &&
      url.pathname === "/api/transactions"
    ) {
      const { results } = await env.DB.prepare(
        `SELECT * FROM transactions ORDER BY date DESC`
      ).all();

      return Response.json(results, { headers: cors });
    }

    // Add one transaction
    if (
      request.method === "POST" &&
      url.pathname === "/api/transactions"
    ) {
      const body = await request.json();

      const exists = await env.DB.prepare(
        `SELECT id FROM transactions
         WHERE merchant=? AND amount=? AND date=? LIMIT 1`
      )
        .bind(
          body.merchant,
          body.amount,
          body.date
        )
        .first();

      if (exists) {
        return Response.json(
          {
            duplicate: true,
          },
          { headers: cors }
        );
      }

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

      return Response.json(
        {
          success: true,
        },
        { headers: cors }
      );
    }

    // Bulk CSV Import
    if (
      request.method === "POST" &&
      url.pathname === "/api/import"
    ) {
      const rows = await request.json();

      let imported = 0;
      let duplicates = 0;

      for (const tx of rows) {
        const exists = await env.DB.prepare(
          `SELECT id FROM transactions
           WHERE merchant=? AND amount=? AND date=? LIMIT 1`
        )
          .bind(
            tx.merchant,
            tx.amount,
            tx.date
          )
          .first();

        if (exists) {
          duplicates++;
          continue;
        }

        await env.DB.prepare(`
          INSERT INTO transactions
          (id,merchant,amount,type,category,account,note,date,created_at)
          VALUES(?,?,?,?,?,?,?,?,?)
        `)
          .bind(
            tx.id,
            tx.merchant,
            tx.amount,
            tx.type,
            tx.category,
            tx.account,
            tx.note,
            tx.date,
            new Date().toISOString()
          )
          .run();

        imported++;
      }

      return Response.json(
        {
          imported,
          duplicates,
          total: rows.length,
        },
        { headers: cors }
      );
    }

    return new Response("Not Found", {
      status: 404,
      headers: cors,
    });
  },
};
