import React, { useEffect, useRef, useState } from "react";
import Board, { BoardInstance, Swine, TileData } from "./components/Board.tsx";

export type Functions = {
    click: Function,
    meepSwine: Function
}

function makeBoard(size: number, swineCount: number): BoardInstance {
    if (size < 5 || swineCount < 1) {
        throw new Error("hey stop messing with stuff");
    }
    const data: TileData[][] = [];
    for (let i = 0; i < size; i++) {
        let toAdd: TileData[] = [];
        for (let j = 0; j < size; j++) {
            toAdd.push({ revealed: false, position: {row: i, column: j} });
        }
        data.push(toAdd);
    }
    const swines: Swine[] = []
    for (let i = 0; i < swineCount; i++) {
        let swine: Swine = {position: {row: Math.floor(Math.random() * data.length), column: Math.floor(Math.random() * data[0].length)}, meeped: false};
        let sameSwine = (s: Swine) => JSON.stringify(s) === JSON.stringify(swine); // Why use JSON.stringify instead of just checking if the values are the same? Good question! It's because attempting to do the former somehow eats up the entirety of my memory, and this is an easier solution than figuring out why.
        while (swines.findIndex(sameSwine) !== -1) {
            swine = {position: {row: Math.floor(Math.random() * data.length), column: Math.floor(Math.random() * data[0].length)}, meeped: false};
        }
        swines.push(swine);
    }
    return new BoardInstance(data, swines);
}


export default function Main() {
    // i love usestates
    const [clicks, setClicks] = useState(0);
    const [highScore, setHighScore] = useState(Infinity); 
    const [restart, setRestart] = useState(false);
    const [meepedSwines, setMeepedSwines] = useState(0);
    const [boardSize, setBoardSize] = useState(25);
    const [swineCount, setSwineCount] = useState(1);
    const [board, setBoard] = useState(makeBoard(25,1));
    
    const boardSizeRef = useRef<HTMLInputElement>(null);
    const swineCountRef = useRef<HTMLInputElement>(null);

    const reinitializeBoard = () => {
        setBoard(makeBoard(boardSize, swineCount));
    }

    useEffect(reinitializeBoard, [boardSize, swineCount])

    useEffect(() => {
        if (meepedSwines === swineCount) {
            setRestart(true);
            setHighScore(clicks < highScore ? clicks : highScore);
        }
    }, [meepedSwines, clicks, highScore, swineCount])

    return (
        <>
            <div className="center">
                <h1>Swinemeeper!</h1>
                {!clicks ?
                    <>
                        <div className="row">
                            <label htmlFor="boardsize">Board Size: {boardSize}</label><input type="range" id="boardsize" defaultValue="25" min="5" max="100" ref={boardSizeRef} onChange={() => {setBoardSize(parseInt(boardSizeRef.current!.value)); setSwineCount(Math.min(swineCount, boardSize)); setHighScore(Infinity); reinitializeBoard()}}/>
                        </div>
                        <div className="row">
                            <label htmlFor="swinecount">Swine Count: {swineCount}</label><input type="range" id="swinecount" defaultValue="1" min="1" max={Math.min(boardSize, 25)} ref={swineCountRef} onChange={() => {setSwineCount(parseInt(swineCountRef.current!.value)); setHighScore(Infinity); reinitializeBoard()}}/>
                        </div>
                    </>
                : <p><b>{clicks}</b> Meep{clicks !== 1 ? "s" : ""}</p>}
                {restart ?
                    <div className="row">
                        <p><b>You win! </b></p><button className="restart" onClick={() => {reinitializeBoard(); setClicks(0); setMeepedSwines(0); setRestart(false)}}>Play again?</button>
                    </div> 
                : <></>}
                {highScore !== Infinity ?
                    <p>Best score: <b>{highScore}</b> meeps</p>
                : <></>}
            </div>
            <Board board={board} functions={restart ? {click: () => {}, meepSwine: () => {}} : {click: () => setClicks(clicks+1), meepSwine: () => setMeepedSwines(meepedSwines + 1)}}></Board>
        </>
    )
}