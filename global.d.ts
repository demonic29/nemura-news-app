// global.d.ts

declare module '*.svg' {
  import * as React from 'react';
  
  // default で Reactコンポーネントをエクスポートすることを宣言
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content; 
}

declare module '*css'
