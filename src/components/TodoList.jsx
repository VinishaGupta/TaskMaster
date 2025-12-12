import React, { useCallback, useState, memo } from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FixedSizeList as List } from "react-window";

const ROW_HEIGHT = 60; // compact row height

function TodoList({
  visibleTasks,
  deleteTask,
  editTask,
  toggleComplete,
  onDragStart,
  onDragEnd,
  reorderTodos,
}) {
  const [showLoader, setShowLoader] = useState(false);

  // --- DRAG END ---
  function handleDragEnd(result) {
    if (!result.destination) {
      onDragEnd();
      return;
    }

    reorderTodos(result.source.index, result.destination.index);
    onDragEnd();
  }

  // --- SCROLL DETECTION FOR SPINNER ---
  const handleScroll = ({ scrollOffset, clientHeight }) => {
    const totalHeight = visibleTasks.length * ROW_HEIGHT;

    // show spinner when user is near bottom
    const threshold = 80;

    if (scrollOffset + clientHeight >= totalHeight - threshold) {
      if (!showLoader) {
        setShowLoader(true);
        setTimeout(() => setShowLoader(false), 900);
      }
    }
  };

  // --- ROW RENDERER ---
  const Row = useCallback(
    ({ index, style }) => {
      const task = visibleTasks[index];
      if (!task) return null;

      return (
        <Draggable draggableId={String(task.id)} index={index} key={task.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={{
                ...style,
                ...provided.draggableProps.style,
                width: "100%",
              }}
            >
              <div className="px-1 pb-1">
                <TodoItem
                  task={task}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  toggleComplete={toggleComplete}
                  dragHandleProps={provided.dragHandleProps}
                  dragging={snapshot.isDragging}
                />
              </div>
            </div>
          )}
        </Draggable>
      );
    },
    [visibleTasks]
  );

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="list"
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => {
          const task = visibleTasks[rubric.source.index];

          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={provided.draggableProps.style}
            >
              <div className="px-1 pb-1">
                <TodoItem
                  task={task}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  toggleComplete={toggleComplete}
                  dragHandleProps={provided.dragHandleProps}
                  dragging={snapshot.isDragging}
                />
              </div>
            </div>
          );
        }}
      >
        {(provided) => (
          <>
            <List
              height={window.innerHeight * 0.52}
              itemCount={visibleTasks.length}
              itemSize={ROW_HEIGHT}
              width="100%"
              outerRef={provided.innerRef}
              onScroll={handleScroll}
              style={{
                overflowX: "hidden",
                paddingRight: "10px",
                paddingBottom: "20px",
              }}
            >
              {Row}
            </List>

            {/* ★ Bottom spinner */}
            {showLoader && (
              <div className="flex justify-center py-3">
                <div className="w-7 h-7 border-2 border-gray-400 dark:border-gray-300 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default memo(TodoList);
