'use strict'

//change every input to white background
function changebgwhite() { 
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            document.getElementById(`xy${x}${y}`).style.backgroundColor = "white"; 
        }
    }
}

//change every input to salmon background
function changebgsalmon() { 
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            document.getElementById(`xy${x}${y}`).style.backgroundColor = "Salmon";  
        }
    }
}

//sleep function to create a delay between specific tasks
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

//count how many nums (1-9) there are in the array and returns
function countn(num, arr) {
    let c = 0;
    for (let n of arr) {
        if (n == num) {
            c += 1;
        }
    }
    return c;
}


//create the sudoku board 9x9
function createboard() { 
    const parentdiv = document.getElementById("board");
    let i = "";

    //create all the 81 inputs with proper spaces between them and style
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (x != 0 & y != 0 & x % 3 == 0 & y % 3 == 0) {
                i += `<input id="xy${x}${y}" class="border-l-4 border-t-4 h-10 w-10 text-center md:h-14 md:w-14 focus:border-gray-500 focus:ring-gray-500 focus:bg-blue-300"
    type="number" min="1" max="9"/>`;
    
            }
            else if (y != 0 & y % 3 == 0) {
                i += `<input id="xy${x}${y}" class="border-t-4 h-10 w-10 text-center md:h-14 md:w-14 focus:border-gray-500 focus:ring-gray-500 focus:bg-blue-300"
    type="number" min="1" max="9"/>`;
            }
            else if (x != 0 & x % 3 == 0) {
                i += `<input id="xy${x}${y}" class="border-l-4 h-10 w-10 text-center md:h-14 md:w-14 focus:border-gray-500 focus:ring-gray-500 focus:bg-blue-300"
    type="number" min="1" max="9"/>`;
            }
            else {
                i += `<input id="xy${x}${y}" class="h-10 w-10 text-center md:h-14 md:w-14 focus:border-gray-500 focus:ring-gray-500 focus:bg-blue-300"
    type="number" min="1" max="9"/>`;
            }
    
        }
    }
    parentdiv.innerHTML = i; //put all the 81 inputs created in the grid div so it looks like a 9x9 sudoku board
}

//function called when you click in the Solve button, it will check if the sudoku puzzle is a valid puzzle and then it will solve it
const start = async() => {
    //disable buttons when starts to solve the puzzle
    document.getElementById("startbtn").disabled = true;
    document.getElementById("resetbtn").disabled = true;
    document.getElementById("generatepuzzlebtn").disabled = true;
    await sleep(500);
    changebgwhite();
    let puzzle = getpuzzle();
    //the puzzle will only get to be solved if the puzzle is a valid puzzle which has at least one solution
    if (validBoard(puzzle)) {
        const solved = solve(getpuzzle());
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (puzzle[y][x] == "") {
                    document.getElementById(`xy${x}${y}`).style.backgroundColor = "lightblue";
                    document.getElementById(`xy${x}${y}`).value = solved[y][x];
                    await sleep(40);
                }
                    
            }
        }
        document.getElementById("startbtn").disabled = false;
        document.getElementById("resetbtn").disabled = false;
        document.getElementById("generatepuzzlebtn").disabled = false;
    }
    //if not valid puzzle to be solved, enable buttons and nothing happens
    else {
        document.getElementById("startbtn").disabled = false;
        document.getElementById("resetbtn").disabled = false;
        document.getElementById("generatepuzzlebtn").disabled = false;
    }
}

//get all the 81 inputs values and return them in a two dimensional array
function getpuzzle() { 
    let puzzle = [];
    let t = [];
    for (let y = 0; y < 9; y++) {
        t = [];
        for (let x = 0; x < 9; x++) {
            t.push(document.getElementById(`xy${x}${y}`).value); 
        }
        puzzle.push(t);
    }
    return puzzle;
}

