import { useEffect } from 'react';
import gameOfLife from '../game';

function Index() {
    useEffect(() => {
        const canvas = document.querySelector("#game")
        const ctx = canvas.getContext("2d")
        const start = document.querySelector("#start")
        const stop = document.querySelector("#stop")
        const generate = document.querySelector("#generate-cells")
        
        let running = false

        canvas.width = window.innerWidth * 0.9
        canvas.height = window.innerHeight * 0.9
        const game = new gameOfLife(canvas, ctx)
        game.setUp()
        game.generateCells(0)
        game.fillCells()

        generate.addEventListener("click", () => {
            const spawnProb = document.querySelector("#cell-chance").value / 100
            const cellSize = document.querySelector("#cell-size").value || 5

            // ajusta o canvas
            canvas.width = window.innerWidth * 0.9
            canvas.height = window.innerHeight * 0.9

            // Define os tamanhos
            game.cell_size = cellSize
            game.cells_in_column = Math.floor(canvas.width / game.cell_size)
            game.cells_in_rows = Math.floor(canvas.height / game.cell_size)

            game.setUp()

            // Deixa o canvas vazio
            game.generateCells(0)
            game.fillCells()

            // Gera as células
            game.generateCells(spawnProb)
            game.fillCells()
        })

        start.addEventListener("click", () => {
            console.log("--------------- GAME IS NOW RUNNING ---------------")
            running = true
            run()
        })

        stop.addEventListener("click", () => {
            console.log("--------------- GAME STOPPED ---------------")
            running = false
            // se running for definido para false, o próximo frame não será rodado.
        })

        // roda os frames
        function run() {
            if (running) {
                requestAnimationFrame(run)
                game.run()
            }
        }

    }, [])
    return (
        <>
            <header>
                <h1>"Jogo da vida" de conways</h1>
                <p>O jogo com vida própria</p>
            </header>

            <div id="configs">
                <h2>Configurações</h2>
                <p>Probabilidade de nascer uma célula viva:</p>
                <input type="number" id="cell-chance" defaultValue={30} />
                <p>Tamanho em pixels das células</p>
                <input type="number" id="cell-size" defaultValue={5} />
                <div id="buttons">
                    <button id="start">Começar jogo</button>
                    <button id="stop">Parar jogo</button>
                    <button id="generate-cells">Gerar células</button>
                </div>
            </div>
            <canvas id="game" />
        </>
    )
}

export default Index;