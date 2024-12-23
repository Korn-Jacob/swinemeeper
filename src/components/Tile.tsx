import React, { useEffect, useState } from "react";
import { BoardInstance, Position, TileData } from "./Board";
import { Functions } from "../Main";

export type TileProps = {
    board: BoardInstance,
    position: Position,
    functions: Functions
}

export default function Tile({ board, position, functions }: TileProps) {
    let data: TileData = board.data[position.row][position.column];
    let distance = Math.max(Math.abs(position.row - board.swine.row), Math.abs(position.column - board.swine.column));
    const [shownNumber, setShownNumber] = useState<number | undefined>();
    const [show, setShow] = useState(data.revealed);
    const onClick = () => {
        data = board.data[position.row][position.column];
        distance = Math.max(Math.abs(position.row - board.swine.row), Math.abs(position.column - board.swine.column));
        if (data.revealed) return;
        data.revealed = true;
        setShow(true);
        if (distance === 0) {
            functions.setHighScore();
            return;
        } else {
            functions.click();
        }
        board.moveSwine();
        distance = Math.max(Math.abs(position.row - board.swine.row), Math.abs(position.column - board.swine.column));
        setShownNumber(distance);
    }

    useEffect(() => {
        setShow(false);
        setShownNumber(undefined);
    }, [board]);

    return (
        <div onClick={data.revealed ? () => {} : onClick} className="tile center" style={{backgroundColor: (position.row + position.column) % 2 === 0 ? "rgb(200,200,200)" : "rgb(200,100,150)", gridRow: 1 + position.row, gridColumn: 1 + position.column}}>
            {show ?
                distance === 0 ? <img src="./images/swine.png" alt="swine"/>
                : <p className="text">{shownNumber}</p>
            : <></>}

        </div>
    )
}