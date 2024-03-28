import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import useStore from '@/store';

interface HybridInputProps {
    suggestions: string[];
    onInputChange: (value: string) => void;
    onSave: () => void;
    initialValue?: string;
}

const HybridInput: React.FC<HybridInputProps> = ({ onInputChange, onSave, initialValue }) => {
    // State for input value and suggestions list
    const [value, setValue] = useState(initialValue ?? '');
    const [suggestionsList, setSuggestionsList] = useState<string[]>([]);
    // Access savedValues state from the store
    const { savedValues, setSavedValues } = useStore();

    // Handler for input change event
    const handleChange = (
        event: React.FormEvent<HTMLInputElement>,
        { newValue }: Autosuggest.ChangeEvent,
    ) => {
        setValue(newValue);
        onInputChange(newValue);
    };

    // Fetch suggestions based on input value
    const getSuggestions = async (inputValue: string) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/suggestions?input=${inputValue}`,
            );
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }
            const data = await response.json();
            setSuggestionsList(data.suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestionsList([]);
        }
    };

    // Handlers for autosuggest component
    const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
        getSuggestions(value);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestionsList([]);
    };

    // Handler for key press event
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSave();
            setValue('');
        }
    };

    // Handler for saving input value
    const handleSave = (word: string) => {
        setSavedValues([...savedValues, word]);
    };

    // Handler for editing input value
    const handleEdit = (word: string) => {
        setValue(word);
    };

    // Render suggestion item
    const renderSuggestion = (suggestion: string) => <div>{suggestion}</div>;

    // Props for input component
    const inputProps = {
        placeholder: 'Enter something...',
        value,
        onChange: handleChange,
        onKeyPress: handleKeyPress,
    };

    return (
        <div>
            <Autosuggest
                suggestions={suggestionsList}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={(value) => value}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps as Autosuggest.InputProps<string>}
            />
        </div>
    );
};

export default HybridInput;