import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, Send } from 'lucide-react';

import { createClient } from '@supabase/supabase-js'

const ImageUpload = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const clearSelection = () => {
    setPreview(null);
    setFileName('');
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await onFileSelect(selectedFile);
      clearSelection();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full mx-auto my-20" >
      {!preview ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          style={{ backgroundColor: '#dfddde'}}
        >
          {/* <UploadCloud className="mx-auto h-12 w-12 text-gray-400" /> */}
          <img
              src="/images/recordati_bigode.jpg"
              alt="Top decoration"
              className="w-full h-full object-cover"
            />
          <p className="mt-2 text-sm text-gray-600">
            <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
              Abrir Ficheiro
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full object-cover rounded-lg"
            />
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{fileName}</span>
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center px-4 py-2 rounded-md text-white ${
                isUploading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isUploading ? (
                <>
                  <span className="mr-2">A enviar...</span>
                  <span className="animate-spin">⌛</span>
                </>
              ) : (
                <>
                  <span className="mr-2">Enviar</span>
                  {/* <Send className="h-4 w-4" /> */}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ImageMatchingGame = () => {

  const fragment = window.location.hash.substring(1);
  // Create a single supabase client for interacting with your database
  const supabase = createClient('https://fgdcwqmfstbspzwotoxd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZGN3cW1mc3Ric3B6d290b3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzNzg2NzgsImV4cCI6MjA0NTk1NDY3OH0.-kC2o9L3WYLJrcD_q-7ECgxsV4Q_AYNz51jdkYG66eo')


  const handleFileSelect = async (file) => {
    // This function can now be async since we're handling the upload state
    try {
      // Your upload logic here
      console.log(fragment)
      
      const { data, error } = await supabase
      .storage
      .from('recordati')
      .upload(`public/${fragment}.png`, file, {
        cacheControl: '3600',
        upsert: false
      })
      console.log(data)
      console.log(error)
    } catch (error) {
      throw error; // The component will handle the error state
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Main game container */}
      <div className="max-w-4xl mx-auto px-4 pb-8 sm:pb-12">
        <div className="bg-white ">
        
          <div>
            <img
              src="/images/recordati_1.jpg"
              alt="Top decoration"
              className="w-full h-full object-cover"
            />
          </div>

          <ImageUpload onFileSelect={handleFileSelect} />
        </div>
        <img
            src="/images/recordati_2.jpg"
            alt="Top decoration"
            className="w-full h-full object-cover"
          />
      </div>

      {/* Bottom decorative image */}
    
        
        
   
    </div>
  );

};

export default ImageMatchingGame;