import React from 'react';
import type { Field } from '../types/Field';

interface FieldEditorProps {
  field: Field;
  onChange: (updatedField: Field) => void;
  onDelete: () => void;
  placeholder?: string;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onChange,
  onDelete,
}) => {
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    if (selectedType === 'nested') {
      onChange({
        ...field,
        type: selectedType,
        nested: true,
        fields: field.fields?.length
          ? field.fields
          : [
              {
                id: crypto.randomUUID(),
                key: '',
                type: '',
                nested: false,
                fields: [],
              },
            ],
      });
    } else {
      onChange({
        ...field,
        type: selectedType,
        nested: false,
        fields: [],
      });
    }
  };

  const handleAddNestedField = () => {
    const updatedFields = [
      ...(field.fields || []),
      {
        id: crypto.randomUUID(),
        key: '',
        type: '',
        nested: false,
        fields: [],
      },
    ];
    onChange({ ...field, fields: updatedFields });
  };

  return (
    <div className="p-4 mb-4 rounded-xl bg-white/20 backdrop-blur-sm shadow-md border border-white/30 hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={field.key}
          placeholder="Enter field key"
          onChange={handleKeyChange}
          className="w-full md:w-1/3 px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={field.type}
          onChange={handleTypeChange}
          className="w-full md:w-1/3 px-4 py-2 rounded-md border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select type</option>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="float">Float</option>
          <option value="boolean">Boolean</option>
          <option value="objectId">ObjectId</option>
          <option value="nested">Nested Field</option>
        </select>

        <button
          onClick={onDelete}
          className="w-full md:w-auto px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300"
        >
          🗑 Delete
        </button>
      </div>

      {/* Nested Fields */}
      {field.nested && (
        <div className="mt-4 ml-4 border-l-4 border-blue-300 pl-4 space-y-4">
          {field.fields?.map((child, index) => (
            <div key={child.id} className="ml-2">
              <FieldEditor
                field={child}
                onChange={(updatedChild) => {
                  const updatedFields = [...(field.fields || [])];
                  updatedFields[index] = updatedChild;
                  onChange({ ...field, fields: updatedFields });
                }}
                onDelete={() => {
                  const updatedFields = field.fields?.filter((_, i) => i !== index);
                  onChange({ ...field, fields: updatedFields });
                }}
              />
            </div>
          ))}

          <button
            onClick={handleAddNestedField}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-all"
          >
            ➕ Add Nested Field
          </button>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;
