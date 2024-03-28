"use client"
import React, { useState } from 'react';
import HybridInput from '@/components/HybridInput';
import useStore from '@/store';

const Home: React.FC = () => {
  // Destructure state and setters from the custom hook
  const { savedValues, setSavedValues, inputValue, setInputValue, inputSuggestions, setInputSuggestions } = useStore();
  
  // State for tracking the index of the currently edited item
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Handler for input change event
  const handleInputChange = async (value: string) => {
    setInputValue(value);
    try {
      const response = await fetch(
        `http://localhost:3000/api/suggestions?input=${value}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const { suggestions } = await response.json();
      setInputSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handler for saving input
  const handleSave = () => {
    // Check if input value is not empty
    if (inputValue.trim() === '') {
      return;
    }
  
    // Check if previous value is an operator '+'
    if (savedValues.length >= 2 && savedValues[savedValues.length - 1] === '+') {
      const leftValue = savedValues[savedValues.length - 2];
      // Concatenate or add based on input type
      if (typeof inputValue === 'string') {
        const result = leftValue + inputValue;
        setSavedValues([...savedValues.slice(0, -2), result]);
        setInputValue('');
        return;
      }
      const rightValue = parseFloat(inputValue);
      if (!isNaN(rightValue)) {
        const sum = parseFloat(leftValue) + rightValue;
        setSavedValues([...savedValues.slice(0, -2), sum.toString()]);
        setInputValue('');
        return;
      } else {
        console.error('Invalid input for operand +');
      }
    } else {
      // Simply add the input value to the array if not an operator
      setSavedValues([...savedValues, inputValue]);
      setInputValue('');
    }
  };
  
  // Handler for updating saved value
  const handleUpdate = (index: number) => {
    const newSavedValues = [...savedValues];
    newSavedValues[index] = inputValue;
    setSavedValues(newSavedValues);
    setEditingIndex(null);
  };

  // Handler for editing saved value
  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <div className="m-10 flex border p-5 gap-5">
      <div>
        <ul className="flex gap-2">
          {savedValues.map((savedValue, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <HybridInput
                  initialValue={savedValue}
                  suggestions={inputSuggestions}
                  onInputChange={setInputValue}
                  onSave={() => handleUpdate(index)}
                />
              ) : (
                <>
                  {savedValue}{' '}
                  {savedValue && <button onClick={() => handleEdit(index)}>(x)</button>}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <HybridInput
        suggestions={inputSuggestions}
        onInputChange={handleInputChange}
        onSave={handleSave}
      />
    </div>
  );
};

export default Home;