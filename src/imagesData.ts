import * as THREE from "three";
const loader = new THREE.TextureLoader();

interface ImageDataInt {
  src: string | THREE.Texture;
}

export const imagesData = [
  {
    src: "https://images.ctfassets.net/ez1fmuh9s880/7EKZfvXlVPnRqk37kI04Qn/8ca02f1303d4e37ca0faf548442b63b4/smart_watch__1_.png",
  },
  {
    src: "https://images.ctfassets.net/ez1fmuh9s880/ptibS1U2EsW4RuovSc7op/ccdc0ec1be75550979da423c5aec496d/aprende_coreano_paso_a_paso_1.png",
  },
  {
    src: "https://images.ctfassets.net/ez1fmuh9s880/4O8KR2ZDf48Y7pbQVTaRkY/d4323a09718d3e2fc2d07b02118e2d7a/cacteria_hero_img.png",
  },
  {
    src: "https://images.ctfassets.net/ez1fmuh9s880/3MFGKQIFyIDyXdrWbgwAqs/59b00f6b3c7803a31301114ceae752a6/pizza_ar_7.png",
  },
  {
    src: "https://images.ctfassets.net/ez1fmuh9s880/53mQrkrXhGXArmwJpmTmGg/735c340436fdddc0f57f2f6469d7f7a6/green_it_img.png",
  },
  {
    src: "https://images.ctfassets.net/ez1fmuh9s880/EZr5KSPpGct1xG78nZEua/57df12bf88b12ae003504ffd25176173/maxi_ruti_web.png",
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
