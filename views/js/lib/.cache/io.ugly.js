function require(e,t,n){var r=require.resolve(e);if(null==r){n=n||e,t=t||"root";var i=new Error('Failed to require "'+n+'" from "'+t+'"');throw i.path=n,i.parent=t,i.require=!0,i}var s=require.modules[r];return s.exports||(s.exports={},s.client=s.component=!0,s.call(this,s.exports,require.relative(r),s)),s.exports}var has=Object.prototype.hasOwnProperty;require.modules={},require.aliases={},require.resolve=function(e){e.charAt(0)==="/"&&(e=e.slice(1));var t=e+"/index.js",n=[e,e+".js",e+".json",e+"/index.js",e+"/index.json"];for(var r=0;r<n.length;r++){var e=n[r];if(has.call(require.modules,e))return e}if(has.call(require.aliases,t))return require.aliases[t]},require.normalize=function(e,t){var n=[];if("."!=t.charAt(0))return t;e=e.split("/"),t=t.split("/");for(var r=0;r<t.length;++r)".."==t[r]?e.pop():"."!=t[r]&&""!=t[r]&&n.push(t[r]);return e.concat(n).join("/")},require.register=function(e,t){require.modules[e]=t},require.alias=function(e,t){if(!has.call(require.modules,e))throw new Error('Failed to alias "'+e+'", it does not exist');require.aliases[t]=e},require.relative=function(e){function n(e,t){var n=e.length;while(n--)if(e[n]===t)return n;return-1}function r(t){var n=r.resolve(t);return require(n,e,t)}var t=require.normalize(e,"..");return r.resolve=function(r){var i=r.charAt(0);if("/"==i)return r.slice(1);if("."==i)return require.normalize(t,r);var s=e.split("/"),o=n(s,"deps")+1;return o||(o=0),r=s.slice(0,o+1).join("/")+"/deps/"+r,r},r.exists=function(e){return has.call(require.modules,r.resolve(e))},r},require.register("component-indexof/index.js",function(e,t,n){var r=[].indexOf;n.exports=function(e,t){if(r)return e.indexOf(t);for(var n=0;n<e.length;++n)if(e[n]===t)return n;return-1}}),require.register("component-emitter/index.js",function(e,t,n){function i(e){if(e)return s(e)}function s(e){for(var t in i.prototype)e[t]=i.prototype[t];return e}var r=t("indexof");n.exports=i,i.prototype.on=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks[e]=this._callbacks[e]||[]).push(t),this},i.prototype.once=function(e,t){function r(){n.off(e,r),t.apply(this,arguments)}var n=this;return this._callbacks=this._callbacks||{},t._off=r,this.on(e,r),this},i.prototype.off=i.prototype.removeListener=i.prototype.removeAllListeners=function(e,t){this._callbacks=this._callbacks||{};if(0==arguments.length)return this._callbacks={},this;var n=this._callbacks[e];if(!n)return this;if(1==arguments.length)return delete this._callbacks[e],this;var i=r(n,t._off||t);return~i&&n.splice(i,1),this},i.prototype.emit=function(e){this._callbacks=this._callbacks||{};var t=[].slice.call(arguments,1),n=this._callbacks[e];if(n){n=n.slice(0);for(var r=0,i=n.length;r<i;++r)n[r].apply(this,t)}return this},i.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks[e]||[]},i.prototype.hasListeners=function(e){return!!this.listeners(e).length}}),require.register("matthewmueller-io/index.js",function(e,t,n){function s(e){if(!(this instanceof s))return new s(e);var t=this.socket=new i.Socket(e||{});r(this),t.on("message",this.message.bind(this))}var r=t("emitter"),i=window.eio;n.exports=s,s.prototype.send=function(){var e=Array.prototype.slice.call(arguments),t=e.shift();return this.socket.send(JSON.stringify({event:t,message:e})),this},s.prototype.message=function(e){return e=JSON.parse(e),this.emit.apply(this,[e.event].concat(e.message)),this}}),require.alias("matthewmueller-io/index.js","undefined/deps/io/index.js"),require.alias("component-emitter/index.js","matthewmueller-io/deps/emitter/index.js"),require.alias("component-indexof/index.js","component-emitter/deps/indexof/index.js")