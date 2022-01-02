export class SceneLoader {

    async loadScene(uri) {
        const scene = await this.loadJson(uri);
        let curLength = scene.textures.length;
        //Add tiles from directory. Choose random locations from a list of possible locations. Num of tiles and locations are stored in the json.
        for(let i = 0; i < scene.num; i++){
            //Get index of random location.
            let randIdx = Math.floor(Math.random()*scene.pLocations.length);
            scene.textures.push("../common/images/puzzle_"+scene.id+"/"+i+".png");
            scene.nodes.push({
                "id": i,
                "type": "tile",
                "mesh": 0,
                "texture": curLength+i,
                "aabb": {
                    "min": [-0.5, -0.05, -0.5],
                    "max": [0.5, 0.05, 0.5]
                },
                "translation": scene.pLocations[randIdx],
                "scale": [0.5, 0.05, 0.5]
            })
            //Store the selected location for later.
            scene.locations.push(scene.pLocations[randIdx]);
            //Remove location from possible choices
            scene.pLocations.splice(randIdx, 1);
        }
        const images = scene.textures.map(uri => this.loadImage(uri));
        const meshes = scene.meshes.map(uri => this.loadJson(uri));
        scene.textures = await Promise.all(images);
        scene.meshes = await Promise.all(meshes);

        return scene;
    }

    loadImage(uri) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', reject);
            image.src = uri;
        });
    }

    loadJson(uri) {
        return fetch(uri).then(response => response.json());
    }

}
