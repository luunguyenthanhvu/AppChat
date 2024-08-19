// UpdateImage.js
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

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginImageEdit,
    FilePondPluginImageCrop,
    FilePondPluginImageTransform,
    FilePondPluginImageFilter
);

const UpdateImage = () => {
    const [files, setFiles] = useState([]);

    const handleUpdateImage = () => {
        // Handle image upload here
        // Example:
        // axios.post(`${BACKEND_URL_HTTP}/upload`, files[0].file)
        //     .then(response => console.log(response))
        //     .catch(error => console.error(error));
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
            imageCropAspectRatio="1:1" // Cắt hình ảnh thành hình vuông
            imageTransformImage="circle" // Cắt hình ảnh thành hình tròn
            onprocessfiles={handleUpdateImage}
        />
    </div>
    );
};

export default UpdateImage;
