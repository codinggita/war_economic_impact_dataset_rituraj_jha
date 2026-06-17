import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import PageWrapper from '../components/layout/PageWrapper';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileImage, X, CheckCircle, Loader2, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('File too large. Maximum 10MB allowed.');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>File Upload | War Economic Impact</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">File Upload</h1>
        <p className="text-muted-foreground mb-8">Upload images and documents related to conflict economic data.</p>

        {/* Drop Zone */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 bg-card'
          }`}
          onClick={() => document.getElementById('file-input').click()}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <CloudUpload size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-medium">Drag & drop a file here, or click to browse</p>
          <p className="text-muted-foreground text-sm mt-1">JPEG, PNG, WebP, GIF, PDF — Max 10MB</p>
        </motion.div>

        {/* File Preview */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <FileImage size={32} className="text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground truncate max-w-[250px]">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              {/* Upload Button */}
              {!result && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload to Cloud
                    </>
                  )}
                </button>
              )}

              {/* Upload Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="font-semibold text-green-400">Upload Successful!</span>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><span className="font-medium text-foreground">URL:</span>{' '}
                      <a href={result.url} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                        {result.url}
                      </a>
                    </p>
                    <p><span className="font-medium text-foreground">Format:</span> {result.format}</p>
                    <p><span className="font-medium text-foreground">Size:</span> {formatSize(result.size)}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default UploadPage;
