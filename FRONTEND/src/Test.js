import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { domain } from "./Hostdata";

const Test = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch the images from the server
        axios.get(domain+'/test/images', { withCredentials: true })
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    return (
        <div>
            {images.length > 0 ? (
                images.map((image, index) => (
                    <img key={index} src={image.profile_name} alt={image[0]} style={{ margin: '10px', width: '200px', height: 'auto' }} />
                ))
            ) : (
                'Loading images...'
            )}
        </div>
    );
};

export default Test;
