import * as THREE from "three";
const loader = new THREE.TextureLoader();

interface ImageDataInt {
  src: string | THREE.Texture;
}

export const imagesData = [
  {
    src: "https://source.unsplash.com/random/1024×576/?fruit, landscape",
  },
  {
    src: "https://source.unsplash.com/random/1024×576/?nature, landscape",
  },
  {
    src: "https://source.unsplash.com/random/1024×576/?night, landscape",
  },
  {
    src: "https://source.unsplash.com/random/1024×576/?flowers, landscape",
  },
  {
    src: "https://source.unsplash.com/random/1024×576/?ocean, landscape",
  },
  {
    src: "https://source.unsplash.com/random/1024×576/?stars, landscape",
  },
];

// Load all images concurrently using Promise.all
const imagePromises = imagesData.map((data: ImageDataInt) => {
  return new Promise((resolve, reject) => {
    loader.load(
      data.src as string,
      (texture) => {
        data.src = texture;
        resolve(data);
      },
      undefined,
      reject
    );
  });
});

export const data = Promise.all(imagePromises)
  .then((loadedImagesData) => {
    return loadedImagesData;
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });
