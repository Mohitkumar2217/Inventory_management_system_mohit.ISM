import React, { useState } from 'react';

const CustomForm = () => {
  // Initialize state with one empty field object
  const [fields, setFields] = useState([{ label: '', type: 'text' }]);

  // Handle adding a new field
  const addField = () => {
    setFields([...fields, { label: '', type: 'text' }]);
  };

  // Handle removing a field
  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  // Handle input changes
  const handleChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    setFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", fields);
    alert("Check console for JSON output");
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Dynamic Field Creator</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index} className="flex gap-4 mb-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium">Field Label</label>
              <input
                type="text"
                name="label"
                value={field.label}
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. Username"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            
            <button
              type="button"
              onClick={() => removeField(index)}
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={addField}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add New Field
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Submit All
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomForm;