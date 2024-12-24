import React, { useEffect, useState } from "react";
import { BoardInstance, Position, Swine, TileData } from "./Board";
import { Functions } from "../Main";

type SwineDistance = {
    swine: Swine,
    distance: number
}

export type TileProps = {
    board: BoardInstance,
    position: Position,
    functions: Functions
}

export default function Tile({ board, position, functions }: TileProps) {
    let data: TileData = board.data[position.row][position.column];
    // gets closest unmeeped swine
    const getClosestSwine = (): SwineDistance => {
        let min = Infinity;
        let s: Swine;
        for (let swine of board.swines) {
            if (swine.meeped) continue;

            let d = Math.max(Math.abs(position.row - swine.position.row), Math.abs(position.column - swine.position.column));
            if (d < min) {
                min = d;
                s = swine;
            }
        }
        return {
            swine: s!,
            distance: min
        };
    }
    let closestSwine = getClosestSwine();
    const [shownNumber, setShownNumber] = useState<number | undefined>();
    const [showSwine, setShowSwine] = useState(false);
    const [show, setShow] = useState(data.revealed);


    const onClick = () => {
        data = board.data[position.row][position.column];
        closestSwine = getClosestSwine();
        if (data.revealed) return;
        data.revealed = true;
        setShow(true);
        functions.click();
        if (closestSwine.distance === 0) {
            closestSwine.swine.meeped = true;
            functions.meepSwine();
            setShowSwine(true);
        } else {
            closestSwine = getClosestSwine();
            setShownNumber(closestSwine.distance);
        }
        Object.keys(board.swines).forEach((swine: string) => board.moveSwine(parseInt(swine)));
    }

    useEffect(() => {
        setShow(false);
        setShownNumber(undefined);
        setShowSwine(false);
    }, [board]);

    return (
        <div onClick={data.revealed ? () => {} : onClick} className="tile center" style={{backgroundColor: (position.row + position.column) % 2 === 0 ? "rgb(200,200,200)" : "rgb(200,100,150)", gridRow: 1 + position.row, gridColumn: 1 + position.column}}>
            {show ?
                showSwine ? <img src="./images/swine.png" alt="swine"/>
                : shownNumber !== Infinity ? <p className="text" style={{fontSize: 25 / board.data.length*board.data.length}}>{shownNumber}</p> : <></>
            : <></>}

        </div>
    )
}