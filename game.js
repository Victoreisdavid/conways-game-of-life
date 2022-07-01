class GameOfLife {
    constructor(canvas, ctx) {
        this.ctx = ctx || canvas.getContext("2d")
        this.cell_size = 5
        this.dead_color = "#2f3036"
        this.alive_color = "#E1C04B"
        this.cells_in_column = Math.floor(canvas.width / this.cell_size)
        this.cells_in_rows = Math.floor(canvas.height / this.cell_size)
        this.active_array = []
        this.inactive_array = []
    }

    cellsInitialization() {
        for (let i = 0; i < this.cells_in_rows; i++) {
            this.active_array[i] = []
            for (let j = 0; j < this.cells_in_column; j++) {
                this.active_array[i][j] = 0
            }
        }
        this.inactive_array = this.active_array
    }

    generateCells(probability = 0.5) {
        for (let i = 0; i < this.cells_in_rows; i++) {
            for (let j = 0; j < this.cells_in_column; j++) {
                this.active_array[i][j] = (Math.random() < probability) ? 1 : 0
            }
        }
    }

    fillCells() {
        for (let i = 0; i < this.cells_in_rows; i++) {
            for (let j = 0; j < this.cells_in_column; j++) {
                let color;
                if (this.active_array[i][j] == 1) {
                    color = this.alive_color
                } else {
                    color = this.dead_color
                }
                this.ctx.fillStyle = color
                this.ctx.fillRect(j * this.cell_size, i * this.cell_size, this.cell_size, this.cell_size)
            }
        }
    }

    updateLifeCycle() {
        for (let i = 0; i < this.cells_in_rows; i++) {
            for (let j = 0; j < this.cells_in_column; j++) {
                let new_state = this.updateCellValue(i, j)
                this.inactive_array[i][j] = new_state
            } 
        }
        this.active_array = this.inactive_array
    }

    updateCellValue(row, col) {
        const total = this.countNeighbours(row, col);
        
        if (total > 4 || total < 3) {
            return 0;
        }
       
        else if (this.active_array[row][col] === 0 && total === 3) {
            return 1;
        }
        
        else {
            return this.active_array[row][col];
        }
    }

    setCellValueHelper(row, col) {
        try {
            return this.active_array[row][col]
        } catch (e) {
            return 0
        }
    }

    countNeighbours(row, col) {
        let total_neighbours = 0;

        total_neighbours += this.setCellValueHelper(row - 1, col - 1);
        total_neighbours += this.setCellValueHelper(row - 1, col);
        total_neighbours += this.setCellValueHelper(row - 1, col + 1);
        total_neighbours += this.setCellValueHelper(row, col - 1);
        total_neighbours += this.setCellValueHelper(row, col + 1);
        total_neighbours += this.setCellValueHelper(row + 1, col - 1);
        total_neighbours += this.setCellValueHelper(row + 1, col);
        total_neighbours += this.setCellValueHelper(row + 1, col + 1);

        return total_neighbours;
    }

    setUp() {
        this.cellsInitialization()
    }

    run() {
        this.updateLifeCycle()

        this.fillCells()
    }
}

export default GameOfLife