//checks if the current sudoku puzzle has at least one valid solution
function validBoard(board) {
    //checking every input in the board and checking if their values are valid
    //valid means they are unique in their rows, columns and 3x3 square grid and returns true
    //everything that is not an empty space or values between 1 to 9 is considered invalid input and returns false as well
    //if invalid change bg to salmon and return false
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (board[y][x] == "0" | board[y][x].length > 1) {
                changebgsalmon();
                return false;
            }
        }
    }

    let square = [];
    for (let y = 0; y < 7; y += 3) {
        for (let x = 0; x < 7; x += 3) {
            square = board[y].slice(x, x+3).concat(board[y+1].slice(x, x+3), board[y+2].slice(x, x+3));
            for (let n = 1; n < 10; n++) {
                if (countn(n, square) > 1) {
                    changebgsalmon();
                    return false;
                }
            }
        }
    }

    for (let y of board) {
        for (let n = 1; n < 10; n++) {
            if (countn(n, y) > 1) {
                changebgsalmon();
                return false;
            }
        }
    }

    let column = [];
    for (let x = 0; x < 9; x++) {
        column = [];
        for (let y = 0; y < 9; y++) {
            column.push(board[y][x])
        }
        for (let n = 1; n < 10; n++) {
            if (countn(n, column) > 1) {
                changebgsalmon();
                return false;
            }
        }
    }

    return true;
}

//function called to solve the sudoku puzzle if it has at least one valid solution
function solve(puzzle) {
    let m = 0;
    let n = 0;

    //m, n will be the position x, y of the last empty input in the sudoku puzzle
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (puzzle[y][x] == "") {
                m = x;
                n = y;
            }
        }
    }
    
    //solve the sudoku puzzle using backtracking
    function sudoku(puzzle, m, n) {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (puzzle[y][x] == "") { 
                    for (let v = 1; v < 10; v++) {
                        if (check(x, y, v.toString(), puzzle)) { 
                            puzzle[y][x] = v.toString() 
                            sudoku(puzzle, m, n); 
                            if (puzzle[n][m] != "") {  //if the input of position m, n is not empty, means the puzzle got solved (m, n is the last empty position in the original puzzle array)
                                return puzzle; //returns the solved puzzle
                            }
                            puzzle[y][x] = ""; 
                        }   
                    }
                    return null; 
                }     
            }
        }
    }
    
    return sudoku(puzzle, m, n);
}

function check(x, y, v, sudoku) {
    //check if the value v in the position x, y is unique in the column, in the row and in the 3x3 square grid
    //if not unique return false, if unique return true
    let xi = Math.floor(x / 3) * 3;
    let yi = Math.floor(y / 3) * 3;
    
    for (let row = 0; row < 3; row++) {
        if (sudoku[yi+row].slice(xi, xi+3).includes(v)) {
            return false;
        }
    }
    
    if (sudoku[y].includes(v)) {
        return false;
    }
        
    else {
        for (let row of sudoku) {
            if (row[x] == v) {
                return false;
            }
        }
    }

    return true;
}

//generate a random sudoku puzzle with at least one valid solution
const generatepuzzle = async() => {
    //disable buttons when starts to generate puzzle
    document.getElementById("startbtn").disabled = true;
    document.getElementById("resetbtn").disabled = true;
    document.getElementById("generatepuzzlebtn").disabled = true;
    let emptypuzzle = [['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '']];
    
    let p = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
            [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], 
            [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], 
            [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], 
            [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], 
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], 
            [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], 
            [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], 
            [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]]; //all the positions permutations generated
            
    let r = 0;
    for (let n = 1; n < 10; n++) {
        r = Math.floor(Math.random()*p.length);
        emptypuzzle[p[r][1]][p[r][0]] = n.toString(); //adding from 1 to 9 in random places in a empty board
        p.splice(r, 1); 
    }

    emptypuzzle = solve(emptypuzzle); //solving the board with 9 numbers

    for (let n = 0; n < 70; n++) {
        emptypuzzle[Math.floor(Math.random()*9)][Math.floor(Math.random()*9)] = "";  //1 to 70 places will become empty
    }   

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            document.getElementById(`xy${x}${y}`).style.backgroundColor = "white"; //fill the board with the generate puzzle with some empty spaces
            document.getElementById(`xy${x}${y}`).value = emptypuzzle[y][x];
            await sleep(20);
        }
    }
    document.getElementById("startbtn").disabled = false;
    document.getElementById("resetbtn").disabled = false;
    document.getElementById("generatepuzzlebtn").disabled = false;
}

//resets the board, making every input empty
const reset = async() => {
    document.getElementById("startbtn").disabled = true;
    document.getElementById("resetbtn").disabled = true;
    document.getElementById("generatepuzzlebtn").disabled = true;
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            document.getElementById(`xy${x}${y}`).style.backgroundColor = "white";
            document.getElementById(`xy${x}${y}`).value = "";
            await sleep(20);
        }
    }
    document.getElementById("startbtn").disabled = false;
    document.getElementById("resetbtn").disabled = false;
    document.getElementById("generatepuzzlebtn").disabled = false;
}


