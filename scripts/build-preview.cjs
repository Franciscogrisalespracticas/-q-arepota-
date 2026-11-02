/* Offline compilation of the SAME App.tsx used by Vite. Node + TypeScript required. */
const fs=require('fs'),path=require('path'),cp=require('child_process');
let ts;try{ts=require('typescript');}catch(e){ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');}
const root=path.resolve(__dirname,'..');
const sources=['src/catalog.ts','src/motion.ts','src/real-video.tsx','src/App.tsx'];
let code='"use strict";\nconst React = window.React;\n';
for(const f of sources){
  const text=fs.readFileSync(path.join(root,f),'utf8').replace(/^import[^\n]+\n/gm,'').replace(/export default /g,'').replace(/export /g,'');
  const result=ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None,jsx:ts.JsxEmit.React},reportDiagnostics:true,fileName:f});
  if(result.diagnostics && result.diagnostics.some(x=>x.category===ts.DiagnosticCategory.Error)){
    console.error(f, result.diagnostics.map(x=>ts.flattenDiagnosticMessageText(x.messageText,'\n')));process.exitCode=1;
  }
  code+='\n'+result.outputText+'\n';
}
code+='\nReactDOM.render(React.createElement(App),document.getElementById("root"));\n';
fs.mkdirSync(path.join(root,'preview'),{recursive:true});
fs.writeFileSync(path.join(root,'preview/app.preview.js'),code);
fs.cpSync(path.join(root,'public/assets'),path.join(root,'assets'),{recursive:true,force:true});
console.log('Offline preview compiled, app size',code.length,'chars');
