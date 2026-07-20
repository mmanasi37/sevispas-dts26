"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Sparkles, Mic, Square, Volume2, VolumeX } from "lucide-react";
import useLanguage from "@/hooks/use-language";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm Chache! I can help explain loan applications, statuses, and repayments. Ask me anything, in English or Tok Pisin.",
};

export default function ChacheChat() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!voiceReplyEnabled || !text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // No browser ships a Tok Pisin voice; English TTS reading Tok Pisin's
    // Latin-script text is still intelligible, so it's the best fallback.
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";
      for (; ;) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: assistantText }]);
      }
      speak(assistantText);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Sorry, I couldn't respond just now. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const transcribeAndSend = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const form = new FormData();
      form.append("audio", blob, "speech.webm");
      form.append("language", language);

      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text?.trim()) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "Sorry, I couldn't hear that clearly. Please try again." },
        ]);
        return;
      }
      send(data.text.trim());
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't hear that clearly. Please try again." },
      ]);
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        transcribeAndSend(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn't access your microphone. Please check your browser's mic permission." },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 rounded-full shadow-lg px-5 gap-2 z-50"
        aria-label="Open Chache assistant"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Ask Chache</span>
      </Button>
    );
  }

  return (
    <Card className="shadow-none fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[32rem] max-h-[calc(100vh-6rem)] shadow-2xl z-50 flex flex-col p-0 gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm">Chache</CardTitle>
            <p className="text-xs text-gray-500">Borrower assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setVoiceReplyEnabled((v) => !v);
              window.speechSynthesis?.cancel();
            }}
            aria-label={voiceReplyEnabled ? "Mute Chache's voice" : "Unmute Chache's voice"}
          >
            {voiceReplyEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent ref={scrollRef} className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
            >
              {m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </CardContent>

      <div className="border-t p-3 flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening…" : isTranscribing ? "Transcribing…" : "Ask Chache..."}
          className="min-h-[40px] max-h-24 resize-none text-sm py-2"
          disabled={isStreaming || isRecording || isTranscribing}
        />
        <Button
          onClick={toggleRecording}
          disabled={isStreaming || isTranscribing}
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          className="h-10 w-10 p-0 shrink-0"
          aria-label={isRecording ? "Stop recording" : "Ask Chache by voice"}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button onClick={() => send()} disabled={isStreaming || !input.trim()} size="sm" className="h-10 w-10 p-0 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
