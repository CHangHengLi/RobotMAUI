/* SVG ANIMATION */

function animation() {
    let isLeft = false;
  
    /**
     * Robot
     */
  
    // 隐藏充电器挂饰和手
    gsap.set("#charge", { 
      autoAlpha: 0,  // 完全隐藏元素
      display: "none" // 确保不占用空间
    });
    
    gsap.set("#left-hand, #right-hand", { 
      autoAlpha: 0,  // 完全隐藏元素
      display: "none" // 确保不占用空间
    });
  
    gsap.set("#left-hand", {
      x: 30,
      transformOrigin: "right center"
    });
  
    const eyesTl = gsap
      .timeline({
        repeat: -1,
        repeatDelay: 2
      })
      .to(".eyes", {
        opacity: 0,
        duration: 0.1
      })
      .to(".eyes", {
        opacity: 1,
        duration: 0.1
      });
  
    const robotTl = gsap
      .timeline({
        repeat: 0
      })
      .to(
        "#robot",
        {
          x: 0,
          duration: 0,
          ease: "power2.inOut"
        },
        "center"
      )
      .to(
        "#faces",
        {
          x: 0,
          rotation: 0,
          duration: 0,
          ease: "power2.inOut"
        },
        "center"
      );
  
    // 添加眼睛和嘴巴随转身变化的动画
    robotTl.eventCallback("onUpdate", () => {
      const robotX = gsap.getProperty("#robot", "x");
      
      // 根据机器人的位置调整眼睛大小
      if (robotX > 50 || robotX < -50) {
        // 转身时眼睛变小一点
        gsap.to("#eyes ellipse", { 
          scaleX: 0.9, 
          scaleY: 0.8,
          duration: 0.2
        });
        
        // 根据转向调整嘴巴形状
        if (robotX > 0) {
          gsap.to("#mouth", { 
            attr: { d: "M390 355c5,10 30,10 30,5" }, 
            duration: 0.2 
          });
        } else {
          gsap.to("#mouth", { 
            attr: { d: "M390 355c0,5 30,10 35,0" }, 
            duration: 0.2 
          });
        }
      } else {
        // 回到中间位置时恢复正常表情
        gsap.to("#eyes ellipse", { 
          scaleX: 1, 
          scaleY: 1,
          duration: 0.3
        });
        gsap.to("#mouth", { 
          attr: { d: "M390 355c10,8 25,8 30,0" }, 
          duration: 0.3 
        });
      }
    });
  
    /**
     * Main display
     */
  
    //left-top-circle
    gsap.set("#left-top-circle", {
      transformOrigin: "center",
      scale: 0
    });
  
    gsap.to("#left-top-circle", {
      transformOrigin: "center",
      scale: 1,
      fill: "#34496a",
      repeat: -1,
      duration: 2
    });
  
    //graph-left-btm
    gsap.to(".graph-circle-lb", {
      rotation: 360,
      transformOrigin: "center",
      duration: 2,
      stagger: {
        amount: 1,
        ease: "sine.inOut",
        repeat: -1
      }
    });
  
    //planet
    // 实现星球和星环的轻微左右摇摆
    const planetGroup = document.querySelector("#planet");
    if (planetGroup) {
      const planetTl = gsap.timeline({
        repeat: -1,
        yoyo: true
      });
      
      planetTl
        .to(planetGroup, {
          x: 5,
          rotation: 3,
          transformOrigin: "center center",
          duration: 3,
          ease: "sine.inOut"
        })
        .to(planetGroup, {
          x: -5,
          rotation: -3,
          transformOrigin: "center center",
          duration: 3,
          ease: "sine.inOut"
        });
    }
  
    //circle-btm-graph
    gsap.to("#graph-cir-1", {
      rotation: 360,
      ease: "none",
      transformOrigin: "-9px center",
      duration: 3,
      repeat: -1
    });
  
    gsap.to("#graph-cir-2", {
      rotation: 360,
      ease: "none",
      transformOrigin: "center 18px",
      duration: 4,
      repeat: -1
    });
  
    gsap.to("#graph-cir-3", {
      rotation: 360,
      ease: "none",
      transformOrigin: "-19px center",
      duration: 5,
      repeat: -1
    });
  
    gsap.to("#graph-cir-mid-2", {
      scale: 1.5,
      ease: "sine.inOut",
      transformOrigin: "center",
      repeat: -1,
      yoyo: true
    });
  
    //bottom-right-graph
    gsap.to("#graph-left", {
      morphSVG: "#graph-morph1",
      repeat: -1,
      yoyo: true,
      ease: Elastic.easeOut.config(1, 0.8),
      duration: 2
    });
  
    gsap.to("#graph-right", {
      morphSVG: "#graph-morph2",
      repeat: -1,
      yoyo: true,
      ease: "power3.inOut",
      duration: 1
    });
    //top right circle
  
    gsap.to(".circles-top", {
      rotation: 360,
  
      duration: 10,
      transformOrigin: "center",
      stagger: {
        each: 0.5,
        ease: "none",
        repeat: -1
      }
    });
  
    gsap.to("#circle-l", {
      drawSVG: "20",
      repeat: -1,
      yoyo: true,
      ease: Bounce.easeOut,
      duration: 1
    });
  
    gsap.to("#circle-m", {
      drawSVG: "80 30",
      repeat: -1,
      yoyo: true,
      ease: Bounce.easeOut,
      duration: 1.5
    });
  
    gsap.to("#circle-r", {
      drawSVG: "0",
      repeat: -1,
      yoyo: true,
      ease: SteppedEase.config(12),
      duration: 3
    });
  
    /**
     * Left Display
     */
    gsap.to("#left-display-display", {
      y: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      duration: 2
    });
    gsap.to("#left-display-shadow", {
      scale: 1.1,
      transformOrigin: "center",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      duration: 2
    });
  
    //song
    const songTl = gsap
      .timeline({
        repeat: -1
      })
      .to("#left-display-display line", {
        stroke: "#34496a",
        stagger: {
          each: 0.5
        }
      })
      .to("#left-display-display line", {
        stroke: "#0ff",
        stagger: {
          each: 0.5
        }
      });
  
    for (let i = 0; i < 3; i++) {
      let clone1 = document.querySelector("#note-1").cloneNode(true);
      let clone2 = document.querySelector("#note-2").cloneNode(true);
      clone1.classList.add("notes");
      clone2.classList.add("notes");
      gsap.set(clone1, {
        attr: {
          d:
            "M180 317l-3.5-3.8a1 1 0 00-1.7.7v8.1a6 6 0 00-2-.3c-2.5 0-4.6 1.6-4.6 3.5s2 3.5 4.7 3.5 4.6-1.5 4.6-3.5a3 3 0 00-.7-1.9v-6.8l1.7 1.8a1 1 0 101.5-1.4z",
          fill: "#0ff"
        },
        y: 40,
        opacity: 0
      });
      gsap.set(clone2, {
        attr: {
          d:
            "M203.4 323.4v-9.5a1 1 0 00-1-1h-9.3a1 1 0 00-1 1v8.1a6 6 0 00-2-.3c-2.5 0-4.6 1.6-4.6 3.5s2 3.5 4.7 3.5 4.6-1.5 4.6-3.5a2.9 2.9 0 00-.7-1.9V315h7.3v7.1a5.8 5.8 0 00-1.9-.3c-2.6 0-4.7 1.6-4.7 3.5s2.1 3.5 4.7 3.5 4.7-1.5 4.7-3.5a2.9 2.9 0 00-.8-1.8z",
          fill: "#0ff"
        },
        x: -10,
        y: 40,
        opacity: 0
      });
      document.querySelector("svg").appendChild(clone1);
      document.querySelector("svg").appendChild(clone2);
    }
  
    gsap.to(".notes", {
      y: gsap.utils.random(-50, -100, 10, true),
      x: gsap.utils.random(-50, 50, 25, true),
      opacity: 1,
      duration: gsap.utils.random(1.5, 3, 1.5, true),
      stagger: {
        each: 0.5,
        ease: "sine.in",
        repeat: -1
      }
    });
  
    /**
     * Right Display
     */
    gsap.to("#right-display-display", {
      y: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      duration: 2,
      delay: 1.5
    });
    gsap.to("#right-display-shadow", {
      scale: 1.1,
      transformOrigin: "center",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      duration: 2,
      delay: 1.5
    });
  
    //graph-lines
    gsap.to("#graph-line", {
      x: -105,
      ease: "none",
      repeat: -1,
      duration: 2
    });
  
    gsap.to("#bar-1-top", {
      morphSVG: "#bar-1-btm",
      repeat: -1,
      yoyo: true
    });
    gsap.to("#bar-2-top", {
      morphSVG: "#bar-2-btm",
      repeat: -1,
      yoyo: true,
      duration: 1.5
    });
    gsap.to("#bar-3-top", {
      morphSVG: "#bar-3-btm",
      repeat: -1,
      yoyo: true,
      duration: 2
    });
  
    //btns
    gsap.to("#btns ellipse", {
      fill: "#34496a",
      stagger: {
        amount: 1,
        grid: [4, 4],
        repeat: -1,
        yoyo: true,
        from: "random"
      }
    });
  
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  
    /**
     * Mouse
     */
  
    let mouseX = 0;
    let mouseY = 0;
  
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / sizes.width) * 2 - 1;
      mouseY = -(e.clientY / sizes.height) * 2 + 1;
  
      gsap.to("#mid-display", {
        x: -mouseX * 10,
        y: mouseY * 10
      });
  
      gsap.to("#btm-display", {
        x: -mouseX * 20,
        y: mouseY * 10
      });
    });
  }
  animation();
  
  /* stars */
  //reference https://redstapler.co/space-warp-background-effect-three-js/
  let scene, camera, renderer, stars, startGeometry;
  const count = 5000;
  
  function init() {
    scene = new THREE.Scene();
  
    startGeometry = new THREE.BufferGeometry();
  
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;     // x坐标
      positions[i + 1] = (Math.random() - 0.5) * 600; // y坐标
      positions[i + 2] = (Math.random() - 0.5) * 600; // z坐标
    }
    startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  
    let sprite = new THREE.TextureLoader().load(
      "https://i.postimg.cc/T25jx3S9/circle-05.png"
    );
    let starMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      alphaMap: sprite
    });
  
    stars = new THREE.Points(startGeometry, starMaterial);
    scene.add(stars);
  
    /**
     * camera1
     */
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 5;
    camera.rotation.x = Math.PI / 2;
  
    const container = document.getElementById("webgl");
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
  
    window.addEventListener("resize", () => {
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(containerWidth || window.innerWidth, containerHeight || window.innerHeight);
    document.getElementById("webgl").appendChild(renderer.domElement);
  
    /**
     * Animate
     */
  
    function animate() {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
  
        startGeometry.attributes.position.array[i3 + 1] -= 3;
  
        if (startGeometry.attributes.position.array[i3 + 1] < -300) {
          startGeometry.attributes.position.array[i3 + 1] = 300;
        }
      }
      startGeometry.attributes.position.needsUpdate = true;
      stars.rotation.y += 0.002;
  
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }
  
  init();
  
  /* OBJECTS */
  
  function objects() {
    // Canvas
    const canvas = document.querySelector("canvas.webgl2");
  
    // scene2
    const scene2 = new THREE.Scene();
  
    /**
     * Objects
     */
    const objects = [];
    const objectGeometry = new THREE.IcosahedronGeometry(1, 0);
    const objectMaterial = new THREE.MeshStandardMaterial({
      color: 0x6699ff,
      metalness: 0,
      roughness: 0
    });
    for (let i = 0; i < 3; i++) {
      const object = new THREE.Mesh(objectGeometry, objectMaterial);
      object.scale.set(0.4, 0.4, 0.4);
      scene2.add(object);
      objects.push(object);
    }
    objects[0].position.set(3, 0.5, 0);
    objects[1].position.set(-3.5, 2, 0);
    objects[2].position.set(1, 3, 0);
  
    objects.forEach((object) => {
      gsap
        .to(object.rotation, {
          x: Math.PI * 2,
          z: Math.PI * 2,
          repeat: -1,
          ease: "none",
          duration: 8 + Math.random() * 5,
          delay: Math.random() * 50
        })
        .seek(100);
  
      gsap
        .to(object.position, {
          y: 1.5,
          z: -1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 4 + Math.random() * 5
        })
        .seek(100);
    });
  
    /**
     * Lights
     */
    const light = new THREE.AmbientLight(0xffffff, 1.0);
    scene2.add(light);
  
    const directionalLight = new THREE.DirectionalLight(0xff0000, 0.8);
    directionalLight.position.set(5, 10, 0);
    scene2.add(directionalLight);
  
    const directionalLight2 = new THREE.DirectionalLight(0xff000, 0.7);
    directionalLight2.position.set(-5, -5, 2);
    scene2.add(directionalLight2);
  
    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
  
      // Update camera2
      camera2.aspect = sizes.width / sizes.height;
      camera2.updateProjectionMatrix();
  
      // Update renderer2
      renderer2.setSize(sizes.width, sizes.height);
      renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  
    /**
     * camera2
     */
    // Base camera2
    const camera2 = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera2.position.z = 5;
    scene2.add(camera2);
  
    /**
     * renderer2
     */
    const renderer2 = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    renderer2.setSize(sizes.width, sizes.height);
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
    /**
     * Animate
     */
    const clock = new THREE.Clock();
  
    let currentIntersect = null;
  
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
  
      // Render
      renderer2.render(scene2, camera2);
  
      window.requestAnimationFrame(tick);
    };
  
    tick();
  }
  objects();
  