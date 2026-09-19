const esbuild = require('esbuild');

const prefix = 'a(te,{children:ISHANT_BLOG_POSTERS.map(({date:e,title:t,id:n,img:r,desc:i,link:o},s)=>(t??=``,i??=``,o??=``,a(l,{id:`Fn20Ri3K1-${n}`,children:a(ge.Provider,{value:{V1MRCV9ui:o},children:a(ie,{links:[{href:`javascript:void(0)`},{href:`javascript:void(0)`},{href:`javascript:void(0)`}],children:n=>a(y,{breakpoint:x,overrides:{InUaW9Rvc:{width:`max(min(max(${m?.width||`100vw`} - 40px, 1px), 1080px) - 40px, 50px)`,y:(m?.y||0)+160+0+0+140+0+248+0+0},roKBWzAFp:{width:`max((min(max(${m?.width||`100vw`} - 40px, 1px), 900px) - 76px) / 2, 50px)`,y:(m?.y||0)+160+0+0+160+0+268+0+0}},children:a(de,{height:460,width:`max((min(max(${m?.width||`100vw`} - 40px, 1px), 1080px) - 32px) / 3, 50px)`,y:(m?.y||0)+160+0+0+180+0+268+0+0,children:a(M,{animate:V,className:`framer-khup2v-container`,"data-framer-appear-id":`khup2v-${s}`,initial:H,nodeId:`PHWVHsDcy`,optimized:!0,rendersWithMotion:!0,scopeId:`HpHbG8OLS`,children:a(y,{breakpoint:x,overrides:{InUaW9Rvc:{u3qjlDHSa:n[2]},roKBWzAFp:{u3qjlDHSa:n[1]}},children:a(O,{bDLUU4atH:e,eq1bfUtHV:t,hDvLDnBDz:i,height:`100%`,id:`PHWVHsDcy`,layoutId:`PHWVHsDcy`,lImbmi2X8:U(r),style:{width:`100%`},u3qjlDHSa:n[0],width:`100%`})';

for (let c1 = 1; c1 <= 9; c1++) {
  for (let c2 = 1; c2 <= 5; c2++) {
    for (let c3 = 1; c3 <= 5; c3++) {
      const end = '})'.repeat(c1) + ')'.repeat(c2) + '})'.repeat(c3);
      try {
        esbuild.transformSync('function test(){ return ' + prefix + end + '; }', { loader: 'js' });
        console.log('FOUND VALID ENDING! c1:', c1, 'c2:', c2, 'c3:', c3, 'end:', end);
        process.exit(0);
      } catch (e) {}
    }
  }
}

// If not found, let's see error on simplest ending:
try {
  esbuild.transformSync('function test(){ return ' + prefix + '})})})})})})})}))}); }', { loader: 'js' });
} catch (e) {
  console.log('Error detail:', e.errors[0]);
}
