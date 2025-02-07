"use client"
import uploadImageToCloudinary from '@/helpers/uploadImage';
import React, { useState } from 'react';

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = () => {
    const data = uploadImageToCloudinary(image!);
    console.log(data);
  }
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {imageUrl && (
        <div>
          <p>Image uploaded successfully! Here's the link:</p>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
