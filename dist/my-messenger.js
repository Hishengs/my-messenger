!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).MyMessenger={})}(this,(function(e){"use strict";class t{flag="";debug=!1;debugPrefix="";events={};uid=+new Date;constructor(e,t){this.flag=e+"_"+this.uid,this.debug=t,this.debugPrefix=`[messenager.${this.flag}]`.padEnd(20,">")}on(e,t){"function"==typeof t&&(this.events[e]||(this.events[e]=[]),this.events[e].push(t))}off(e,t){if(e&&this.events[e]){if(t&&"function"==typeof t){const s=this.events[e].indexOf(t);this.events[e].splice(s,1)}this.events[e]=void 0}}offAll(){Object.keys(this.events).forEach((e=>this.off(e)))}invoke(e,...t){if(e&&this.events[e])for(const s of this.events[e])s.call(this,...t)}showDebug(...e){this.debug&&console.info(this.debugPrefix,...e)}showError(e){this.debug&&console.error(this.debugPrefix,"string"==typeof e?e:e.message)}}class s extends t{static debug=!1;shakehandTimes=0;shakehandTimer=null;connected=!1;timeout=5e3;interval=100;maxShakeTimes=50;constructor(e,t={}){"string"==typeof e&&(e=document.querySelector(e)),super("parent",s.debug),this.iframe=e,this.timeout=t.timeout||this.timeout,this.interval=t.interval||this.interval,this.maxShakeTimes=Math.floor(this.timeout/this.interval),this.targetOrigin=t.targetOrigin||e.src,this.onMessage=this.onMessage.bind(this),window.addEventListener("message",this.onMessage)}connect(){return this.checkLoaded().then((()=>this.shakehand())).then((()=>{this.connected=!0,this.showDebug("connected")}))}checkLoaded(){return new Promise(((e,t)=>{if(this.showDebug("checkLoaded"),this.iframe){this.iframe.addEventListener("load",(()=>{e()}));try{const t=this.iframe.contentDocument||this.iframe.contentWindow.document;t&&"complete"===t.readyState&&e()}catch(t){e()}}else t("no iframe found")}))}shakehand(){return new Promise(((e,t)=>{const s=e=>{if(this.shakehandTimes>=this.maxShakeTimes)return clearInterval(this.shakehandTimer),this.showError("shakehand failed, max times"),void t("shakehand failed, max times");this.shakehandTimes++,this.showDebug(`shakehand: ${this.shakehandTimes}`,e),this.send("shakehand",{ack:e})};s(),this.shakehandTimer=setInterval(s,this.interval),this.on("shakehand-reply",(({ack:t})=>{t&&(clearInterval(this.shakehandTimer),s(!0),this.off("shakehand-reply"),e())}))}))}send(e,t){if(this.iframe&&this.iframe.contentWindow)try{this.iframe.contentWindow.postMessage({event:e,data:t},this.targetOrigin)}catch(e){this.showError(e)}}onMessage(e){if(!this.iframe||this.iframe.contentWindow!==e.source)return;const{event:t,data:s}=e.data;this.showDebug("onMessage",e),this.invoke(t,s,e)}close(){this.connected=!1,window.removeEventListener("message",this.onMessage),this.offAll()}}class i extends t{static debug=!1;origin="";connected=!1;constructor(e){super("child",i.debug),this.origin=e||document.referrer||"*",this.onMessage=this.onMessage.bind(this),window.addEventListener("message",this.onMessage)}connect(){return new Promise((e=>{this.on("shakehand",(t=>{this.showDebug("on.shakehand",t),this.replyShakehand(t).then(e)}))}))}replyShakehand({ack:e}){return new Promise((t=>{if(e)return this.showDebug("connected"),this.connected=!0,this.off("shakehand"),void t();this.showDebug("shakehand-reply"),this.send("shakehand-reply",{ack:!0})}))}send(e,t){if(window.parent&&this.origin)try{window.parent.postMessage({event:e,data:t},this.origin)}catch(e){this.showError(e)}}onMessage(e){const{event:t="",data:s}=e.data||{};this.showDebug("onMessage",e.data),this.invoke(t,s,e)}close(){this.connected=!1,window.removeEventListener("message",this.onMessage),this.offAll()}}const n={Parent:s,Child:i};e.default=n,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=my-messenger.js.map
