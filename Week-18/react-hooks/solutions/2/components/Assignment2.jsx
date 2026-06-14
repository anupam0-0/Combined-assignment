import React, { useState, useCallback } from 'react';

export function Assignment2() {
    const [inputText, setInputText] = useState('');

    // Updated showAlert function to check for empty input
    const showAlert = useCallback(() => {
        if (inputText) {
            alert(inputText);
        }
    }, [inputText]);

    return (
        <div className='container'>
            <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter some text"
            />
            <Alert showAlert={showAlert} />
        </div>
    );
};

function Alert({ showAlert }) {
    return <button onClick={showAlert}>Show Alert</button>;
}