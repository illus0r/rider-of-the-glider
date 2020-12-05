"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const gif_player_1 = require("./gif-player");
class GifLoader {
    constructor() {
        this.cache = {};
    }
    update() {
        Object.keys(this.cache).forEach(k => {
            const cache = this.cache[k];
            if (cache) {
                cache.gif.update();
                cache.texture.needsUpdate = true;
            }
        });
    }
    load(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.cache[url];
            if (cache) {
                return cache.texture;
            }
            const gif = yield gif_player_1.default.create(url, 1);
            const canvas = gif.getCanvas();
            const texture = new THREE.Texture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            this.cache[url] = { name, texture, gif };
            return texture;
        });
    }
    unload(url) {
        this.cache[url] = null;
    }
}
exports.default = GifLoader;
//# sourceMappingURL=gif-loader.js.map