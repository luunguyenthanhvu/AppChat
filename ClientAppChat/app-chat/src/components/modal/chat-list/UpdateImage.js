import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageFilter from 'filepond-plugin-image-filter';
import axios from 'axios';
import { BACKEND_URL_HTTP } from '../../../config.js';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginImageEdit,
    FilePondPluginImageCrop,
    FilePondPluginImageTransform,
    FilePondPluginImageFilter
);

const UpdateImage = ({setImageFile}) => {
    const [files, setFiles] = useState([]);

    const handleProcess = async (fieldName, file, metadata, load, error, progress, abort) => {
        try {
            const signatureResponse = await axios.get(`http://${BACKEND_URL_HTTP}/api/cloudinary/get-signature`);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", signatureResponse.data.apiKey); 
            formData.append("signature", signatureResponse.data.signature);
            formData.append("timestamp", signatureResponse.data.timestamp);
            
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.cloudinary.com/v1_1/dter3mlpl/image/upload');
          
            xhr.upload.onprogress = (event) => {
                const progressPercentage = Math.round((event.loaded / event.total) * 100);
                progress(progressPercentage);
            };
    
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    const public_id = response.public_id;
                    
                    setImageFile(response.url); // Lưu URL của ảnh sau khi upload
                    console.log("Uploaded image URL: ", response.url);
                    load(public_id);
                } else {
                    error('Upload error');
                }
            };
    
            xhr.onerror = () => {
                error('Upload error');
            };
    
            xhr.send(formData);
    
            return {
                abort: () => {
                    xhr.abort();
                    abort();
                }
            };
        } catch (err) {
            console.error(err);
            error('Error occurred during upload');
        }
    };

    const handleRevert = async (source, load, error) => {
        try {
            await axios.get(`http://${BACKEND_URL_HTTP}/api/cloudinary/remove-image`, { params: { id: source } });
            setImageFile(''); // Reset URL khi ảnh bị xóa
            load();
        } catch (err) {
            console.error('Error removing image:', err);
            error('Error occurred during removal');
        }
    };

    return (
        <div className='update-image-userinfo'>
            <FilePond
                files={files}
                onupdatefiles={fileItems => setFiles(fileItems.map(fileItem => fileItem.file))}
                allowMultiple={false}
                maxFileSize='5MB'
                acceptedFileTypes={['image/*']}
                imagePreviewHeight={150}
                server={{
                    process: handleProcess,
                    revert: handleRevert
                }}
            />
        </div>
    );
};

export default UpdateImage;
