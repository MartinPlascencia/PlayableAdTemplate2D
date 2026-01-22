import { Assets, AssetsManifest } from 'pixi.js';

import manifestJson from '../data/assets';
import sound from '../utils/Sound';

import spineJson from '../assets/spines/pretty_woman.json';

// Add webpack require.context type declaration
declare const require: {
    context(path: string, deep?: boolean, filter?: RegExp): {
        (id: string): any;
        keys(): string[];
    };
};

type GameAssets = {
    bundles: Bundle[];
    models: AssetEntry[];
    fonts: AssetEntry[];
    sounds: AssetEntry[];
    textures: AssetEntry[];
}

type Bundle = {
    name: string;
    assets: AssetEntry[];
}
type AssetEntry = {
    alias: string;
    src: string;
};

type SpineAssetEntry = {
    alias: string;
    atlas: string;
    texture: string;
    skeleton?: string;
    json?: string;
    imageName: string;
};

export default class AssetsInlineHelper {
    private _manifest!: AssetsManifest;
    private _fontEntries: AssetEntry[] = [];
    private _soundEntries: AssetEntry[] = [];
    private _spineAssets: SpineAssetEntry[] = [];
    private _gameAssets: GameAssets = manifestJson as GameAssets;

    constructor() {
        this._createManifestFromJson();
    }

    private _createManifestFromJson(): void {
        const assetContext = require.context('../assets', true, /\.(png|jpe?g|gif|svg|webp|glb|ttf|otf|mp3|wav|ogg|atlas|json|skel)$/i);
        this._manifest = {
            bundles: (this._gameAssets.bundles || []).map((bundle: Bundle) => ({
                name: bundle.name,
                assets: (bundle.assets || []).map((asset: AssetEntry) => ({
                    alias: asset.alias,
                    src: assetContext(`./${asset.src}`),
                })),
            })),
        };

        this._fontEntries = (this._gameAssets.fonts || []).map((font: AssetEntry) => ({
            alias: font.alias,
            src: assetContext(`./${font.src}`),
        }));

        this._soundEntries = (this._gameAssets.sounds || []).map((sound: AssetEntry) => ({
            alias: sound.alias,
            src: assetContext(`./${sound.src}`),
        }));

        this._spineAssets = manifestJson.spine.map((entry: SpineAssetEntry) => ({
            ...entry,
            atlas: assetContext(`./${entry.atlas}`),
            texture: assetContext(`./${entry.texture}`),
            skeleton: entry.skeleton
                ? assetContext(`./${entry.skeleton}`)
                : undefined,
            json: entry.json
                ? assetContext(`./${entry.json}`)
                : undefined,
        }));
    }

    private _normalizeToUrl(src: string): string {
        // Already a URL (http, data, blob)
        if (/^(https?:|data:|blob:)/.test(src)) {
            return src;
        }

        // Inline JSON content → convert to Blob URL
        const blob = new Blob([src], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }

    public async loadSpineAssets(): Promise<void> {
        for (const spine of this._spineAssets) {
            await this._loadSpineAssets(spine);
        }
    }

    private async _loadSpineAssets({alias, atlas, texture, skeleton, json, imageName}: SpineAssetEntry): Promise<void> {
        const textureBase64 = await Assets.load({
            alias: `${alias}_texture`,
            parser: 'loadTextures',
            src: texture,
        });

        Assets.add({
            alias: `${alias}_atlas`,
            parser: 'spineTextureAtlasLoader',
            src: atlas,
            data: { images: { [imageName]: textureBase64.source } },
        });

        Assets.add({
            alias: `${alias}_json`,
            parser: skeleton ? 'spineSkeletonLoader' : 'loadJson',
            src: this._normalizeToUrl(skeleton ?? json!),
        }); 

        await Assets.load([`${alias}_json`, `${alias}_atlas`]);
    }

    public async init(): Promise<void> {
        await Promise.all([
            this.loadFonts(),
            this.loadSounds()
        ]);
    }

    public async loadBundleByName(bundleName: string, progressCallback?: (progress: number) => void): Promise<void> {
        const bundle = this._manifest.bundles.find(b => b.name === bundleName);
        if (!bundle) {
            console.warn(`Bundle "${bundleName}" not found in manifest.`);
            return;
        }

        Assets.addBundle(bundle.name, bundle.assets);
        try {
            await Assets.loadBundle(bundleName, progress => {
                progressCallback?.(progress);
            });
        } catch (error) {
            console.error(`Error loading bundle: ${bundleName}`, error);
            throw error;
        }
    }

    public async loadFonts(): Promise<void> {
        await Promise.all(this._fontEntries.map(font => this._loadFont(font.alias, font.src)));
    }

    private async _loadFont(name: string, url: string): Promise<void> {
        try {
            const font = new FontFace(name, `url(${url})`);
            await font.load();
            document.fonts.add(font);
            console.log(`Font "${name}" loaded`);
        } catch (error) {
            console.error(`Error loading font "${name}" from "${url}"`, error);
            throw error;
        }
    }

    public async loadSounds(): Promise<void> {
        await Promise.all(this._soundEntries.map(async (currentSound) => {
            try {
                await sound.loadSound(currentSound.alias, currentSound.src);
            } catch (error) {
                console.error(`Error loading sound "${currentSound.alias}" from "${currentSound.src}"`, error);
                throw error;
            }
        }));
    }
}