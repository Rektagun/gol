import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [rows, setRows] = useState(50);
  const [cols, setcols] = useState(100);
  const [cells, setCells] = useState(rows * cols);
  const [mainArray, setMainArray] = useState(Array(cells).fill(0));
  const [start, setStart] = useState(false);
  const [speed, setSpeed] = useState(250);
  const [isDrawing, setIsDrawing] = useState(false);

  const saves = [
    {
      id: 1,
      array: [],
    },
    {
      id: 2,
      array: [],
    },
    {
      id: 3,
      array: [],
    },
    {
      id: 4,
      array: [],
    },
    {
      id: 5,
      array: [],
    },
    {
      id: 6,
      array: [],
    },
  ]

  const updateSpeed = (e) => {
    setSpeed(e.target.value);
  }

  function toggleGen() {
    setStart(!start);
  }

  function resetGrid() {
    setMainArray(Array(cells).fill(0));
    if (start) {
      setStart(false);
    }
  }

  const savePattern = () => { };

  const handleMouseDown = (index) => {
    setIsDrawing(true);
    drawCell(index);
  }

  const handleMouseEnter = (index) => {
    if (isDrawing) {
      drawCell(index);
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false);
  }

  const drawCell = (index) => {
    setMainArray(prev => {
      const newArray = [...prev];
      newArray[index] = 1;
      return newArray;
    });
  }

  const handleRightClick = (index, e) => {
    e.preventDefault(); // Prevent the default context menu
    isAlive(index);
  }

  const isAlive = (index) => {
    setMainArray(prev => {
      const newArray = [...prev];
      if (mainArray[index] === 1) {
        newArray[index] = 0;
      }
      else {
        newArray[index] = 1;
      }
      return newArray;
    });
  }

  // Use useEffect to handle the game logic when start is true
  useEffect(() => {
    if (!start) return;

    const intervalId = setInterval(() => {
      setMainArray(prev => {
        const newArray = [...prev];
        const tempArray = [...prev]; // Use a temporary array to calculate the next state

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const index = i * cols + j; // Calculate index from i and j
            let neighbours = 0;

            // Check all 8 neighbors
            // Left
            if (j > 0 && tempArray[index - 1] === 1) neighbours++;
            // Right
            if (j < cols - 1 && tempArray[index + 1] === 1) neighbours++;
            // Top
            if (i > 0 && tempArray[index - cols] === 1) neighbours++;
            // Bottom
            if (i < rows - 1 && tempArray[index + cols] === 1) neighbours++;
            // Top-left
            if (i > 0 && j > 0 && tempArray[index - cols - 1] === 1) neighbours++;
            // Top-right
            if (i > 0 && j < cols - 1 && tempArray[index - cols + 1] === 1) neighbours++;
            // Bottom-left
            if (i < rows - 1 && j > 0 && tempArray[index + cols - 1] === 1) neighbours++;
            // Bottom-right
            if (i < rows - 1 && j < cols - 1 && tempArray[index + cols + 1] === 1) neighbours++;

            // Apply Conway's Game of Life rules
            if (tempArray[index] === 1) {
              // Cell is alive
              if (neighbours < 2 || neighbours > 3) {
                newArray[index] = 0; // Cell dies
              }
              // For 2 or 3 neighbors, the cell stays alive (no change needed)
            } else {
              // Cell is dead
              if (neighbours === 3) {
                newArray[index] = 1; // Cell becomes alive
              }
            }
          }
        }

        return newArray;
      });
    }, speed);

    return () => clearInterval(intervalId); // Cleanup on unmount or when start changes
  }, [start, rows, cols, speed]);

  return (
    <>
      <div className='flex flex-col bg-gray-900 h-screen w-screen p-2 gap-2'>
        <div className='flex flex-row bg-gray-800 rounded-2xl p-2 w-fit mx-auto gap-2 font-bold'>
          <button
            onClick={toggleGen}
            className={`px-4 py-2 w-28 hover:opacity-70 active:opacity-60 transition-all duration-75 rounded-lg h-fit ${start ? 'bg-red-900' : 'bg-green-900'}`}>
            {start ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={resetGrid}
            className={`px-4 py-2 active:opacity-50 hover:opacity-70 transition-all duration-75 rounded-lg h-fit bg-sky-800`}>Reset</button>

          <div
            className='bg-gray-500 rounded-md w-fit text-white flex flex-row justify-center p-2 items-center'>
            <h1 className='bg-gray-500 rounded-md text-white flex m-auto'>
              Speed (ms) :
            </h1>
            <input
              type='number'
              id='speed'
              value={speed}
              onChange={updateSpeed}
              className='bg-gray-500 rounded-md w-28 px-2 text-white flex m-auto' />
          </div>

          <button
            onClick={savePattern}
            className={`px-4 py-2 active:opacity-50 hover:opacity-70 transition-all duration-75 rounded-lg h-fit bg-sky-800`}>Save</button>
        </div>

        <div
          className='m-auto scroll-auto rounded-2xl flex justify-center'
          onMouseUp={handleMouseUp}
        >
          <div
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
            }}
            className={`grid justify-center bg-sky-900 rounded-md`}>
            {mainArray.map((value, index) => {
              return (
                <button
                  //onClick={() => isAlive(index)}
                  onMouseDown={() => handleMouseDown(index)}
                  key={index}
                  onContextMenu={(e) => handleRightClick(index, e)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  className={`m-0 outline hover:outline-gray-300 text-[6px] hover:text-gray-400 size-4 text-center flex justify-center items-center transition-colors ease-out ${mainArray[index] ? 'bg-gray-400' : 'bg-sky-950'}`}
                >
                  {index % 1000}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
