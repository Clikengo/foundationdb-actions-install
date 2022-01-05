/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 442:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(442);
const os = __nccwpck_require__(37);
const { execSync } = __nccwpck_require__(81);
const { mkdirSync, readFileSync, writeFileSync } = __nccwpck_require__(147);

function exec(cmd) {
    console.info(`> ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

try {
    const version = core.getInput('version');
    console.log(`Installing foundationdb ${version} (${os.platform()})!`);
    let base_url = `https://github.com/apple/foundationdb/releases/tag/${version}`;
    switch (os.platform()) {
        case 'linux': {
            let client_url = `${base_url}/foundationdb-clients_${version}-1_amd64.deb`;
            exec(`curl -O ${client_url}`);
            exec(`sudo dpkg -i foundationdb-clients_${version}-1_amd64.deb`);

            let server_url = `${base_url}/foundationdb-server_${version}-1_amd64.deb`;
            exec(`curl -O ${server_url}`);
            exec(`sudo dpkg -i foundationdb-server_${version}-1_amd64.deb`);
            break;
        }
        case 'darwin': {
            let url = `${base_url}/FoundationDB-${version}.pkg`;
            exec(`curl -O ${url}`);
            exec(`sudo installer -pkg FoundationDB-${version}.pkg -target /`);
            break;
        }
    }

} catch (error) {
    core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;