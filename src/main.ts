import "./style.css";
import * as THREE from "three";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { data } from "./imagesData";

gsap.registerPlugin(Observer);

let carrouselImages: any = [];
const getCarrouselImages = async () => data;

carrouselImages = await getCarrouselImages();

const debugObject = {
  uTime: 0,
  uSpeed: 1,
  uFrequency: new THREE.Vector2(3, 5),
  imageWidth: 3.5,
  imageHeight: 2,
};

const canvas = document.createElement("canvas");
const clock = new THREE.Clock();

canvas.setAttribute("id", "webgl");

document.body.appendChild(canvas);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.set(0, 0, 3);

scene.add(camera);

// Carrousel

const carrouselGroup = new THREE.Group();
const imagesArray: THREE.Mesh[] = [];
const geometry = new THREE.PlaneGeometry(
  debugObject.imageWidth,
  debugObject.imageHeight,
  32,
  32
);

const angleIncrement = (2 * Math.PI) / carrouselImages.length;
const imageWidth = debugObject.imageWidth;
const dynamicRadius = imageWidth / 2 / Math.tan(angleIncrement / 2) + 0.5;

for (let i = 0; i < carrouselImages.length; i++) {
  const image = carrouselImages[i];

  // Create the mesh
  const imageMesh = new THREE.Mesh(
    geometry,
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: debugObject.uTime },
        uSpeed: { value: debugObject.uSpeed },
        uFrequencyX: { value: debugObject.uFrequency.x },
        uDiffuse: { value: image.src },
      },
    })
  );

  const angle = i * angleIncrement;

  const newX = dynamicRadius * Math.cos(angle);
  const newZ = dynamicRadius * Math.sin(angle);

  imageMesh.position.set(newX, 0, newZ);
  imageMesh.name = `image_${i}`;
  imageMesh.lookAt(0, 0, 0);
  imagesArray.push(imageMesh);
  carrouselGroup.add(imageMesh);
}
scene.add(carrouselGroup);

// MIRROR GROWN

const groundMirror = new Reflector(new THREE.CircleGeometry(5, 64), {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xb5b5b5,
});
groundMirror.position.y = -debugObject.imageHeight;
groundMirror.rotation.x = -Math.PI * 0.5;

// TORUS

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.3),
  new THREE.MeshBasicMaterial({})
);
torus.material.color = new THREE.Color(2, 2, 0.9);
torus.material.toneMapped = false;

scene.add(torus, groundMirror);

/// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));

/// GSAP

let rotationY = 0;

Observer.create({
  target: window,
  type: "wheel,touch",
  onChange: (self) => {
    if (clickedImage) return;

    let y = -(self.velocityY / 10000).toFixed(2);
    let x = -(self.velocityX / 10000).toFixed(2);
    rotationY = y + x;
  },
});

let initialScale = sizes.width > 960 ? 2 : 0.75;

const calculateScaleFactor = () =>
  Math.min(window.innerWidth / sizes.width, window.innerHeight / sizes.height);

let scaleFactor = calculateScaleFactor();

const mousePosition = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

//EVENTS

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  scaleFactor = calculateScaleFactor();
  initialScale = sizes.width > 960 ? 2 : 0.75;

  renderer.setSize(sizes.width, sizes.height);
});

// HOVER

window.addEventListener("mousemove", (event) => {
  mousePosition(event);
  checkIntersections(mouse);
});

const checkIntersections = (mouse: THREE.Vector2) => {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if (intersects[0].object.name.startsWith("image_"))
      document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
};

// CLICK

let clickedImage: THREE.Mesh | null = null;

const onClickImage = (event: MouseEvent) => {
  mousePosition(event);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(imagesArray);

  if (intersects.length > 0) {
    const intersectedMesh = intersects[0].object as THREE.Mesh;
    if (clickedImage) {
      intersectedMesh.id === clickedImage.id;
      const tl = gsap.timeline({ ease: "none" });
      tl.to(clickedImage.position, {
        x: clickedImage.userData.originalPosition.x,
        y: clickedImage.userData.originalPosition.y,
        z: clickedImage.userData.originalPosition.z,
      })
        .to(
          clickedImage.scale,
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0
        )
        .to(
          clickedImage.rotation,
          {
            duration: 0.1,
            x: clickedImage.userData.originalRotation.x,
            y: clickedImage.userData.originalRotation.y,
            z: clickedImage.userData.originalRotation.z,
          },
          0
        );
      if (intersectedMesh.id === clickedImage.id) {
        clickedImage = null;
        return;
      }
    }
    clickedImage = intersectedMesh;

    clickedImage!.userData.originalPosition = intersectedMesh.position.clone();
    clickedImage!.userData.originalRotation = intersectedMesh.rotation.clone();

    const tl = gsap.timeline({ ease: "none" });
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    tl.to(intersectedMesh.position, {
      x: 0,
      y: 0,
      z: 0,
    })
      .to(
        intersectedMesh.scale,
        {
          x: initialScale * scaleFactor,
          y: initialScale * scaleFactor,
          z: initialScale * scaleFactor,
        },
        0
      )

      .to(
        intersectedMesh.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          onUpdate: () => {
            intersectedMesh.lookAt(cameraPosition);
          },
        },
        0
      );
  }
};

renderer.domElement.addEventListener("click", onClickImage);

const tick = () => {
  if (!clickedImage) {
    rotationY = THREE.MathUtils.lerp(rotationY, 0, 0.05);
    carrouselGroup.rotation.y += rotationY;
  }
  const elapsedTime = clock.getElapsedTime();
  torus.rotation.x = elapsedTime;

  for (let mesh of carrouselGroup.children) {
    (
      (mesh as THREE.Mesh).material as THREE.ShaderMaterial
    ).uniforms.uTime.value = elapsedTime;
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
