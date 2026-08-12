interface StatusMessageProps {
  variant: "loading" | "error";
  message: string;
  onRetry?: () => void;
}

export default function StatusMessage({ variant, message, onRetry }: StatusMessageProps) {
  return (
    <div className={`status status--${variant}`} role="status">
      <span className="status__mark">{variant === "loading" ? "•••" : "!"}</span>
      <p className="status__text">{message}</p>
      {variant === "error" && onRetry && (
        <button className="status__retry" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  );
}
