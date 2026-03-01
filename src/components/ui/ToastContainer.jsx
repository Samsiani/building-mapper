import { createPortal } from 'react-dom';
import { useToastStore } from '../../stores/toastStore';
import Toast from './Toast';

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
}
