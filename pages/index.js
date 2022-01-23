import { useEffect } from 'react';

function Index() {
    useEffect(() => {
        const screen_height = window.innerHeight;
        const screen_width = window.innerWidth;
        const rows = Math.round(screen_height / 20) // altura
        const cols = Math.round(screen_width / 18) // largura
        let currGen = [rows]
        let nextGen = [rows]
        let started = false
        let random_cells = []
        document.querySelector("#cells-number").textContent = `Número de quadradinhos que serão gerados: ${rows + cols}`
        function createGenArrays() {
            for(let i = 0; i < rows; i++) {
                currGen[i] = new Array(cols)
                nextGen[i] = new Array(cols)
            }
        }

        function initGenArrays() {
            for(let i = 0; i < rows; i++) {
                for(let j = 0; j < cols; j++) {
                    currGen[i][j] = 0
                    nextGen[i][j] = 0
                }
            }
        }

        const progress = document.querySelector("#progress")
        const time_ = document.querySelector("#time")
        async function delay() {
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        async function createWorld(generate_random_cells = false) {
            let time = Date.now();
            let world = document.querySelector('#world');
            let tbl = document.createElement('table');
            tbl.setAttribute('id','worldgrid');
            world.appendChild(tbl);
            for (let i = 0; i < rows; i++) {
                let tr = document.createElement('tr');
                for (let j = 0; j < cols; j++) {
                    let cell = document.createElement('td');
                    cell.setAttribute("id", `${i}_${j}`)
                    cell.addEventListener('click', cellClick);
                    if(generate_random_cells) {
                        const random = Math.random()
                        if(random < 0.3) {
                            cell.setAttribute("class", "alive")
                            random_cells.push(`${i}_${j}`)
                        } else {
                            cell.setAttribute("class", "dead")
                        }
                    } else {
                        cell.setAttribute("class", "dead")
                    }
                    tr.appendChild(cell);
                    let progressS = Math.round(((i * cols) + j) / (rows * cols) * 100)
                    if(progressS > 100) progressS = 100;
                    progress.textContent = `Gerando mundo: ${progressS}%`;
                }
                await delay();
                tbl.appendChild(tr);
            }
            time = Date.now() - time;
            time = time > 1000 ? time / 1000 + ' segundos' : time + ' milissegundos';
            time_.innerHTML = `Tempo levado: ${time}`;
            document.querySelectorAll("button").forEach(button => button.hidden = false);
        }

        function cellClick() {
            let loc = this.id.split("_")
            let row = Number(loc[0])
            let col = Number(loc[1])

            if(this.className == "alive") {
                this.setAttribute("class", "dead")
                currGen[row][col] = 0
            } else {
                this.setAttribute("class", "alive")
                currGen[row][col] = 1
            }

        }

        function getNeighborCount(row, col) {
            let count = 0
            let nrow = Number(row)
            let ncol = Number(col)
            if(nrow - 1 >= 0) {
                if(currGen[nrow - 1][ncol] == 1) {
                    count++;
                }
            }
            if(nrow - 1 >= 0 && ncol - 1 >= 0) {
                if(currGen[nrow - 1][ncol - 1] == 1) {
                    count++;
                }
            }
            if(nrow - 1 >= 0 && ncol + 1 < cols) {
                if(currGen[nrow - 1][ncol + 1] == 1) {
                    count++;
                }
            }
            if(ncol -1 >= 0) {
                if(currGen[nrow][ncol - 1] == 1) {
                    count++;
                }
            }
            if(ncol + 1 < cols) {
                if(currGen[nrow][ncol + 1] == 1) {
                    count++;
                }
            }
            if(nrow + 1 < rows && ncol - 1 >= 0) {
                if(currGen[nrow + 1][ncol - 1] == 1) {
                    count++;
                }
            }
            if(nrow + 1 < rows && ncol + 1 < cols) {
                if(currGen[nrow + 1][ncol + 1] == 1) {
                    count++;
                }
            }
            if(nrow + 1 < rows) {
                if(currGen[nrow + 1][ncol] == 1) {
                    count++;
                }
            }
            return count
        }
        
        function createNextGen() {
            for(let row in currGen) {
                for(let col in currGen[row]) {
                    let neighbors = getNeighborCount(row, col)
                    if(currGen[row][col] == 1) {
                        if(neighbors < 2) {
                            nextGen[row][col] = 0
                        } else if(neighbors == 2 || neighbors == 3) {
                            nextGen[row][col] = 1
                        } else if(neighbors > 3) {
                            nextGen[row][col] = 0
                        }
                    } else if(currGen[row][col] == 0) {
                        if(neighbors == 3) {
                            nextGen[row][col] = 1
                        }
                    }
                }
            }
        }

        function updateCurrGen() {
            for(let row in currGen) {
                for(let col in currGen[row]) {
                    currGen[row][col] = nextGen[row][col]
                    nextGen[row][col] = 0
                    random_cells.forEach(cell => {
                        const loc = cell.split("_")
                        const row = Number(loc[0])
                        const col = Number(loc[1])
                        currGen[row][col] = 1
                    })
                }
            }
            random_cells = []
        }

        function updateWorld() {
            let cell = ""
            for(let row in currGen) {
                for(let col in currGen[row]) {
                    cell = document.getElementById(`${row}_${col}`)
                    if(currGen[row][col] == 0) {
                        cell.setAttribute("class", "dead")
                    } else {
                        cell.setAttribute("class", "alive")
                    }
                }
            }
        }

        function startGame() {
            createNextGen()
            updateCurrGen()
            updateWorld()
            if(!started) return;
            setTimeout(startGame, 100);
        }
        
        document.querySelector("#start").addEventListener('click', () => {
            if(started) return;
            started = true;
            startGame();
        })

        document.querySelector("#stop").addEventListener('click', () => {
            started = false
        })

        document.querySelector("#generate-world").addEventListener('click', () => {
            const generate_random_cells = document.querySelector("#random-cells").checked
            document.querySelector("#game-config").remove()
            document.querySelector("#game").hidden = false
            createWorld(generate_random_cells);
            createGenArrays();
            initGenArrays();
        })

    }, [])
    return (
        <>
            <div id="game" hidden>
                <p id="progress">Gerando mundo: 0%</p>
                <p id="time">Tempo levado: calculando...</p>
                <p id="cells-number">Número de quadradinhos que serão gerados: 0</p>
                <div id="world" />
                <div className="buttons">
                    <button id="start" hidden>Começar</button>
                    <button id="stop" hidden>Pausar</button>
                </div>
            </div>
            <div id="game-config">
                <div id="content">
                    <h1>Configuração do jogo</h1>
                    <input type="checkbox" id="random-cells" /> Gerar células aleatórias? <br />
                    <div className="buttons">
                        <button id="generate-world">Gerar mundo</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index;