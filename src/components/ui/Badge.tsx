export default function Badge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm">
      {text}
    </span>
  );
}