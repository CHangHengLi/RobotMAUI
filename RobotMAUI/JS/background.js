// 添加当页面加载完毕后启动动画
window.addEventListener('load', function() {
  console.log("背景动画初始化开始");
  
  // 初始化GSAP插件
  try {
    if (typeof gsap !== 'undefined') {
      if (gsap.registerPlugin) {
        if (MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);
        if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
        console.log("GSAP插件已注册");
      } else {
        console.warn("GSAP插件注册函数不存在");
      }
    } else {
      console.warn("GSAP未加载");
    }
  } catch(e) {
    console.error("GSAP插件初始化错误:", e);
  }
  
  // 初始化SVG动画
  initSvgAnimations();
  
  // 初始化Three.js背景
  initThreeBackground();
});

function initSvgAnimations() {
  try {
    console.log("开始初始化SVG动画");
    
    // 旋转图表圆圈动画
    gsap.to('#graph-cir', {
      rotation: 360,
      transformOrigin: 'center center',
      repeat: -1,
      duration: 30,
      ease: 'none'
    });
    
    // 左上角圆形缩放动画
    gsap.to('#left-top-circle', {
      scale: 0.8,
      transformOrigin: 'center center',
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: 'power1.inOut'
    });
    
    // 行星轨道旋转动画
    // 注释掉行星轨道旋转动画
    /*
    gsap.to('#planet-circle', {
      rotation: 360,
      transformOrigin: 'center center',
      repeat: -1,
      duration: 15,
      ease: 'none'
    });
    */
    
    // 顶部圆环渐变旋转
    gsap.to(['#circle-l', '#circle-m', '#circle-r'], {
      rotation: 360,
      transformOrigin: 'center center',
      repeat: -1,
      duration: 8,
      ease: 'none',
      stagger: 0.5
    });
    
    // 图表形状变形
    if (typeof MorphSVGPlugin !== 'undefined') {
      gsap.to('#graph-left', {
        morphSVG: '#graph-morph1',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
      
      gsap.to('#graph-right', {
        morphSVG: '#graph-morph2',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 1.5
      });
    } else {
      console.warn("MorphSVGPlugin 未加载，形变动画未执行");
    }
    
    // 图表线条绘制
    if (typeof DrawSVGPlugin !== 'undefined') {
      gsap.from('#graph-line', {
        drawSVG: '0%',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
      
      gsap.from(['#note-1', '#note-2'], {
        drawSVG: '0%',
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        ease: 'power1.inOut'
      });
    } else {
      console.warn("DrawSVGPlugin 未加载，绘制动画未执行");
    }
    
    // 右侧和左侧面板按钮闪烁
    gsap.to('#btns ellipse', {
      opacity: 0.5,
      stagger: {
        each: 0.1,
        grid: 'auto',
        from: 'random'
      },
      repeat: -1,
      yoyo: true,
      duration: 1
    });
    
    // 左侧面板线条闪烁
    gsap.to('#left-display-display line', {
      opacity: 0.5,
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
      duration: 1.5
    });
    
    // 底部右侧图表柱状图动画
    gsap.to(['#bar-1-top', '#bar-2-top', '#bar-3-top'], {
      scaleY: 1.2,
      transformOrigin: 'bottom center',
      stagger: 0.3,
      repeat: -1,
      yoyo: true,
      duration: 1.5
    });
    
    // 小圆点旋转
    gsap.to(['#graph-cir-1', '#graph-cir-2', '#graph-cir-3'], {
      rotation: 360,
      transformOrigin: 'center center',
      repeat: -1,
      duration: 5,
      ease: 'none',
      stagger: 1
    });
    
    console.log("SVG动画初始化完成");
    
  } catch(e) {
    console.error("SVG动画初始化错误:", e);
  }
}

function initThreeBackground() {
  try {
    console.log("开始初始化Three.js背景");
    
    if (typeof THREE === 'undefined') {
      console.warn("Three.js 未加载");
      return;
    }
    
    const canvas = document.querySelector('.webgl2');
    if (!canvas) {
      console.warn("未找到canvas元素");
      return;
    }
    
    // 获取容器或窗口尺寸
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 创建场景
    const scene = new THREE.Scene();
    
    // 摄像机 - 增加视野距离
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerWidth / containerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 20); // 增加距离
    scene.add(camera);
    
    // 创建粒子系统
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // 更均匀的分布粒子
      posArray[i] = (Math.random() - 0.5) * 100;     // x
      posArray[i + 1] = (Math.random() - 0.5) * 100; // y 
      posArray[i + 2] = (Math.random() - 0.5) * 100; // z
      
      // 缩放
      scaleArray[i/3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // 粒子材质
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: new THREE.Color(0x00ffff),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    
    // 粒子系统
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 添加发光球体 - 调整大小和不透明度
    const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x34496a,
      transparent: true,
      opacity: 0.15 // 更低的不透明度
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // 动画循环
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // 旋转粒子系统
      particlesMesh.rotation.x = elapsedTime * 0.05;
      particlesMesh.rotation.y = elapsedTime * 0.03;
      
      // 旋转球体
      sphere.rotation.y = elapsedTime * 0.1;
      
      // 渲染
      renderer.render(scene, camera);
      
      // 下一帧
      window.requestAnimationFrame(animate);
    };
    
    animate();
    
    // 窗口大小变化时调整
    window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // 更新摄像机
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      // 更新渲染器
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    console.log("Three.js背景初始化完成");
  } catch(e) {
    console.error("Three.js背景初始化错误:", e);
  }
} 