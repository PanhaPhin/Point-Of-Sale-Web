import React, {useState} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const ProductImageLightBox = (props) => {
    const {isOpen, setIsOpen, lightBoxImage} = props;
    const [photoIndex, setPhotoIndex] = useState(0);

    return (
        <div>
            {isOpen && lightBoxImage[photoIndex] ? <Lightbox
                mainSrc={lightBoxImage[photoIndex]}
                nextSrc={lightBoxImage[(photoIndex + 1) % lightBoxImage.length]}
                prevSrc={lightBoxImage[(photoIndex + lightBoxImage.length - 1) % lightBoxImage.length]}
                onCloseRequest={() => setIsOpen(!isOpen)}
                onMovePrevRequest={() =>
                    setPhotoIndex((photoIndex + lightBoxImage.length - 1) % lightBoxImage.length)
                }
                onMoveNextRequest={() =>
                    setPhotoIndex((photoIndex + 1) % lightBoxImage.length)
                }
            /> : null}
        </div>
    );
}

export default ProductImageLightBox
