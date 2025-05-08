import React, { useState, useEffect } from "react";

const Notes = () => {
  const [noteInput, setNoteInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("user_notes");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("user_notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    if (editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = noteInput;
      setNotes(updatedNotes);
      setEditIndex(null);
    } else {
      setNotes([...notes, noteInput]);
    }
    setNoteInput("");
  };

  const handleEdit = (index) => {
    setNoteInput(notes[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded shadow mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Notes</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded"
          placeholder="Write a note..."
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        />
        <button
          onClick={handleAddNote}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-100 p-3 rounded break-words"
          >
            <span>{note}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="text-yellow-600 hover:bg-yellow-500 hover:text-black px-2 py-1 rounded transition-all duration-200 ease-in-out"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded transition-all duration-200 ease-in-out"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;