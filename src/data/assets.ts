export default {
    bundles: [
        {
            name: "load-screen",
            assets: [
                { alias: "progress_bar", src: "sprites/progress_bar.png" },
                { alias: "progress_bar_fill", src: "sprites/progress_bar_fill.png" }
            ]
        },
        {
            name: "game-screen",
            assets: [
                { alias: "complete_collection_en", src:"sprites/complete_collection_en.webp"},
            ]
        }
    ],
    models: [],
    fonts: [
        { alias: "grobold", src: "fonts/grobold.ttf" }
    ],
    sounds: [],
    textures: [],
    "spine": [
        {
            "alias": "pretty_woman",
            "atlas": "spines/pretty_woman.atlas",
            "texture": "spines/pretty_woman.png",
            "json": "spines/pretty_woman.json",
            "imageName": "pretty_woman.png"
        },
    ]
};
