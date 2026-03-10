"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // bin/live-reload.js
  var init_live_reload = __esm({
    "bin/live-reload.js"() {
      "use strict";
      new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());
    }
  });

  // node_modules/@amplitude/ua-parser-js/src/ua-parser.js
  var require_ua_parser = __commonJS({
    "node_modules/@amplitude/ua-parser-js/src/ua-parser.js"(exports, module) {
      init_live_reload();
      (function(window2, undefined2) {
        "use strict";
        var LIBVERSION = "0.7.33", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION2 = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded", UA_MAX_LENGTH = 350;
        var AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", BROWSER = "Browser", CHROME = "Chrome", EDGE = "Edge", FIREFOX = "Firefox", GOOGLE = "Google", HUAWEI = "Huawei", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", OPERA = "Opera", SAMSUNG = "Samsung", SHARP = "Sharp", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", FACEBOOK = "Facebook";
        var extend = function(regexes2, extensions) {
          var mergedRegexes = {};
          for (var i in regexes2) {
            if (extensions[i] && extensions[i].length % 2 === 0) {
              mergedRegexes[i] = extensions[i].concat(regexes2[i]);
            } else {
              mergedRegexes[i] = regexes2[i];
            }
          }
          return mergedRegexes;
        }, enumerize = function(arr) {
          var enums = {};
          for (var i = 0; i < arr.length; i++) {
            enums[arr[i].toUpperCase()] = arr[i];
          }
          return enums;
        }, has = function(str1, str2) {
          return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        }, lowerize = function(str) {
          return str.toLowerCase();
        }, majorize = function(version3) {
          return typeof version3 === STR_TYPE ? version3.replace(/[^\d\.]/g, EMPTY).split(".")[0] : undefined2;
        }, trim = function(str, len) {
          if (typeof str === STR_TYPE) {
            str = str.replace(/^\s\s*/, EMPTY);
            return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
          }
        };
        var rgxMapper = function(ua, arrays) {
          var i = 0, j, k, p, q, matches, match;
          while (i < arrays.length && !matches) {
            var regex = arrays[i], props = arrays[i + 1];
            j = k = 0;
            while (j < regex.length && !matches) {
              matches = regex[j++].exec(ua);
              if (!!matches) {
                for (p = 0; p < props.length; p++) {
                  match = matches[++k];
                  q = props[p];
                  if (typeof q === OBJ_TYPE && q.length > 0) {
                    if (q.length === 2) {
                      if (typeof q[1] == FUNC_TYPE) {
                        this[q[0]] = q[1].call(this, match);
                      } else {
                        this[q[0]] = q[1];
                      }
                    } else if (q.length === 3) {
                      if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined2;
                      } else {
                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined2;
                      }
                    } else if (q.length === 4) {
                      this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined2;
                    }
                  } else {
                    this[q] = match ? match : undefined2;
                  }
                }
              }
            }
            i += 2;
          }
        }, strMapper = function(str, map) {
          for (var i in map) {
            if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
              for (var j = 0; j < map[i].length; j++) {
                if (has(map[i][j], str)) {
                  return i === UNKNOWN ? undefined2 : i;
                }
              }
            } else if (has(map[i], str)) {
              return i === UNKNOWN ? undefined2 : i;
            }
          }
          return str;
        };
        var oldSafariMap = {
          "1.0": "/8",
          1.2: "/1",
          1.3: "/3",
          "2.0": "/412",
          "2.0.2": "/416",
          "2.0.3": "/417",
          "2.0.4": "/419",
          "?": "/"
        }, windowsVersionMap = {
          ME: "4.90",
          "NT 3.11": "NT3.51",
          "NT 4.0": "NT4.0",
          2e3: "NT 5.0",
          XP: ["NT 5.1", "NT 5.2"],
          Vista: "NT 6.0",
          7: "NT 6.1",
          8: "NT 6.2",
          8.1: "NT 6.3",
          10: ["NT 6.4", "NT 10.0"],
          RT: "ARM"
        };
        var regexes = {
          browser: [
            [
              /\b(?:crmo|crios)\/([\w\.]+)/i
              // Chrome for Android/iOS
            ],
            [VERSION2, [NAME, "Chrome"]],
            [
              /edg(?:e|ios|a)?\/([\w\.]+)/i
              // Microsoft Edge
            ],
            [VERSION2, [NAME, "Edge"]],
            [
              // Presto based
              /(opera mini)\/([-\w\.]+)/i,
              // Opera Mini
              /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
              // Opera Mobi/Tablet
              /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
              // Opera
            ],
            [NAME, VERSION2],
            [
              /opios[\/ ]+([\w\.]+)/i
              // Opera mini on iphone >= 8.0
            ],
            [VERSION2, [NAME, OPERA + " Mini"]],
            [
              /\bopr\/([\w\.]+)/i
              // Opera Webkit
            ],
            [VERSION2, [NAME, OPERA]],
            [
              // Mixed
              /(kindle)\/([\w\.]+)/i,
              // Kindle
              /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
              // Lunascape/Maxthon/Netfront/Jasmine/Blazer
              // Trident based
              /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
              // Avant/IEMobile/SlimBrowser
              /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
              // Baidu Browser
              /(?:ms|\()(ie) ([\w\.]+)/i,
              // Internet Explorer
              // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
              /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
              // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
              /(weibo)__([\d\.]+)/i
              // Weibo
            ],
            [NAME, VERSION2],
            [
              /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
              // UCBrowser
            ],
            [VERSION2, [NAME, "UC" + BROWSER]],
            [
              /microm.+\bqbcore\/([\w\.]+)/i,
              // WeChat Desktop for Windows Built-in Browser
              /\bqbcore\/([\w\.]+).+microm/i
            ],
            [VERSION2, [NAME, "WeChat(Win) Desktop"]],
            [
              /micromessenger\/([\w\.]+)/i
              // WeChat
            ],
            [VERSION2, [NAME, "WeChat"]],
            [
              /konqueror\/([\w\.]+)/i
              // Konqueror
            ],
            [VERSION2, [NAME, "Konqueror"]],
            [
              /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
              // IE11
            ],
            [VERSION2, [NAME, "IE"]],
            [
              /yabrowser\/([\w\.]+)/i
              // Yandex
            ],
            [VERSION2, [NAME, "Yandex"]],
            [
              /(avast|avg)\/([\w\.]+)/i
              // Avast/AVG Secure Browser
            ],
            [[NAME, /(.+)/, "$1 Secure " + BROWSER], VERSION2],
            [
              /\bfocus\/([\w\.]+)/i
              // Firefox Focus
            ],
            [VERSION2, [NAME, FIREFOX + " Focus"]],
            [
              /\bopt\/([\w\.]+)/i
              // Opera Touch
            ],
            [VERSION2, [NAME, OPERA + " Touch"]],
            [
              /coc_coc\w+\/([\w\.]+)/i
              // Coc Coc Browser
            ],
            [VERSION2, [NAME, "Coc Coc"]],
            [
              /dolfin\/([\w\.]+)/i
              // Dolphin
            ],
            [VERSION2, [NAME, "Dolphin"]],
            [
              /coast\/([\w\.]+)/i
              // Opera Coast
            ],
            [VERSION2, [NAME, OPERA + " Coast"]],
            [
              /miuibrowser\/([\w\.]+)/i
              // MIUI Browser
            ],
            [VERSION2, [NAME, "MIUI " + BROWSER]],
            [
              /fxios\/([-\w\.]+)/i
              // Firefox for iOS
            ],
            [VERSION2, [NAME, FIREFOX]],
            [
              /\bqihu|(qi?ho?o?|360)browser/i
              // 360
            ],
            [[NAME, "360 " + BROWSER]],
            [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i],
            [[NAME, /(.+)/, "$1 " + BROWSER], VERSION2],
            [
              // Oculus/Samsung/Sailfish/Huawei Browser
              /(comodo_dragon)\/([\w\.]+)/i
              // Comodo Dragon
            ],
            [[NAME, /_/g, " "], VERSION2],
            [
              /(electron)\/([\w\.]+) safari/i,
              // Electron-based App
              /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
              // Tesla
              /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
              // QQBrowser/Baidu App/2345 Browser
            ],
            [NAME, VERSION2],
            [
              /(metasr)[\/ ]?([\w\.]+)/i,
              // SouGouBrowser
              /(lbbrowser)/i,
              // LieBao Browser
              /\[(linkedin)app\]/i
              // LinkedIn App for iOS & Android
            ],
            [NAME],
            [
              // WebView
              /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
              // Facebook App for iOS & Android
            ],
            [[NAME, FACEBOOK], VERSION2],
            [
              /safari (line)\/([\w\.]+)/i,
              // Line App for iOS
              /\b(line)\/([\w\.]+)\/iab/i,
              // Line App for Android
              /(chromium|instagram)[\/ ]([-\w\.]+)/i
              // Chromium/Instagram
            ],
            [NAME, VERSION2],
            [
              /\bgsa\/([\w\.]+) .*safari\//i
              // Google Search Appliance on iOS
            ],
            [VERSION2, [NAME, "GSA"]],
            [
              /headlesschrome(?:\/([\w\.]+)| )/i
              // Chrome Headless
            ],
            [VERSION2, [NAME, CHROME + " Headless"]],
            [
              / wv\).+(chrome)\/([\w\.]+)/i
              // Chrome WebView
            ],
            [[NAME, CHROME + " WebView"], VERSION2],
            [
              /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
              // Android Browser
            ],
            [VERSION2, [NAME, "Android " + BROWSER]],
            [
              /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
              // Chrome/OmniWeb/Arora/Tizen/Nokia
            ],
            [NAME, VERSION2],
            [
              /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
              // Mobile Safari
            ],
            [VERSION2, [NAME, "Mobile Safari"]],
            [
              /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
              // Safari & Safari Mobile
            ],
            [VERSION2, NAME],
            [
              /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
              // Safari < 3.0
            ],
            [NAME, [VERSION2, strMapper, oldSafariMap]],
            [/(webkit|khtml)\/([\w\.]+)/i],
            [NAME, VERSION2],
            [
              // Gecko based
              /(navigator|netscape\d?)\/([-\w\.]+)/i
              // Netscape
            ],
            [[NAME, "Netscape"], VERSION2],
            [
              /mobile vr; rv:([\w\.]+)\).+firefox/i
              // Firefox Reality
            ],
            [VERSION2, [NAME, FIREFOX + " Reality"]],
            [
              /ekiohf.+(flow)\/([\w\.]+)/i,
              // Flow
              /(swiftfox)/i,
              // Swiftfox
              /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
              // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
              /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
              // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
              /(firefox)\/([\w\.]+)/i,
              // Other Firefox-based
              /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
              // Mozilla
              // Other
              /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
              // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
              /(links) \(([\w\.]+)/i
              // Links
            ],
            [NAME, VERSION2],
            [
              /(cobalt)\/([\w\.]+)/i
              // Cobalt
            ],
            [NAME, [VERSION2, /master.|lts./, ""]]
          ],
          cpu: [
            [
              /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
              // AMD64 (x64)
            ],
            [[ARCHITECTURE, "amd64"]],
            [
              /(ia32(?=;))/i
              // IA32 (quicktime)
            ],
            [[ARCHITECTURE, lowerize]],
            [
              /((?:i[346]|x)86)[;\)]/i
              // IA32 (x86)
            ],
            [[ARCHITECTURE, "ia32"]],
            [
              /\b(aarch64|arm(v?8e?l?|_?64))\b/i
              // ARM64
            ],
            [[ARCHITECTURE, "arm64"]],
            [
              /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
              // ARMHF
            ],
            [[ARCHITECTURE, "armhf"]],
            [
              // PocketPC mistakenly identified as PowerPC
              /windows (ce|mobile); ppc;/i
            ],
            [[ARCHITECTURE, "arm"]],
            [
              /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
              // PowerPC
            ],
            [[ARCHITECTURE, /ower/, EMPTY, lowerize]],
            [
              /(sun4\w)[;\)]/i
              // SPARC
            ],
            [[ARCHITECTURE, "sparc"]],
            [
              /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
              // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ],
            [[ARCHITECTURE, lowerize]]
          ],
          device: [
            [
              //////////////////////////
              // MOBILES & TABLETS
              // Ordered by popularity
              /////////////////////////
              // Samsung
              /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ],
            [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]],
            [
              /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
              /samsung[- ]([-\w]+)/i,
              /sec-(sgh\w+)/i
            ],
            [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]],
            [
              // Apple
              /((ipod|iphone)\d+,\d+)/i
              // iPod/iPhone model
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]],
            [
              /(ipad\d+,\d+)/i
              // iPad model
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, TABLET]],
            [
              /\((ip(?:hone|od)[\w ]*);/i
              // iPod/iPhone
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]],
            [
              /\((ipad);[-\w\),; ]+apple/i,
              // iPad
              /applecoremedia\/[\w\.]+ \((ipad)/i,
              /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ],
            [MODEL, [VENDOR, APPLE], [TYPE, TABLET]],
            [/(macintosh);/i],
            [MODEL, [VENDOR, APPLE]],
            [
              // Huawei
              /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ],
            [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]],
            [
              /(?:huawei|honor)([-\w ]+)[;\)]/i,
              /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ],
            [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]],
            [
              // Xiaomi
              /\b(poco[\w ]+)(?: bui|\))/i,
              // Xiaomi POCO
              /\b; (\w+) build\/hm\1/i,
              // Xiaomi Hongmi 'numeric' models
              /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
              // Xiaomi Hongmi
              /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
              // Xiaomi Redmi
              /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
              // Xiaomi Mi
            ],
            [
              [MODEL, /_/g, " "],
              [VENDOR, XIAOMI],
              [TYPE, MOBILE]
            ],
            [
              /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
              // Mi Pad tablets
            ],
            [
              [MODEL, /_/g, " "],
              [VENDOR, XIAOMI],
              [TYPE, TABLET]
            ],
            [
              // OPPO
              /; (\w+) bui.+ oppo/i,
              /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ],
            [MODEL, [VENDOR, "OPPO"], [TYPE, MOBILE]],
            [
              // Vivo
              /vivo (\w+)(?: bui|\))/i,
              /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ],
            [MODEL, [VENDOR, "Vivo"], [TYPE, MOBILE]],
            [
              // Realme
              /\b(rmx[12]\d{3})(?: bui|;|\))/i
            ],
            [MODEL, [VENDOR, "Realme"], [TYPE, MOBILE]],
            [
              // Motorola
              /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
              /\bmot(?:orola)?[- ](\w*)/i,
              /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ],
            [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]],
            [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
            [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]],
            [
              // LG
              /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ],
            [MODEL, [VENDOR, LG], [TYPE, TABLET]],
            [
              /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
              /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
              /\blg-?([\d\w]+) bui/i
            ],
            [MODEL, [VENDOR, LG], [TYPE, MOBILE]],
            [
              // Lenovo
              /(ideatab[-\w ]+)/i,
              /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ],
            [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]],
            [
              // Nokia
              /(?:maemo|nokia).*(n900|lumia \d+)/i,
              /nokia[-_ ]?([-\w\.]*)/i
            ],
            [
              [MODEL, /_/g, " "],
              [VENDOR, "Nokia"],
              [TYPE, MOBILE]
            ],
            [
              // Google
              /(pixel c)\b/i
              // Google Pixel C
            ],
            [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]],
            [
              /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
              // Google Pixel
            ],
            [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]],
            [
              // Sony
              /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ],
            [MODEL, [VENDOR, SONY], [TYPE, MOBILE]],
            [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
            [
              [MODEL, "Xperia Tablet"],
              [VENDOR, SONY],
              [TYPE, TABLET]
            ],
            [
              // OnePlus
              / (kb2005|in20[12]5|be20[12][59])\b/i,
              /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ],
            [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]],
            [
              // Amazon
              /(alexa)webm/i,
              /(kf[a-z]{2}wi)( bui|\))/i,
              // Kindle Fire without Silk
              /(kf[a-z]+)( bui|\)).+silk\//i
              // Kindle Fire HD
            ],
            [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]],
            [
              /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
              // Fire Phone
            ],
            [
              [MODEL, /(.+)/g, "Fire Phone $1"],
              [VENDOR, AMAZON],
              [TYPE, MOBILE]
            ],
            [
              // BlackBerry
              /(playbook);[-\w\),; ]+(rim)/i
              // BlackBerry PlayBook
            ],
            [MODEL, VENDOR, [TYPE, TABLET]],
            [
              /\b((?:bb[a-f]|st[hv])100-\d)/i,
              /\(bb10; (\w+)/i
              // BlackBerry 10
            ],
            [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]],
            [
              // Asus
              /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ],
            [MODEL, [VENDOR, ASUS], [TYPE, TABLET]],
            [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
            [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]],
            [
              // HTC
              /(nexus 9)/i
              // HTC Nexus 9
            ],
            [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
            [
              /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
              // HTC
              // ZTE
              /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
              /(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i
              // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ],
            [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
            [
              // Acer
              /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ],
            [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
            [
              // Meizu
              /droid.+; (m[1-5] note) bui/i,
              /\bmz-([-\w]{2,})/i
            ],
            [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
            [
              // Sharp
              /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ],
            [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]],
            [
              // MIXED
              /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
              // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
              /(hp) ([\w ]+\w)/i,
              // HP iPAQ
              /(asus)-?(\w+)/i,
              // Asus
              /(microsoft); (lumia[\w ]+)/i,
              // Microsoft Lumia
              /(lenovo)[-_ ]?([-\w]+)/i,
              // Lenovo
              /(jolla)/i,
              // Jolla
              /(oppo) ?([\w ]+) bui/i
              // OPPO
            ],
            [VENDOR, MODEL, [TYPE, MOBILE]],
            [
              /(archos) (gamepad2?)/i,
              // Archos
              /(hp).+(touchpad(?!.+tablet)|tablet)/i,
              // HP TouchPad
              /(kindle)\/([\w\.]+)/i,
              // Kindle
              /(nook)[\w ]+build\/(\w+)/i,
              // Nook
              /(dell) (strea[kpr\d ]*[\dko])/i,
              // Dell Streak
              /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
              // Le Pan Tablets
              /(trinity)[- ]*(t\d{3}) bui/i,
              // Trinity Tablets
              /(gigaset)[- ]+(q\w{1,9}) bui/i,
              // Gigaset Tablets
              /(vodafone) ([\w ]+)(?:\)| bui)/i
              // Vodafone
            ],
            [VENDOR, MODEL, [TYPE, TABLET]],
            [
              /(surface duo)/i
              // Surface Duo
            ],
            [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]],
            [
              /droid [\d\.]+; (fp\du?)(?: b|\))/i
              // Fairphone
            ],
            [MODEL, [VENDOR, "Fairphone"], [TYPE, MOBILE]],
            [
              /(u304aa)/i
              // AT&T
            ],
            [MODEL, [VENDOR, "AT&T"], [TYPE, MOBILE]],
            [
              /\bsie-(\w*)/i
              // Siemens
            ],
            [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
            [
              /\b(rct\w+) b/i
              // RCA Tablets
            ],
            [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
            [
              /\b(venue[\d ]{2,7}) b/i
              // Dell Venue Tablets
            ],
            [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
            [
              /\b(q(?:mv|ta)\w+) b/i
              // Verizon Tablet
            ],
            [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
            [
              /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
              // Barnes & Noble Tablet
            ],
            [MODEL, [VENDOR, "Barnes & Noble"], [TYPE, TABLET]],
            [/\b(tm\d{3}\w+) b/i],
            [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
            [
              /\b(k88) b/i
              // ZTE K Series Tablet
            ],
            [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
            [
              /\b(nx\d{3}j) b/i
              // ZTE Nubia
            ],
            [MODEL, [VENDOR, "ZTE"], [TYPE, MOBILE]],
            [
              /\b(gen\d{3}) b.+49h/i
              // Swiss GEN Mobile
            ],
            [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
            [
              /\b(zur\d{3}) b/i
              // Swiss ZUR Tablet
            ],
            [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
            [
              /\b((zeki)?tb.*\b) b/i
              // Zeki Tablets
            ],
            [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
            [
              /\b([yr]\d{2}) b/i,
              /\b(dragon[- ]+touch |dt)(\w{5}) b/i
              // Dragon Touch Tablet
            ],
            [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
            [
              /\b(ns-?\w{0,9}) b/i
              // Insignia Tablets
            ],
            [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
            [
              /\b((nxa|next)-?\w{0,9}) b/i
              // NextBook Tablets
            ],
            [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
            [
              /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
              // Voice Xtreme Phones
            ],
            [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
            [
              /\b(lvtel\-)?(v1[12]) b/i
              // LvTel Phones
            ],
            [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
            [
              /\b(ph-1) /i
              // Essential PH-1
            ],
            [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
            [
              /\b(v(100md|700na|7011|917g).*\b) b/i
              // Envizen Tablets
            ],
            [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
            [
              /\b(trio[-\w\. ]+) b/i
              // MachSpeed Tablets
            ],
            [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
            [
              /\btu_(1491) b/i
              // Rotor Tablets
            ],
            [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
            [
              /(shield[\w ]+) b/i
              // Nvidia Shield Tablets
            ],
            [MODEL, [VENDOR, "Nvidia"], [TYPE, TABLET]],
            [
              /(sprint) (\w+)/i
              // Sprint Phones
            ],
            [VENDOR, MODEL, [TYPE, MOBILE]],
            [
              /(kin\.[onetw]{3})/i
              // Microsoft Kin
            ],
            [
              [MODEL, /\./g, " "],
              [VENDOR, MICROSOFT],
              [TYPE, MOBILE]
            ],
            [
              /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
              // Zebra
            ],
            [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]],
            [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
            [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]],
            [
              ///////////////////
              // CONSOLES
              ///////////////////
              /(ouya)/i,
              // Ouya
              /(nintendo) ([wids3utch]+)/i
              // Nintendo
            ],
            [VENDOR, MODEL, [TYPE, CONSOLE]],
            [
              /droid.+; (shield) bui/i
              // Nvidia
            ],
            [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]],
            [
              /(playstation [345portablevi]+)/i
              // Playstation
            ],
            [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]],
            [
              /\b(xbox(?: one)?(?!; xbox))[\); ]/i
              // Microsoft Xbox
            ],
            [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]],
            [
              ///////////////////
              // SMARTTVS
              ///////////////////
              /smart-tv.+(samsung)/i
              // Samsung
            ],
            [VENDOR, [TYPE, SMARTTV]],
            [/hbbtv.+maple;(\d+)/i],
            [
              [MODEL, /^/, "SmartTV"],
              [VENDOR, SAMSUNG],
              [TYPE, SMARTTV]
            ],
            [
              /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
              // LG SmartTV
            ],
            [
              [VENDOR, LG],
              [TYPE, SMARTTV]
            ],
            [
              /(apple) ?tv/i
              // Apple TV
            ],
            [VENDOR, [MODEL, APPLE + " TV"], [TYPE, SMARTTV]],
            [
              /crkey/i
              // Google Chromecast
            ],
            [
              [MODEL, CHROME + "cast"],
              [VENDOR, GOOGLE],
              [TYPE, SMARTTV]
            ],
            [
              /droid.+aft(\w)( bui|\))/i
              // Fire TV
            ],
            [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]],
            [
              /\(dtv[\);].+(aquos)/i,
              /(aquos-tv[\w ]+)\)/i
              // Sharp
            ],
            [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],
            [
              /(bravia[\w ]+)( bui|\))/i
              // Sony
            ],
            [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]],
            [
              /(mitv-\w{5}) bui/i
              // Xiaomi
            ],
            [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]],
            [
              /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
              // Roku
              /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i
              // HbbTV devices
            ],
            [
              [VENDOR, trim],
              [MODEL, trim],
              [TYPE, SMARTTV]
            ],
            [
              /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
              // SmartTV from Unidentified Vendors
            ],
            [[TYPE, SMARTTV]],
            [
              ///////////////////
              // WEARABLES
              ///////////////////
              /((pebble))app/i
              // Pebble
            ],
            [VENDOR, MODEL, [TYPE, WEARABLE]],
            [
              /droid.+; (glass) \d/i
              // Google Glass
            ],
            [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]],
            [/droid.+; (wt63?0{2,3})\)/i],
            [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]],
            [
              /(quest( 2)?)/i
              // Oculus Quest
            ],
            [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]],
            [
              ///////////////////
              // EMBEDDED
              ///////////////////
              /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
              // Tesla
            ],
            [VENDOR, [TYPE, EMBEDDED]],
            [
              ////////////////////
              // MIXED (GENERIC)
              ///////////////////
              /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
              // Android Phones from Unidentified Vendors
            ],
            [MODEL, [TYPE, MOBILE]],
            [
              /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
              // Android Tablets from Unidentified Vendors
            ],
            [MODEL, [TYPE, TABLET]],
            [
              /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
              // Unidentifiable Tablet
            ],
            [[TYPE, TABLET]],
            [
              /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
              // Unidentifiable Mobile
            ],
            [[TYPE, MOBILE]],
            [
              /(android[-\w\. ]{0,9});.+buil/i
              // Generic Android Device
            ],
            [MODEL, [VENDOR, "Generic"]]
          ],
          engine: [
            [
              /windows.+ edge\/([\w\.]+)/i
              // EdgeHTML
            ],
            [VERSION2, [NAME, EDGE + "HTML"]],
            [
              /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
              // Blink
            ],
            [VERSION2, [NAME, "Blink"]],
            [
              /(presto)\/([\w\.]+)/i,
              // Presto
              /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
              // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
              /ekioh(flow)\/([\w\.]+)/i,
              // Flow
              /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
              // KHTML/Tasman/Links
              /(icab)[\/ ]([23]\.[\d\.]+)/i
              // iCab
            ],
            [NAME, VERSION2],
            [
              /rv\:([\w\.]{1,9})\b.+(gecko)/i
              // Gecko
            ],
            [VERSION2, NAME]
          ],
          os: [
            [
              // Windows
              /microsoft (windows) (vista|xp)/i
              // Windows (iTunes)
            ],
            [NAME, VERSION2],
            [
              /(windows) nt 6\.2; (arm)/i,
              // Windows RT
              /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
              // Windows Phone
              /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
            ],
            [NAME, [VERSION2, strMapper, windowsVersionMap]],
            [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
            [
              [NAME, "Windows"],
              [VERSION2, strMapper, windowsVersionMap]
            ],
            [
              // iOS/macOS
              /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
              // iOS
              /cfnetwork\/.+darwin/i
            ],
            [
              [VERSION2, /_/g, "."],
              [NAME, "iOS"]
            ],
            [
              /(mac os x) ?([\w\. ]*)/i,
              /(macintosh|mac_powerpc\b)(?!.+haiku)/i
              // Mac OS
            ],
            [
              [NAME, "Mac OS"],
              [VERSION2, /_/g, "."]
            ],
            [
              // Mobile OSes
              /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
              // Android-x86/HarmonyOS
            ],
            [VERSION2, NAME],
            [
              // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
              /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
              /(blackberry)\w*\/([\w\.]*)/i,
              // Blackberry
              /(tizen|kaios)[\/ ]([\w\.]+)/i,
              // Tizen/KaiOS
              /\((series40);/i
              // Series 40
            ],
            [NAME, VERSION2],
            [
              /\(bb(10);/i
              // BlackBerry 10
            ],
            [VERSION2, [NAME, BLACKBERRY]],
            [
              /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
              // Symbian
            ],
            [VERSION2, [NAME, "Symbian"]],
            [
              /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
              // Firefox OS
            ],
            [VERSION2, [NAME, FIREFOX + " OS"]],
            [
              /web0s;.+rt(tv)/i,
              /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
              // WebOS
            ],
            [VERSION2, [NAME, "webOS"]],
            [
              // Google Chromecast
              /crkey\/([\d\.]+)/i
              // Google Chromecast
            ],
            [VERSION2, [NAME, CHROME + "cast"]],
            [
              /(cros) [\w]+ ([\w\.]+\w)/i
              // Chromium OS
            ],
            [[NAME, "Chromium OS"], VERSION2],
            [
              // Console
              /(nintendo|playstation) ([wids345portablevuch]+)/i,
              // Nintendo/Playstation
              /(xbox); +xbox ([^\);]+)/i,
              // Microsoft Xbox (360, One, X, S, Series X, Series S)
              // Other
              /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
              // Joli/Palm
              /(mint)[\/\(\) ]?(\w*)/i,
              // Mint
              /(mageia|vectorlinux)[; ]/i,
              // Mageia/VectorLinux
              /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
              // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
              /(hurd|linux) ?([\w\.]*)/i,
              // Hurd/Linux
              /(gnu) ?([\w\.]*)/i,
              // GNU
              /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
              // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
              /(haiku) (\w+)/i
              // Haiku
            ],
            [NAME, VERSION2],
            [
              /(sunos) ?([\w\.\d]*)/i
              // Solaris
            ],
            [[NAME, "Solaris"], VERSION2],
            [
              /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
              // Solaris
              /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
              // AIX
              /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,
              // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX
              /(unix) ?([\w\.]*)/i
              // UNIX
            ],
            [NAME, VERSION2]
          ]
        };
        var UAParser2 = function(ua, extensions) {
          if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined2;
          }
          if (!(this instanceof UAParser2)) {
            return new UAParser2(ua, extensions).getResult();
          }
          var _ua = ua || (typeof window2 !== UNDEF_TYPE && window2.navigator && window2.navigator.userAgent ? window2.navigator.userAgent : EMPTY);
          var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
          this.getBrowser = function() {
            var _browser = {};
            _browser[NAME] = undefined2;
            _browser[VERSION2] = undefined2;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser.major = majorize(_browser.version);
            return _browser;
          };
          this.getCPU = function() {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined2;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
          };
          this.getDevice = function() {
            var _device = {};
            _device[VENDOR] = undefined2;
            _device[MODEL] = undefined2;
            _device[TYPE] = undefined2;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            return _device;
          };
          this.getEngine = function() {
            var _engine = {};
            _engine[NAME] = undefined2;
            _engine[VERSION2] = undefined2;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
          };
          this.getOS = function() {
            var _os = {};
            _os[NAME] = undefined2;
            _os[VERSION2] = undefined2;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            return _os;
          };
          this.getResult = function() {
            return {
              ua: this.getUA(),
              browser: this.getBrowser(),
              engine: this.getEngine(),
              os: this.getOS(),
              device: this.getDevice(),
              cpu: this.getCPU()
            };
          };
          this.getUA = function() {
            return _ua;
          };
          this.setUA = function(ua2) {
            _ua = typeof ua2 === STR_TYPE && ua2.length > UA_MAX_LENGTH ? trim(ua2, UA_MAX_LENGTH) : ua2;
            return this;
          };
          this.setUA(_ua);
          return this;
        };
        UAParser2.VERSION = LIBVERSION;
        UAParser2.BROWSER = enumerize([NAME, VERSION2, MAJOR]);
        UAParser2.CPU = enumerize([ARCHITECTURE]);
        UAParser2.DEVICE = enumerize([
          MODEL,
          VENDOR,
          TYPE,
          CONSOLE,
          MOBILE,
          SMARTTV,
          TABLET,
          WEARABLE,
          EMBEDDED
        ]);
        UAParser2.ENGINE = UAParser2.OS = enumerize([NAME, VERSION2]);
        if (typeof exports !== UNDEF_TYPE) {
          if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser2;
          }
          exports.UAParser = UAParser2;
        } else {
          if (typeof define === FUNC_TYPE && define.amd) {
            define(function() {
              return UAParser2;
            });
          } else if (typeof window2 !== UNDEF_TYPE) {
            window2.UAParser = UAParser2;
          }
        }
        var $2 = typeof window2 !== UNDEF_TYPE && (window2.jQuery || window2.Zepto);
        if ($2 && !$2.ua) {
          var parser = new UAParser2();
          $2.ua = parser.getResult();
          $2.ua.get = function() {
            return parser.getUA();
          };
          $2.ua.set = function(ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
              $2.ua[prop] = result[prop];
            }
          };
        }
      })(typeof window === "object" ? window : exports);
    }
  });

  // src/index.js
  init_live_reload();

  // src/anchor-tags.js
  init_live_reload();
  function installAndScrollAnchorTags() {
    document.querySelectorAll("h1,h2,h3").forEach((el) => {
      const id = el.innerText.toLowerCase().split(" ").map((a) => a.replace(/\W/g, "")).join("-");
      el.style.position = "relative";
      const anchorEl = document.createElement("div");
      anchorEl.style.position = "absolute";
      anchorEl.style.top = "-90px";
      anchorEl.style.left = "0";
      anchorEl.id = id;
      el.appendChild(anchorEl);
      requestAnimationFrame(() => {
        if (window.location.hash) {
          const hashEl = document.getElementById(window.location.hash.replace("#", ""));
          window.scrollTo({
            top: hashEl.getBoundingClientRect().top + window.scrollY
          });
        }
      }, 1);
    });
  }

  // src/animations.js
  init_live_reload();
  function animateLines() {
    $("[data-line-dividers]").each(function() {
      let wrap = $(this);
      let lines = wrap.find(".line-divider");
      lines.each(function(index) {
        let scaleStart = $(this).attr("data-start-scale") || 0;
        let scaleEnd = $(this).attr("data-end-scale") || 0.2;
        gsap.set($(this), {
          scaleY: scaleStart,
          transformOrigin: "bottom"
        });
        gsap.to($(this), {
          scaleY: scaleEnd,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    });
  }
  animateLines();
  function initAnims() {
    animateLines();
  }

  // src/forms/form.js
  init_live_reload();
  function setupHookForFormSubmission() {
    const forms = document.querySelectorAll("form");
    if (!forms.length)
      return;
    forms.forEach((form) => {
      const honeypot = form.querySelector("#form-description");
      const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
      const firstNameInput = form.querySelector(
        'input[name*="First-Name"], input[name*="First-name"]'
      );
      const lastNameInput = form.querySelector('input[name*="Last-Name"], input[name*="Last-name"]');
      const emailInput = form.querySelector("input[data-domain-check]");
      if (honeypot) {
        honeypot.oninput = function() {
          if (honeypot.value.length > 0) {
            submitButton.disabled = true;
          }
        };
      }
      const fieldErrors = /* @__PURE__ */ new Map();
      function showFieldError(field, message) {
        let errorElement = fieldErrors.get(field);
        if (!errorElement) {
          errorElement = document.createElement("div");
          errorElement.className = "field-validation-error";
          errorElement.style.cssText = "color: #e74c3c; font-size: 14px; margin-top: 5px;";
          field.parentNode.insertBefore(errorElement, field.nextSibling);
          fieldErrors.set(field, errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = "block";
      }
      function hideFieldError(field) {
        const errorElement = fieldErrors.get(field);
        if (errorElement) {
          errorElement.style.display = "none";
        }
      }
      function setFieldInputError(field, hasError) {
        if (hasError) {
          field.style.outlineColor = "#e74c3c";
          field.style.outlineWidth = "2px";
        } else {
          field.style.outlineColor = "";
          field.style.outlineWidth = "";
        }
      }
      function setSubmitButtonState(disabled) {
        if (submitButton) {
          submitButton.disabled = disabled;
          submitButton.style.opacity = disabled ? "0.5" : "1";
          submitButton.style.cursor = disabled ? "not-allowed" : "pointer";
        }
      }
      if (firstNameInput) {
        firstNameInput.addEventListener("input", (ev) => {
          const name = ev.target.value.trim();
          if (isLikelyInvalidName(name)) {
            showFieldError(
              firstNameInput,
              "Please enter a valid name. Names should contain standard letters and spacing."
            );
            setFieldInputError(firstNameInput, true);
            setSubmitButtonState(true);
          } else {
            hideFieldError(firstNameInput);
            setFieldInputError(firstNameInput, false);
            setSubmitButtonState(false);
          }
        });
      }
      if (lastNameInput) {
        lastNameInput.addEventListener("input", (ev) => {
          const name = ev.target.value.trim();
          if (isLikelyInvalidName(name)) {
            showFieldError(
              lastNameInput,
              "Please enter a valid name. Names should contain standard letters and spacing."
            );
            setFieldInputError(lastNameInput, true);
            setSubmitButtonState(true);
          } else {
            hideFieldError(lastNameInput);
            setFieldInputError(lastNameInput, false);
            setSubmitButtonState(false);
          }
        });
      }
      if (!emailInput) {
        return;
      }
      function validateEmailDomain(emailDomain) {
        const blockedDomains = [
          "comcast.net",
          "gmail.com",
          "live.com",
          "yahoo.com",
          "hotmail.com",
          "mail.ru",
          "web.de",
          "gmx.net",
          "live.net",
          "mail.com",
          "aol.com",
          "msn.com",
          "outlook.com",
          "proton.me",
          "protonmail.com",
          "icloud.com",
          "me.com",
          "zoho.com",
          "yandex.com",
          "inbox.com"
        ];
        return blockedDomains.includes(emailDomain.toLowerCase());
      }
      emailInput.addEventListener("input", (ev) => {
        const email = ev.target.value.trim();
        const emailDomain = email.toLowerCase().split("@")[1];
        if (email && email.includes("@")) {
          const isBlocked = validateEmailDomain(emailDomain);
          if (isBlocked) {
            showFieldError(
              emailInput,
              `Please use a business email address. ${emailDomain} is not allowed.`
            );
            setFieldInputError(emailInput, true);
            setSubmitButtonState(true);
          } else {
            hideFieldError(emailInput);
            setFieldInputError(emailInput, false);
            setSubmitButtonState(false);
          }
        } else {
          hideFieldError(emailInput);
          setFieldInputError(emailInput, false);
          setSubmitButtonState(false);
        }
      });
    });
  }
  function isLikelyInvalidName(name) {
    let score = 0;
    if (/(.)\1{2,}/.test(name))
      score += 3;
    const vowels = name.match(/[aeiou]/gi) || [];
    const vowelRatio = vowels.length / name.replace(/\s/g, "").length;
    if (vowelRatio < 0.15 || vowelRatio > 0.7)
      score += 2;
    if (/asdf|qwer|zxcv|hjkl/i.test(name))
      score += 3;
    if (/[^aeiou\s]{6,}/i.test(name))
      score += 2;
    if (/[^a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿāăąćčďđēėęěğģīįķĺļľłńņňőœŕřśşšţťũūůűųźżžșțə\s'-]/i.test(
      name
    ))
      score += 3;
    const capsScore = checkCapitalization(name);
    score += capsScore;
    return score >= 3;
  }
  function checkCapitalization(name) {
    const words = name.split(/[\s-]+/);
    let suspiciousPatterns = 0;
    for (const word of words) {
      if (word.length === 0)
        continue;
      if (/[A-Z]{3,}/.test(word)) {
        suspiciousPatterns += 2;
      }
      if (word.length > 2) {
        const isException = /^(ma?c|o'|d'|de|van|von|la|le|di|da)[A-Z]/i.test(
          word
        );
        if (isException) {
          return suspiciousPatterns;
        }
        const startsWithLowerCase = /^[a-z]/.test(word);
        let transitions = 0;
        for (let i = 1; i < word.length; i++) {
          const prevIsUpper = /[A-Z]/.test(word[i - 1]);
          const currIsUpper = /[A-Z]/.test(word[i]);
          if (prevIsUpper !== currIsUpper) {
            transitions++;
          }
        }
        if (startsWithLowerCase && transitions > 0) {
          suspiciousPatterns += 3;
        } else if (!startsWithLowerCase && transitions > 2) {
          suspiciousPatterns += 3;
        }
      }
    }
    if (suspiciousPatterns >= 2)
      return 3;
    if (suspiciousPatterns === 1)
      return 1;
    return 0;
  }

  // src/lottie.js
  init_live_reload();
  function initMojoAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("h1, h2, h3, h4, h5, h6").each(function() {
      if ($(this).is("[data-emoji-exclude]") || $(this).closest(".w-richtext").length) {
        return;
      }
      const $heading = $(this);
      let html = $heading.html();
      if (html.includes("Mojo")) {
        const newHtml = html.replace(
          /Mojo/g,
          '<span style="display: inline-flex;align-items: center;"><span>Mojo</span><span style="width: 1em; display: inline-block;height: 1em" data-lottie data-lottie-src="https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/694322d8b5849da406718d9a_MojoEmoji.json"></span></span>'
        );
        $heading.html(newHtml);
      }
    });
    $("[data-lottie]").each(function() {
      const target = this;
      let anim;
      ScrollTrigger.create({
        trigger: target,
        start: "top bottom+=50%",
        end: "bottom top-=25%",
        onEnter: handleEnter,
        onEnterBack: handleEnter,
        onLeave: handleLeave,
        onLeaveBack: handleLeave
      });
      function handleEnter() {
        if (!target.hasAttribute("data-lottie-fired")) {
          target.setAttribute("data-lottie-fired", "true");
          anim = lottie.loadAnimation({
            container: target,
            renderer: "svg",
            loop: true,
            autoplay: !reduceMotion,
            path: target.getAttribute("data-lottie-src")
          });
          anim.setSpeed(1.5);
          anim.addEventListener("DOMLoaded", () => {
            if (reduceMotion) {
              const frame = parseInt(target.getAttribute("data-lottie-frame") || "0", 10);
              anim.goToAndStop(frame, true);
            }
          });
        } else if (anim && !reduceMotion) {
          anim.play();
        }
      }
      function handleLeave() {
        if (anim && !reduceMotion) {
          anim.pause();
        }
      }
    });
  }

  // src/max.js
  init_live_reload();
  function initMaxReplacements() {
    $("h1, h2, h3, h4, h5, h6").each(function() {
      const $heading = $(this);
      if ($heading.attr("data-max-processed") || $heading.is("data-emoji-exclude") || $heading.closest(".w-richtext").length) {
        return;
      }
      let html = $heading.html();
      if (/\bMAX\b/.test(html)) {
        const maxSvg = '<svg width="100%" height="100%" viewBox="0 0 62 20" style="width: 2.2em; margin-left: 0.05em;" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0849 5.92771C17.9874 5.92771 17.9084 5.8487 17.9084 5.75123V0.206055H15.4824L10.9206 13.7531H10.3676L5.80588 0.206055H0V19.559H3.59412V6.15017H4.14706L8.70882 19.559H12.5794L17.1341 6.1711C17.1388 6.11056 17.1895 6.06283 17.2513 6.06283L17.5794 6.06284C17.6339 6.06284 17.6797 6.09989 17.6931 6.15017H17.6941V6.15434C17.696 6.16275 17.697 6.1715 17.697 6.18049V11.8734C17.697 11.8823 17.696 11.8911 17.6941 11.8995V19.559H21.2882V5.92771H18.0849Z" fill="currentColor"></path><path d="M42.4204 19.559L49.0557 9.60606L42.8351 0.206055H47.1204L51.2675 6.56488H51.8204L55.9675 0.206055H60.2528L54.0322 9.60606L60.6675 19.559H56.3822L51.8204 12.6472H51.2675L46.7057 19.559H42.4204Z" fill="currentColor"></path><path d="M22.4322 19.559L29.344 0.206055H34.5969L41.5087 19.559H37.4998L36.0345 15.4119H27.9063L26.441 19.559H22.4322ZM29.0675 12.0943H34.8734L32.2469 4.35311H31.694L29.0675 12.0943Z" fill="currentColor"></path></svg>';
        const newHtml = html.replace(
          /\bMAX\b/g,
          '<span style="display: inline-block;"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);">MAX</span>' + maxSvg + "</span>"
        );
        $heading.html(newHtml);
        $heading.attr("data-max-processed", "true");
      }
    });
  }
  $(document).ready(function() {
    initMaxReplacements();
  });

  // src/modal.js
  init_live_reload();
  function initModalBasic() {
    const modalGroup = document.querySelector("[data-modal-group-status]");
    const modals = document.querySelectorAll("[data-modal-name]");
    const modalTargets = document.querySelectorAll("[data-modal-target]");
    function initModalList($modal) {
      const $list = $modal.find("[data-modal-list]");
      if (!$list.length)
        return;
      $modal.off("wheel touchstart touchmove");
      $list.off("scroll");
      $(window).off("resize.modalCounter" + $modal.attr("data-modal-name"));
      const $items = $list.find("[data-modal-item]");
      const total = $items.length;
      $modal.find('[data-modal-counter="total"]').text(total);
      function updateCurrentCounter() {
        const listRect = $list[0].getBoundingClientRect();
        const threshold = listRect.bottom - listRect.height * 0.25;
        let currentIndex = 0;
        $items.each(function(index) {
          const itemRect = $(this)[0].getBoundingClientRect();
          if (itemRect.top <= threshold) {
            currentIndex = index;
          }
        });
        $modal.find('[data-modal-counter="current"]').text(currentIndex + 1);
      }
      updateCurrentCounter();
      $list.on("scroll", updateCurrentCounter);
      $(window).on("resize.modalCounter" + $modal.attr("data-modal-name"), updateCurrentCounter);
      $modal.on("wheel", function(e) {
        e.preventDefault();
        $list.scrollTop($list.scrollTop() + e.originalEvent.deltaY);
      });
      let touchStart = 0;
      $modal.on("touchstart", function(e) {
        touchStart = e.originalEvent.touches[0].clientY;
      });
      $modal.on("touchmove", function(e) {
        e.preventDefault();
        const touchCurrent = e.originalEvent.touches[0].clientY;
        const delta = touchStart - touchCurrent;
        $list.scrollTop($list.scrollTop() + delta);
        touchStart = touchCurrent;
      });
    }
    modalTargets.forEach((modalTarget) => {
      modalTarget.addEventListener("click", function() {
        const modalTargetName = this.getAttribute("data-modal-target");
        const index = $(this).parent().index();
        modalTargets.forEach((target) => target.setAttribute("data-modal-status", "not-active"));
        modals.forEach((modal) => {
          modal.setAttribute("data-modal-status", "not-active");
          $(modal).off("wheel touchstart touchmove");
          $(modal).find("[data-modal-list]").off("scroll");
        });
        document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute("data-modal-status", "active");
        const $activeModal = $(`[data-modal-name="${modalTargetName}"]`);
        $activeModal.attr("data-modal-status", "active");
        if (modalGroup) {
          modalGroup.setAttribute("data-modal-group-status", "active");
        }
        initModalList($activeModal);
        setTimeout(() => {
          const $list = $activeModal.find("[data-modal-list]");
          const $targetItem = $list.find("[data-modal-item]").eq(index);
          if ($targetItem.length) {
            const listRect = $list[0].getBoundingClientRect();
            const itemRect = $targetItem[0].getBoundingClientRect();
            const scrollOffset = itemRect.top - listRect.top + $list.scrollTop();
            $list.scrollTop(scrollOffset);
          }
        }, 0);
      });
    });
    document.querySelectorAll("[data-modal-close]").forEach((closeBtn) => {
      closeBtn.addEventListener("click", closeAllModals);
    });
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        closeAllModals();
      }
    });
    function closeAllModals() {
      modalTargets.forEach((target) => target.setAttribute("data-modal-status", "not-active"));
      modals.forEach((modal) => {
        modal.setAttribute("data-modal-status", "not-active");
        const modalName = modal.getAttribute("data-modal-name");
        $(modal).off("wheel touchstart touchmove");
        $(modal).find("[data-modal-list]").off("scroll");
        $(window).off("resize.modalCounter" + modalName);
      });
      if (modalGroup) {
        modalGroup.setAttribute("data-modal-group-status", "not-active");
      }
    }
  }

  // src/nav.js
  init_live_reload();
  var $snackBar = $(".snackbar");
  var $navWrapper = $(".nav-wrapper");
  var $nav = $(".nav");
  var $navWrap = $(".nav_menu-wrap");
  var $navMenu = $(".nav_menu");
  var $navItems = $navWrap.find(".nav_menu-item, .nav_part");
  var $navBrand = $(".nav_part").eq(0);
  var $navHam = $(".nav_menu-ham");
  var $navLinks = $(".nav_menu-link");
  var $menuInner = $(".nav_menu-inner");
  var $menuBg = $(".nav_menu-inner-bg");
  var $menuBack = $(".nav_menu-back");
  var $allTriggers = $("[data-dropdown-trigger]");
  var $allTargets = $("[data-dropdown-target]");
  var currentTrigger = null;
  var originalParent = null;
  function killAllTweens() {
    gsap.killTweensOf($menuInner);
    gsap.killTweensOf($menuBg);
    gsap.killTweensOf($menuInner);
    $allTargets.each(function() {
      gsap.killTweensOf($(this));
      gsap.killTweensOf($(this).find("li"));
    });
  }
  function resetAllStyles() {
    gsap.set($navWrap, { clearProps: "all" });
    gsap.set($navMenu, { clearProps: "all" });
    gsap.set($navItems, { clearProps: "all" });
    gsap.set($navBrand, { clearProps: "all" });
    gsap.set($menuInner, { clearProps: "all" });
    gsap.set($menuBg, { clearProps: "all" });
    gsap.set($menuBack, { clearProps: "all" });
    gsap.set($allTargets, { clearProps: "all" });
    $allTargets.each(function() {
      const $target = $(this);
      $target.removeClass("is-active");
      gsap.set($target.find("li"), { clearProps: "all" });
      const $triggerLi = $target.prev("li");
      if ($triggerLi.length) {
        const $siblings = $triggerLi.siblings("li");
        gsap.set($siblings, { clearProps: "all" });
      }
    });
    $navLinks.each(function() {
      const $li = $(this).closest("li");
      gsap.set($li, { clearProps: "all" });
    });
  }
  function hideAllTargets(callback) {
    $allTargets.each(function() {
      const $target = $(this);
      $target.removeClass("is-active");
      gsap.set($target, { autoAlpha: 0 });
      gsap.set($target.find("li"), { autoAlpha: 0, y: 0 });
    });
    if (callback)
      callback();
  }
  function resizeBackground($target) {
    $target.addClass("is-active");
    gsap.set($target, { autoAlpha: 1 });
    const targetWidth = $target.outerWidth();
    const targetHeight = $target.outerHeight();
    gsap.to($menuBg, {
      width: targetWidth,
      height: targetHeight,
      autoAlpha: 1,
      duration: 0.25,
      ease: "power2.out"
    });
  }
  function showTarget($target) {
    resizeBackground($target);
    gsap.fromTo(
      $target.find("li"),
      { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.out",
        delay: 0.05
      }
    );
  }
  function hideTarget($target, callback) {
    gsap.to($target.find("li"), {
      autoAlpha: 0,
      y: -10,
      duration: 0.15,
      stagger: 0.02,
      onComplete: () => {
        $target.removeClass("is-active");
        gsap.set($target, { autoAlpha: 0 });
        if (callback)
          callback();
      }
    });
  }
  function handleTriggerHover(targetName) {
    if (currentTrigger === targetName)
      return;
    killAllTweens();
    const $currentTarget = $(`[data-dropdown-target="${targetName}"]`);
    const $currentTriggerEl = $(`[data-dropdown-trigger="${targetName}"]`);
    const $prevTarget = $allTargets.filter(".is-active");
    currentTrigger = targetName;
    gsap.set($currentTarget, { autoAlpha: 1 });
    const parentRect = $menuInner.parent()[0].getBoundingClientRect();
    const triggerRect = $currentTriggerEl[0].getBoundingClientRect();
    const menuWidth = $menuInner.outerWidth();
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const parentCenter = parentRect.left + parentRect.width / 2;
    let offsetFromCenter = triggerCenter - parentCenter;
    const finalLeft = parentRect.left + offsetFromCenter;
    const finalRight = finalLeft + menuWidth;
    const windowWidth = $(window).width();
    const edgePadding = 20;
    if (finalLeft < edgePadding) {
      offsetFromCenter += edgePadding - finalLeft;
    } else if (finalRight > windowWidth - edgePadding) {
      offsetFromCenter -= finalRight - (windowWidth - edgePadding);
    }
    gsap.to([$menuInner, $menuBg], {
      x: offsetFromCenter,
      duration: 0.3,
      ease: "power2.out"
    });
    if ($prevTarget.length) {
      hideAllTargets(() => showTarget($currentTarget));
    } else {
      gsap.to($menuInner, {
        autoAlpha: 1,
        duration: 0.2
      });
      showTarget($currentTarget);
    }
  }
  function handleNavLeave() {
    killAllTweens();
    const $activeTarget = $allTargets.filter(".is-active");
    currentTrigger = null;
    if ($activeTarget.length) {
      hideTarget($activeTarget);
      gsap.to($menuBg, {
        autoAlpha: 0,
        duration: 0.2,
        delay: 0.1
      });
      gsap.to($menuInner, {
        autoAlpha: 0,
        duration: 0.2,
        delay: 0.2
      });
    }
  }
  function resetToDefault() {
    killAllTweens();
    gsap.set($menuBack, { autoAlpha: 0 });
    gsap.set($navBrand, { autoAlpha: 1 });
    gsap.set($allTargets, { display: "none", autoAlpha: 0, clearProps: "height" });
    $allTargets.removeClass("is-active");
    const $siblings = $navMenu.find("li").not("[data-dropdown-target]");
    gsap.set($siblings, { display: "block", autoAlpha: 1 });
    gsap.set($navMenu, { autoAlpha: 1 });
  }
  function showTargetMobile($target, $triggerLi) {
    const $siblings = $triggerLi.siblings("li");
    gsap.set($navBrand, { autoAlpha: 0 });
    gsap.set($menuBack, { autoAlpha: 1 });
    gsap.to($navMenu, { autoAlpha: 0, duration: 0.15 });
    gsap.to([$siblings, $allTargets], {
      autoAlpha: 0,
      duration: 0.15,
      onComplete: () => {
        gsap.set($siblings, { display: "none" });
        gsap.set($allTargets, { display: "none" });
        $allTargets.removeClass("is-active");
        $target.addClass("is-active");
        gsap.set($target, { display: "block", height: "auto" });
        const targetHeight = $target.outerHeight();
        gsap.set($target, { height: 0 });
        gsap.to($navMenu, { autoAlpha: 1, duration: 0.1 });
        gsap.to($target, {
          height: targetHeight,
          autoAlpha: 1,
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => gsap.set($target, { height: "auto" })
        });
        gsap.fromTo(
          $target.find("li"),
          { autoAlpha: 0, x: -10 },
          { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.03, ease: "power2.out", delay: 0.1 }
        );
      }
    });
  }
  function hideTargetMobile() {
    const $activeTarget = $allTargets.filter(".is-active");
    if (!$activeTarget.length)
      return;
    gsap.to($activeTarget.find("li"), {
      autoAlpha: 0,
      x: 10,
      duration: 0.15,
      stagger: 0.02
    });
    gsap.to($activeTarget, {
      height: 0,
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => resetToDefault()
    });
  }
  function handleTriggerClick(e, targetName) {
    e.preventDefault();
    killAllTweens();
    const $currentTarget = $(`[data-dropdown-target="${targetName}"]`);
    const $triggerLi = $(e.currentTarget).closest("li");
    if ($currentTarget.hasClass("is-active")) {
      hideTargetMobile();
    } else {
      showTargetMobile($currentTarget, $triggerLi);
    }
  }
  function setupDesktop() {
    killAllTweens();
    resetAllStyles();
    if (originalParent && originalParent.length) {
      $allTargets.each(function() {
        $(this).appendTo(originalParent);
      });
    }
    gsap.set($menuInner, { autoAlpha: 0 });
    gsap.set($menuBg, { autoAlpha: 0 });
    gsap.set($allTargets, { autoAlpha: 0 });
    gsap.set($menuBack, { autoAlpha: 0 });
    $navLinks.off("click mouseenter").on("mouseenter", function() {
      const targetName = $(this).attr("data-dropdown-trigger");
      if (targetName)
        handleTriggerHover(targetName);
      else {
        handleNavLeave();
      }
    });
    $nav.off("mouseleave").on("mouseleave", () => handleNavLeave());
    $menuBack.off("click");
  }
  function setupMobile() {
    killAllTweens();
    resetAllStyles();
    gsap.set($allTargets, { display: "none", autoAlpha: 0 });
    gsap.set($menuBack, { autoAlpha: 0 });
    $navLinks.off("mouseenter");
    $navLinks.off("mouseleave");
    $nav.off("mouseleave");
    if (!originalParent) {
      originalParent = $allTargets.first().parent();
    }
    $navLinks.each(function() {
      const triggerName = $(this).attr("data-dropdown-trigger");
      if (triggerName) {
        const $triggerLi = $(this).closest("li");
        const $targetToMove = $(`[data-dropdown-target="${triggerName}"]`);
        if ($targetToMove.length && $triggerLi.length) {
          $targetToMove.insertAfter($triggerLi);
        }
      }
    });
    $navLinks.on("click", function(e) {
      const targetName = $(this).attr("data-dropdown-trigger");
      if (targetName)
        handleTriggerClick(e, targetName);
    });
    $menuBack.on("click", hideTargetMobile);
  }
  function animateNav() {
    if ($(window).width() < 992) {
      gsap.set($navWrap, { autoAlpha: 0, display: "none" });
      gsap.set($navItems, { autoAlpha: 0, y: "1em" });
    } else {
      resetAllStyles();
    }
    function revealNav() {
      let tl = gsap.timeline();
      $snackBar.hide();
      tl.to($navWrap, { autoAlpha: 1, display: "flex" });
      tl.to($navMenu, { autoAlpha: 1 });
      tl.to(
        $navItems,
        {
          autoAlpha: 1,
          y: "0em",
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.inOut"
        },
        "<"
      );
    }
    function hideNav() {
      resetToDefault();
      $snackBar.css("display", "flex");
      let tl = gsap.timeline();
      tl.to($navMenu, { autoAlpha: 0 });
      tl.to(
        $navItems,
        {
          autoAlpha: 0,
          y: "1em",
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.inOut"
        },
        "<"
      );
      tl.to($navWrap, { autoAlpha: 0, display: "flex" });
    }
    $navHam.on("click", function() {
      if (!$(this).hasClass("is-active")) {
        revealNav();
        $(this).addClass("is-active");
      } else {
        hideNav();
        $(this).removeClass("is-active");
      }
    });
  }
  function initNavScrollBorder() {
    var classAdd = "fixed";
    if ($nav.hasClass(classAdd))
      return;
    $(window).on("scroll load", function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 80) {
        if (!$nav.hasClass(classAdd)) {
          $nav.addClass(classAdd);
        }
      } else {
        $nav.removeClass(classAdd);
      }
    });
  }
  function initNavScroll() {
    const shouldRun = $(window).width() > 992 && $(".subnav").length > 0;
    if (!shouldRun)
      return;
    let lastScroll = 0;
    const navHeight = $nav.outerHeight();
    $(window).on("scroll", function() {
      const currentScroll = $(this).scrollTop();
      if (currentScroll > lastScroll && currentScroll > navHeight) {
        gsap.to($navWrapper, {
          y: -navHeight,
          duration: 0.6,
          ease: "power2.out"
        });
      } else if (currentScroll < lastScroll) {
        gsap.to($navWrapper, {
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            $navWrapper.attr("style", "");
          }
        });
      }
      lastScroll = currentScroll;
    });
  }
  function initSnackbar() {
    function truncateSnackbar() {
      $("[data-snackbar-text]").each(function() {
        const $el = $(this);
        const fullText = $el.data("original-text") || $el.text().trim();
        if (!$el.data("original-text")) {
          $el.data("original-text", fullText);
        }
        const dashIndex = fullText.lastIndexOf("-");
        if (dashIndex === -1)
          return;
        let beforeDash = fullText.substring(0, dashIndex);
        const afterDash = fullText.substring(dashIndex);
        const lineHeight = parseFloat($el.css("line-height"));
        const maxHeight = lineHeight * 2.1;
        $el.css("overflow", "hidden");
        $el.html(beforeDash + afterDash);
        if ($el.prop("scrollHeight") <= maxHeight)
          return;
        const words = beforeDash.split(" ");
        while ($el.prop("scrollHeight") > maxHeight && words.length > 0) {
          words.pop();
          beforeDash = words.join(" ");
          $el.html(beforeDash + "... " + afterDash);
        }
        $el.css("max-height", maxHeight + "px");
      });
    }
    truncateSnackbar();
    let resizeTimer;
    $(window).on("resize", function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(truncateSnackbar, 150);
    });
  }
  function initNav() {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 992px)", setupDesktop);
    mm.add("(max-width: 991px)", setupMobile);
    animateNav();
    initNavScrollBorder();
    initNavScroll();
    initSnackbar();
  }

  // src/scroll.js
  init_live_reload();
  function initScrollToggle() {
    var $body = $(document.body);
    var scrollPosition = 0;
    var isScrollDisabled = false;
    var currentBreakpoint = "";
    function toggleScroll() {
      if (isScrollDisabled) {
        enableScroll();
      } else {
        disableScroll();
      }
    }
    function disableScroll() {
      var oldWidth = $body.innerWidth();
      scrollPosition = window.pageYOffset;
      $body.css({
        overflow: "hidden",
        position: "fixed",
        top: `-${scrollPosition}px`,
        width: oldWidth
      });
      isScrollDisabled = true;
    }
    function enableScroll() {
      $body.css({
        overflow: "",
        position: "",
        top: "",
        width: ""
      });
      $(window).scrollTop(scrollPosition);
      isScrollDisabled = false;
    }
    $('[data-scroll="toggle"]').on("click", toggleScroll);
    const breakpoints = [991, 767, 479];
    let lastWidth = window.innerWidth;
    function handleBreakpoint(breakpoint) {
      if (isScrollDisabled) {
        enableScroll();
      }
    }
    function checkBreakpoints() {
      const currentWidth = window.innerWidth;
      breakpoints.forEach((breakpoint) => {
        if (lastWidth <= breakpoint && currentWidth > breakpoint || lastWidth >= breakpoint && currentWidth < breakpoint) {
          handleBreakpoint(breakpoint);
        }
      });
      lastWidth = currentWidth;
    }
    window.addEventListener("resize", checkBreakpoints);
  }

  // src/scroll-themes.js
  init_live_reload();
  function initCheckSectionThemeScroll() {
    const navBarHeight = document.querySelector("[data-nav-bar-height]");
    const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;
    function initializeAttributes() {
      const body = document.body;
      if (!body.hasAttribute("data-theme-nav")) {
        body.setAttribute("data-theme-nav", "light");
      }
      const sections = document.querySelectorAll("section");
      sections.forEach(function(section) {
        if (!section.hasAttribute("data-theme-section")) {
          section.setAttribute("data-theme-section", "light");
        }
      });
    }
    function checkThemeSection() {
      const themeSections = document.querySelectorAll("[data-theme-section]");
      themeSections.forEach(function(themeSection) {
        const rect = themeSection.getBoundingClientRect();
        const themeSectionTop = rect.top;
        const themeSectionBottom = rect.bottom;
        if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
          const themeSectionActive = themeSection.getAttribute("data-theme-section");
          document.querySelectorAll("[data-theme-nav]").forEach(function(elem) {
            if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
              elem.setAttribute("data-theme-nav", themeSectionActive);
            }
          });
        }
      });
    }
    function startThemeCheck() {
      document.addEventListener("scroll", checkThemeSection);
    }
    initializeAttributes();
    checkThemeSection();
    startThemeCheck();
  }

  // src/swipers.js
  init_live_reload();
  function initTestimonials() {
    $(".section_testimonials").each(function(index) {
      var currentSection = $(this);
      var slider = currentSection.find(".testimonials_slider");
      var items = currentSection.find(".testimonials_menu-item");
      var nextArrow = currentSection.find(".swiper-arrow.is-next");
      var prevArrow = currentSection.find(".swiper-arrow.is-prev");
      var csQuote = new Swiper(slider[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: nextArrow[0],
          prevEl: prevArrow[0]
        },
        on: {
          init: function() {
            updateActiveNav(this);
          },
          slideChange: function() {
            updateActiveNav(this);
          }
        }
      });
      function updateActiveNav(swiper) {
        items.removeClass("is-active").eq(swiper.realIndex).addClass("is-active");
      }
      function slideToItem() {
        items.on("click", function() {
          csQuote.slideTo($(this).index());
        });
      }
      slideToItem();
    });
  }
  function initTestimonialCards() {
    $(".testimonial-cards_wrap").each(function(index) {
      var currentSection = $(this);
      var slider = currentSection.find(".testimonial-cards_slider");
      var nextArrow = currentSection.find(".swiper-arrow.is-next");
      var prevArrow = currentSection.find(".swiper-arrow.is-prev");
      var csQuote = new Swiper(slider[0], {
        slidesPerView: 1,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: nextArrow[0],
          prevEl: prevArrow[0]
        }
      });
    });
  }
  function initLatestBlog() {
    $(".section_latest-blog").each(function(index) {
      var currentSection = $(this);
      var slider = currentSection.find(".latest-blog_slider");
      var nextArrow = currentSection.find(".swiper-arrow.is-next");
      var prevArrow = currentSection.find(".swiper-arrow.is-prev");
      var csQuote = new Swiper(slider[0], {
        slidesPerView: "auto",
        spaceBetween: 20,
        navigation: {
          nextEl: nextArrow[0],
          prevEl: prevArrow[0]
        }
      });
    });
  }
  function initDeploy() {
    $(".section_deploy-slider").each(function(index) {
      var currentSection = $(this);
      var slider = currentSection.find(".deploy-slider");
      var nextArrow = currentSection.find(".swiper-arrow.is-next");
      var prevArrow = currentSection.find(".swiper-arrow.is-prev");
      var csQuote = new Swiper(slider[0], {
        slidesPerView: "auto",
        spaceBetween: 20,
        navigation: {
          nextEl: nextArrow[0],
          prevEl: prevArrow[0]
        },
        pagination: {
          el: ".swiper-navigation",
          type: "bullets",
          bulletActiveClass: "is-active",
          bulletClass: "swiper-dot",
          clickable: true
        }
      });
    });
  }
  function initCareerGallery() {
    let slider = $(".about-company_slider");
    if (slider.length == 0)
      return;
    function initBasicCustomCursor() {
      gsap.set(".cursor-box_wrap", { xPercent: -50, yPercent: -50 });
      let xTo = gsap.quickTo(".cursor-box_wrap", "x", { duration: 0.6, ease: "power3" });
      let yTo = gsap.quickTo(".cursor-box_wrap", "y", { duration: 0.6, ease: "power3" });
      window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      });
    }
    const swiperTestimonial = new Swiper(".about-company_slider", {
      slidesPerView: 1,
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      navigation: {
        nextEl: ".swiper-arrow.is-next",
        prevEl: ".swiper-arrow.is-prev"
      }
    });
    gsap.set(".cursor-box_wrap", { display: "hidden" });
    gsap.set(".cursor-box", { scale: 0 });
    $(".about-company_desktop-box").on("mouseenter", function() {
      if ($(window).width() < 992)
        return;
      gsap.to(".cursor-box_wrap", { display: "flex" });
      gsap.to(".cursor-box", { scale: 1, duration: 0.3, ease: "back.out" });
      let next = $('[cursor-arrow="next"]');
      let prev = $('[cursor-arrow="prev"]');
      if ($(this).hasClass("is-right")) {
        next.show();
        prev.hide();
      } else if ($(this).hasClass("is-left")) {
        prev.show();
        next.hide();
      }
    });
    $(".about-company_desktop-box").on("mouseleave", function() {
      if ($(window).width() < 992)
        return;
      gsap.to(".cursor-box_wrap", { display: "none" });
      gsap.to(".cursor-box", { scale: 0, duration: 0.3, ease: "back.out" });
    });
    initBasicCustomCursor();
  }
  function initSwipers() {
    initTestimonials();
    initLatestBlog();
    initDeploy();
    initTestimonialCards();
    initCareerGallery();
  }

  // src/tabs.js
  init_live_reload();
  var wrapLetters = (element) => {
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.parentNode.classList.contains("letter")) {
          const codeText = node.textContent;
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < codeText.length; i++) {
            const span = document.createElement("span");
            span.className = "letter";
            span.textContent = codeText[i];
            fragment.appendChild(span);
          }
          node.parentNode.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName !== "BR") {
          const childNodes = Array.from(node.childNodes);
          childNodes.forEach(processNode);
        }
      }
    };
    $(element).contents().each(function() {
      processNode(this);
    });
  };
  var resetLetters = (elements) => {
    $(elements).each((elementIndex, element) => {
      const letters = $(element).find(".letter").not(".line-numbers-row .code-letter");
      const highlights = $(element).find(".word-highlight");
      gsap.set(letters, { visibility: "hidden" });
      if (highlights.length) {
        const firstHighlight = highlights[0];
        const currentBgColor = window.getComputedStyle(firstHighlight).getPropertyValue("background-color");
        const currentBoxShadow = window.getComputedStyle(firstHighlight).getPropertyValue("box-shadow");
        const hexToRGBA = (hex, alpha) => {
          const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        const rgbaToTransparent = (rgba) => {
          const rgbaArray = rgba.replace(/^rgba?\(/, "").replace(/\)$/, "").split(",");
          return `rgba(${rgbaArray[0]}, ${rgbaArray[1]}, ${rgbaArray[2]}, 0)`;
        };
        const isHex = (color) => /^#(?:[0-9a-f]{3}){1,2}$/i.test(color);
        const initialBackgroundColor = isHex(currentBgColor) ? hexToRGBA(currentBgColor, 0) : rgbaToTransparent(currentBgColor);
        const initialBoxShadow = currentBoxShadow.replace(/rgba?\([^)]+\)/g, (match) => {
          return isHex(match) ? hexToRGBA(match, 0) : rgbaToTransparent(match);
        });
        gsap.set(highlights, {
          backgroundColor: initialBackgroundColor,
          boxShadow: initialBoxShadow
        });
      }
    });
  };
  var revealLetters = (elements, baseDelay = 0.01) => {
    const timeline = gsap.timeline();
    let globalLetterIndex = 0;
    let totalLetters = 0;
    let cumulativeTime = 0;
    $(elements).each((elementIndex, element) => {
      const letters = $(element).find(".letter").not(".line-numbers-row .code-letter");
      totalLetters += letters.length;
    });
    $(elements).each((elementIndex, element) => {
      const letters = $(element).find(".letter").not(".line-numbers-row .code-letter");
      const highlights = $(element).find(".word-highlight");
      letters.each((letterIndex, letter) => {
        const progress = globalLetterIndex / totalLetters;
        const exponentialDelay = baseDelay * Math.pow(0.3, progress * 3);
        timeline.fromTo(letter, { visibility: "hidden" }, { visibility: "initial" }, cumulativeTime);
        cumulativeTime += exponentialDelay;
        globalLetterIndex++;
      });
      if (highlights.length) {
        const firstHighlight = highlights[0];
        const currentBgColor = window.getComputedStyle(firstHighlight).getPropertyValue("background-color");
        const currentBoxShadow = window.getComputedStyle(firstHighlight).getPropertyValue("box-shadow");
        timeline.to(
          highlights,
          {
            backgroundColor: currentBgColor,
            boxShadow: currentBoxShadow,
            duration: 0.35
          },
          "<"
        );
      }
    });
    return timeline;
  };
  var animateCode = ($codeBlock) => {
    const codeElement = $codeBlock.find("code");
    const lineNumbers = codeElement.find(".line-numbers-rows").eq(0).clone();
    codeElement.find(".line-numbers-rows").remove();
    if (!codeElement.find(".letter").length) {
      wrapLetters(codeElement);
    }
    resetLetters(codeElement);
    codeElement.css("visibility", "visible");
    codeElement.prepend(lineNumbers);
    return revealLetters(codeElement);
  };
  function initTabs() {
    $('[data-tabs="wrap"]').each(function() {
      const $wrap = $(this);
      const $menu = $wrap.find('[data-tabs="menu"]');
      const $menuItems = $menu.find('[data-tabs="menu-item"]');
      const $contents = $wrap.find('[data-tabs="content"]');
      const $codes = $wrap.find('[data-tabs="code"]');
      let wrapTimeline = null;
      $menuItems.on("click", function() {
        if (wrapTimeline) {
          wrapTimeline.kill();
          wrapTimeline = null;
        }
        $menuItems.removeClass("is-active");
        $(this).addClass("is-active");
        const index = $(this).closest("li").index();
        const currentHeight = $wrap.height();
        $contents.each(function() {
          $(this).hide();
        });
        $codes.hide();
        const $targetContent = $contents.eq(index);
        const $targetCode = $codes.eq(index);
        $targetContent.css("display", "flex");
        $targetCode.css("display", "flex");
        const newHeight = $wrap.height();
        const computedHeight = window.getComputedStyle($wrap[0]).height;
        const inlineHeight = $wrap[0].style.height;
        if (!inlineHeight) {
          $wrap.css("height", currentHeight);
          gsap.to($wrap, {
            height: newHeight,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              $wrap.attr("style", "");
            }
          });
        } else {
          $wrap.css("height", "auto");
        }
        if ($targetContent.is("ul, ol, li")) {
          const $items = $targetContent.find("li").add('[data-tabs="content-item"]');
          gsap.fromTo(
            $items,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.2 }
          );
        }
        wrapTimeline = animateCode($targetCode);
      });
    });
  }

  // src/tracking/amplitude.js
  init_live_reload();

  // src/forms/sniffEmail.js
  init_live_reload();
  function SniffEmailForAmplitude() {
    const interval = setInterval(() => {
      const inputs = document.querySelectorAll("input[type=email]");
      if (inputs.length) {
        sniffEmail(inputs);
        clearInterval(interval);
      }
    }, 1e3);
  }
  var lastFire = "";
  function sniffEmail(inputs) {
    for (let input of inputs) {
      if (input.classList.contains("emailCheck")) {
        continue;
      }
      let formParent = input.parentElement;
      while (formParent && formParent.nodeName !== "FORM" && formParent.nodeName !== "BODY") {
        formParent = formParent.parentElement;
      }
      const { formId } = formParent.dataset;
      const debouncedAmpCall = debounce((input2, formId2) => {
        if (!isValid(input2)) {
          return;
        }
        lastFire = input2.value;
        amplitude.track("emailInput", { email: input2.value, formId: formId2 });
      }, 3e3);
      input.addEventListener("input", (ev) => {
        if (ev.target.value === lastFire) {
          return;
        }
        if (isValid(ev.target)) {
          debouncedAmpCall(ev.target, formId);
        }
      });
      input.classList.add("emailCheck");
    }
  }
  function isValid(el) {
    return el.checkValidity() && !el.classList.contains("error") && el.value !== "";
  }
  var debounce = (callback, wait2) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait2);
    };
  };

  // src/tracking/amplitude.js
  function initAmplitude() {
    SniffEmailForAmplitude();
    function amplitudeTrack(anchorTag, trackTitle) {
      return () => {
        amplitude.track(trackTitle, {
          href: window.location.href,
          location: anchorTag.dataset.analyticsLocation
        });
      };
    }
    setTimeout(() => {
      [...document.querySelectorAll("a")].filter((a) => a.href === "https://docs.modular.com/").forEach((a) => {
        a.onclick = amplitudeTrack(a, "DownloadMaxClicked");
      });
    }, 100);
    setTimeout(() => {
      [...document.querySelectorAll("a")].filter((a) => a.href === "https://modular.com/enterprise#form").forEach((a) => {
        a.onclick = amplitudeTrack(a, "ContactSalesClicked");
      });
    }, 200);
    setTimeout(() => {
      [...document.querySelectorAll("[data-analytics-onclick]")].forEach((a) => {
        a.onclick = amplitudeTrack(a, a.dataset.analyticsOnclick);
      });
    }, 300);
    let timeStartedOnPage = /* @__PURE__ */ new Date();
    function trackTimeOnPage(pathname) {
      if (!timeStartedOnPage) {
        return;
      }
      const durationInSeconds = Math.round((/* @__PURE__ */ new Date()).getTime() - timeStartedOnPage.getTime()) / 1e3;
      amplitude.track("TimeOnPage", {
        duration: `${Math.round(durationInSeconds)}`,
        minutes: `${Math.round(durationInSeconds / 60)}`,
        pathname
      });
    }
    function scrollPercentage() {
      const { documentElement } = document, { body } = document;
      return Math.round(
        (documentElement.scrollTop || body.scrollTop) / ((documentElement.scrollHeight || body.scrollHeight) - documentElement.clientHeight) * 100
      );
    }
    let maxScroll = 0;
    setInterval(() => {
      const curScroll = scrollPercentage();
      if (curScroll > maxScroll) {
        maxScroll = curScroll;
      }
    }, 500);
    window.addEventListener("beforeunload", () => {
      const { pathname } = window.location;
      trackTimeOnPage(pathname);
      amplitude.track("MaxScrollPercentage", { maxScroll, pathname });
      return void 0;
    });
  }

  // src/tracking/experiment.js
  init_live_reload();

  // src/utils/wait.js
  init_live_reload();
  async function wait(ms = 15) {
    await new Promise(
      (resolve) => setTimeout(
        () => requestAnimationFrame(() => {
          resolve();
        }),
        ms
      )
    );
  }
  async function waitUntil(condition, maxChecks = 1e3) {
    let timesChecked = 0;
    while (!condition() && timesChecked < maxChecks) {
      timesChecked = timesChecked + 1;
      await wait();
    }
  }

  // node_modules/@amplitude/experiment-js-client/dist/experiment.esm.js
  init_live_reload();

  // node_modules/@amplitude/analytics-connector/dist/analytics-connector.esm.js
  init_live_reload();
  var ApplicationContextProviderImpl = (
    /** @class */
    function() {
      function ApplicationContextProviderImpl2() {
      }
      ApplicationContextProviderImpl2.prototype.getApplicationContext = function() {
        return {
          versionName: this.versionName,
          language: getLanguage(),
          platform: "Web",
          os: void 0,
          deviceModel: void 0
        };
      };
      return ApplicationContextProviderImpl2;
    }()
  );
  var getLanguage = function() {
    return typeof navigator !== "undefined" && (navigator.languages && navigator.languages[0] || navigator.language) || "";
  };
  var EventBridgeImpl = (
    /** @class */
    function() {
      function EventBridgeImpl2() {
        this.queue = [];
      }
      EventBridgeImpl2.prototype.logEvent = function(event) {
        if (!this.receiver) {
          if (this.queue.length < 512) {
            this.queue.push(event);
          }
        } else {
          this.receiver(event);
        }
      };
      EventBridgeImpl2.prototype.setEventReceiver = function(receiver) {
        this.receiver = receiver;
        if (this.queue.length > 0) {
          this.queue.forEach(function(event) {
            receiver(event);
          });
          this.queue = [];
        }
      };
      return EventBridgeImpl2;
    }()
  );
  var __assign = function() {
    __assign = Object.assign || function __assign4(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var isEqual = function(obj1, obj2) {
    var primitive = ["string", "number", "boolean", "undefined"];
    var typeA = typeof obj1;
    var typeB = typeof obj2;
    if (typeA !== typeB) {
      return false;
    }
    for (var _i = 0, primitive_1 = primitive; _i < primitive_1.length; _i++) {
      var p = primitive_1[_i];
      if (p === typeA) {
        return obj1 === obj2;
      }
    }
    if (obj1 == null && obj2 == null) {
      return true;
    } else if (obj1 == null || obj2 == null) {
      return false;
    }
    if (obj1.length !== obj2.length) {
      return false;
    }
    var isArrayA = Array.isArray(obj1);
    var isArrayB = Array.isArray(obj2);
    if (isArrayA !== isArrayB) {
      return false;
    }
    if (isArrayA && isArrayB) {
      for (var i = 0; i < obj1.length; i++) {
        if (!isEqual(obj1[i], obj2[i])) {
          return false;
        }
      }
    } else {
      var sorted1 = Object.keys(obj1).sort();
      var sorted2 = Object.keys(obj2).sort();
      if (!isEqual(sorted1, sorted2)) {
        return false;
      }
      var result_1 = true;
      Object.keys(obj1).forEach(function(key) {
        if (!isEqual(obj1[key], obj2[key])) {
          result_1 = false;
        }
      });
      return result_1;
    }
    return true;
  };
  var ID_OP_SET = "$set";
  var ID_OP_UNSET = "$unset";
  var ID_OP_CLEAR_ALL = "$clearAll";
  if (!Object.entries) {
    Object.entries = function(obj) {
      var ownProps = Object.keys(obj);
      var i = ownProps.length;
      var resArray = new Array(i);
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }
      return resArray;
    };
  }
  var IdentityStoreImpl = (
    /** @class */
    function() {
      function IdentityStoreImpl2() {
        this.identity = { userProperties: {} };
        this.listeners = /* @__PURE__ */ new Set();
      }
      IdentityStoreImpl2.prototype.editIdentity = function() {
        var self2 = this;
        var actingUserProperties = __assign({}, this.identity.userProperties);
        var actingIdentity = __assign(__assign({}, this.identity), { userProperties: actingUserProperties });
        return {
          setUserId: function(userId) {
            actingIdentity.userId = userId;
            return this;
          },
          setDeviceId: function(deviceId) {
            actingIdentity.deviceId = deviceId;
            return this;
          },
          setUserProperties: function(userProperties) {
            actingIdentity.userProperties = userProperties;
            return this;
          },
          setOptOut: function(optOut) {
            actingIdentity.optOut = optOut;
            return this;
          },
          updateUserProperties: function(actions) {
            var actingProperties = actingIdentity.userProperties || {};
            for (var _i = 0, _a = Object.entries(actions); _i < _a.length; _i++) {
              var _b = _a[_i], action = _b[0], properties = _b[1];
              switch (action) {
                case ID_OP_SET:
                  for (var _c = 0, _d = Object.entries(properties); _c < _d.length; _c++) {
                    var _e = _d[_c], key = _e[0], value = _e[1];
                    actingProperties[key] = value;
                  }
                  break;
                case ID_OP_UNSET:
                  for (var _f = 0, _g = Object.keys(properties); _f < _g.length; _f++) {
                    var key = _g[_f];
                    delete actingProperties[key];
                  }
                  break;
                case ID_OP_CLEAR_ALL:
                  actingProperties = {};
                  break;
              }
            }
            actingIdentity.userProperties = actingProperties;
            return this;
          },
          commit: function() {
            self2.setIdentity(actingIdentity);
            return this;
          }
        };
      };
      IdentityStoreImpl2.prototype.getIdentity = function() {
        return __assign({}, this.identity);
      };
      IdentityStoreImpl2.prototype.setIdentity = function(identity) {
        var originalIdentity = __assign({}, this.identity);
        this.identity = __assign({}, identity);
        if (!isEqual(originalIdentity, this.identity)) {
          this.listeners.forEach(function(listener) {
            listener(identity);
          });
        }
      };
      IdentityStoreImpl2.prototype.addIdentityListener = function(listener) {
        this.listeners.add(listener);
      };
      IdentityStoreImpl2.prototype.removeIdentityListener = function(listener) {
        this.listeners.delete(listener);
      };
      return IdentityStoreImpl2;
    }()
  );
  var safeGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : self;
  var AnalyticsConnector = (
    /** @class */
    function() {
      function AnalyticsConnector2() {
        this.identityStore = new IdentityStoreImpl();
        this.eventBridge = new EventBridgeImpl();
        this.applicationContextProvider = new ApplicationContextProviderImpl();
      }
      AnalyticsConnector2.getInstance = function(instanceName) {
        if (!safeGlobal["analyticsConnectorInstances"]) {
          safeGlobal["analyticsConnectorInstances"] = {};
        }
        if (!safeGlobal["analyticsConnectorInstances"][instanceName]) {
          safeGlobal["analyticsConnectorInstances"][instanceName] = new AnalyticsConnector2();
        }
        return safeGlobal["analyticsConnectorInstances"][instanceName];
      };
      return AnalyticsConnector2;
    }()
  );

  // node_modules/@amplitude/experiment-core/dist/experiment-core.esm.js
  init_live_reload();
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign2 = function() {
    __assign2 = Object.assign || function __assign4(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = {
      label: 0,
      sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    }, f, y, t, g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = {
        error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  var EvaluationOperator = {
    IS: "is",
    IS_NOT: "is not",
    CONTAINS: "contains",
    DOES_NOT_CONTAIN: "does not contain",
    LESS_THAN: "less",
    LESS_THAN_EQUALS: "less or equal",
    GREATER_THAN: "greater",
    GREATER_THAN_EQUALS: "greater or equal",
    VERSION_LESS_THAN: "version less",
    VERSION_LESS_THAN_EQUALS: "version less or equal",
    VERSION_GREATER_THAN: "version greater",
    VERSION_GREATER_THAN_EQUALS: "version greater or equal",
    SET_IS: "set is",
    SET_IS_NOT: "set is not",
    SET_CONTAINS: "set contains",
    SET_DOES_NOT_CONTAIN: "set does not contain",
    SET_CONTAINS_ANY: "set contains any",
    SET_DOES_NOT_CONTAIN_ANY: "set does not contain any",
    REGEX_MATCH: "regex match",
    REGEX_DOES_NOT_MATCH: "regex does not match"
  };
  var stringToUtf8ByteArray = function(str) {
    var out = [];
    var p = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 128) {
        out[p++] = c;
      } else if (c < 2048) {
        out[p++] = c >> 6 | 192;
        out[p++] = c & 63 | 128;
      } else if ((c & 64512) == 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) == 56320) {
        c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
        out[p++] = c >> 18 | 240;
        out[p++] = c >> 12 & 63 | 128;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      } else {
        out[p++] = c >> 12 | 224;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      }
    }
    return Uint8Array.from(out);
  };
  var C1_32 = -862048943;
  var C2_32 = 461845907;
  var R1_32 = 15;
  var R2_32 = 13;
  var M_32 = 5;
  var N_32 = -430675100;
  var hash32x86 = function(input, seed) {
    if (seed === void 0) {
      seed = 0;
    }
    var data = stringToUtf8ByteArray(input);
    var length = data.length;
    var nBlocks = length >> 2;
    var hash = seed;
    for (var i = 0; i < nBlocks; i++) {
      var index_1 = i << 2;
      var k = readIntLe(data, index_1);
      hash = mix32(k, hash);
    }
    var index = nBlocks << 2;
    var k1 = 0;
    switch (length - index) {
      case 3:
        k1 ^= data[index + 2] << 16;
        k1 ^= data[index + 1] << 8;
        k1 ^= data[index];
        k1 = Math.imul(k1, C1_32);
        k1 = rotateLeft(k1, R1_32);
        k1 = Math.imul(k1, C2_32);
        hash ^= k1;
        break;
      case 2:
        k1 ^= data[index + 1] << 8;
        k1 ^= data[index];
        k1 = Math.imul(k1, C1_32);
        k1 = rotateLeft(k1, R1_32);
        k1 = Math.imul(k1, C2_32);
        hash ^= k1;
        break;
      case 1:
        k1 ^= data[index];
        k1 = Math.imul(k1, C1_32);
        k1 = rotateLeft(k1, R1_32);
        k1 = Math.imul(k1, C2_32);
        hash ^= k1;
        break;
    }
    hash ^= length;
    return fmix32(hash) >>> 0;
  };
  var mix32 = function(k, hash) {
    var kResult = k;
    var hashResult = hash;
    kResult = Math.imul(kResult, C1_32);
    kResult = rotateLeft(kResult, R1_32);
    kResult = Math.imul(kResult, C2_32);
    hashResult ^= kResult;
    hashResult = rotateLeft(hashResult, R2_32);
    hashResult = Math.imul(hashResult, M_32);
    return hashResult + N_32 | 0;
  };
  var fmix32 = function(hash) {
    var hashResult = hash;
    hashResult ^= hashResult >>> 16;
    hashResult = Math.imul(hashResult, -2048144789);
    hashResult ^= hashResult >>> 13;
    hashResult = Math.imul(hashResult, -1028477387);
    hashResult ^= hashResult >>> 16;
    return hashResult;
  };
  var rotateLeft = function(x, n, width) {
    if (width === void 0) {
      width = 32;
    }
    if (n > width)
      n = n % width;
    var mask = 4294967295 << width - n >>> 0;
    var r = (x & mask) >>> 0 >>> width - n >>> 0;
    return (x << n | r) >>> 0;
  };
  var readIntLe = function(data, index) {
    if (index === void 0) {
      index = 0;
    }
    var n = data[index] << 24 | data[index + 1] << 16 | data[index + 2] << 8 | data[index + 3];
    return reverseBytes(n);
  };
  var reverseBytes = function(n) {
    return (n & -16777216) >>> 24 | (n & 16711680) >>> 8 | (n & 65280) << 8 | (n & 255) << 24;
  };
  var select = function(selectable, selector) {
    var e_1, _a;
    if (!selector || selector.length === 0) {
      return void 0;
    }
    try {
      for (var selector_1 = __values(selector), selector_1_1 = selector_1.next(); !selector_1_1.done; selector_1_1 = selector_1.next()) {
        var selectorElement = selector_1_1.value;
        if (!selectorElement || !selectable || typeof selectable !== "object") {
          return void 0;
        }
        selectable = selectable[selectorElement];
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (selector_1_1 && !selector_1_1.done && (_a = selector_1.return))
          _a.call(selector_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    if (!selectable) {
      return void 0;
    } else {
      return selectable;
    }
  };
  var MAJOR_MINOR_REGEX = "(\\d+)\\.(\\d+)";
  var PATCH_REGEX = "(\\d+)";
  var PRERELEASE_REGEX = "(-(([-\\w]+\\.?)*))?";
  var VERSION_PATTERN = "^".concat(MAJOR_MINOR_REGEX, "(\\.").concat(PATCH_REGEX).concat(PRERELEASE_REGEX, ")?$");
  var SemanticVersion = (
    /** @class */
    function() {
      function SemanticVersion2(major, minor, patch, preRelease) {
        if (preRelease === void 0) {
          preRelease = void 0;
        }
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.preRelease = preRelease;
      }
      SemanticVersion2.parse = function(version3) {
        if (!version3) {
          return void 0;
        }
        var matchGroup = new RegExp(VERSION_PATTERN).exec(version3);
        if (!matchGroup) {
          return void 0;
        }
        var major = Number(matchGroup[1]);
        var minor = Number(matchGroup[2]);
        if (isNaN(major) || isNaN(minor)) {
          return void 0;
        }
        var patch = Number(matchGroup[4]) || 0;
        var preRelease = matchGroup[5] || void 0;
        return new SemanticVersion2(major, minor, patch, preRelease);
      };
      SemanticVersion2.prototype.compareTo = function(other) {
        if (this.major > other.major)
          return 1;
        if (this.major < other.major)
          return -1;
        if (this.minor > other.minor)
          return 1;
        if (this.minor < other.minor)
          return -1;
        if (this.patch > other.patch)
          return 1;
        if (this.patch < other.patch)
          return -1;
        if (this.preRelease && !other.preRelease)
          return -1;
        if (!this.preRelease && other.preRelease)
          return 1;
        if (this.preRelease && other.preRelease) {
          if (this.preRelease > other.preRelease)
            return 1;
          if (this.preRelease < other.preRelease)
            return -1;
          return 0;
        }
        return 0;
      };
      return SemanticVersion2;
    }()
  );
  var EvaluationEngine = (
    /** @class */
    function() {
      function EvaluationEngine2() {
      }
      EvaluationEngine2.prototype.evaluate = function(context, flags) {
        var e_1, _a;
        var results = {};
        var target = {
          context,
          result: results
        };
        try {
          for (var flags_1 = __values(flags), flags_1_1 = flags_1.next(); !flags_1_1.done; flags_1_1 = flags_1.next()) {
            var flag = flags_1_1.value;
            var variant = this.evaluateFlag(target, flag);
            if (variant) {
              results[flag.key] = variant;
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (flags_1_1 && !flags_1_1.done && (_a = flags_1.return))
              _a.call(flags_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return results;
      };
      EvaluationEngine2.prototype.evaluateFlag = function(target, flag) {
        var e_2, _a;
        var result;
        try {
          for (var _b = __values(flag.segments), _c = _b.next(); !_c.done; _c = _b.next()) {
            var segment = _c.value;
            result = this.evaluateSegment(target, flag, segment);
            if (result) {
              var metadata = __assign2(__assign2(__assign2({}, flag.metadata), segment.metadata), result.metadata);
              result = __assign2(__assign2({}, result), { metadata });
              break;
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
        return result;
      };
      EvaluationEngine2.prototype.evaluateSegment = function(target, flag, segment) {
        var e_3, _a, e_4, _b;
        if (!segment.conditions) {
          var variantKey = this.bucket(target, segment);
          if (variantKey !== void 0) {
            return flag.variants[variantKey];
          } else {
            return void 0;
          }
        }
        try {
          for (var _c = __values(segment.conditions), _d = _c.next(); !_d.done; _d = _c.next()) {
            var conditions = _d.value;
            var match = true;
            try {
              for (var conditions_1 = (e_4 = void 0, __values(conditions)), conditions_1_1 = conditions_1.next(); !conditions_1_1.done; conditions_1_1 = conditions_1.next()) {
                var condition = conditions_1_1.value;
                match = this.matchCondition(target, condition);
                if (!match) {
                  break;
                }
              }
            } catch (e_4_1) {
              e_4 = { error: e_4_1 };
            } finally {
              try {
                if (conditions_1_1 && !conditions_1_1.done && (_b = conditions_1.return))
                  _b.call(conditions_1);
              } finally {
                if (e_4)
                  throw e_4.error;
              }
            }
            if (match) {
              var variantKey = this.bucket(target, segment);
              if (variantKey !== void 0) {
                return flag.variants[variantKey];
              } else {
                return void 0;
              }
            }
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return))
              _a.call(_c);
          } finally {
            if (e_3)
              throw e_3.error;
          }
        }
        return void 0;
      };
      EvaluationEngine2.prototype.matchCondition = function(target, condition) {
        var propValue = select(target, condition.selector);
        if (!propValue) {
          return this.matchNull(condition.op, condition.values);
        } else if (this.isSetOperator(condition.op)) {
          var propValueStringList = this.coerceStringArray(propValue);
          if (!propValueStringList) {
            return false;
          }
          return this.matchSet(propValueStringList, condition.op, condition.values);
        } else {
          var propValueString = this.coerceString(propValue);
          if (propValueString !== void 0) {
            return this.matchString(propValueString, condition.op, condition.values);
          } else {
            return false;
          }
        }
      };
      EvaluationEngine2.prototype.getHash = function(key) {
        return hash32x86(key);
      };
      EvaluationEngine2.prototype.bucket = function(target, segment) {
        var e_5, _a, e_6, _b;
        if (!segment.bucket) {
          return segment.variant;
        }
        var bucketingValue = this.coerceString(select(target, segment.bucket.selector));
        if (!bucketingValue || bucketingValue.length === 0) {
          return segment.variant;
        }
        var keyToHash = "".concat(segment.bucket.salt, "/").concat(bucketingValue);
        var hash = this.getHash(keyToHash);
        var allocationValue = hash % 100;
        var distributionValue = Math.floor(hash / 100);
        try {
          for (var _c = __values(segment.bucket.allocations), _d = _c.next(); !_d.done; _d = _c.next()) {
            var allocation = _d.value;
            var allocationStart = allocation.range[0];
            var allocationEnd = allocation.range[1];
            if (allocationValue >= allocationStart && allocationValue < allocationEnd) {
              try {
                for (var _e = (e_6 = void 0, __values(allocation.distributions)), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var distribution = _f.value;
                  var distributionStart = distribution.range[0];
                  var distributionEnd = distribution.range[1];
                  if (distributionValue >= distributionStart && distributionValue < distributionEnd) {
                    return distribution.variant;
                  }
                }
              } catch (e_6_1) {
                e_6 = { error: e_6_1 };
              } finally {
                try {
                  if (_f && !_f.done && (_b = _e.return))
                    _b.call(_e);
                } finally {
                  if (e_6)
                    throw e_6.error;
                }
              }
            }
          }
        } catch (e_5_1) {
          e_5 = { error: e_5_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return))
              _a.call(_c);
          } finally {
            if (e_5)
              throw e_5.error;
          }
        }
        return segment.variant;
      };
      EvaluationEngine2.prototype.matchNull = function(op, filterValues) {
        var containsNone = this.containsNone(filterValues);
        switch (op) {
          case EvaluationOperator.IS:
          case EvaluationOperator.CONTAINS:
          case EvaluationOperator.LESS_THAN:
          case EvaluationOperator.LESS_THAN_EQUALS:
          case EvaluationOperator.GREATER_THAN:
          case EvaluationOperator.GREATER_THAN_EQUALS:
          case EvaluationOperator.VERSION_LESS_THAN:
          case EvaluationOperator.VERSION_LESS_THAN_EQUALS:
          case EvaluationOperator.VERSION_GREATER_THAN:
          case EvaluationOperator.VERSION_GREATER_THAN_EQUALS:
          case EvaluationOperator.SET_IS:
          case EvaluationOperator.SET_CONTAINS:
          case EvaluationOperator.SET_CONTAINS_ANY:
            return containsNone;
          case EvaluationOperator.IS_NOT:
          case EvaluationOperator.DOES_NOT_CONTAIN:
          case EvaluationOperator.SET_DOES_NOT_CONTAIN:
          case EvaluationOperator.SET_DOES_NOT_CONTAIN_ANY:
            return !containsNone;
          default:
            return false;
        }
      };
      EvaluationEngine2.prototype.matchSet = function(propValues, op, filterValues) {
        switch (op) {
          case EvaluationOperator.SET_IS:
            return this.setEquals(propValues, filterValues);
          case EvaluationOperator.SET_IS_NOT:
            return !this.setEquals(propValues, filterValues);
          case EvaluationOperator.SET_CONTAINS:
            return this.matchesSetContainsAll(propValues, filterValues);
          case EvaluationOperator.SET_DOES_NOT_CONTAIN:
            return !this.matchesSetContainsAll(propValues, filterValues);
          case EvaluationOperator.SET_CONTAINS_ANY:
            return this.matchesSetContainsAny(propValues, filterValues);
          case EvaluationOperator.SET_DOES_NOT_CONTAIN_ANY:
            return !this.matchesSetContainsAny(propValues, filterValues);
          default:
            return false;
        }
      };
      EvaluationEngine2.prototype.matchString = function(propValue, op, filterValues) {
        var _this = this;
        switch (op) {
          case EvaluationOperator.IS:
            return this.matchesIs(propValue, filterValues);
          case EvaluationOperator.IS_NOT:
            return !this.matchesIs(propValue, filterValues);
          case EvaluationOperator.CONTAINS:
            return this.matchesContains(propValue, filterValues);
          case EvaluationOperator.DOES_NOT_CONTAIN:
            return !this.matchesContains(propValue, filterValues);
          case EvaluationOperator.LESS_THAN:
          case EvaluationOperator.LESS_THAN_EQUALS:
          case EvaluationOperator.GREATER_THAN:
          case EvaluationOperator.GREATER_THAN_EQUALS:
            return this.matchesComparable(propValue, op, filterValues, function(value) {
              return _this.parseNumber(value);
            }, this.comparator);
          case EvaluationOperator.VERSION_LESS_THAN:
          case EvaluationOperator.VERSION_LESS_THAN_EQUALS:
          case EvaluationOperator.VERSION_GREATER_THAN:
          case EvaluationOperator.VERSION_GREATER_THAN_EQUALS:
            return this.matchesComparable(propValue, op, filterValues, function(value) {
              return SemanticVersion.parse(value);
            }, this.versionComparator);
          case EvaluationOperator.REGEX_MATCH:
            return this.matchesRegex(propValue, filterValues);
          case EvaluationOperator.REGEX_DOES_NOT_MATCH:
            return !this.matchesRegex(propValue, filterValues);
          default:
            return false;
        }
      };
      EvaluationEngine2.prototype.matchesIs = function(propValue, filterValues) {
        if (this.containsBooleans(filterValues)) {
          var lower_1 = propValue.toLowerCase();
          if (lower_1 === "true" || lower_1 === "false") {
            return filterValues.some(function(value) {
              return value.toLowerCase() === lower_1;
            });
          }
        }
        return filterValues.some(function(value) {
          return propValue === value;
        });
      };
      EvaluationEngine2.prototype.matchesContains = function(propValue, filterValues) {
        var e_7, _a;
        try {
          for (var filterValues_1 = __values(filterValues), filterValues_1_1 = filterValues_1.next(); !filterValues_1_1.done; filterValues_1_1 = filterValues_1.next()) {
            var filterValue = filterValues_1_1.value;
            if (propValue.toLowerCase().includes(filterValue.toLowerCase())) {
              return true;
            }
          }
        } catch (e_7_1) {
          e_7 = { error: e_7_1 };
        } finally {
          try {
            if (filterValues_1_1 && !filterValues_1_1.done && (_a = filterValues_1.return))
              _a.call(filterValues_1);
          } finally {
            if (e_7)
              throw e_7.error;
          }
        }
        return false;
      };
      EvaluationEngine2.prototype.matchesComparable = function(propValue, op, filterValues, typeTransformer, typeComparator) {
        var _this = this;
        var propValueTransformed = typeTransformer(propValue);
        var filterValuesTransformed = filterValues.map(function(filterValue) {
          return typeTransformer(filterValue);
        }).filter(function(filterValue) {
          return filterValue !== void 0;
        });
        if (propValueTransformed === void 0 || filterValuesTransformed.length === 0) {
          return filterValues.some(function(filterValue) {
            return _this.comparator(propValue, op, filterValue);
          });
        } else {
          return filterValuesTransformed.some(function(filterValueTransformed) {
            return typeComparator(propValueTransformed, op, filterValueTransformed);
          });
        }
      };
      EvaluationEngine2.prototype.comparator = function(propValue, op, filterValue) {
        switch (op) {
          case EvaluationOperator.LESS_THAN:
          case EvaluationOperator.VERSION_LESS_THAN:
            return propValue < filterValue;
          case EvaluationOperator.LESS_THAN_EQUALS:
          case EvaluationOperator.VERSION_LESS_THAN_EQUALS:
            return propValue <= filterValue;
          case EvaluationOperator.GREATER_THAN:
          case EvaluationOperator.VERSION_GREATER_THAN:
            return propValue > filterValue;
          case EvaluationOperator.GREATER_THAN_EQUALS:
          case EvaluationOperator.VERSION_GREATER_THAN_EQUALS:
            return propValue >= filterValue;
          default:
            return false;
        }
      };
      EvaluationEngine2.prototype.versionComparator = function(propValue, op, filterValue) {
        var compareTo = propValue.compareTo(filterValue);
        switch (op) {
          case EvaluationOperator.LESS_THAN:
          case EvaluationOperator.VERSION_LESS_THAN:
            return compareTo < 0;
          case EvaluationOperator.LESS_THAN_EQUALS:
          case EvaluationOperator.VERSION_LESS_THAN_EQUALS:
            return compareTo <= 0;
          case EvaluationOperator.GREATER_THAN:
          case EvaluationOperator.VERSION_GREATER_THAN:
            return compareTo > 0;
          case EvaluationOperator.GREATER_THAN_EQUALS:
          case EvaluationOperator.VERSION_GREATER_THAN_EQUALS:
            return compareTo >= 0;
          default:
            return false;
        }
      };
      EvaluationEngine2.prototype.matchesRegex = function(propValue, filterValues) {
        return filterValues.some(function(filterValue) {
          return Boolean(new RegExp(filterValue).exec(propValue));
        });
      };
      EvaluationEngine2.prototype.containsNone = function(filterValues) {
        return filterValues.some(function(filterValue) {
          return filterValue === "(none)";
        });
      };
      EvaluationEngine2.prototype.containsBooleans = function(filterValues) {
        return filterValues.some(function(filterValue) {
          switch (filterValue.toLowerCase()) {
            case "true":
            case "false":
              return true;
            default:
              return false;
          }
        });
      };
      EvaluationEngine2.prototype.parseNumber = function(value) {
        var _a;
        return (_a = Number(value)) !== null && _a !== void 0 ? _a : void 0;
      };
      EvaluationEngine2.prototype.coerceString = function(value) {
        if (!value) {
          return void 0;
        }
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        return String(value);
      };
      EvaluationEngine2.prototype.coerceStringArray = function(value) {
        var _this = this;
        if (Array.isArray(value)) {
          var anyArray = value;
          return anyArray.map(function(e) {
            return _this.coerceString(e);
          }).filter(Boolean);
        }
        var stringValue = String(value);
        try {
          var parsedValue = JSON.parse(stringValue);
          if (Array.isArray(parsedValue)) {
            var anyArray = value;
            return anyArray.map(function(e) {
              return _this.coerceString(e);
            }).filter(Boolean);
          } else {
            return void 0;
          }
        } catch (_a) {
          return void 0;
        }
      };
      EvaluationEngine2.prototype.isSetOperator = function(op) {
        switch (op) {
          case EvaluationOperator.SET_IS:
          case EvaluationOperator.SET_IS_NOT:
          case EvaluationOperator.SET_CONTAINS:
          case EvaluationOperator.SET_DOES_NOT_CONTAIN:
          case EvaluationOperator.SET_CONTAINS_ANY:
          case EvaluationOperator.SET_DOES_NOT_CONTAIN_ANY:
            return true;
          default:
            return false;
        }
      };
      EvaluationEngine2.prototype.setEquals = function(xa, ya) {
        var xs = new Set(xa);
        var ys = new Set(ya);
        return xs.size === ys.size && __spreadArray([], __read(ys), false).every(function(y) {
          return xs.has(y);
        });
      };
      EvaluationEngine2.prototype.matchesSetContainsAll = function(propValues, filterValues) {
        var e_8, _a;
        if (propValues.length < filterValues.length) {
          return false;
        }
        try {
          for (var filterValues_2 = __values(filterValues), filterValues_2_1 = filterValues_2.next(); !filterValues_2_1.done; filterValues_2_1 = filterValues_2.next()) {
            var filterValue = filterValues_2_1.value;
            if (!this.matchesIs(filterValue, propValues)) {
              return false;
            }
          }
        } catch (e_8_1) {
          e_8 = { error: e_8_1 };
        } finally {
          try {
            if (filterValues_2_1 && !filterValues_2_1.done && (_a = filterValues_2.return))
              _a.call(filterValues_2);
          } finally {
            if (e_8)
              throw e_8.error;
          }
        }
        return true;
      };
      EvaluationEngine2.prototype.matchesSetContainsAny = function(propValues, filterValues) {
        var e_9, _a;
        try {
          for (var filterValues_3 = __values(filterValues), filterValues_3_1 = filterValues_3.next(); !filterValues_3_1.done; filterValues_3_1 = filterValues_3.next()) {
            var filterValue = filterValues_3_1.value;
            if (this.matchesIs(filterValue, propValues)) {
              return true;
            }
          }
        } catch (e_9_1) {
          e_9 = { error: e_9_1 };
        } finally {
          try {
            if (filterValues_3_1 && !filterValues_3_1.done && (_a = filterValues_3.return))
              _a.call(filterValues_3);
          } finally {
            if (e_9)
              throw e_9.error;
          }
        }
        return false;
      };
      return EvaluationEngine2;
    }()
  );
  var topologicalSort = function(flags, flagKeys) {
    var e_1, _a;
    var available = __assign2({}, flags);
    var result = [];
    var startingKeys = flagKeys || Object.keys(available);
    try {
      for (var startingKeys_1 = __values(startingKeys), startingKeys_1_1 = startingKeys_1.next(); !startingKeys_1_1.done; startingKeys_1_1 = startingKeys_1.next()) {
        var flagKey = startingKeys_1_1.value;
        var traversal = parentTraversal(flagKey, available);
        if (traversal) {
          result.push.apply(result, __spreadArray([], __read(traversal), false));
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (startingKeys_1_1 && !startingKeys_1_1.done && (_a = startingKeys_1.return))
          _a.call(startingKeys_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    return result;
  };
  var parentTraversal = function(flagKey, available, path) {
    var e_2, _a;
    if (path === void 0) {
      path = [];
    }
    var flag = available[flagKey];
    if (!flag) {
      return void 0;
    } else if (!flag.dependencies || flag.dependencies.length === 0) {
      delete available[flag.key];
      return [flag];
    }
    path.push(flag.key);
    var result = [];
    var _loop_1 = function(parentKey2) {
      if (path.some(function(p) {
        return p === parentKey2;
      })) {
        throw Error("Detected a cycle between flags ".concat(path));
      }
      var traversal = parentTraversal(parentKey2, available, path);
      if (traversal) {
        result.push.apply(result, __spreadArray([], __read(traversal), false));
      }
    };
    try {
      for (var _b = __values(flag.dependencies), _c = _b.next(); !_c.done; _c = _b.next()) {
        var parentKey = _c.value;
        _loop_1(parentKey);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return))
          _a.call(_b);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
    result.push(flag);
    path.pop();
    delete available[flag.key];
    return result;
  };
  var version = "3.7.5";
  var VERSION = version;
  var _hasatob = typeof atob === "function";
  var _hasbtoa = typeof btoa === "function";
  var _hasBuffer = typeof Buffer === "function";
  var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
  var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
  var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var b64chs = Array.prototype.slice.call(b64ch);
  var b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
  })(b64chs);
  var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  var _fromCC = String.fromCharCode.bind(String);
  var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
  var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
  var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
  var btoaPolyfill = (bin) => {
    let u32, c0, c1, c2, asc = "";
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length; ) {
      if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
        throw new TypeError("invalid character found");
      u32 = c0 << 16 | c1 << 8 | c2;
      asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
  };
  var _btoa = _hasbtoa ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
  var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
    const maxargs = 4096;
    let strs = [];
    for (let i = 0, l = u8a.length; i < l; i += maxargs) {
      strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
    }
    return _btoa(strs.join(""));
  };
  var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
  var cb_utob = (c) => {
    if (c.length < 2) {
      var cc = c.charCodeAt(0);
      return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    } else {
      var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
      return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    }
  };
  var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
  var utob = (u) => u.replace(re_utob, cb_utob);
  var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
  var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
  var encodeURI = (src) => encode(src, true);
  var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
  var cb_btou = (cccc) => {
    switch (cccc.length) {
      case 4:
        var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
        return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
      case 3:
        return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
      default:
        return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
    }
  };
  var btou = (b) => b.replace(re_btou, cb_btou);
  var atobPolyfill = (asc) => {
    asc = asc.replace(/\s+/g, "");
    if (!b64re.test(asc))
      throw new TypeError("malformed base64.");
    asc += "==".slice(2 - (asc.length & 3));
    let u24, bin = "", r1, r2;
    for (let i = 0; i < asc.length; ) {
      u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
      bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
  };
  var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
  var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
  var toUint8Array = (a) => _toUint8Array(_unURI(a));
  var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
  var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
  var decode = (src) => _decode(_unURI(src));
  var isValid2 = (src) => {
    if (typeof src !== "string")
      return false;
    const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
  };
  var _noEnum = (v) => {
    return {
      value: v,
      enumerable: false,
      writable: true,
      configurable: true
    };
  };
  var extendString = function() {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add("fromBase64", function() {
      return decode(this);
    });
    _add("toBase64", function(urlsafe) {
      return encode(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return encode(this, true);
    });
    _add("toBase64URL", function() {
      return encode(this, true);
    });
    _add("toUint8Array", function() {
      return toUint8Array(this);
    });
  };
  var extendUint8Array = function() {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add("toBase64", function(urlsafe) {
      return fromUint8Array(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return fromUint8Array(this, true);
    });
    _add("toBase64URL", function() {
      return fromUint8Array(this, true);
    });
  };
  var extendBuiltins = () => {
    extendString();
    extendUint8Array();
  };
  var gBase64 = {
    version,
    VERSION,
    atob: _atob,
    atobPolyfill,
    btoa: _btoa,
    btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode,
    encodeURI,
    encodeURL: encodeURI,
    utob,
    btou,
    decode,
    isValid: isValid2,
    fromUint8Array,
    toUint8Array,
    extendString,
    extendUint8Array,
    extendBuiltins
  };
  var FetchError = (
    /** @class */
    function(_super) {
      __extends(FetchError2, _super);
      function FetchError2(statusCode, message) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        Object.setPrototypeOf(_this, FetchError2.prototype);
        return _this;
      }
      return FetchError2;
    }(Error)
  );
  var SdkEvaluationApi = (
    /** @class */
    function() {
      function SdkEvaluationApi2(deploymentKey, serverUrl, httpClient) {
        this.deploymentKey = deploymentKey;
        this.serverUrl = serverUrl;
        this.httpClient = httpClient;
      }
      SdkEvaluationApi2.prototype.getVariants = function(user, options) {
        return __awaiter(this, void 0, void 0, function() {
          var userJsonBase64, headers, url, response;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                userJsonBase64 = gBase64.encodeURL(JSON.stringify(user));
                headers = {
                  Authorization: "Api-Key ".concat(this.deploymentKey),
                  "X-Amp-Exp-User": userJsonBase64
                };
                if (options === null || options === void 0 ? void 0 : options.flagKeys) {
                  headers["X-Amp-Exp-Flag-Keys"] = gBase64.encodeURL(JSON.stringify(options.flagKeys));
                }
                if (options === null || options === void 0 ? void 0 : options.trackingOption) {
                  headers["X-Amp-Exp-Track"] = options.trackingOption;
                }
                url = new URL("".concat(this.serverUrl, "/sdk/v2/vardata?v=0"));
                if (options === null || options === void 0 ? void 0 : options.evaluationMode) {
                  url.searchParams.append("eval_mode", options === null || options === void 0 ? void 0 : options.evaluationMode);
                }
                if (options === null || options === void 0 ? void 0 : options.deliveryMethod) {
                  url.searchParams.append("delivery_method", options === null || options === void 0 ? void 0 : options.deliveryMethod);
                }
                return [4, this.httpClient.request({
                  requestUrl: url.toString(),
                  method: "GET",
                  headers,
                  timeoutMillis: options === null || options === void 0 ? void 0 : options.timeoutMillis
                })];
              case 1:
                response = _a.sent();
                if (response.status != 200) {
                  throw new FetchError(response.status, "Fetch error response: status=".concat(response.status));
                }
                return [2, JSON.parse(response.body)];
            }
          });
        });
      };
      return SdkEvaluationApi2;
    }()
  );
  var SdkFlagApi = (
    /** @class */
    function() {
      function SdkFlagApi2(deploymentKey, serverUrl, httpClient) {
        this.deploymentKey = deploymentKey;
        this.serverUrl = serverUrl;
        this.httpClient = httpClient;
      }
      SdkFlagApi2.prototype.getFlags = function(options) {
        return __awaiter(this, void 0, void 0, function() {
          var headers, response, flagsArray;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                headers = {
                  Authorization: "Api-Key ".concat(this.deploymentKey)
                };
                if ((options === null || options === void 0 ? void 0 : options.libraryName) && (options === null || options === void 0 ? void 0 : options.libraryVersion)) {
                  headers["X-Amp-Exp-Library"] = "".concat(options.libraryName, "/").concat(options.libraryVersion);
                }
                return [4, this.httpClient.request({
                  requestUrl: "".concat(this.serverUrl, "/sdk/v2/flags"),
                  method: "GET",
                  headers,
                  timeoutMillis: options === null || options === void 0 ? void 0 : options.timeoutMillis
                })];
              case 1:
                response = _a.sent();
                if (response.status != 200) {
                  throw Error("Flags error response: status=".concat(response.status));
                }
                flagsArray = JSON.parse(response.body);
                return [2, flagsArray.reduce(function(map, flag) {
                  map[flag.key] = flag;
                  return map;
                }, {})];
            }
          });
        });
      };
      return SdkFlagApi2;
    }()
  );
  var safeGlobal2 = typeof globalThis !== "undefined" ? globalThis : global || self;
  var Poller = (
    /** @class */
    function() {
      function Poller2(action, ms) {
        this.poller = void 0;
        this.action = action;
        this.ms = ms;
      }
      Poller2.prototype.start = function() {
        if (this.poller) {
          return;
        }
        this.poller = safeGlobal2.setInterval(this.action, this.ms);
        void this.action();
      };
      Poller2.prototype.stop = function() {
        if (!this.poller) {
          return;
        }
        safeGlobal2.clearInterval(this.poller);
        this.poller = void 0;
      };
      return Poller2;
    }()
  );

  // node_modules/@amplitude/experiment-js-client/dist/experiment.esm.js
  var import_ua_parser_js = __toESM(require_ua_parser());
  var AmplitudeUserProvider = (
    /** @class */
    function() {
      function AmplitudeUserProvider2(amplitudeInstance) {
        this.amplitudeInstance = amplitudeInstance;
      }
      AmplitudeUserProvider2.prototype.getUser = function() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
          device_id: (_b = (_a = this.amplitudeInstance) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.deviceId,
          user_id: (_d = (_c = this.amplitudeInstance) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.userId,
          version: (_f = (_e = this.amplitudeInstance) === null || _e === void 0 ? void 0 : _e.options) === null || _f === void 0 ? void 0 : _f.versionName,
          language: (_h = (_g = this.amplitudeInstance) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.language,
          platform: (_k = (_j = this.amplitudeInstance) === null || _j === void 0 ? void 0 : _j.options) === null || _k === void 0 ? void 0 : _k.platform,
          os: this.getOs(),
          device_model: this.getDeviceModel()
        };
      };
      AmplitudeUserProvider2.prototype.getOs = function() {
        var _a, _b, _c, _d, _e, _f;
        return [
          (_c = (_b = (_a = this.amplitudeInstance) === null || _a === void 0 ? void 0 : _a._ua) === null || _b === void 0 ? void 0 : _b.browser) === null || _c === void 0 ? void 0 : _c.name,
          (_f = (_e = (_d = this.amplitudeInstance) === null || _d === void 0 ? void 0 : _d._ua) === null || _e === void 0 ? void 0 : _e.browser) === null || _f === void 0 ? void 0 : _f.major
        ].filter(function(e) {
          return e !== null && e !== void 0;
        }).join(" ");
      };
      AmplitudeUserProvider2.prototype.getDeviceModel = function() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.amplitudeInstance) === null || _a === void 0 ? void 0 : _a._ua) === null || _b === void 0 ? void 0 : _b.os) === null || _c === void 0 ? void 0 : _c.name;
      };
      return AmplitudeUserProvider2;
    }()
  );
  var AmplitudeAnalyticsProvider = (
    /** @class */
    function() {
      function AmplitudeAnalyticsProvider2(amplitudeInstance) {
        this.amplitudeInstance = amplitudeInstance;
      }
      AmplitudeAnalyticsProvider2.prototype.track = function(event) {
        this.amplitudeInstance.logEvent(event.name, event.properties);
      };
      AmplitudeAnalyticsProvider2.prototype.setUserProperty = function(event) {
        var _a;
        var _b;
        this.amplitudeInstance.setUserProperties((_a = {}, _a[event.userProperty] = (_b = event.variant) === null || _b === void 0 ? void 0 : _b.value, _a));
      };
      AmplitudeAnalyticsProvider2.prototype.unsetUserProperty = function(event) {
        var _a;
        this.amplitudeInstance["_logEvent"]("$identify", null, null, {
          $unset: (_a = {}, _a[event.userProperty] = "-", _a)
        });
      };
      return AmplitudeAnalyticsProvider2;
    }()
  );
  var __assign3 = function() {
    __assign3 = Object.assign || function __assign4(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign3.apply(this, arguments);
  };
  function __awaiter2(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator2(thisArg, body) {
    var _ = {
      label: 0,
      sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    }, f, y, t, g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  }
  function __values2(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read2(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = {
        error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray2(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  function unfetch(e, n) {
    return n = n || {}, new Promise(function(t, r) {
      var s = new XMLHttpRequest(), o = [], u = [], i = {}, a = function() {
        return {
          ok: 2 == (s.status / 100 | 0),
          statusText: s.statusText,
          status: s.status,
          url: s.responseURL,
          text: function() {
            return Promise.resolve(s.responseText);
          },
          json: function() {
            return Promise.resolve(JSON.parse(s.responseText));
          },
          blob: function() {
            return Promise.resolve(new Blob([s.response]));
          },
          clone: a,
          headers: {
            keys: function() {
              return o;
            },
            entries: function() {
              return u;
            },
            get: function(e2) {
              return i[e2.toLowerCase()];
            },
            has: function(e2) {
              return e2.toLowerCase() in i;
            }
          }
        };
      };
      for (var l in s.open(n.method || "get", e, true), s.onload = function() {
        s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function(e2, n2, t2) {
          o.push(n2 = n2.toLowerCase()), u.push([n2, t2]), i[n2] = i[n2] ? i[n2] + "," + t2 : t2;
        }), t(a());
      }, s.onerror = r, s.withCredentials = "include" == n.credentials, n.headers)
        s.setRequestHeader(l, n.headers[l]);
      s.send(n.body || null);
    });
  }
  var fetch = safeGlobal2.fetch || unfetch;
  var timeout = function(promise, timeoutMillis) {
    if (timeoutMillis == null || timeoutMillis <= 0) {
      return promise;
    }
    return new Promise(function(resolve, reject) {
      safeGlobal2.setTimeout(function() {
        reject(Error("Request timeout after " + timeoutMillis + " milliseconds"));
      }, timeoutMillis);
      promise.then(resolve, reject);
    });
  };
  var _request = function(requestUrl, method, headers, data, timeoutMillis) {
    var call = function() {
      return __awaiter2(void 0, void 0, void 0, function() {
        var response, simpleResponse;
        var _a;
        return __generator2(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, fetch(requestUrl, {
                method,
                headers,
                body: data
              })];
            case 1:
              response = _b.sent();
              _a = {
                status: response.status
              };
              return [4, response.text()];
            case 2:
              simpleResponse = (_a.body = _b.sent(), _a);
              return [2, simpleResponse];
          }
        });
      });
    };
    return timeout(call(), timeoutMillis);
  };
  var WrapperClient = (
    /** @class */
    function() {
      function WrapperClient2(client) {
        this.client = client;
      }
      WrapperClient2.prototype.request = function(request) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, this.client.request(request.requestUrl, request.method, request.headers, null, request.timeoutMillis)];
              case 1:
                return [2, _a.sent()];
            }
          });
        });
      };
      return WrapperClient2;
    }()
  );
  var FetchHttpClient = { request: _request };
  var Source;
  (function(Source2) {
    Source2["LocalStorage"] = "localStorage";
    Source2["InitialVariants"] = "initialVariants";
  })(Source || (Source = {}));
  var VariantSource;
  (function(VariantSource2) {
    VariantSource2["LocalStorage"] = "storage";
    VariantSource2["InitialVariants"] = "initial";
    VariantSource2["SecondaryLocalStorage"] = "secondary-storage";
    VariantSource2["SecondaryInitialVariants"] = "secondary-initial";
    VariantSource2["FallbackInline"] = "fallback-inline";
    VariantSource2["FallbackConfig"] = "fallback-config";
    VariantSource2["LocalEvaluation"] = "local-evaluation";
  })(VariantSource || (VariantSource = {}));
  var isFallback = function(source) {
    return !source || source === VariantSource.FallbackInline || source === VariantSource.FallbackConfig || source === VariantSource.SecondaryInitialVariants;
  };
  var Defaults = {
    debug: false,
    instanceName: "$default_instance",
    fallbackVariant: {},
    initialVariants: {},
    initialFlags: void 0,
    source: Source.LocalStorage,
    serverUrl: "https://api.lab.amplitude.com",
    flagsServerUrl: "https://flag.lab.amplitude.com",
    serverZone: "US",
    fetchTimeoutMillis: 1e4,
    retryFetchOnFailure: true,
    automaticExposureTracking: true,
    pollOnStart: true,
    fetchOnStart: true,
    automaticFetchOnAmplitudeIdentityChange: false,
    userProvider: null,
    analyticsProvider: null,
    exposureTrackingProvider: null,
    httpClient: FetchHttpClient
  };
  var version2 = "1.11.0";
  var ConnectorUserProvider = (
    /** @class */
    function() {
      function ConnectorUserProvider2(identityStore) {
        this.identityStore = identityStore;
      }
      ConnectorUserProvider2.prototype.identityReady = function(ms) {
        return __awaiter2(this, void 0, void 0, function() {
          var identity;
          var _this = this;
          return __generator2(this, function(_a) {
            identity = this.identityStore.getIdentity();
            if (!identity.userId && !identity.deviceId) {
              return [2, Promise.race([
                new Promise(function(resolve) {
                  var listener = function() {
                    resolve(void 0);
                    _this.identityStore.removeIdentityListener(listener);
                  };
                  _this.identityStore.addIdentityListener(listener);
                }),
                new Promise(function(resolve, reject) {
                  safeGlobal2.setTimeout(reject, ms, "Timed out waiting for Amplitude Analytics SDK to initialize. You must ensure that the analytics SDK is initialized prior to calling fetch().");
                })
              ])];
            }
            return [
              2
              /*return*/
            ];
          });
        });
      };
      ConnectorUserProvider2.prototype.getUser = function() {
        var identity = this.identityStore.getIdentity();
        var userProperties = void 0;
        try {
          userProperties = identity.userProperties;
        } catch (_a) {
          console.warn("[Experiment] failed to cast user properties");
        }
        return {
          user_id: identity.userId,
          device_id: identity.deviceId,
          user_properties: userProperties
        };
      };
      return ConnectorUserProvider2;
    }()
  );
  var ConnectorExposureTrackingProvider = (
    /** @class */
    function() {
      function ConnectorExposureTrackingProvider2(eventBridge) {
        this.eventBridge = eventBridge;
      }
      ConnectorExposureTrackingProvider2.prototype.track = function(exposure) {
        this.eventBridge.logEvent({
          eventType: "$exposure",
          eventProperties: exposure
        });
      };
      return ConnectorExposureTrackingProvider2;
    }()
  );
  var DefaultUserProvider = (
    /** @class */
    function() {
      function DefaultUserProvider2(applicationContextProvider, userProvider) {
        this.ua = new import_ua_parser_js.UAParser(typeof navigator !== "undefined" ? navigator.userAgent : null).getResult();
        this.contextProvider = applicationContextProvider;
        this.userProvider = userProvider;
      }
      DefaultUserProvider2.prototype.getUser = function() {
        var _a;
        var user = ((_a = this.userProvider) === null || _a === void 0 ? void 0 : _a.getUser()) || {};
        var context = this.contextProvider.getApplicationContext();
        return __assign3({ version: context.versionName, language: context.language, platform: context.platform, os: context.os || this.getOs(this.ua), device_model: context.deviceModel || this.getDeviceModel(this.ua) }, user);
      };
      DefaultUserProvider2.prototype.getOs = function(ua) {
        var _a, _b;
        return [(_a = ua.browser) === null || _a === void 0 ? void 0 : _a.name, (_b = ua.browser) === null || _b === void 0 ? void 0 : _b.major].filter(function(e) {
          return e !== null && e !== void 0;
        }).join(" ");
      };
      DefaultUserProvider2.prototype.getDeviceModel = function(ua) {
        var _a;
        return (_a = ua.os) === null || _a === void 0 ? void 0 : _a.name;
      };
      return DefaultUserProvider2;
    }()
  );
  var LocalStorage = (
    /** @class */
    function() {
      function LocalStorage2() {
      }
      LocalStorage2.prototype.get = function(key) {
        return localStorage.getItem(key);
      };
      LocalStorage2.prototype.put = function(key, value) {
        localStorage.setItem(key, value);
      };
      LocalStorage2.prototype.delete = function(key) {
        localStorage.removeItem(key);
      };
      return LocalStorage2;
    }()
  );
  var getVariantStorage = function(deploymentKey, instanceName, storage) {
    var truncatedDeployment = deploymentKey.substring(deploymentKey.length - 6);
    var namespace = "amp-exp-".concat(instanceName, "-").concat(truncatedDeployment);
    return new LoadStoreCache(namespace, storage, transformVariantFromStorage);
  };
  var getFlagStorage = function(deploymentKey, instanceName, storage) {
    if (storage === void 0) {
      storage = new LocalStorage();
    }
    var truncatedDeployment = deploymentKey.substring(deploymentKey.length - 6);
    var namespace = "amp-exp-".concat(instanceName, "-").concat(truncatedDeployment, "-flags");
    return new LoadStoreCache(namespace, storage);
  };
  var LoadStoreCache = (
    /** @class */
    function() {
      function LoadStoreCache2(namespace, storage, transformer) {
        this.cache = {};
        this.namespace = namespace;
        this.storage = storage;
        this.transformer = transformer;
      }
      LoadStoreCache2.prototype.get = function(key) {
        return this.cache[key];
      };
      LoadStoreCache2.prototype.getAll = function() {
        return __assign3({}, this.cache);
      };
      LoadStoreCache2.prototype.put = function(key, value) {
        this.cache[key] = value;
      };
      LoadStoreCache2.prototype.putAll = function(values) {
        var e_1, _a;
        try {
          for (var _b = __values2(Object.keys(values)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            this.cache[key] = values[key];
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      };
      LoadStoreCache2.prototype.remove = function(key) {
        delete this.cache[key];
      };
      LoadStoreCache2.prototype.clear = function() {
        this.cache = {};
      };
      LoadStoreCache2.prototype.load = function() {
        var e_2, _a;
        var rawValues = this.storage.get(this.namespace);
        var jsonValues;
        try {
          jsonValues = JSON.parse(rawValues) || {};
        } catch (_b) {
          return;
        }
        var values = {};
        try {
          for (var _c = __values2(Object.keys(jsonValues)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var key = _d.value;
            try {
              var value = void 0;
              if (this.transformer) {
                value = this.transformer(jsonValues[key]);
              } else {
                value = jsonValues[key];
              }
              if (value) {
                values[key] = value;
              }
            } catch (_e) {
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return))
              _a.call(_c);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
        this.clear();
        this.putAll(values);
      };
      LoadStoreCache2.prototype.store = function(values) {
        if (values === void 0) {
          values = this.cache;
        }
        this.storage.put(this.namespace, JSON.stringify(values));
      };
      return LoadStoreCache2;
    }()
  );
  var transformVariantFromStorage = function(storageValue) {
    if (typeof storageValue === "string") {
      return {
        key: storageValue,
        value: storageValue
      };
    } else if (typeof storageValue === "object") {
      var key = storageValue["key"];
      var value = storageValue["value"];
      var payload = storageValue["payload"];
      var metadata = storageValue["metadata"];
      var experimentKey = storageValue["expKey"];
      if (metadata && metadata.experimentKey) {
        experimentKey = metadata.experimentKey;
      } else if (experimentKey) {
        metadata = metadata || {};
        metadata["experimentKey"] = experimentKey;
      }
      var variant = {};
      if (key) {
        variant.key = key;
      } else if (value) {
        variant.key = value;
      }
      if (value)
        variant.value = value;
      if (metadata)
        variant.metadata = metadata;
      if (payload)
        variant.payload = payload;
      if (experimentKey)
        variant.expKey = experimentKey;
      return variant;
    }
  };
  var exposureEvent = function(user, key, variant, source) {
    var _a;
    var name = "[Experiment] Exposure";
    var value = variant === null || variant === void 0 ? void 0 : variant.value;
    var userProperty = "[Experiment] ".concat(key);
    return {
      name,
      user,
      key,
      variant,
      userProperty,
      properties: {
        key,
        variant: value,
        source
      },
      userProperties: (_a = {}, _a[userProperty] = value, _a)
    };
  };
  var isNullOrUndefined = function(value) {
    return value === null || value === void 0;
  };
  var isNullUndefinedOrEmpty = function(value) {
    if (isNullOrUndefined(value))
      return true;
    return value && Object.keys(value).length === 0;
  };
  var isLocalEvaluationMode = function(flag) {
    var _a;
    return ((_a = flag === null || flag === void 0 ? void 0 : flag.metadata) === null || _a === void 0 ? void 0 : _a.evaluationMode) === "local";
  };
  var Backoff = (
    /** @class */
    function() {
      function Backoff2(attempts, min, max, scalar) {
        this.started = false;
        this.done = false;
        this.attempts = attempts;
        this.min = min;
        this.max = max;
        this.scalar = scalar;
      }
      Backoff2.prototype.start = function(fn) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!this.started) {
                  this.started = true;
                } else {
                  throw Error("Backoff already started");
                }
                return [4, this.backoff(fn, 0, this.min)];
              case 1:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Backoff2.prototype.cancel = function() {
        this.done = true;
        clearTimeout(this.timeoutHandle);
      };
      Backoff2.prototype.backoff = function(fn, attempt, delay) {
        return __awaiter2(this, void 0, void 0, function() {
          var _this = this;
          return __generator2(this, function(_a) {
            if (this.done) {
              return [
                2
                /*return*/
              ];
            }
            this.timeoutHandle = safeGlobal2.setTimeout(function() {
              return __awaiter2(_this, void 0, void 0, function() {
                var nextAttempt, nextDelay;
                return __generator2(this, function(_a2) {
                  switch (_a2.label) {
                    case 0:
                      _a2.trys.push([0, 2, , 3]);
                      return [4, fn()];
                    case 1:
                      _a2.sent();
                      return [3, 3];
                    case 2:
                      _a2.sent();
                      nextAttempt = attempt + 1;
                      if (nextAttempt < this.attempts) {
                        nextDelay = Math.min(delay * this.scalar, this.max);
                        this.backoff(fn, nextAttempt, nextDelay);
                      }
                      return [3, 3];
                    case 3:
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            }, delay);
            return [
              2
              /*return*/
            ];
          });
        });
      };
      return Backoff2;
    }()
  );
  var convertUserToContext = function(user) {
    var e_1, _a;
    var _b, _c;
    if (!user) {
      return {};
    }
    var context = { user };
    var groups = {};
    if (!user.groups) {
      return context;
    }
    try {
      for (var _d = __values2(Object.keys(user.groups)), _e = _d.next(); !_e.done; _e = _d.next()) {
        var groupType = _e.value;
        var groupNames = user.groups[groupType];
        if (groupNames.length > 0 && groupNames[0]) {
          var groupName = groupNames[0];
          var groupNameMap = {
            group_name: groupName
          };
          var groupProperties = (_c = (_b = user.group_properties) === null || _b === void 0 ? void 0 : _b[groupType]) === null || _c === void 0 ? void 0 : _c[groupName];
          if (groupProperties && Object.keys(groupProperties).length > 0) {
            groupNameMap["group_properties"] = groupProperties;
          }
          groups[groupType] = groupNameMap;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_e && !_e.done && (_a = _d.return))
          _a.call(_d);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    if (Object.keys(groups).length > 0) {
      context["groups"] = groups;
    }
    delete context.user["groups"];
    delete context.user["group_properties"];
    return context;
  };
  var convertVariant = function(value) {
    if (value === null || value === void 0) {
      return {};
    }
    if (typeof value == "string") {
      return {
        key: value,
        value
      };
    } else {
      return value;
    }
  };
  var convertEvaluationVariantToVariant = function(evaluationVariant) {
    if (!evaluationVariant) {
      return {};
    }
    var experimentKey = void 0;
    if (evaluationVariant.metadata) {
      experimentKey = evaluationVariant.metadata["experimentKey"];
    }
    var variant = {};
    if (evaluationVariant.key)
      variant.key = evaluationVariant.key;
    if (evaluationVariant.value)
      variant.value = evaluationVariant.value;
    if (evaluationVariant.payload)
      variant.payload = evaluationVariant.payload;
    if (experimentKey)
      variant.expKey = experimentKey;
    if (evaluationVariant.metadata)
      variant.metadata = evaluationVariant.metadata;
    return variant;
  };
  var SessionAnalyticsProvider = (
    /** @class */
    function() {
      function SessionAnalyticsProvider2(analyticsProvider) {
        this.setProperties = {};
        this.unsetProperties = {};
        this.analyticsProvider = analyticsProvider;
      }
      SessionAnalyticsProvider2.prototype.track = function(event) {
        if (this.setProperties[event.key] == event.variant.value) {
          return;
        } else {
          this.setProperties[event.key] = event.variant.value;
          delete this.unsetProperties[event.key];
        }
        this.analyticsProvider.track(event);
      };
      SessionAnalyticsProvider2.prototype.setUserProperty = function(event) {
        if (this.setProperties[event.key] == event.variant.value) {
          return;
        }
        this.analyticsProvider.setUserProperty(event);
      };
      SessionAnalyticsProvider2.prototype.unsetUserProperty = function(event) {
        if (this.unsetProperties[event.key]) {
          return;
        } else {
          this.unsetProperties[event.key] = "unset";
          delete this.setProperties[event.key];
        }
        this.analyticsProvider.unsetUserProperty(event);
      };
      return SessionAnalyticsProvider2;
    }()
  );
  var SessionExposureTrackingProvider = (
    /** @class */
    function() {
      function SessionExposureTrackingProvider2(exposureTrackingProvider) {
        this.tracked = {};
        this.exposureTrackingProvider = exposureTrackingProvider;
      }
      SessionExposureTrackingProvider2.prototype.track = function(exposure) {
        var trackedExposure = this.tracked[exposure.flag_key];
        if (trackedExposure && trackedExposure.variant === exposure.variant) {
          return;
        } else {
          this.tracked[exposure.flag_key] = exposure;
          this.exposureTrackingProvider.track(exposure);
        }
      };
      return SessionExposureTrackingProvider2;
    }()
  );
  var fetchBackoffTimeout = 1e4;
  var fetchBackoffAttempts = 8;
  var fetchBackoffMinMillis = 500;
  var fetchBackoffMaxMillis = 1e4;
  var fetchBackoffScalar = 1.5;
  var flagPollerIntervalMillis = 6e4;
  var euServerUrl = "https://api.lab.eu.amplitude.com";
  var euFlagsServerUrl = "https://flag.lab.eu.amplitude.com";
  var ExperimentClient = (
    /** @class */
    function() {
      function ExperimentClient2(apiKey, config) {
        var _this = this;
        var _a, _b;
        this.engine = new EvaluationEngine();
        this.poller = new Poller(function() {
          return _this.doFlags();
        }, flagPollerIntervalMillis);
        this.isRunning = false;
        this.apiKey = apiKey;
        this.config = __assign3(__assign3(__assign3({}, Defaults), config), {
          // Set server URLs separately
          serverUrl: (config === null || config === void 0 ? void 0 : config.serverUrl) || (((_a = config === null || config === void 0 ? void 0 : config.serverZone) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "eu" ? euServerUrl : Defaults.serverUrl),
          flagsServerUrl: (config === null || config === void 0 ? void 0 : config.flagsServerUrl) || (((_b = config === null || config === void 0 ? void 0 : config.serverZone) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "eu" ? euFlagsServerUrl : Defaults.flagsServerUrl)
        });
        if (this.config.initialVariants) {
          for (var flagKey in this.config.initialVariants) {
            this.config.initialVariants[flagKey] = transformVariantFromStorage(this.config.initialVariants[flagKey]);
          }
        }
        if (this.config.userProvider) {
          this.userProvider = this.config.userProvider;
        }
        if (this.config.analyticsProvider) {
          this.analyticsProvider = new SessionAnalyticsProvider(this.config.analyticsProvider);
        }
        if (this.config.exposureTrackingProvider) {
          this.exposureTrackingProvider = new SessionExposureTrackingProvider(this.config.exposureTrackingProvider);
        }
        var httpClient = new WrapperClient(this.config.httpClient || FetchHttpClient);
        this.flagApi = new SdkFlagApi(this.apiKey, this.config.flagsServerUrl, httpClient);
        this.evaluationApi = new SdkEvaluationApi(this.apiKey, this.config.serverUrl, httpClient);
        var storage = new LocalStorage();
        this.variants = getVariantStorage(this.apiKey, this.config.instanceName, storage);
        this.flags = getFlagStorage(this.apiKey, this.config.instanceName, storage);
        try {
          this.flags.load();
          this.variants.load();
        } catch (e) {
        }
        this.mergeInitialFlagsWithStorage();
      }
      ExperimentClient2.prototype.start = function(user) {
        var _a;
        return __awaiter2(this, void 0, void 0, function() {
          var flagsReadyPromise, fetchOnStart;
          return __generator2(this, function(_b) {
            switch (_b.label) {
              case 0:
                if (this.isRunning) {
                  return [
                    2
                    /*return*/
                  ];
                } else {
                  this.isRunning = true;
                }
                this.setUser(user);
                flagsReadyPromise = this.doFlags();
                fetchOnStart = (_a = this.config.fetchOnStart) !== null && _a !== void 0 ? _a : true;
                if (!fetchOnStart)
                  return [3, 2];
                return [4, Promise.all([this.fetch(user), flagsReadyPromise])];
              case 1:
                _b.sent();
                return [3, 4];
              case 2:
                return [4, flagsReadyPromise];
              case 3:
                _b.sent();
                _b.label = 4;
              case 4:
                if (this.config.pollOnStart) {
                  this.poller.start();
                }
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      ExperimentClient2.prototype.stop = function() {
        if (!this.isRunning) {
          return;
        }
        this.poller.stop();
        this.isRunning = false;
      };
      ExperimentClient2.prototype.fetch = function(user, options) {
        if (user === void 0) {
          user = this.user;
        }
        return __awaiter2(this, void 0, void 0, function() {
          var e_1;
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                this.setUser(user || {});
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, this.fetchInternal(user, this.config.fetchTimeoutMillis, this.config.retryFetchOnFailure, options)];
              case 2:
                _a.sent();
                return [3, 4];
              case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3, 4];
              case 4:
                return [2, this];
            }
          });
        });
      };
      ExperimentClient2.prototype.variant = function(key, fallback) {
        var _a, _b;
        if (!this.apiKey) {
          return { value: void 0 };
        }
        var sourceVariant = this.variantAndSource(key, fallback);
        if (this.config.automaticExposureTracking) {
          this.exposureInternal(key, sourceVariant);
        }
        this.debug("[Experiment] variant for ".concat(key, " is ").concat(((_a = sourceVariant.variant) === null || _a === void 0 ? void 0 : _a.key) || ((_b = sourceVariant.variant) === null || _b === void 0 ? void 0 : _b.value)));
        return sourceVariant.variant || {};
      };
      ExperimentClient2.prototype.exposure = function(key) {
        var sourceVariant = this.variantAndSource(key);
        this.exposureInternal(key, sourceVariant);
      };
      ExperimentClient2.prototype.all = function() {
        if (!this.apiKey) {
          return {};
        }
        var evaluatedVariants = this.evaluate();
        for (var flagKey in evaluatedVariants) {
          var flag = this.flags.get(flagKey);
          if (!isLocalEvaluationMode(flag)) {
            delete evaluatedVariants[flagKey];
          }
        }
        return __assign3(__assign3(__assign3({}, this.secondaryVariants()), this.sourceVariants()), evaluatedVariants);
      };
      ExperimentClient2.prototype.clear = function() {
        this.variants.clear();
        try {
          void this.variants.store();
        } catch (e) {
        }
      };
      ExperimentClient2.prototype.getUser = function() {
        var _a;
        if (!this.user) {
          return this.user;
        }
        if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.user_properties) {
          var userPropertiesCopy = __assign3({}, this.user.user_properties);
          return __assign3(__assign3({}, this.user), { user_properties: userPropertiesCopy });
        } else {
          return __assign3({}, this.user);
        }
      };
      ExperimentClient2.prototype.setUser = function(user) {
        var _a;
        if (!user) {
          this.user = null;
          return;
        }
        if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.user_properties) {
          var userPropertiesCopy = __assign3({}, user.user_properties);
          this.user = __assign3(__assign3({}, user), { user_properties: userPropertiesCopy });
        } else {
          this.user = __assign3({}, user);
        }
      };
      ExperimentClient2.prototype.getUserProvider = function() {
        return this.userProvider;
      };
      ExperimentClient2.prototype.setUserProvider = function(userProvider) {
        this.userProvider = userProvider;
        return this;
      };
      ExperimentClient2.prototype.mergeInitialFlagsWithStorage = function() {
        var _this = this;
        if (this.config.initialFlags) {
          var initialFlags = JSON.parse(this.config.initialFlags);
          initialFlags.forEach(function(flag) {
            if (!_this.flags.get(flag.key)) {
              _this.flags.put(flag.key, flag);
            }
          });
        }
      };
      ExperimentClient2.prototype.evaluate = function(flagKeys) {
        var e_2, _a;
        var user = this.addContext(this.user);
        var flags = topologicalSort(this.flags.getAll(), flagKeys);
        var context = convertUserToContext(user);
        var evaluationVariants = this.engine.evaluate(context, flags);
        var variants = {};
        try {
          for (var _b = __values2(Object.keys(evaluationVariants)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var flagKey = _c.value;
            variants[flagKey] = convertEvaluationVariantToVariant(evaluationVariants[flagKey]);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
        return variants;
      };
      ExperimentClient2.prototype.variantAndSource = function(key, fallback) {
        var sourceVariant = {};
        if (this.config.source === Source.LocalStorage) {
          sourceVariant = this.localStorageVariantAndSource(key, fallback);
        } else if (this.config.source === Source.InitialVariants) {
          sourceVariant = this.initialVariantsVariantAndSource(key, fallback);
        }
        var flag = this.flags.get(key);
        if (isLocalEvaluationMode(flag) || !sourceVariant.variant && flag) {
          sourceVariant = this.localEvaluationVariantAndSource(key, flag, fallback);
        }
        return sourceVariant;
      };
      ExperimentClient2.prototype.localEvaluationVariantAndSource = function(key, flag, fallback) {
        var _a;
        var defaultSourceVariant = {};
        var variant = this.evaluate([flag.key])[key];
        var source = VariantSource.LocalEvaluation;
        var isLocalEvaluationDefault = (_a = variant === null || variant === void 0 ? void 0 : variant.metadata) === null || _a === void 0 ? void 0 : _a.default;
        if (!isNullOrUndefined(variant) && !isLocalEvaluationDefault) {
          return {
            variant: convertVariant(variant),
            source,
            hasDefaultVariant: false
          };
        } else if (isLocalEvaluationDefault) {
          defaultSourceVariant = {
            variant: convertVariant(variant),
            source,
            hasDefaultVariant: true
          };
        }
        if (!isNullOrUndefined(fallback)) {
          return {
            variant: convertVariant(fallback),
            source: VariantSource.FallbackInline,
            hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
          };
        }
        var initialVariant = this.config.initialVariants[key];
        if (!isNullOrUndefined(initialVariant)) {
          return {
            variant: convertVariant(initialVariant),
            source: VariantSource.SecondaryInitialVariants,
            hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
          };
        }
        var fallbackVariant = convertVariant(this.config.fallbackVariant);
        var fallbackSourceVariant = {
          variant: fallbackVariant,
          source: VariantSource.FallbackConfig,
          hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
        };
        if (!isNullUndefinedOrEmpty(fallbackVariant)) {
          return fallbackSourceVariant;
        }
        return defaultSourceVariant;
      };
      ExperimentClient2.prototype.localStorageVariantAndSource = function(key, fallback) {
        var _a;
        var defaultSourceVariant = {};
        var localStorageVariant = this.variants.get(key);
        var isLocalStorageDefault = (_a = localStorageVariant === null || localStorageVariant === void 0 ? void 0 : localStorageVariant.metadata) === null || _a === void 0 ? void 0 : _a.default;
        if (!isNullOrUndefined(localStorageVariant) && !isLocalStorageDefault) {
          return {
            variant: convertVariant(localStorageVariant),
            source: VariantSource.LocalStorage,
            hasDefaultVariant: false
          };
        } else if (isLocalStorageDefault) {
          defaultSourceVariant = {
            variant: convertVariant(localStorageVariant),
            source: VariantSource.LocalStorage,
            hasDefaultVariant: true
          };
        }
        if (!isNullOrUndefined(fallback)) {
          return {
            variant: convertVariant(fallback),
            source: VariantSource.FallbackInline,
            hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
          };
        }
        var initialVariant = this.config.initialVariants[key];
        if (!isNullOrUndefined(initialVariant)) {
          return {
            variant: convertVariant(initialVariant),
            source: VariantSource.SecondaryInitialVariants,
            hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
          };
        }
        var fallbackVariant = convertVariant(this.config.fallbackVariant);
        var fallbackSourceVariant = {
          variant: fallbackVariant,
          source: VariantSource.FallbackConfig,
          hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
        };
        if (!isNullUndefinedOrEmpty(fallbackVariant)) {
          return fallbackSourceVariant;
        }
        return defaultSourceVariant;
      };
      ExperimentClient2.prototype.initialVariantsVariantAndSource = function(key, fallback) {
        var _a;
        var defaultSourceVariant = {};
        var initialVariantsVariant = this.config.initialVariants[key];
        if (!isNullOrUndefined(initialVariantsVariant)) {
          return {
            variant: convertVariant(initialVariantsVariant),
            source: VariantSource.InitialVariants,
            hasDefaultVariant: false
          };
        }
        var localStorageVariant = this.variants.get(key);
        var isLocalStorageDefault = (_a = localStorageVariant === null || localStorageVariant === void 0 ? void 0 : localStorageVariant.metadata) === null || _a === void 0 ? void 0 : _a.default;
        if (!isNullOrUndefined(localStorageVariant) && !isLocalStorageDefault) {
          return {
            variant: convertVariant(localStorageVariant),
            source: VariantSource.LocalStorage,
            hasDefaultVariant: false
          };
        } else if (isLocalStorageDefault) {
          defaultSourceVariant = {
            variant: convertVariant(localStorageVariant),
            source: VariantSource.LocalStorage,
            hasDefaultVariant: true
          };
        }
        if (!isNullOrUndefined(fallback)) {
          return {
            variant: convertVariant(fallback),
            source: VariantSource.FallbackInline,
            hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
          };
        }
        var fallbackVariant = convertVariant(this.config.fallbackVariant);
        var fallbackSourceVariant = {
          variant: fallbackVariant,
          source: VariantSource.FallbackConfig,
          hasDefaultVariant: defaultSourceVariant.hasDefaultVariant
        };
        if (!isNullUndefinedOrEmpty(fallbackVariant)) {
          return fallbackSourceVariant;
        }
        return defaultSourceVariant;
      };
      ExperimentClient2.prototype.fetchInternal = function(user, timeoutMillis, retry, options) {
        return __awaiter2(this, void 0, void 0, function() {
          var variants, e_3;
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!this.apiKey) {
                  throw Error("Experiment API key is empty");
                }
                this.debug("[Experiment] Fetch all: retry=".concat(retry));
                if (retry) {
                  this.stopRetries();
                }
                _a.label = 1;
              case 1:
                _a.trys.push([1, 4, , 5]);
                return [4, this.doFetch(user, timeoutMillis, options)];
              case 2:
                variants = _a.sent();
                return [4, this.storeVariants(variants, options)];
              case 3:
                _a.sent();
                return [2, variants];
              case 4:
                e_3 = _a.sent();
                if (retry && this.shouldRetryFetch(e_3)) {
                  void this.startRetries(user, options);
                }
                throw e_3;
              case 5:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      ExperimentClient2.prototype.doFetch = function(user, timeoutMillis, options) {
        return __awaiter2(this, void 0, void 0, function() {
          var results, variants, _a, _b, key;
          var e_4, _c;
          return __generator2(this, function(_d) {
            switch (_d.label) {
              case 0:
                return [4, this.addContextOrWait(user, 1e4)];
              case 1:
                user = _d.sent();
                this.debug("[Experiment] Fetch variants for user: ", user);
                return [4, this.evaluationApi.getVariants(user, __assign3({ timeoutMillis }, options))];
              case 2:
                results = _d.sent();
                variants = {};
                try {
                  for (_a = __values2(Object.keys(results)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    key = _b.value;
                    variants[key] = convertEvaluationVariantToVariant(results[key]);
                  }
                } catch (e_4_1) {
                  e_4 = { error: e_4_1 };
                } finally {
                  try {
                    if (_b && !_b.done && (_c = _a.return))
                      _c.call(_a);
                  } finally {
                    if (e_4)
                      throw e_4.error;
                  }
                }
                this.debug("[Experiment] Received variants: ", variants);
                return [2, variants];
            }
          });
        });
      };
      ExperimentClient2.prototype.doFlags = function() {
        return __awaiter2(this, void 0, void 0, function() {
          var flags;
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, this.flagApi.getFlags({
                  libraryName: "experiment-js-client",
                  libraryVersion: version2,
                  timeoutMillis: this.config.fetchTimeoutMillis
                })];
              case 1:
                flags = _a.sent();
                this.flags.clear();
                this.flags.putAll(flags);
                try {
                  this.flags.store();
                } catch (e) {
                }
                this.mergeInitialFlagsWithStorage();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      ExperimentClient2.prototype.storeVariants = function(variants, options) {
        return __awaiter2(this, void 0, void 0, function() {
          var failedFlagKeys, _loop_1, this_1, key, key;
          return __generator2(this, function(_a) {
            failedFlagKeys = options && options.flagKeys ? options.flagKeys : [];
            if (failedFlagKeys.length === 0) {
              this.variants.clear();
            }
            _loop_1 = function(key2) {
              failedFlagKeys = failedFlagKeys.filter(function(flagKey) {
                return flagKey !== key2;
              });
              this_1.variants.put(key2, variants[key2]);
            };
            this_1 = this;
            for (key in variants) {
              _loop_1(key);
            }
            for (key in failedFlagKeys) {
              this.variants.remove(key);
            }
            try {
              this.variants.store();
            } catch (e) {
            }
            this.debug("[Experiment] Stored variants: ", variants);
            return [
              2
              /*return*/
            ];
          });
        });
      };
      ExperimentClient2.prototype.startRetries = function(user, options) {
        return __awaiter2(this, void 0, void 0, function() {
          var _this = this;
          return __generator2(this, function(_a) {
            this.debug("[Experiment] Retry fetch");
            this.retriesBackoff = new Backoff(fetchBackoffAttempts, fetchBackoffMinMillis, fetchBackoffMaxMillis, fetchBackoffScalar);
            void this.retriesBackoff.start(function() {
              return __awaiter2(_this, void 0, void 0, function() {
                return __generator2(this, function(_a2) {
                  switch (_a2.label) {
                    case 0:
                      return [4, this.fetchInternal(user, fetchBackoffTimeout, false, options)];
                    case 1:
                      _a2.sent();
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            });
            return [
              2
              /*return*/
            ];
          });
        });
      };
      ExperimentClient2.prototype.stopRetries = function() {
        if (this.retriesBackoff) {
          this.retriesBackoff.cancel();
        }
      };
      ExperimentClient2.prototype.addContext = function(user) {
        var _a, _b;
        var providedUser = (_a = this.userProvider) === null || _a === void 0 ? void 0 : _a.getUser();
        var mergedUserProperties = __assign3(__assign3({}, user === null || user === void 0 ? void 0 : user.user_properties), providedUser === null || providedUser === void 0 ? void 0 : providedUser.user_properties);
        return __assign3(__assign3(__assign3({ library: "experiment-js-client/".concat(version2) }, (_b = this.userProvider) === null || _b === void 0 ? void 0 : _b.getUser()), user), { user_properties: mergedUserProperties });
      };
      ExperimentClient2.prototype.addContextOrWait = function(user, ms) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!(this.userProvider instanceof DefaultUserProvider))
                  return [3, 2];
                if (!(this.userProvider.userProvider instanceof ConnectorUserProvider))
                  return [3, 2];
                return [4, this.userProvider.userProvider.identityReady(ms)];
              case 1:
                _a.sent();
                _a.label = 2;
              case 2:
                return [2, this.addContext(user)];
            }
          });
        });
      };
      ExperimentClient2.prototype.sourceVariants = function() {
        if (this.config.source == Source.LocalStorage) {
          return this.variants.getAll();
        } else if (this.config.source == Source.InitialVariants) {
          return this.config.initialVariants;
        }
      };
      ExperimentClient2.prototype.secondaryVariants = function() {
        if (this.config.source == Source.LocalStorage) {
          return this.config.initialVariants;
        } else if (this.config.source == Source.InitialVariants) {
          return this.variants.getAll();
        }
      };
      ExperimentClient2.prototype.exposureInternal = function(key, sourceVariant) {
        var _a, _b, _c, _d, _e, _f;
        this.legacyExposureInternal(key, sourceVariant.variant, sourceVariant.source);
        var exposure = { flag_key: key };
        var fallback = isFallback(sourceVariant.source);
        if (fallback && !sourceVariant.hasDefaultVariant) {
          return;
        }
        if ((_a = sourceVariant.variant) === null || _a === void 0 ? void 0 : _a.expKey) {
          exposure.experiment_key = (_b = sourceVariant.variant) === null || _b === void 0 ? void 0 : _b.expKey;
        }
        var metadata = (_c = sourceVariant.variant) === null || _c === void 0 ? void 0 : _c.metadata;
        if (!fallback && !(metadata === null || metadata === void 0 ? void 0 : metadata.default)) {
          if ((_d = sourceVariant.variant) === null || _d === void 0 ? void 0 : _d.key) {
            exposure.variant = sourceVariant.variant.key;
          } else if ((_e = sourceVariant.variant) === null || _e === void 0 ? void 0 : _e.value) {
            exposure.variant = sourceVariant.variant.value;
          }
        }
        if (metadata)
          exposure.metadata = metadata;
        (_f = this.exposureTrackingProvider) === null || _f === void 0 ? void 0 : _f.track(exposure);
      };
      ExperimentClient2.prototype.legacyExposureInternal = function(key, variant, source) {
        var _a, _b, _c, _d, _e;
        if (this.analyticsProvider) {
          var user = this.addContext(this.getUser());
          var event_1 = exposureEvent(user, key, variant, source);
          if (isFallback(source) || !(variant === null || variant === void 0 ? void 0 : variant.value)) {
            (_b = (_a = this.analyticsProvider) === null || _a === void 0 ? void 0 : _a.unsetUserProperty) === null || _b === void 0 ? void 0 : _b.call(_a, event_1);
          } else if (variant === null || variant === void 0 ? void 0 : variant.value) {
            (_d = (_c = this.analyticsProvider) === null || _c === void 0 ? void 0 : _c.setUserProperty) === null || _d === void 0 ? void 0 : _d.call(_c, event_1);
            (_e = this.analyticsProvider) === null || _e === void 0 ? void 0 : _e.track(event_1);
          }
        }
      };
      ExperimentClient2.prototype.debug = function(message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          optionalParams[_i - 1] = arguments[_i];
        }
        if (this.config.debug) {
          console.debug.apply(console, __spreadArray2([message], __read2(optionalParams), false));
        }
      };
      ExperimentClient2.prototype.shouldRetryFetch = function(e) {
        if (e instanceof FetchError) {
          return e.statusCode < 400 || e.statusCode >= 500 || e.statusCode === 429;
        }
        return true;
      };
      return ExperimentClient2;
    }()
  );
  var instances = {};
  var initialize = function(apiKey, config) {
    var instanceName = (config === null || config === void 0 ? void 0 : config.instanceName) || Defaults.instanceName;
    var instanceKey = "".concat(instanceName, ".").concat(apiKey);
    var connector = AnalyticsConnector.getInstance(instanceName);
    if (!instances[instanceKey]) {
      config = __assign3(__assign3({}, config), { userProvider: new DefaultUserProvider(connector.applicationContextProvider, config === null || config === void 0 ? void 0 : config.userProvider) });
      instances[instanceKey] = new ExperimentClient(apiKey, config);
    }
    return instances[instanceKey];
  };
  var initializeWithAmplitudeAnalytics = function(apiKey, config) {
    var instanceName = (config === null || config === void 0 ? void 0 : config.instanceName) || Defaults.instanceName;
    var instanceKey = "".concat(instanceName, ".").concat(apiKey);
    var connector = AnalyticsConnector.getInstance(instanceName);
    if (!instances[instanceKey]) {
      config = __assign3({ userProvider: new DefaultUserProvider(connector.applicationContextProvider, new ConnectorUserProvider(connector.identityStore)), exposureTrackingProvider: new ConnectorExposureTrackingProvider(connector.eventBridge) }, config);
      instances[instanceKey] = new ExperimentClient(apiKey, config);
      if (config.automaticFetchOnAmplitudeIdentityChange) {
        connector.identityStore.addIdentityListener(function() {
          instances[instanceKey].fetch();
        });
      }
    }
    return instances[instanceKey];
  };
  var Experiment = {
    initialize,
    initializeWithAmplitudeAnalytics
  };
  var StubExperimentClient = (
    /** @class */
    function() {
      function StubExperimentClient2() {
      }
      StubExperimentClient2.prototype.getUser = function() {
        return {};
      };
      StubExperimentClient2.prototype.start = function(user) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a) {
            return [
              2
              /*return*/
            ];
          });
        });
      };
      StubExperimentClient2.prototype.stop = function() {
      };
      StubExperimentClient2.prototype.setUser = function(user) {
      };
      StubExperimentClient2.prototype.fetch = function(user) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a) {
            return [2, this];
          });
        });
      };
      StubExperimentClient2.prototype.getUserProvider = function() {
        return null;
      };
      StubExperimentClient2.prototype.setUserProvider = function(uerProvider) {
        return this;
      };
      StubExperimentClient2.prototype.variant = function(key, fallback) {
        return Defaults.fallbackVariant;
      };
      StubExperimentClient2.prototype.all = function() {
        return {};
      };
      StubExperimentClient2.prototype.clear = function() {
      };
      StubExperimentClient2.prototype.exposure = function(key) {
      };
      return StubExperimentClient2;
    }()
  );

  // src/tracking/experiment.js
  function initExperiment() {
    async function experimentCode() {
      try {
        const isProd = new URL(window.location.href).host === "modular-prod-dev.webflow.io";
        const apiKey = isProd ? "client-ejPfaOrUEtTflNBKKrNtLWx5IB1QbAmy" : "client-fhQfFdzMgOCoCAWmoV0W8KvnbhFe2dUu";
        const experiment = Experiment.initializeWithAmplitudeAnalytics(apiKey);
        await experiment.fetch();
        Object.entries(experiment.variants.getAll()).forEach(([key, val]) => {
          if (val.payload) {
            experiment.exposure(key);
            const hideStr = val.payload.hide ? `.${val.payload.hide} { display: none !important; }
` : "";
            const showStr = val.payload.hide ? `.${val.payload.show} { display: flex !important; }` : "";
            const style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = hideStr + showStr;
            document.getElementsByTagName("head")[0].appendChild(style);
          }
        });
      } catch (e) {
      }
      if (document.querySelector(".section_hp-hero")) {
        document.querySelector(".section_hp-hero").style.opacity = 1;
      }
    }
    waitUntil(() => window.amplitude).then(() => {
      const isProd = location.href.indexOf("www.modular.com") !== 0;
      const sessionReplayTracking = window.sessionReplay.plugin({ sampleRate: isProd ? 0.1 : 0 });
      window.amplitude.add(sessionReplayTracking);
      window.amplitude.init(
        isProd ? "3878a0571d1575870a7d0a5f7e644d23" : "d8bf208ebdc1b1000d38da8b826a74c4"
      );
      experimentCode();
    });
  }

  // src/index.js
  $(document).ready(function() {
    initScrollToggle();
    initNav();
    initTabs();
    initSwipers();
    initModalBasic();
    initMojoAnimations();
    initMaxReplacements();
    initAnims();
    initAmplitude();
    setupHookForFormSubmission();
    initExperiment();
    installAndScrollAnchorTags();
    initCheckSectionThemeScroll();
  });
  $(document).ready(function() {
    const ctaButton = document.querySelector(".cta-button");
    const contentSection = document.querySelector(".section-content-blog-template");
    if (ctaButton && contentSection) {
      let updateCTAVisibility2 = function() {
        if (contentSectionVisible && !nextSiblingVisible) {
          ctaButton.style.opacity = 1;
        } else {
          ctaButton.style.opacity = 0;
        }
      };
      var updateCTAVisibility = updateCTAVisibility2;
      ctaButton.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      ctaButton.style.opacity = 0;
      let contentSectionVisible = false;
      let nextSiblingVisible = false;
      const contentObserver = new IntersectionObserver((entries) => {
        contentSectionVisible = entries[0].isIntersecting;
        updateCTAVisibility2();
      });
      contentObserver.observe(contentSection);
      const nextSibling = contentSection.nextElementSibling;
      if (nextSibling) {
        const nextSiblingObserver = new IntersectionObserver((entries) => {
          nextSiblingVisible = entries[0].isIntersecting;
          updateCTAVisibility2();
        });
        nextSiblingObserver.observe(nextSibling);
      }
    }
  });
})();
//# sourceMappingURL=index.js.map
