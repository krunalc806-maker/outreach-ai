export default function ChatSkeleton() {
  return (
    <div aria-label="Loading conversation" className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-8">
      {["one", "two", "three"].map((item, index) => (
        <div key={item} className={`animate-pulse rounded-2xl bg-white/5 p-5 ${index % 2 ? "ml-auto max-w-md" : "max-w-xl"}`}>
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="mt-4 h-3 w-full rounded bg-white/10" />
          <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
