import glsl from "vite-plugin-glsl";

// ...

export default {
  // ...
  build: {
    target: "esnext",
  },
  plugins: [glsl()],
};
