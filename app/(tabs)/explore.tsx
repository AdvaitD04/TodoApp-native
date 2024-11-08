import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const addTask = () => {
    if (taskTitle && taskDescription && taskDate) {
      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        description: taskDescription,
        date: taskDate.toLocaleDateString(),
        done: false, // New property to track if task is done
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDate(new Date());
      setDialogVisible(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskDate;
    setDatePickerVisible(Platform.OS === 'ios' ? true : false); // iOS doesn't close by default
    setTaskDate(currentDate);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-xl font-bold text-blue-600 mt-4 mb-2 pt-6 text-center">TaskApp</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={`bg-white p-4 mb-4 mx-4 rounded-lg shadow-lg ${item.done ? 'bg-green-100' : ''}`}>
            <Text
              className={`text-lg font-semibold text-gray-800 ${item.done ? 'line-through text-gray-500' : ''}`}
            >
              {item.title}
            </Text>
            <Text
              className={`text-gray-600 mb-2 ${item.done ? 'line-through text-gray-500' : ''}`}
            >
              {item.description}
            </Text>
            <Text className="text-sm text-gray-500">{item.date}</Text>

            {/* Toggle Task Done */}
            <View className='flex flex-row justify-between mt-3'>
            <TouchableOpacity onPress={() => toggleTaskDone(item.id)} className=" mt-2">
              <Ionicons name={item.done ? "checkmark-circle" : "ellipse-outline"} size={24} color={item.done ? "green" : "gray"} />
            </TouchableOpacity>

            {/* Delete Task */}
            <TouchableOpacity onPress={() => deleteTask(item.id)} className=" mt-2">
              <Ionicons name="trash-bin-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
          </View>
        )}
      />

      {/* FAB to add a new task */}
      <FAB
        icon="plus"
        className="absolute bottom-3 right-4 bg-blue-600"
        onPress={() => setDialogVisible(true)}
      />

      {/* Task Input Dialog */}
      {isDialogVisible && (
        <View className="absolute bottom-16 left-4 right-4 p-4 bg-white rounded-lg shadow-lg">
          <View className='flex flex-row  justify-between'>
          <Text className="text-lg font-bold mb-2">Add New Note</Text>
          <Text className="text-lg text-red-400" onPress={() => setDialogVisible(false)}>Back</Text>
          </View>
          <TextInput
            placeholder="Task Title"
            value={taskTitle}
            onChangeText={setTaskTitle}
            className="border-b border-gray-300 mb-2 p-2"
          />
          <TextInput
            placeholder="Task Description"
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline
            className="border-b border-gray-300 mb-2 p-2"
          />

          {/* Date Picker */}
          <TouchableOpacity onPress={openDatePicker} className="border-b border-gray-300 mb-2 p-2">
            <Text className="text-gray-600">Select Task Date: {taskDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* DateTimePicker */}
          {isDatePickerVisible && (
            <DateTimePicker
              value={taskDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity onPress={addTask} className="bg-blue-500 p-3 rounded-lg mt-4">
            <Text className="text-center text-white font-semibold">Add Task</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
