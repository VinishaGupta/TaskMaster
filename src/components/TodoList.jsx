import React from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TodoList({
  visibleTasks,
  deleteTask,
  editTask,
  toggleComplete,
  onDragStart,
  onDragEnd,
  reorderTodos,
}) {
  function handleDragEnd(result) {
    if (!result.destination) {
      onDragEnd();
      return;
    }

    reorderTodos(result.source.index, result.destination.index);
    onDragEnd();
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
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
              >
                {(prov, snapshot) => {
                  const style = {
                    ...prov.draggableProps.style,
                    transition: snapshot.isDragging
                      ? "none"
                      : prov.draggableProps.style?.transition,
                  };

                  return (
                    <div
                      ref={prov.innerRef}
                      style={style}
                      {...prov.draggableProps} // container draggable
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
