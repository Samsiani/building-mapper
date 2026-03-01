import { memo, useCallback, useRef, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUpload = memo(function ImageUpload({ value, onChange, label = 'Background Image' }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Image too large. Please use an image under ${MAX_SIZE_MB}MB for localStorage.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target.result);
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      processFile(e.target.files[0]);
      e.target.value = '';
    },
    [processFile]
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  return (
    <div>
      <label className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-[var(--border)] group">
          <img
            src={value}
            alt="Background"
            className="w-full h-24 object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 border-none flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center gap-1.5 py-5 px-3 border-2 border-dashed rounded-lg cursor-pointer transition-all text-center
            ${dragOver
              ? 'border-[var(--accent)] bg-[var(--accent-dim)]'
              : 'border-[var(--border)] bg-[var(--bg-tertiary)] hover:border-[var(--text-tertiary)]'
            }`}
        >
          {dragOver ? (
            <Image size={20} className="text-[var(--accent)]" />
          ) : (
            <Upload size={20} className="text-[var(--text-tertiary)]" />
          )}
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {dragOver ? 'Drop image here' : 'Click or drag image'}
          </span>
          <span className="text-[9px] text-[var(--text-tertiary)]">
            JPG, PNG, WebP &middot; Max {MAX_SIZE_MB}MB
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
});

export default ImageUpload;
