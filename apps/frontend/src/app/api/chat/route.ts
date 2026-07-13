import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Chache, the friendly borrower support assistant for MIJOE — a microfinance platform in Papua New Guinea powered by SevisPass digital identity.

Help borrowers with:
- Understanding the loan application process (amount, term, purpose)
- Explaining what application statuses mean (pending, under review, approved, rejected)
- Understanding repayment schedules and Kina (K) amounts
- General questions about SevisPass digital identity verification
- Speaking in English or Tok Pisin, matching whichever the borrower uses

You do not have access to any specific borrower's real account data — for account-specific questions ("what's my balance", "when is my next payment"), point them to the relevant screen (Dashboard, Status, Repayments, Profile) instead of guessing a number.

You are an informational assistant only — you cannot approve loans, change application statuses, or make binding financial or legal decisions. Keep responses concise and friendly.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("Chache isn't configured yet (missing ANTHROPIC_API_KEY).", {
      status: 503,
    });
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          output_config: { effort: "medium" },
          messages,
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await anthropicStream.finalMessage();
      } catch (err) {
        console.error("Chache error:", err);
        controller.enqueue(encoder.encode("\n\n[Chache hit an error. Please try again.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
