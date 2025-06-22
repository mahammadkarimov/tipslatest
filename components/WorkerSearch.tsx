'use client';
import { useState, useEffect } from "react";



export default function WorkerSearch({ initialWorkers }: { initialWorkers: any[] }) {
    const [allWorkers, setAllWorkers] = useState(initialWorkers); // unfiltered
    const [workers, setWorkers] = useState(initialWorkers); // filtered

    const handleSearch = (e: { target: { value: string; }; }) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allWorkers.filter((worker) =>
            worker.name.toLowerCase().includes(searchTerm)
        );
        setWorkers(filtered);
    };

    return (
        <div className="mb-6">
            <input
                type="text"
                placeholder="Search Workers"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={handleSearch}
            />

            {/* Example display */}
            <ul>
                {workers.map((worker, index) => (
                    <li key={index}>{worker.name}</li>
                ))}
            </ul>
        </div>
    );
}
