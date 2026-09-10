import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/toast.store";
import Toast from "@/components/ui/toast/toast";
import "@/components/ui/toast/toast-container.css";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
