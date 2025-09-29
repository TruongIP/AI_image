
import React, { useCallback, useState } from 'react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
  title: string;
  description?: string;
  files: ImageFile[];
  onFilesChange: (files: ImageFile[]) => void;
  maxFiles: number;
  compact?: boolean;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, description, files, onFilesChange, maxFiles, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: ImageFile[] = [];
    for (let i = 0; i < selectedFiles.length && (files.length + newFiles.length) < maxFiles; i++) {
      const file = selectedFiles[i];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        newFiles.push({ name: file.name, type: file.type, base64 });
      }
    }
    onFilesChange([...files, ...newFiles]);
  }, [files, maxFiles, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };
  
  const dragProps = {
    onDragEnter: (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(true); },
    onDragLeave: (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); },
    onDragOver: (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); },
    onDrop: handleDrop,
  };

  return (
    <div>
      <h3 className={`font-semibold ${compact ? 'mb-1 text-sm' : 'mb-2'}`}>{title}</h3>
      {!compact && description && <p className="text-xs text-brand-subtle mb-3">{description}</p>}

      <div className="flex flex-wrap gap-2 mb-2">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <img src={`data:${file.type};base64,${file.base64}`} alt={file.name} className="w-16 h-16 object-cover rounded-md"/>
            <button onClick={() => removeFile(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">&times;</button>
          </div>
        ))}
      </div>

      {files.length < maxFiles && (
        <label
          {...dragProps}
          className={`cursor-pointer flex justify-center items-center w-full ${compact ? 'p-3' : 'p-6'} border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-brand-accent-end bg-brand-accent-end/10' : 'border-brand-muted hover:border-brand-accent-end'}`}
        >
          <div className="text-center">
             <span className={`text-sm ${isDragging ? 'text-brand-accent-end' : 'text-brand-subtle'}`}>{compact ? 'Click or drop' : title}</span>
          </div>
          <input type="file" accept="image/*" multiple={maxFiles > 1} className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;