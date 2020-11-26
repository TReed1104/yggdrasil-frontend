import Desk from './Desk.js'

export default class Room {
    constructor(name, width, height, jsonData) {
        // Parse the json data
        this.name = name;
        this.width = width;
        this.height = height;
        this.map = this.ParseMapData(width, height, jsonData);
    }
    ParseMapData(width, height, rawMapJSON) {
        // Converts the one-dimensional json array to a 2D JS array
        let map = [];
        for (let y = 0; y < height; y++) {
            let rowData = [];
            for (let x = 0; x < width; x++) {
                // (I * N) + J
                rowData.push(new Desk(rawMapJSON[(y * width) + x], "", ""));
            }
            map.push(rowData);
        }
        return map;
    }
    GetDeskAtPosition(x, y) {
        // Check the y is in bounds
        if (this.map[y] == null) {
            return null;
        }
        // check the x is in bounds
        if (this.map[y][x] == null) {
            return null;
        }
        // return the cell value
        return this.map[y][x];
    }
    GetDeskByID(deskNumber) {
        let rowIndex = -1;
        let columnIndex = -1;

        this.map.find(function(row, index) {
            let indexOfDesk = row.find(function(desk, index) {
                if (desk.deskNumber == deskNumber) {
                    columnIndex = index;
                    return desk;
                }
                else {
                    return null;
                }
            }, this);

            rowIndex = index;
            return indexOfDesk;
        }, this);
        return this.map[rowIndex][columnIndex];
    }
}