import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // For exit icon

export default function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null); // Track the expanded note

  const addNote = () => {
    if (noteTitle && noteDescription) {
      const newNote = {
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

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleExpandNote = (id) => {
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
              <View className="top-0 left-0 right-0 bottom-0 h-lvh  bg-white opacity-100 p-6">
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
          <View className='flex flex-row  justify-between'>
          <Text className="text-lg font-bold mb-2">Add New Note</Text>
          <Text className="text-lg text-red-400" onPress={() => setDialogVisible(false)}>Back</Text>
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
