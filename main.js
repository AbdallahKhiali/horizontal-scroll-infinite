import * as THREE from 'three';
import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const camera = new THREE.PerspectiveCamera(45, Math.min(window.devicePixelRatio, 2), 0.1, 1000);
  camera.position.z = 10;

  const scene = new THREE.Scene();

  const createImages = () => {
    const images = [];
    const imageCount = 10;
    const baseURL = 'https://picsum.photos/200/300?image=';

    for (let i = 0; i < imageCount; i++) {
      const randomNumber = Math.floor(Math.random() * 1000);
      images.push(baseURL + randomNumber);
    }

    return images;
  }


  let scrollTarget = 0
  let scroll = 0
  let currentScroll = 0
  let meshes = []
  let images = createImages();
  let marginBetween = 4.4
  let wholeWidth = images.length * 2.2
  let time = 0.0


  document.addEventListener('mousewheel', (e) => {

    scrollTarget = e.wheelDelta * 0.3

  })



  const createShapes = () => {

    for (var i = 0; i < images.length; i++) {
      var geometry = new THREE.PlaneGeometry(4, 5, 1);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          image: { value: new THREE.TextureLoader().load(images[i]), },
          time: { value: time }
        },
        vertexShader,
        fragmentShader,
      });


      var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      meshes.push({ mesh, index: i })
    }


  }


  const updateMeshes = () => {

    meshes.forEach(({ mesh, index }) => {
      mesh.position.x = (index * marginBetween + currentScroll + 1000 * wholeWidth) % wholeWidth - 2.6 * marginBetween;
    })
  }
  createShapes()

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {

    time += time * 0.01
    console.log(time)


    scroll += (scrollTarget - scroll) * 0.1
    scroll *= 0.9
    scrollTarget *= 0.9

    currentScroll += scroll * 0.05 // this small number represents the scroll speed 

    updateMeshes()

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
