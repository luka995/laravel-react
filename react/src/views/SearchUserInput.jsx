import {useState} from "react";

export default function SearchUserInput ({searchTerm, onSearch}) {

    const handleChange = (e) => {
        const value = e.target.value;
        onSearch(value);
    };

    return (
        <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleChange}
            style={{ width: "200px" }}
        />
    );
}
