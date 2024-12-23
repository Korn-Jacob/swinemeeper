import React, { useState } from "react";
import Board, { BoardInstance, Position, TileData } from "./components/Board.tsx";

export type Functions = {
    click: Function,
    setHighScore: Function
}

function makeBoard(): BoardInstance {
    const data: TileData[][] = [];
    for (let i = 0; i < 25; i++) {
        let toAdd: TileData[] = [];
        for (let j = 0; j < 25; j++) {
            toAdd.push({ revealed: false, position: {row: i, column: j} });
        }
        data.push(toAdd);
    }
    const swine: Position = {row: Math.floor(Math.random() * data.length), column: Math.floor(Math.random() * data[0].length)}
    return new BoardInstance(data, swine);
}

let board = makeBoard();


export default function Main() {
    const [clicks, setClicks] = useState(0);
    const [highScore, setHighScore] = useState(Infinity); 
    const [restart, setRestart] = useState(false);

    return (
        <>
            <div className="center">
                <h1>Swinemeeper!</h1>
                {restart ?
                    <div className="row">
                        <p><b>You win! </b></p><button className="restart" onClick={() => {board = makeBoard(); setClicks(0); setRestart(false)}}>Play again?</button>
                    </div> 
                : <></>}
                {highScore !== Infinity ?
                    <p>Best score: <b>{highScore}</b> meeps.</p>
                : <></>}
                <p><b>{clicks}</b> Meep{clicks !== 1 ? "s" : ""}</p>
            </div>
            <Board board={board} functions={restart ? {click: () => {}, setHighScore: () => {}} : {click: () => setClicks(clicks+1), setHighScore: () => {setHighScore(clicks < highScore ? clicks : highScore); setRestart(true)}}}></Board>
        </>
    )
}