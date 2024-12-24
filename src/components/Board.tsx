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

export type Swine = {
    position: Position,
    meeped: boolean
}

export class BoardInstance {
    data: TileData[][];
    swines: Swine[];
    previousSwinePositions: Position[][];
    constructor (data: TileData[][], swines: Swine[]) {
        this.data = data;
        this.swines = swines;
        this.previousSwinePositions = [];
        for (let i = 0; i < swines.length; i++) {
            this.previousSwinePositions.push([]);
        }
    }

    moveSwine(swine: number): void {
        if (this.swines[swine].meeped) return;

        let direction = directions[Math.floor(Math.random() * directions.length)];
        let samePosition = (pos: Position) => pos.row === this.swines[swine].position.row + direction[0] && pos.column === this.swines[swine].position.column + direction[1];
        while (!(this.data[this.swines[swine].position.row + direction[0]] && this.data[this.swines[swine].position.row + direction[0]][this.swines[swine].position.column + direction[1]])
                || this.data[this.swines[swine].position.row + direction[0]][this.swines[swine].position.column + direction[1]].revealed
                || (this.swines.map(swine => swine.position).filter(samePosition).length !== 0 && direction[0] !== 0 && direction[1] !== 0)) {

            // bias against repetitivity
            if (this.previousSwinePositions[swine].findIndex(samePosition) !== -1) {
                if (Math.random() < 0.9) {
                    continue;
                }
            }
            direction = directions[Math.floor(Math.random() * directions.length)];
        }
        this.previousSwinePositions[swine].splice(0, 0, this.swines[swine].position);
        if (this.previousSwinePositions[swine].length > 10) {
            this.previousSwinePositions[swine].pop();
        }
        this.swines[swine].position = {row: this.swines[swine].position.row + direction[0], column: this.swines[swine].position.column + direction[1]};
    }
}

export type BoardProps = {
    board: BoardInstance,
    functions: Functions
}



const directions: number[][] = [];
for (let a of [-1,0,1]) for (let b of [-1,0,1]) directions.push([a,b]);


export default function Board({ board, functions }: BoardProps) {
    let key = 0;
    return (
        <div className="board" style={{zoom: Math.round(25 / board.data.length * 100) + "%"}}>
            {board.data.map(row => row.map(tile => <Tile board={board} position={tile.position} functions={functions} key={key++}/>))}
        </div>
    )
}