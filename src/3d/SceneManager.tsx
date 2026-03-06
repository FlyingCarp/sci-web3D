import React, { useEffect, useRef, useMemo, useState } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import { useGraphStore } from '../store/graphStore'; // 请确保路径正确
import { useNavigate } from 'react-router-dom'; // 1. 新增这一行
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import { CSS3DRenderer, CSS3DObject } from 'three-stdlib';
import { useHandGesture } from '../hooks/useHandGesture';
import { GestureController } from '../components/GestureController';

// --- ⚙️ 参数配置 ---
const SCALE_FACTOR = 200;
const NODE_REL_SIZE = 4;
const BLOOM_STRENGTH = 2;
const BLOOM_RADIUS = 0.4;
const BLOOM_THRESHOLD = 0.1;
const GESTURE_ROTATE_SPEED = 0.02; // radians per frame at max hand displacement

const SceneManager: React.FC = () => {
  const navigate = useNavigate(); // 2. 在组件内部第一行初始化
  const { data, fetchData, setSelectedNode } = useGraphStore();
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // --- 状态管理 ---
  // appliedThreshold: 真正用于过滤数据的阈值 (触发重计算)
  const [appliedThreshold, setAppliedThreshold] = useState(0.82);
  // sliderValue: UI 显示数值 (实时响应，无延迟)
  const [sliderValue, setSliderValue] = useState(0.82);

  // --- 🤚 手势控制 ---
  const gesture = useHandGesture();

  // --- Refs ---
  // 使用 ReturnType<typeof setTimeout> 自动适配浏览器环境，解决 TS 报错
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cssObjectsRef = useRef<CSS3DObject[]>([]);
  
  // 缓存几何体，优化性能
  const sharedGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  // --- 初始化与 Resize ---
  useEffect(() => {
    fetchData();

    // 延迟初始化 PostProcessing (Bloom) 和控制参数
    const timer = setTimeout(() => {
      if (graphRef.current) {
        const controls = (graphRef.current.controls() as any);
        if (controls) {
          controls.enableDamping = true;
          controls.dampingFactor = 0.1;
          controls.rotateSpeed = 2.0;
        }

        const composer = (graphRef.current as any).postProcessingComposer();
        const hasBloom = composer.passes.some((pass: any) => pass instanceof UnrealBloomPass);
        
        // 初始相机位置
        graphRef.current.cameraPosition(
          { x: 0, y: 0, z: 230 },
          { x: 0, y: 0, z: 0 },
          0
        );

        if (!hasBloom) {
          const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            BLOOM_STRENGTH,
            BLOOM_RADIUS,
            BLOOM_THRESHOLD
          );
          composer.addPass(bloomPass);
        }
      }
    }, 100);

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [fetchData]);

  // --- 动画循环 (保持文字面向相机 + 手势旋转) ---
  useEffect(() => {
    const { deltaRef: gestureDeltaRef } = gesture; // capture ref once (stable identity)

    // Pre-allocate rotation helpers — avoids per-frame GC pressure
    const _offset     = new THREE.Vector3();
    const _yawAxis    = new THREE.Vector3(0, 1, 0); // world-up for yaw
    const _yawQuat    = new THREE.Quaternion();
    const _pitchQuat  = new THREE.Quaternion();
    const _cameraRight = new THREE.Vector3();

    let frameId: number;
    const animate = () => {
      if (graphRef.current) {
        const camera = graphRef.current.camera();

        // Keep CSS3D labels facing camera
        const cssObjects = cssObjectsRef.current;
        for (let i = 0; i < cssObjects.length; i++) {
          cssObjects[i].quaternion.copy(camera.quaternion);
        }

        // Gesture: Yaw (Y-axis) + Pitch (camera-right axis). Roll is absent by construction.
        // Works regardless of controls type (avoids reliance on OrbitControls-private rotateLeft/Up).
        const { x, y } = gestureDeltaRef.current;
        if (x !== 0 || y !== 0) {
          const controls = graphRef.current.controls() as any;
          if (controls?.target) {
            // Camera offset relative to orbit target
            _offset.subVectors(camera.position, controls.target);

            // Yaw: rotate offset around world-Y (negative sign → hand-right shows scene-right)
            _yawQuat.setFromAxisAngle(_yawAxis, -x * GESTURE_ROTATE_SPEED);
            _offset.applyQuaternion(_yawQuat);

            // Pitch: rotate offset around camera's current right axis
            _cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
            _pitchQuat.setFromAxisAngle(_cameraRight, -y * GESTURE_ROTATE_SPEED);
            _offset.applyQuaternion(_pitchQuat);

            // Apply — controls.update() reads the new position and syncs its internal spherical
            camera.position.copy(controls.target).add(_offset);
            camera.lookAt(controls.target);
            controls.update();
          }
        }
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- 数据处理 (核心优化点) ---
  const processedData = useMemo(() => {
    cssObjectsRef.current = []; // 重置文字对象引用
    if (!data) return { nodes: [], links: [] };

    // ⚠️ 仅当 appliedThreshold 变化时才重新过滤 Links
    // 这样 UI 拖动时不会导致图表每一帧都重算
    const filteredLinks = data.links
      .filter((link: any) => link.similarity >= appliedThreshold)
      .map((link: any) => ({ ...link }));

    return {
      nodes: data.nodes.map((node: any) => ({
        ...node,
        fx: node.x * SCALE_FACTOR,
        fy: node.y * SCALE_FACTOR,
        fz: node.z * SCALE_FACTOR,
        x: node.x * SCALE_FACTOR,
        y: node.y * SCALE_FACTOR,
        z: node.z * SCALE_FACTOR,
      })),
      links: filteredLinks
    };
  }, [data, appliedThreshold]);

  // --- CSS3D 渲染器 ---
  const extraRenderers = useMemo(() => {
    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';
    return [renderer];
  }, []);

  // --- 🕹️ 交互逻辑 ---

  // 1. 滑块松手/触摸结束：立即提交
  const handleSliderCommit = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (sliderValue !== appliedThreshold) {
      setAppliedThreshold(sliderValue);
    }
  };

  // 2. 按钮微调：防抖提交 (500ms 延迟)
  const handleFineTune = (delta: number) => {
    const newValue = Math.max(0, Math.min(1, parseFloat((sliderValue + delta).toFixed(2))));
    
    // 立即更新 UI
    setSliderValue(newValue);

    // 重置防抖计时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setAppliedThreshold(newValue);
      debounceTimerRef.current = null;
    }, 100);
  };

  if (!data) return null;

  return (
    <>
      {/* --- 🤚 手势控制 UI --- */}
      <GestureController
        isModelReady={gesture.isModelReady}
        isEnabled={gesture.isEnabled}
        isActive={gesture.isActive}
        hasError={gesture.hasError}
        onToggle={gesture.toggle}
        videoRef={gesture.videoRef}
        palmPos={gesture.palmPos}
        deadZone={gesture.deadZone}
      />

      {/* --- 🔙 返回首页按钮 (新增) --- */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '45px',
          left: '15px',
          zIndex: 100,
          backgroundColor: 'rgba(10, 20, 30, 0.85)', // 与底部面板背景一致
          border: '1px solid rgba(100, 200, 255, 0.3)', // 与底部面板边框一致
          color: '#64c8ff',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)', // 毛玻璃效果
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease', // 添加简单的交互动画
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(20, 40, 60, 0.95)';
          e.currentTarget.style.borderColor = '#64c8ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 20, 30, 0.85)';
          e.currentTarget.style.borderColor = 'rgba(100, 200, 255, 0.3)';
        }}
      >
        {/* 这里画一个简单的 SVG 箭头，无需额外图标库 */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>    
      {/* --- 🎛️ UI 控制面板 (底部居中 + 移动端适配) --- */}
      <div style={{
        position: 'absolute',
        bottom: '30px',               
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        backgroundColor: 'rgba(10, 20, 30, 0.85)',
        
        // 核心适配样式
        width: '90%',                 // 手机宽屏
        maxWidth: '400px',            // 电脑限宽
        
        padding: '12px 20px',
        borderRadius: '24px',
        border: '1px solid rgba(100, 200, 255, 0.3)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        touchAction: 'none' // 防止手机滑动穿透
      }}>
        {/* 标题栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <span style={{ fontWeight: 'bold', color: '#64c8ff', fontSize: '14px' }}>
            Similarity Filter
          </span>
          {/* 当数值未应用时显示黄色，应用后显示白色 */}
          <span style={{ 
            fontSize: '16px', 
            fontFamily: 'monospace', 
            fontWeight: 'bold',
            color: sliderValue !== appliedThreshold ? '#ffe066' : '#fff'
          }}>
            {sliderValue.toFixed(2)}
          </span>
        </div>

        {/* 控件行 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* 减小按钮 */}
          <button 
            onClick={() => handleFineTune(-0.01)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              flexShrink: 0,
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: 0
            }}
          >
            -
          </button>

          {/* 滑块 */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 5px' }}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              onMouseUp={handleSliderCommit}
              onTouchEnd={handleSliderCommit}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: '#64c8ff',
                height: '4px',
                outline: 'none'
              }}
            />
          </div>

          {/* 增加按钮 */}
          <button 
            onClick={() => handleFineTune(0.01)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              flexShrink: 0,
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: 0
            }}
          >
            +
          </button>
        </div>

        <div style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '2px' }}>
          Visible Links: <span style={{ color: '#fff' }}>{processedData.links.length}</span>
        </div>
      </div>

      <ForceGraph3D
        ref={graphRef as any}
        width={dimensions.width}
        height={dimensions.height}
        graphData={processedData}
        cooldownTicks={0}
        backgroundColor="#000003"
        showNavInfo={false}
        // @ts-ignore
        extraRenderers={extraRenderers}
        nodeLabel="id"
        nodeThreeObject={(node: any) => {
          const group = new THREE.Group();
          const material = new THREE.MeshBasicMaterial({ 
            color: node.color,
            transparent: false 
          });
          const mesh = new THREE.Mesh(sharedGeometry, material);
          const radius = (node.val || 1) * NODE_REL_SIZE;
          mesh.scale.set(radius, radius, radius);
          group.add(mesh);

          const nodeEl = document.createElement('div');
          nodeEl.textContent = node.id;
          nodeEl.style.color = '#fff';
          nodeEl.style.fontSize = '24px'; 
          nodeEl.style.fontWeight = 'bold';
          nodeEl.style.fontFamily = 'Arial, sans-serif';
          nodeEl.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
          nodeEl.style.userSelect = 'none';

          const cssObject = new CSS3DObject(nodeEl);
          const textScaleFactor = 0.15;
          const dynamicScale = (node.val || 1) * 0.1;
          const finalScale = textScaleFactor + dynamicScale;
          cssObject.scale.set(finalScale, finalScale, finalScale);
          cssObjectsRef.current.push(cssObject);
          group.add(cssObject);
          return group;
        }}
        linkColor={() => 'rgba(100, 200, 255, 0.4)'}
        linkWidth={(link: any) => link.similarity > 0.9 ? 1.0 : 0.2}
        onNodeClick={(node: any) => {
          setSelectedNode(node);
          const distance = 120;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          graphRef.current?.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
            { x: node.x, y: node.y, z: node.z },
            2000
          );
        }}
      />
    </>
  );
};

export default SceneManager;