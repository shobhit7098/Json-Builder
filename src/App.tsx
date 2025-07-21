import React, { useState } from 'react';
import FieldEditor from './components/FieldEditor';
import type { Field } from './types/Field';
import { v4 as uuidv4 } from 'uuid';
import './index.css'; // Tailwind styles

const App: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);

  const handleAddField = () => {
    const newField: Field = {
      id: uuidv4(),
      key: '',
      type: '',
      nested: false,
      fields: [],
    };
    setFields([...fields, newField]);
  };

  const convertToKeyTypeObject = (fields: Field[]): Record<string, any> => {
    if (fields.length === 0) return { "": "" };

    const result: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.nested && field.fields?.length) {
        result[field.key] = convertToKeyTypeObject(field.fields);
      } else if (field.nested && !field.fields?.length) {
        result[field.key] = { "": "" };
      } else {
        result[field.key] = field.type;
      }
    });
    return result;
  };

  const handleFieldChange = (index: number, updatedField: Field) => {
    const updatedFields = [...fields];
    updatedFields[index] = updatedField;
    setFields(updatedFields);
  };

  const handleDeleteField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1950&q=80)',
      }}
    >
      <div className="backdrop-blur-md bg-white/30 shadow-2xl rounded-xl p-8 w-full max-w-3xl animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">JSON Form Builder</h1>

        <div className="space-y-4">
          {fields.map((field: Field, index: number) => (
            <FieldEditor
              key={field.id}
              field={field}
              placeholder="Enter field name"
              onChange={(updatedField: Field) => handleFieldChange(index, updatedField)}
              onDelete={() => handleDeleteField(index)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleAddField}
            className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
          >
            + Add Field
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2 text-black drop-shadow">Generated JSON</h2>
          <pre className="bg-white/20 text-black p-4 rounded-md max-h-80 overflow-auto text-sm shadow-inner backdrop-blur-sm">
            {JSON.stringify(convertToKeyTypeObject(fields), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
