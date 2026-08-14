const cors = {
  "Access-Control-Allow-Origin":
    "https://ledgerly.praveenmdu127.workers.dev",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // Health Check
    if (url.pathname === "/api/health") {
      return Response.json(
        {
          app: "Ledgerly",
          status: "online",
        },
        { headers: cors }
      );
    }

    // Get Transactions
    if (
      request.method === "GET" &&
      url.pathname === "/api/transactions"
    ) {
      const { results } = await env.DB.prepare(
        `SELECT * FROM transactions ORDER BY date DESC`
      ).all();

      return Response.json(results, { headers: cors });
    }

    // Add Single Transaction
    if (
      request.method === "POST" &&
      url.pathname === "/api/transactions"
    ) {
      const tx = await request.json();

      const duplicate = await env.DB.prepare(
        `SELECT id FROM transactions
         WHERE merchant=? AND amount=? AND date=?
         LIMIT 1`
      )
        .bind(tx.merchant, tx.amount, tx.date)
        .first();

      if (duplicate) {
        return Response.json(
          { success: false, duplicate: true },
          { headers: cors }
        );
      }

      await env.DB.prepare(`
        INSERT INTO transactions
        (id, merchant, amount, type, category, account, note, date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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

      return Response.json(
        { success: true },
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
           WHERE merchant=? AND amount=? AND date=?
           LIMIT 1`
        )
          .bind(tx.merchant, tx.amount, tx.date)
          .first();

        if (exists) {
          duplicates++;
          continue;
        }

        await env.DB.prepare(`
          INSERT INTO transactions
          (id, merchant, amount, type, category, account, note, date, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          success: true,
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
