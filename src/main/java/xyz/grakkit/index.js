{const global=globalThis,server=org.bukkit.Bukkit.server,plugin=server.pluginManager.getPlugin("grakkit"),core={circular:function(){},color:a=>a.split("&").join("\xA7").split("\xA7\xA7").join("&"),command:a=>{core.event("org.bukkit.event.server.TabCompleteEvent",b=>{const c=b.buffer.slice(1).split(" ");a.name===c[0]&&(b.completions=a.tabComplete(b.sender,...c.slice(1)))}),core.event("org.bukkit.event.player.PlayerCommandPreprocessEvent",b=>{const c=b.message.slice(1).split(" ");a.name===c[0]&&(a.execute(b.player,...c.slice(1)),b.cancelled=!0)})},data:(a,b)=>{const c=core.store({data:{},[a]:{}}),d=core.folder(core.root,"data",a).file(`${b}.json`);return c[b]||(c[b]=JSON.parse(d.read()||"{}"))},display:a=>{if(a&&a.constructor===core.circular)return"Circular";else{const b=toString.apply(a);switch(b){case"[object Object]":case"[object Function]":case"[foreign HostFunction]":return b.split(" ")[1].slice(0,-1);case"[object Array]":return`[ ${core.serialize(a).map(core.display).join(", ")} ]`;case"[foreign HostObject]":const c=`${a}`;return c.startsWith("class ")?a.class.canonicalName:c;default:switch(typeof a){case"function":return"Function";case"string":return`"${a}"`;case"symbol":return`@@${a.toString().slice(7,-1)}`;default:return`${a}`;}}}},eval:(µ,self)=>eval(µ),event:(a,b)=>{const c=core.store({event:{},[a]:[]});1===c.push(b)&&server.pluginManager.registerEvent(core.eval(a).class,new(Java.extend(org.bukkit.event.Listener,{})),org.bukkit.event.EventPriority.HIGHEST,(a,b)=>c.forEach(a=>a(b)),plugin)},fetch:a=>new Promise((b,c)=>{server.scheduler.scheduleAsyncDelayedTask(plugin,()=>{const d=new java.net.URL(a).openConnection();d.doOutput=!0,d.requestMethod="GET",d.instanceFollowRedirects=!0,200===d.responseCode?b({stream:()=>d.inputStream,response:()=>new java.util.Scanner(d.inputStream).useDelimiter("\\A").next()}):c(d.responseCode)})}),file:(...a)=>{const b=core.stat(...a).file();return b.exists()||java.nio.file.Files.createFile(b.toPath()),{folder:()=>core.folder(b.parentFile),io:()=>b,path:()=>core.stat(b.toPath().toString()).path(),read:()=>{const a=[],c=new java.io.BufferedReader(new java.io.FileReader(b));return c.lines().forEach(b=>a.push(b)),c.close(),a.join("")},remove:a=>{if(b.delete(),a)for(let a=b.parentFile;0===a.listFiles().length;)a.delete(),a=a.parentFile},write:a=>{const c=new java.io.PrintWriter(new java.io.FileWriter(b));c.print(a),c.close()}}},folder:(...a)=>{const b=core.stat(...a),c=b.path();return core.traverse([],c,{mode:"array",post:a=>{const b=core.stat(...a).file();b.exists()||b.mkdir()}}),{file:a=>core.file(...c,a),folder:(...a)=>core.folder(...c,...a),io:()=>b.file(),path:()=>b.path(),remove:a=>{const c=a=>{const b=a.listFiles();if(b)for(let a=0;a<b.length;++a){const d=b[a];d.directory?c(d):d.delete()}a.delete()};if(c(b.file()),a)for(let a=b.file().parentFile;0===a.listFiles().length;)a.delete(),a=a.parentFile}}},from:(a,b)=>b.filter(b=>b.contains(a)),keys:a=>Object.getOwnPropertyNames(a),lc:a=>a.toLowerCase(),root:`${plugin.dataFolder}`,serialize:(a,b,c)=>{let d=null;if(!(a&&"object"==typeof a))d=a;else if(c=c||[a],"function"==typeof a[Symbol.iterator]){d=[];for(let e of a)c.includes(e)?d.push(b?null:new core.circular):d.push(core.serialize(e,b,[...c,e]))}else for(let e in d={},a)d[e]=c.includes(a[e])?b?null:new core.circular:core.serialize(a[e],b,[...c,a[e]]);return d},stat:(...a)=>{const b=java.nio.file.Path.of(...a);return{file:()=>b.toFile(),path:()=>[...b.toString().replace(/\\/g,"/").split("/")]}},store:a=>{const b=core.store.db||(core.store.db={});return core.traverse(b,core.keys(a),{mode:"object",pre:(b,c)=>{b[c]||(b[c]=a[c])}})},text:(a,b,c,d)=>(!1!==d&&(b=core.color(b)),"action"===c?a.sendActionBar(b):"title"===c?a.sendTitle(...b.split("\n")):a.sendMessage(b)),traverse:(a,b,c)=>{c||(c={});for(let d of b){switch(c.pre&&c.pre(a,d),c.mode){case"string":a+=d;break;case"array":a.push(d);break;case"object":a=a[d];break;case"function":a=c.next(a,d);}c.post&&c.post(a,d)}return a},values:a=>core.keys(a).map(b=>a[b])},module={apply:(a,b)=>new Promise((c,d)=>{module.repo(a.slice(1)).then(e=>{e.release("latest").then(e=>{if(b===e.data.id)d("repository already up to date.");else{try{core.folder(core.root,"modules",a).remove(!0)}catch(a){d("repo folder could not be removed.")}e.download().then(b=>{const d=core.folder(core.root,"modules",a);d.remove(),java.nio.file.Files.move(b.folder.io().toPath(),d.io().toPath(),java.nio.file.StandardCopyOption.REPLACE_EXISTING),b.folder.remove(!0),c(e.data.id)}).catch(()=>{d("repository extraction failed.")})}}).catch(()=>{d("no releases available.")})}).catch(()=>{d("invalid repository.")})}),context:[core.root],default:{index:"module.exports = (function (global) {\n   return {\n      /* exports */\n   }\n})(globalThis);\n",package:"{\n   \"main\": \"./index.js\"\n}\n"},download:a=>new Promise((b,c)=>{core.fetch(a).then(a=>{let c=null,d=null;const e=new java.util.zip.ZipInputStream(a.stream()),f=core.folder(core.root,"downloads");for(;c=e.nextEntry;){if(c.directory){const a=f.folder(c.name);d||(d=a)}else{const a=new java.io.FileOutputStream(f.file(c.name).io());e.transferTo(a),a.close()}e.closeEntry()}e.close(),b({folder:d})}).catch(a=>{c(a)})}),exports:{},fetch:a=>new Promise((b,c)=>{core.fetch(a).then(a=>{const d=JSON.parse(a.response());return d.message?c(d.message):b(d)}).catch(a=>{c(a)})}),info:a=>{if(a){const b=`${module.trusted[a]||a.split("/").slice(-2).join("/")}`,c=core.folder(core.root,"modules",b),d=JSON.parse(c.file("package.json").read()||"{}"),e=d.main?c.file(d.main):null;return{data:d,folder:c,installed:core.keys(module.list).includes(b),js:e?e.read():null,script:e,source:b,valid:!!d.main}}else{const a=core.keys(module.trusted);return core.keys(module.list).map(b=>{for(let c of a)if(b===module.trusted[c])return c;return b})}},list:core.data("grakkit","modules",{}),parse:(a,b)=>{let c;const d=[...module.context];module.context.push(...b.replace(/\\/g,"/").split("/")),core.stat(...module.context).file().directory||module.context.pop();try{c=core.eval(a)}catch(a){console.error(a)}return module.context=d,module.exports={},c},release:a=>new Promise((b,c)=>{module.fetch(a).then(a=>{b({data:a,download:()=>module.download(a.zipball_url)})}).catch(a=>{c(a)})}),repo:a=>{const b=`https://api.github.com/repos/${a}`;return new Promise((a,c)=>{module.fetch(b).then(c=>{a({data:c,release:a=>module.release(`${b}/releases/${a}`)})}).catch(a=>{c(a)})})},require:a=>{if(a.startsWith("./")){const b=core.folder(...module.context).file(a);return console.log(`evaluating script: ./${b.path().join("/")}`),module.parse(b.read(),a)}else{const b=module.info(a);return b.installed?b.valid?(console.log(`evaluating script: ./${b.script.path().join("/")}`),module.parse(b.js,`modules/${b.source}`)):"invalid-package":"package-unavailable"}},trusted:{}},index={core:core,get exports(){return module.exports},set exports(a){return module.exports=a},global:global,module:module,persist:(...a)=>core.data("legacy",...a),plugin:plugin,refresh:(...a)=>{server.pluginManager.disablePlugin(plugin),server.pluginManager.enablePlugin(plugin)},require:(...a)=>module.require(...a),server:server};if(global.module)global.module.exports=index;else{core.command({name:"js",execute:(a,...b)=>{try{let c=null;const d=core.eval(b.join(" "),a);switch(toString.apply(d)){case"[object Object]":const a=core.keys(d);c=`{ ${a.map(a=>`${a}: ${core.display(d[a])}`).join(", ")} }`;break;case"[object Function]":c=`${d}`.replace(/\r/g,"");break;case"[foreign HostFunction]":let e=b.slice(-1)[0].split(".").slice(-1)[0];e.endsWith("]")&&(e=core.eval(e.replace(/.*\[/,"").slice(0,-1))),c=`hostFunction ${e}() { [native code] }`;break;default:c=core.display(d);}core.text(a,`\u00a77${c}`,"chat",!1)}catch(b){let c="Error",d=`${b}`;b.stack&&(c=b.stack.split("\n")[0].split(" ")[0].slice(0,-1),"TypeError"===c?d=b.message.split("\n")[0]:"SyntaxError"===c?d=b.message.split(" ").slice(1).join(" ").split("\n")[0]:void 0);core.text(a,`\u00a7c${c}: ${d}`,"chat",!1)}},tabComplete:(a,...b)=>{const c=b.slice(-1)[0],d=/.*(\!|\^|\&|\*|\(|\-|\+|\=|\[|\{|\||\;|\:|\,|\?|\/)/,e=c.replace(d,"").split(".");let f=Object.assign({self:a},global),g=0;for(;g<e.length-1;){let a=e[g];f[a]?(f=f[a],++g):g=1/0}if(g===e.length-1){const a=e.slice(-1)[0];return core.keys(f).filter(b=>b.includes(a)).map(a=>(c.match(d)||[""])[0]+[...e.slice(0,-1),a].join("."))}return[]}}),core.command({name:"module",execute:(a,b,c)=>{if(!b)core.text(a,"&7module $&c no action specified.");else if(b=core.lc(b),!["add","create","remove","update"].includes(b))core.text(a,"&7module $&c invalid action.");else if(!c)core.text(a,`&7module $&c no repository specified.`);else if("*"===c&&["remove","update"].includes(b)){const c=module.info(),d=e=>{const f=c[e];if(++e,f)switch(b){case"remove":core.text(a,`&7module $&e ${f}&f deleting...`);try{core.folder(core.root,"modules",f).remove(!0),delete module.list[f],core.text(a,`&7module $&e ${f}&f deleted.`)}catch(b){core.text(a,`&7module $&e ${f}&c repo folder could not be removed.`)}d();break;case"update":-1===module.list[f]?d():(core.text(a,`&7module $&e ${f}&f updating...`),module.apply(f,module.list[f]).then(b=>{module.list[f]=b,core.text(a,`&7module $&e ${f}&f updated.`),d()}).catch(b=>{core.text(a,`&7module $&e ${f}&c ${b}`),d()}));}else e<c.length?d():0===c.length&&core.text(a,`&7module $&c there are no modules to ${b}.`)};d(0)}else if("@"===c[0])core.text(a,`&7module $&c invalid repository.`);else{c=core.lc(c).replace(/\\/g,"/");let d=null;d="create"===b?c.replace(/.*\//g,""):`${module.trusted[c]||c.split("/").slice(-2).join("/")}`;const e=core.keys(module.list).includes(d);switch(b){case"add":e?core.text(a,`&7module $&e ${d}&c repository already installed.`):(core.text(a,`&7module $&e ${d}&f installing...`),module.apply(d).then(b=>{module.list[d]=b,core.text(a,`&7module $&e ${d}&f installed.`)}).catch(b=>{core.text(a,`&7module $&e ${d}&c ${b}`)}));break;case"create":if(e)core.text(a,`&7module $&e ${d}&c repository already installed.`);else{core.text(a,`&7module $&e ${d}&f creating...`);try{const b=core.folder(core.root,"modules",d);b.file("index.js").write(module.default.index),b.file("package.json").write(module.default.package),module.list[d]=-1,core.text(a,`&7module $&e ${d}&f created.`)}catch(b){core.text(a,`&7module $&e ${d}&c repo folder could not be created.`)}}break;case"remove":if(e){core.text(a,`&7module $&e ${d}&f deleting...`);try{core.folder(core.root,"modules",d).remove(!0),delete module.list[d],core.text(a,`&7module $&e ${d}&f deleted.`)}catch(b){core.text(a,`&7module $&e ${d}&c repo folder could not be removed.`)}}else core.text(a,`&7module $&e ${d}&c repository not already installed.`);break;case"update":e?-1===module.list[d]?core.text(a,`&7module $&e ${d}&c cannot update a local module.`):(core.text(a,`&7module $&e ${d}&f updating...`),module.apply(d,module.list[d]).then(b=>{module.list[d]=b,core.text(a,`&7module $&e ${d}&f updated.`)}).catch(b=>{core.text(a,`&7module $&e ${d}&c ${b}`)})):core.text(a,`&7module $&e ${d}&c repository not installed.`);}}},tabComplete:(a,b,c,d)=>void 0===c?core.from(core.lc(b),["add","create","remove","update"]):void 0===d?"add"===b?core.from(core.lc(c),core.keys(module.trusted)):"remove"===b||"update"===b?[...core.from(core.lc(c),module.info()),"*"]:[]:[]}),core.event("org.bukkit.event.server.PluginDisableEvent",a=>{if(a.plugin===plugin){const a=core.store({data:{}});for(let b in a)for(let c in a[b]){const d=core.folder(core.root,"data",b).file(`${c}.json`);d.write(JSON.stringify(core.serialize(a[b][c],!0)))}}}),module.fetch("https://raw.githubusercontent.com/hb432/Grakkit/master/modules.json").then(a=>{module.trusted=a}),Object.assign(global,index);const a=b=>{const c=b.listFiles();if(c)for(let b=0;b<c.length;++b){const d=c[b];if(d.directory)a(d);else{const a=core.file(d.toPath().toString());console.log(`evaluating script: ./${a.path().join("/")}`),core.eval(a.read())}}};try{a(core.folder(core.root,"scripts").io())}catch(a){console.trace(a)}}}