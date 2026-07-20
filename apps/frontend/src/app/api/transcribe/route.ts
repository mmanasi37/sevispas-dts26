export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "Voice input isn't configured yet (missing OPENAI_API_KEY)." },
      { status: 503 },
    );
  }

  const incoming = await req.formData();
  const audio = incoming.get("audio");
  const language = incoming.get("language");

  if (!(audio instanceof Blob)) {
    return Response.json({ error: "No audio provided." }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.append("file", audio, "speech.webm");
  outgoing.append("model", "whisper-1");
  // Tok Pisin isn't a Whisper-supported language code; let it auto-detect
  // instead of forcing a hint that the API would reject.
  if (language === "en") outgoing.append("language", "en");

  try {
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: outgoing,
    });

    if (!res.ok) {
      console.error("Whisper transcription error:", await res.text());
      return Response.json({ error: "Couldn't transcribe audio." }, { status: 502 });
    }

    const data = (await res.json()) as { text: string };
    return Response.json({ text: data.text });
  } catch (err) {
    console.error("Transcription request failed:", err);
    return Response.json({ error: "Couldn't transcribe audio." }, { status: 502 });
  }
}
