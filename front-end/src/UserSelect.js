// UserSelect.js
import React from 'react';

const UserSelect = ({ users, handleUsernameSelect }) => (
    <header className="App-header">
        <h2>Vali enda kasutaja:</h2>
        <div>
            {users.map((user) => (
                <button key={user.id} onClick={() => handleUsernameSelect(user.username)}>
                    {user.username}
                </button>
            ))}
        </div>
    </header>
);

export default UserSelect;
