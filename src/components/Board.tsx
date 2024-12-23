import React from "react";
import Tile from "./Tile.tsx";
import { Functions } from "../Main.tsx";

export type Position = {
    row: number,
    column: number
}
export type TileData = {
    revealed: boolean,
    position: Position
}

export class BoardInstance {
    data: TileData[][];
    swine: Position;
    previousSwinePositions: Position[];
    constructor (data: TileData[][], swine: Position) {
        this.data = data;
        this.swine = swine;
        this.previousSwinePositions = [];
    }

    moveSwine(): void {
        let direction = directions[Math.floor(Math.random() * directions.length)];
        let filter = (pos: Position) => pos.row === this.swine.row + direction[0] && pos.column === this.swine.column + direction[1];
        while (!(this.data[this.swine.row + direction[0]] && this.data[this.swine.row + direction[0]][this.swine.column + direction[1]]) || this.data[this.swine.row + direction[0]][this.swine.column + direction[1]].revealed) {
            // bias against repetitivity
            if (this.previousSwinePositions.filter(filter).length) {
                if (Math.random() < 0.9) {
                    continue;
                }
            }
            direction = directions[Math.floor(Math.random() * directions.length)];
        }
        this.previousSwinePositions.splice(0, 0, this.swine);
        if (this.previousSwinePositions.length > 10) {
            this.previousSwinePositions.pop();
        }
        this.swine = {row: this.swine.row + direction[0], column: this.swine.column + direction[1]};
    }

}

export type BoardProps = {
    board: BoardInstance,
    functions: Functions
}



const directions: number[][] = [];
for (let a of [-1,0,1]) for (let b of [-1,0,1]) directions.push([a,b]);


export default function Board({ board, functions }: BoardProps) {
    console.log(board.swine);
    let key = 0;
    return (
        <div className="board">
            {board.data.map(row => row.map(tile => <Tile board={board} position={tile.position} functions={functions} key={key++}/>))}
        </div>
    )
}