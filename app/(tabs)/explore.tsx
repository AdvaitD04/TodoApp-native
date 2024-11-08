import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for a Task
interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  done: boolean;
}

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks, type it as an array of Task
  const [isDialogVisible, setDialogVisible] = useState<boolean>(false); // State for dialog visibility
  const [taskTitle, setTaskTitle] = useState<string>(''); // State for task title
  const [taskDescription, setTaskDescription] = useState<string>(''); // State for task description
  const [taskDate, setTaskDate] = useState<Date>(new Date()); // State for task date
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false); // State for date picker visibility

  // Load tasks from AsyncStorage when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks)); // Parse and set tasks from storage
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever the tasks change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as a string
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    };
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  const addTask = () => {
    if (taskTitle && taskDescription && taskDate) {
      const newTask: Task = {
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

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskDone = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || taskDate;
    setDatePickerVisible(Platform.OS === 'ios' ? true : false); // iOS doesn't close by default
    setTaskDate(currentDate);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold text-blue-600 mt-4 mb-2 pt-6 text-center">TaskApp</Text>

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
           
            <View className='flex flex-row justify-between pt-2'>
              {/* Toggle Task Done */}
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
            <Text className="text-lg font-bold mb-2 ">Add New Task</Text>
            <Text className="text-lg text-red-600" onPress={() => setDialogVisible(false)}>Back</Text>
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
