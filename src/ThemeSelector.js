import React from 'react';

function ThemeSelector({ onThemeSelect }) {
    return (
        <div className="theme-selector">
            <select onChange={(e) => onThemeSelect(e.target.value)} defaultValue="default">
                <option value="default">Blue Color Theme</option>
                <option value="pink-theme">Pink Color Theme</option>
                <option value="green-theme">Green Color Theme</option>
                <option value="purple-theme">Purple Color Theme</option>
                <option value="pastel-theme">Pastel Color Theme</option>
                <option value="blackandwhite-theme">Black and White Color Theme</option>
            </select>
        </div>
    );
    }

    export default ThemeSelector;