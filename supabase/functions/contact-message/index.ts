import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

Deno.serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    if (req.method !== "POST") {
      const body: ContactResponse = {
        success: false,
        message: "Method not allowed",
      };

      return new Response(JSON.stringify(body), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: ContactRequest = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.subject || !body.message) {
      const resp: ContactResponse = {
        success: false,
        message: "Missing required fields",
      };

      return new Response(JSON.stringify(resp), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      const resp: ContactResponse = {
        success: false,
        message: "Invalid email address",
      };

      return new Response(JSON.stringify(resp), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert into contact_messages via REST
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: body.name.trim(),
        email: body.email.trim(),
        subject: body.subject.trim(),
        message: body.message.trim(),
        status: "new",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Database error:", errorText);
      throw new Error(`Database insertion failed: ${response.status}`);
    }

    const data = await response.json();
    const messageId = data?.[0]?.id ?? "unknown";

    const successResponse: ContactResponse = {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      id: messageId,
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);

    const errorResponse: ContactResponse = {
      success: false,
      message: "An error occurred while processing your message. Please try again.",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
