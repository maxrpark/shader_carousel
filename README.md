# Shader_carousel

A Carrousel built using THREE.js and GreenSock.

GreenSock has a very useful plugin called Observer, that responds to "scroll-like" interactions.
In this case, a THREE.js carrousel that rotates when a user "scrolls" up or down.

This is the code that controls the rotation.

```ts
Observer.create({
  target: window,

  type: "wheel,touch",

  onChangeY: (self) => {
    if (!clickedImage) carrouselGroup.rotation.y += self.deltaY * 0.005;
  },
});
```

**Codepen:** [Shader Carousel on Codepen](https://codepen.io/maxrpark/pen/qBQLxqz)

**Deploy:** [Shader Carousel Deployment](https://shader-carousel.vercel.app/)

**Repository:** [GitHub Repository](https://github.com/maxrpark/shader_carousel/tree/main)

**Observer Docs:** [GreenSock Observer Documentation](https://greensock.com/docs/v3/Plugins/Observer)

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/threejs?src=hash&amp;ref_src=twsrc%5Etfw">#threejs</a> infinite carrousel using <a href="https://twitter.com/greensock?ref_src=twsrc%5Etfw">@greensock</a> observer<a href="https://t.co/Ob7QzZm7h6">https://t.co/Ob7QzZm7h6</a> <a href="https://t.co/Yc0PRGCtML">pic.twitter.com/Yc0PRGCtML</a></p>&mdash; Max (@MaxCodeJourney) <a href="https://twitter.com/MaxCodeJourney/status/1685967379522801664?ref_src=twsrc%5Etfw">July 31, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
