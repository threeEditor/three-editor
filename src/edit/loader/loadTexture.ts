import { Texture, TextureLoader } from "three";

let loader: TextureLoader;
export function loadTexture(url: string): Promise<Texture | null> {
    if(!loader) loader = new TextureLoader();
    return new Promise((resolve) => {
        loader.load(url, (texture) => {
            return resolve(texture);
        }, 
        () => {
            // onProgress
        },
        (error) => {
            // onError
            console.warn(`Texture Loar Error: ${error}`);
            return resolve(null);
        })
    })
}