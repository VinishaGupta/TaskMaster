import React from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTodos from "../hooks/useTodos";

export default function TodoList({
  visibleTasks,
  deleteTask,
  editTask,
  toggleComplete,
  onDragStart,
  onDragEnd
}) {
  const { reorderTodos } = useTodos();

  function handleDragEnd(result) {
    if (!result.destination) {
      onDragEnd();
      return;
    }

    onDragEnd();
    reorderTodos(result.source.index, result.destination.index);
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasklist">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-4"
          >
            {visibleTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(prov, snapshot) => {
                  const style = {
                    ...prov.draggableProps.style,
                    transition: snapshot.isDragging ? "none" : "transform 180ms ease"
                  };

                  return (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      style={style}
                    >
                      <TodoItem
                        task={task}
                        deleteTask={deleteTask}
                        editTask={editTask}
                        toggleComplete={toggleComplete}
                        dragHandleProps={prov.dragHandleProps}
                        dragging={snapshot.isDragging}
                      />
                    </div>
                  );
                }}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
