type NotificationToastProps = {
  message: string;
  visible: boolean;
};

export default function NotificationToast({
  message,
  visible,
}: NotificationToastProps) {
  return (
    <div
      className={`fixed left-1/2 top-16 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 transition-all duration-500 sm:top-14 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-center text-sm text-white shadow-lg backdrop-blur-md sm:px-5">
        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-400 animate-pulse" />
        <span className="line-clamp-2">{message}</span>
      </div>
    </div>
  );
}
