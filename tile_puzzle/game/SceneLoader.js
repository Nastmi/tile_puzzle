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
                "on_grid": false,
                "correct": false,
                "grid": null,
                "type": "tile",
                "mesh": 0,
                "texture": curLength+i,
                "aabb": {
                    "min": [-0.5, -0.02, -0.5],
                    "max": [0.5, 0.02, 0.5]
                },
                "translation": scene.pLocations[randIdx],
                "scale": [0.5, 0.02, 0.5]
            })
            //Store the selected location for later.
            scene.locations.push(scene.pLocations[randIdx]);
            //Remove location from possible choices
            scene.pLocations.splice(randIdx, 1);
            //Add a grid piece for this node
            let baseLoc = scene.grid_location.slice();
            let x = i%3;
            let y = Math.floor(i/3);
            baseLoc[0] += x;
            baseLoc[2] += y;
            scene.nodes.push({
                "id": i,
                "type": "grid_piece",
                "filled": false,
                "correct": false,
                "mesh": 0,
                "texture": 5,
                "aabb": {
                    "min": [-0.5, -0.03, -0.5],
                    "max": [0.5, 0.03, 0.5]
                },
                "translation": baseLoc,
                "scale": [0.5, 0.03, 0.5],
                "rotation": [0, 1.57, 0]
            })
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
