import React, { useEffect, useRef, useMemo, useState } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import { useGraphStore } from '../store/graphStore';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import { CSS3DRenderer, CSS3DObject } from 'three-stdlib';

// --- ⚙️ 参数配置 ---
const SCALE_FACTOR = 20;     
const NODE_REL_SIZE = 4;     
const BLOOM_STRENGTH = 1.5;  
const BLOOM_RADIUS = 0.4;    
const BLOOM_THRESHOLD = 0.1; 

const SceneManager: React.FC = () => {
  const { data, fetchData, setSelectedNode } = useGraphStore();
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // ⚡️ 缓存所有 CSS3D 文字对象，用于高性能遍历
  const cssObjectsRef = useRef<CSS3DObject[]>([]);

  const sharedGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  useEffect(() => {
    fetchData();

    // 1. 初始化 Bloom 和 控制器
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
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchData]);

  // 2. ⚡️⚡️ 核心修复：独立的高性能动画循环，强制文字面向相机 ⚡️⚡️
  useEffect(() => {
    let frameId: number;

    const animate = () => {
      if (graphRef.current) {
        const camera = graphRef.current.camera();
        
        // 性能优化：直接遍历缓存数组，不碰场景图
        const cssObjects = cssObjectsRef.current;
        for (let i = 0; i < cssObjects.length; i++) {
          const obj = cssObjects[i];
          // 关键代码：Copy Quaternion
          // 让文字对象的旋转角度完全等于相机的旋转角度
          // 这样文字就永远“正对”着屏幕（Billboard效果）
          obj.quaternion.copy(camera.quaternion);
        }
      }
      frameId = requestAnimationFrame(animate);
    };

    animate(); // 启动循环

    return () => cancelAnimationFrame(frameId); // 清理循环
  }, []); // 空依赖，只运行一次启动

  const processedData = useMemo(() => {
    // 重置缓存
    cssObjectsRef.current = [];
    
    if (!data) return { nodes: [], links: [] };
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
      links: data.links.map((link: any) => ({ ...link }))
    };
  }, [data]);

  const extraRenderers = useMemo(() => {
    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none'; 
    return [renderer];
  }, []);

  if (!data) return null;

  return (
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

        // A. 实体球
        const material = new THREE.MeshBasicMaterial({ 
          color: node.color,
          transparent: false 
        });
        const mesh = new THREE.Mesh(sharedGeometry, material);
        const radius = (node.val || 1) * NODE_REL_SIZE;
        mesh.scale.set(radius, radius, radius);
        group.add(mesh);

        // B. 3D HTML 文字
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
        
        // ⚡️ 将对象存入缓存，供上面的 animate 循环使用
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
  );
};

export default SceneManager;