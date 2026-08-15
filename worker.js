export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods":
        "GET,POST,PUT,DELETE,OPTIONS",
    };

    if (request.method === "OPTIONS")
      return new Response("", {
        headers: cors,
      });

    // ---------- HEALTH ----------
    if (url.pathname === "/api/health") {
      return json({
        status: "ok",
        version: "8.1",
      });
    }

    // ---------- LOGIN ----------
    if (
      url.pathname === "/api/login" &&
      request.method === "POST"
    ) {
      const body = await request.json();

      const user = await env.DB.prepare(
        `SELECT * FROM users
         WHERE email=?1 AND pin=?2`
      )
        .bind(body.email, body.pin)
        .first();

      if (!user) {
        return json(
          { error: "Invalid credentials" },
          401
        );
      }

      return json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }

    // ---------- REGISTER ----------
    if (
      url.pathname === "/api/register" &&
      request.method === "POST"
    ) {
      const body = await request.json();

      const id = crypto.randomUUID();

      try {
        await env.DB.prepare(
          `INSERT INTO users
          (id,name,email,pin)
          VALUES(?1,?2,?3,?4)`
        )
          .bind(
            id,
            body.name,
            body.email,
            body.pin
          )
          .run();

        return json({
          id,
          name: body.name,
          email: body.email,
        });
      } catch {
        return json(
          { error: "Email already exists" },
          400
        );
      }
    }

    // ---------- GET TRANSACTIONS ----------
    if (
      url.pathname === "/api/transactions" &&
      request.method === "GET"
    ) {
      const userId =
        request.headers.get("x-user-id");

      const result = await env.DB.prepare(
        `SELECT *
         FROM transactions
         WHERE user_id=?1
         ORDER BY date DESC`
      )
        .bind(userId)
        .all();

      return json(result.results);
    }

    // ---------- ADD TRANSACTION ----------
    if (
      url.pathname === "/api/transactions" &&
      request.method === "POST"
    ) {
      const body = await request.json();

      const id = crypto.randomUUID();

      await env.DB.prepare(
        `INSERT INTO transactions
        (id,user_id,merchant,amount,type,
         category,account,note,date,transfer,recurring_id)
        VALUES(?1,?2,?3,?4,?5,
               ?6,?7,?8,?9,?10,?11)`
      )
        .bind(
          id,
          body.user_id,
          body.merchant,
          body.amount,
          body.type,
          body.category,
          body.account,
          body.note,
          body.date,
          body.transfer ? 1 : 0,
          body.recurring_id || null
        )
        .run();

      return json({
        success: true,
        id,
      });
    }

    // ---------- GET ACCOUNTS ----------
    if (
      url.pathname === "/api/accounts" &&
      request.method === "GET"
    ) {
      const userId =
        request.headers.get("x-user-id");

      const result = await env.DB.prepare(
        `SELECT *
         FROM accounts
         WHERE user_id=?1`
      )
        .bind(userId)
        .all();

      return json(result.results);
    }

    // ---------- ADD ACCOUNT ----------
    if (
      url.pathname === "/api/accounts" &&
      request.method === "POST"
    ) {
      const body = await request.json();

      const id = crypto.randomUUID();

      await env.DB.prepare(
        `INSERT INTO accounts
        (id,user_id,name,type,opening)
        VALUES(?1,?2,?3,?4,?5)`
      )
        .bind(
          id,
          body.user_id,
          body.name,
          body.type,
          body.opening
        )
        .run();

      return json({
        success: true,
        id,
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: cors,
    });

    function json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          ...cors,
        },
      });
    }
  },
};
