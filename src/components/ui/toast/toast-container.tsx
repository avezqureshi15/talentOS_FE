import { useToastStore } from "@/store/toast.store";
import Toast from "@/components/ui/toast/toast";
import "@/components/ui/toast/toast-container.css";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
