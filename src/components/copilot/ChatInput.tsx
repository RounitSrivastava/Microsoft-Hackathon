"use client";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
}: ChatInputProps) {
  return (
    <div className="flex gap-3 mt-4">
      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
        placeholder="Ask OrgMind about risks, dependencies, bottlenecks..."
        className="flex-1 bg-slate-900 text-white p-4 rounded-xl outline-none border border-slate-700"
      />

      <button
        onClick={onSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl"
      >
        Send
      </button>
    </div>
  );
}