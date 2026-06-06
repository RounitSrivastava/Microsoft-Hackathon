interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({
  messages,
}: ChatWindowProps) {
  return (
    <div className="bg-[#030611] border border-indigo-950/80 rounded-2xl p-6 h-[480px] overflow-y-auto custom-scrollbar shadow-inner">
      <div className="space-y-5">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`max-w-[80%] flex flex-col ${isUser ? "ml-auto items-end" : "items-start"}`}
            >
              {/* Telemetry Header */}
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                {isUser ? "USER SOURCE" : "AI COPILOT SCAN"}
              </span>

              {/* Message Bubble */}
              <div
                className={`p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-indigo-950/30 text-white border border-indigo-500/25 rounded-2xl rounded-tr-sm shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                    : "bg-[#090d1a] text-slate-100 border border-cyan-500/25 rounded-2xl rounded-tl-sm shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}