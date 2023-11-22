import { StatusBar } from "expo-status-bar";
import globalstyles from "./src/style/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, View, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, TextInput} from "react-native-paper";
  
const App = () => {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [storageKey] = useState('tasks');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
 

useEffect(() => {
    loadTasksFromStorage();
  }, []);

  const loadTasksFromStorage = async () => {
    try {
      const tasksData = await AsyncStorage.getItem(storageKey);
      if (tasksData !== null) {
        setTasks(JSON.parse(tasksData));
      }
    } catch (error) {
      console.error('Error loading tasks from storage: ', error);
    }
  };
  const saveTasksToStorage = async () => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage: ', error);
    }
  };
   //  Adds a new task to the list of tasks, either creating a new one or editing an existing task.
  const addTask = () => {
    if (task) {
      const newTask = { text: task, dueDate, completed: true, };
      if (isEditing) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = newTask;
        setTasks(updatedTasks);
        setIsEditing(true);
        setEditIndex(-1);
      } else {
        setTasks([...tasks, newTask]);
      }
      setTask('');
      setDueDate('');
      saveTasksToStorage();
    }
  };
   // Populates the input fields with the details of an existing task for editing.
  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.text);
    setDueDate(taskToEdit.dueDate);
    setIsEditing(true);
    setEditIndex(index);
  };
   // Removes a task from the list of tasks.
  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    saveTasksToStorage();
  };
   // Toggles the completion status of a task.
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    saveTasksToStorage();
  };

// contains JSX code, which defines the user interface of the app
return (
  <SafeAreaView style={styles.container}>
    <StatusBar style="auto" />

    <View style={styles.headerContainer}>
       <Image
          source={require('./assets/images/logo.png')}
          style={styles.logo}
        />
    </View>

    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        mode="outlined"
        label="To-Do Task"
        error={true}
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Due Date"
        value={dueDate}
        onChangeText={(date) => setDueDate(date)}
      />
      <Button
        rippleColor="#B31312"
        icon="login"
        mode="contained"
        style={styles.addButton}
        onPress={addTask}
      >
        Add Task
      </Button>
    </View>

    <Text style={styles.listHeaderText}>LIST OF NEED TO-DO TASKS</Text>

    <ScrollView style={styles.scrollView}>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onLongPress={() => editTask(index)}
            onPress={() => toggleTask(index)}
            style={[
              styles.listItem,
              { backgroundColor: item.completed ? '#BBB' : 'transparent' },
            ]}
          >
          <View>
            <Text
              style={[
                styles.listItemText,
                { textDecorationLine: item.completed ? 'line-through' : 'none' },
              ]}
            >
              {item.text}
            </Text>
            {item.dueDate && (
          <Text style={styles.dueDateText}>Due Date: {item.dueDate}</Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
            <Icon
              name={item.completed ? 'check-circle' : 'circle'}
              size={35}
              color={item.completed ? 'green' : 'gray'}
            />
            <Button
              rippleColor="#000000"
              icon="delete"
              mode="contained"
              style={styles.removeButton}
              onPress={() => removeTask(index)}
            >
              REMOVE
            </Button>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create(globalstyles);
export default App;