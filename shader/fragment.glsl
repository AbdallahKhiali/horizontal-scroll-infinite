uniform sampler2D image;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(image, vUv);
}