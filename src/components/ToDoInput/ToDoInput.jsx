import React, { useEffect, useState } from 'react';
import Css from './input.module.css';
import Confetti from 'react-confetti';

function ToDoInput() {
    const [list, setList] = useState('');
    const [todos, setTodos] = useState([]);
    const [allCompleted, setAllCompleted] = useState(false);

    useEffect(() => {
        const getTodos = JSON.parse(localStorage.getItem('list')) || [];
        setTodos(getTodos);
        checkAllCompleted(getTodos);
    }, []);

    useEffect(() => {
        checkAllCompleted(todos);
    }, [todos]);

    const HandleButton = (e) => {
        e.preventDefault();
        if (!list.trim()) {
            return;
        }

        const newTask = {
            title: list,
            completed: false
        };

        const updatedTodos = [...todos, newTask];
        localStorage.setItem('list', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        setList('');
    };

    const HandleComplete = (index) => {
        const ChangeState = todos.map((todo, i) => {
            if (i === index) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        localStorage.setItem('list', JSON.stringify(ChangeState));
        setTodos(ChangeState);
    };

    const HandleDelete = (index) => {
        const ChangeState = todos.filter((_, i) => i !== index);
        localStorage.setItem('list', JSON.stringify(ChangeState));
        setTodos(ChangeState);
    };

    const startVoiceCommand = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Ваш браузер не поддерживает голосовые команды.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU'; 
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => {
            console.log('Voice recognition started. Try speaking into the microphone.');
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setList(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.start();
    };

    
    const checkAllCompleted = (todos) => {
        const allTasksCompleted = todos.length > 0 && todos.every(todo => todo.completed);
        setAllCompleted(allTasksCompleted);
    };

    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;

    return (
        <div className={Css.Main}>
           {allCompleted && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            <div className={Css.CounterWrapper}>
                <p>Total tasks: {totalCount}</p>
                <p>Completed tasks: {completedCount}</p>
            </div>
            <form onSubmit={HandleButton} className={Css.FormInput}>
                <button type="button" className={Css.VoiceButton} onClick={startVoiceCommand}>🎤</button>
                <input
                    type="text"
                    id="nu"
                    placeholder='Write your tasks'
                    value={list}
                    onChange={(e) => setList(e.target.value)}
                />
                <button type='submit' className={Css.AddButton} disabled={!list.trim()}>Add</button>
            </form>
            <ul className={Css.TaskList}>
                {todos.map((todo, index) => (
                    <li key={index} className={Css.TaskItem}>
                        <span className={todo.completed ? Css.True : Css.False}>
                            {todo.title}
                        </span>
                        <div className={Css.ButtonWrapper}>
                            <button className={Css.CompleteButton} onClick={() => HandleComplete(index)}>Complete</button>
                            <button className={Css.DeleteButton} onClick={() => HandleDelete(index)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDoInput;
