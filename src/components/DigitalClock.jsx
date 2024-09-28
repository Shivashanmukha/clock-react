import { useState, useEffect } from "react"

const DigitalClock = () => {
    // useState for storing the current time
    const[time,setTime]=useState(new Date())
    console.log(time)

    // state to track the selected mode
    const [mode, setMode] = useState("clock"); 

    // state the stopwatch
    const [elapsedTime, setElapsedTime] = useState(0); // Stopwatch state
    const [isRunning, setIsRunning] = useState(false); // Is stopwatch running?
    const [savedTimes, setSavedTimes] = useState([]); // Array of saved times

    // Timer state
    const [timerDuration, setTimerDuration] = useState(60000); // Default timer duration (1 minute)
    const [timerRunning, setTimerRunning] = useState(false); // Is timer running?
    const [timerDisplay, setTimerDisplay] = useState(timerDuration); // Current timer display


    // useEffect for handling the Time
    useEffect(()=>{
        let intervalID=setInterval(()=>{
            setTime(new Date())   // updating the Time after every 1's
        },1000)

        return ()=>{
            clearInterval(intervalID)
        }  // cleanup function

    },[]) // dependency

    // formating the Time
    function formatTime(){
        let hours=time.getHours()
        let min=time.getMinutes()
        let seconds=time.getSeconds()
        let AmPm=(hours>=12)?"PM":"AM"
        // console.log(hours,min,sec)
        hours=hours % 12 || 12
        return `${Addzero(hours)}:${Addzero(min)}:${Addzero(seconds)}${Addzero(AmPm)}`
    }

    // stopwatch
    // Update the stopwatch when it is running
    useEffect(() => {
        let intervalID;
        if (isRunning) {
            intervalID = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 10); // Update every 10ms for smooth time
            }, 10);
        }
        return () => clearInterval(intervalID);
        }, [isRunning]);

    // Format the stopwatch time in mm:ss:ms
    function formatStopwatch(time) {
        const milliseconds = Math.floor((time % 1000) / 10);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / 60000) % 60);
        return `${Addzero(minutes)}:${Addzero(seconds)}:${Addzero(milliseconds)}`;
    }
        
    // Update the timer when it is running
    useEffect(() => {
        let intervalID;
        if (timerRunning && timerDisplay > 0) {
          intervalID = setInterval(() => {
            setTimerDisplay((prevDisplay) => prevDisplay - 1000); // Decrease the timer by 1 second
          }, 1000);
        } else if (timerDisplay <= 0) {
          clearInterval(intervalID);
          setTimerRunning(false);
          alert("Time's up!");
        }
        return () => clearInterval(intervalID);
      }, [timerRunning, timerDisplay]);

    // Format the timer display
    function formatTimer(time) {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / 60000) % 60);
        return `${Addzero(minutes)}:${Addzero(seconds)}`;
    }

    function Addzero(a){
        return (a<10?"0":"")+a
    }

    // Function to handle button clicks and set the mode
    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode !== "timer") {
            resetTimer(); // Reset the timer when switching modes
        }
    };

    // function to handle the stopwatch
    // Handle starting and stopping the stopwatch
    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    // Handle saving the current stopwatch time
    const handleSaveTime = () => {
        if (elapsedTime !== 0) {
            setSavedTimes([...savedTimes, elapsedTime]);
        }
    };

    // Handle resetting the stopwatch and clearing saved times
    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        setSavedTimes([]);
    };

    // Start or stop the timer
    const handleTimerStartStop = () => {
        setTimerRunning(!timerRunning);
    };

    // Reset the timer
    const resetTimer = () => {
        setTimerRunning(false);
        setTimerDisplay(timerDuration); // Reset to the original duration
        setSavedTimes([])
    };

      // Handle saving the current timer duration
    const handleSaveTimer = () => {
        if (timerDisplay !== timerDuration) {
            setSavedTimes((prevTimes) => [...prevTimes, timerDuration - timerDisplay]); // Save the elapsed time
        }
    };

    // Handle setting the timer duration
    const handleTimerInputChange = (e) => {
        const inputDuration = parseInt(e.target.value, 10) * 60000; // Convert minutes to milliseconds
        setTimerDuration(inputDuration);
        setTimerDisplay(inputDuration); // Also update the display to match
    };

    return (
        <div style={{
            backgroundImage: `url('./src/assets/clock.jpg')`,
            backgroundSize: 'cover',        // Ensures the image covers the whole area
            backgroundPosition: 'center',   // Centers the background image
            backgroundRepeat: 'no-repeat',  // Prevents the image from repeating
            width: '100vw',                 // Ensures full screen width
            height: '100vh',                // Ensures full screen height
            margin: 0,                      // Removes any margin that may interfere with layout
            padding: 0,                     // Removes padding to avoid white spaces
            display: 'flex',                // Flexbox to center content inside the container
            justifyContent: 'center',       // Horizontally centers the content
            alignItems: 'center',           // Vertically centers the content
            }}>
            <div className="container my-5">
            {/* Buttons for Clock, Stopwatch, and Timer */}
    
            {/* Conditional Rendering based on selected mode */}
            {mode === "clock" && (
                <div className="clock-container p-4 bg-light rounded shadow text-center mx-auto w-100">
                    <div className="clock-face bg-dark text-light p-3 rounded">
                        <h1 className="display-2">{formatTime()}</h1>
                    </div>
                </div>
            )}
    
            {/* Stopwatch display */}
            {mode === "stopwatch" && (
                <div className="stopwatch-container p-4 bg-light rounded shadow text-center mx-auto w-100">
                    <div className="stopwatch-face bg-dark text-light p-3 rounded">
                        <h1 className="display-3">{formatStopwatch(elapsedTime)}</h1>
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-success mx-2" onClick={handleStartStop}>
                            {isRunning ? "Stop" : "Start"}
                        </button>
                        {/* if you want stop to save use on disabled={elapsedTime === 0 || isRunning} */}
                        <button className="btn btn-primary mx-2" onClick={handleSaveTime}> 
                            Save
                        </button>
                        <button className="btn btn-danger mx-2" onClick={handleReset}>
                            Reset
                        </button>
                    </div>

                    {/* Display saved times */}
                    <div className="mt-4">
                        <h3>Saved Times</h3>
                        {savedTimes.length === 0 ? (
                            <p>No saved times</p>
                        ) : (
                             <ul className="list-group">
                             {savedTimes.map((time, index) => (
                                <li key={index} className="list-group-item">
                                    {formatStopwatch(time)}
                                </li>
                            ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
    
           {/* Timer display */}
           {mode === "timer" && (
                <div className="timer-container p-4 bg-light rounded shadow text-center mx-auto w-100">
                    <div className="timer-face bg-dark text-light p-3 rounded">
                        <h1 className="display-3">{formatTimer(timerDisplay)}</h1>
                    </div>
                    <div className="mt-3">
                        <input
                            type="number"
                            placeholder="Minutes"
                            min="1"
                            onChange={handleTimerInputChange}
                            className="form-control mb-2"
                        />
                        <button className="btn btn-success mx-2" onClick={handleTimerStartStop}>
                            {timerRunning ? "Pause" : "Start"}
                        </button>
                        <button className="btn btn-primary mx-2" onClick={handleSaveTimer}>
                            Save
                        </button>
                        <button className="btn btn-danger mx-2" onClick={resetTimer}>
                            Reset
                        </button>
                    </div>

                   {/* Display saved times */}
                    <div className="mt-4">
                        <h3>Saved Timer Durations</h3>
                            {savedTimes.length === 0 ? (
                            <p>No saved times</p>
                        ) : (
                        <ul className="list-group">
                            {savedTimes.map((time, index) => (
                            <li key={index} className="list-group-item">
                                {formatTimer(time)} {/* Display the saved time in format */}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
            </div>
            )}

                <div className="d-flex justify-content-center mb-3 p-5">
                    <button className={`btn btn-outline-primary mx-2" ${mode === "clock" ? "active" : ""}`} 
                        onClick={() => handleModeChange("clock")}>
                        Clock
                    </button>
            
                    <button className={`btn btn-outline-primary mx-2 ${mode === "stopwatch" ? "active" : ""}`}
                        onClick={() => handleModeChange("stopwatch")}
                    >
                        Stopwatch
                    </button>

                    <button className={`btn btn-outline-primary mx-2 ${mode === "timer" ? "active" : ""}`}
                        onClick={() => handleModeChange("timer")}>
                        Timer
                    </button>
                </div>
            </div>
        </div>
      );
    };
    
export default DigitalClock;
