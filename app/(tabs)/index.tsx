import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // For exit icon
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the type for a Note object
interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function NoteApp() {
  // State types
  const [notes, setNotes] = useState<Note[]>([]); // notes state holds an array of Note objects
  const [isDialogVisible, setDialogVisible] = useState<boolean>(false); // Visibility of dialog
  const [noteTitle, setNoteTitle] = useState<string>(''); // Title of the new note
  const [noteDescription, setNoteDescription] = useState<string>(''); // Description of the new note
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null); // Track the expanded note, can be string or null

  // Load notes from AsyncStorage when the app starts
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes)); // Parse the saved notes and set them in state
        }
      } catch (error) {
        console.error('Failed to load notes from AsyncStorage:', error);
      }
    };

    loadNotes();
  }, []);

  // Save notes to AsyncStorage whenever the notes array changes
  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes to AsyncStorage:', error);
      }
    };

    saveNotes();
  }, [notes]);

  const addNote = () => {
    if (noteTitle && noteDescription) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteTitle,
        description: noteDescription,
        createdAt: new Date().toLocaleString(), // Adds creation date
      };
      setNotes([...notes, newNote]);
      setNoteTitle('');
      setNoteDescription('');
      setDialogVisible(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleExpandNote = (id: string) => {
    if (expandedNoteId === id) {
      setExpandedNoteId(null); // Close the note if already expanded
    } else {
      setExpandedNoteId(id); // Expand the selected note
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold text-blue-600 mt-4 mb-2 pt-6 text-center">Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpandNote(item.id)} className="bg-white p-4 mb-4 mx-4 rounded-lg shadow">
            <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
            <Text className="text-xs text-gray-500">{item.createdAt}</Text>
            <Text className="text-gray-600 mb-2">{item.description}</Text>

            {/* Show delete button only if it's not expanded */}
            {expandedNoteId !== item.id && (
              <TouchableOpacity onPress={() => deleteNote(item.id)} className="self-end">
                <Text className="text-red-500 font-bold">Delete</Text>
              </TouchableOpacity>
            )}

            {/* Show the full note view when expanded */}
            {expandedNoteId === item.id && (
              <View className="top-0 left-0 right-0 bottom-0 h-lvh bg-white opacity-100 p-6">
                <TouchableOpacity onPress={() => setExpandedNoteId(null)} className="absolute top-4 right-4 ">
                  <Ionicons name="close-circle" size={30} color="red" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-800">{item.title}</Text>
                <Text className="text-lg text-gray-600 mb-4">{item.createdAt}</Text>
                <Text className="text-lg text-gray-600">{item.description}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* FAB to add a new note */}
      <FAB
        icon="plus"
        className="absolute bottom-3 right-4 bg-blue-600"
        onPress={() => setDialogVisible(true)}
      />

      {/* Note Input Dialog */}
      {isDialogVisible && (
        <View className="absolute bottom-16 left-4 right-4 p-4 bg-white rounded-lg shadow-lg">
          <View className='flex flex-row justify-between'>
            <Text className="text-lg font-bold mb-2">Add New Note</Text>
            <Text className="text-lg text-red-600" onPress={() => setDialogVisible(false)}>Back</Text>
          </View>
          <TextInput
            placeholder="Title"
            value={noteTitle}
            onChangeText={setNoteTitle}
            className="border-b border-gray-300 mb-2 p-2"
          />
          <TextInput
            placeholder="Description"
            value={noteDescription}
            onChangeText={setNoteDescription}
            multiline
            className="border-b border-gray-300 mb-4 p-2"
          />
          <TouchableOpacity onPress={addNote} className="bg-blue-500 p-3 rounded-lg">
            <Text className="text-center text-white font-semibold">Add Note</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
