import React, { useEffect, useCallback, useState } from 'react';
import './Spin.css';
import { useBalance } from '../contexts/BalanceContext'; // Correct import for context

const SpinWheel = () => {
    let rotation = 0;
    const segments = [10, 1, -10, -25, 5, 2, -2, -4, 25, 15]; // Values on the wheel
    const segmentAngle = 360 / segments.length; // Angle of each segment

    const { addToBalance } = useBalance(); // Correctly use the context

    // Move getSpinsLeft before it's used
    const getSpinsLeft = () => parseInt(localStorage.getItem('spinsLeft'), 10) || 3; // Default to 3 spins
    const getLastSpinDate = () => localStorage.getItem('lastSpinDate') || ''; // Get last spin date

    const [spinsLeft, setSpinsLeftState] = useState(getSpinsLeft()); // State to manage spins left
    const [canSpin, setCanSpin] = useState(true); // State to manage if the user can spin
    const getIsSpinning = () => document.querySelector('.spinBtn').getAttribute('data-spinning') === 'true';

    const setSpinsLeft = (spinsLeft) => {
        localStorage.setItem('spinsLeft', spinsLeft);
        setSpinsLeftState(spinsLeft);
        document.querySelector('.spinsLeft').textContent = `Spins Left: ${spinsLeft}`;
    };

    const setIsSpinning = (spinning) => {
        document.querySelector('.spinBtn').setAttribute('data-spinning', spinning);
    };

    const initializeSpins = useCallback(() => {
        const storedSpins = localStorage.getItem('spinsLeft');
        const storedDate = localStorage.getItem('lastSpinDate');
        const today = new Date().toDateString();

        if (storedDate === today && storedSpins !== null) {
            setSpinsLeft(parseInt(storedSpins, 10));
        } else {
            // Reset spins to 3 every new day
            setSpinsLeft(3);
            localStorage.setItem('lastSpinDate', today);
        }

        // Disable spinning if no spins are left
        setCanSpin(parseInt(storedSpins, 10) > 0);

        setIsSpinning(false);
    }, []);

    // Handle the spin button click
    const handleSpin = () => {
        const spinsLeft = getSpinsLeft();
        const isSpinning = getIsSpinning();

        if (isSpinning || spinsLeft === 0) return; // Prevent spin if already spinning or no spins left

        setIsSpinning(true);
        const randomRotation = Math.ceil(Math.random() * 3600) + 3600; // Random multiple rotations
        const newRotation = rotation + randomRotation;
        rotation = newRotation;

        setTimeout(() => {
            const actualRotation = newRotation % 360;
            const segmentIndex = Math.floor((360 - actualRotation + segmentAngle / 2) % 360 / segmentAngle);
            const result = segments[segmentIndex];

            console.log('Landed on: ', result); // For debugging

            // Add or subtract the result to/from the balance
            addToBalance(result);

            setIsSpinning(false);
            setSpinsLeft(spinsLeft - 1);

            if (spinsLeft - 1 === 0) {
                setCanSpin(false); // Disable spinning when no spins left
            }
        }, 4000); // Spin duration

        document.querySelector('.wheel').style.transform = `rotate(${newRotation}deg)`;
    };

    useEffect(() => {
        initializeSpins(); // Call the memoized initializeSpins function
    }, [initializeSpins]);

    // Check daily reset of spins every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const lastSpinDate = getLastSpinDate();
            const today = new Date().toDateString();

            if (lastSpinDate !== today) {
                setSpinsLeft(3); // Reset spins for the new day
                localStorage.setItem('lastSpinDate', today);
                setCanSpin(true); // Enable spinning again
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className='body3'>
            <div className="container">
                <div className="spinText">Spin the wheel</div>
                <span className='spinsLeft'>Spins Left: {spinsLeft}</span>
                <div
                    className={`spinBtn ${!canSpin ? 'disabled' : ''}`} // Disable button if no spins left
                    data-spinning="false"
                    onClick={canSpin ? handleSpin : null} // Disable click if no spins left
                    style={{ pointerEvents: canSpin ? 'auto' : 'none' }} // Disable click event when no spins left
                >
                    Spin
                </div>
                <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                    {segments.map((value, index) => (
                        <div key={index} className="number" style={{ '--i': index + 1 }}>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpinWheel;
