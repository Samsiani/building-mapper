import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ConfirmButton({ onConfirm, children, className, timeout = 3000 }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), timeout);
    } else {
      clearTimeout(timerRef.current);
      setConfirming(false);
      onConfirm();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2.5 border-none rounded-[var(--radius-sm)] font-[var(--font-sans)] text-[13px] font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97]',
        confirming
          ? 'bg-[var(--red)] text-white animate-[shake_300ms_ease]'
          : 'bg-[rgba(239,68,68,0.12)] text-[var(--red)] hover:bg-[rgba(239,68,68,0.2)]',
        className
      )}
    >
      {confirming ? (
        <>
          <AlertTriangle size={16} />
          Confirm Delete?
        </>
      ) : (
        children || (
          <>
            <Trash2 size={16} />
            Delete Unit
          </>
        )
      )}
    </button>
  );
}
