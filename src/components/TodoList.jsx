import React, { useCallback, useState, memo } from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FixedSizeList as List } from "react-window";

const ROW_HEIGHT = 68; // ⬅ slightly taller rows

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

  /* ---------------- DRAG END ---------------- */
  function handleDragEnd(result) {
    if (!result.destination) {
      onDragEnd();
      return;
    }

    reorderTodos(result.source.index, result.destination.index);
    onDragEnd();
  }

  /* ---------------- SCROLL LOADER ---------------- */
  const handleScroll = ({ scrollOffset, clientHeight }) => {
    const totalHeight = visibleTasks.length * ROW_HEIGHT;

    if (scrollOffset + clientHeight >= totalHeight - 80) {
      if (!showLoader) {
        setShowLoader(true);
        setTimeout(() => setShowLoader(false), 900);
      }
    }
  };

  /* ---------------- ROW ---------------- */
  const Row = useCallback(
    ({ index, style }) => {
      const task = visibleTasks[index];
      if (!task) return <div style={style} />;

      return (
        <Draggable draggableId={String(task.id)} index={index}>
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
              {/* Reduced vertical gap, taller item */}
              <div className="px-3 py-2.5">
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
    [visibleTasks, deleteTask, editTask, toggleComplete]
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
              <div className="px-3 py-2.5">
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
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="relative w-full h-full"
          >
            {/* EMPTY STATE */}
            {visibleTasks.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-lg">
                No tasks found
              </div>
            )}

            {/* LIST */}
            {visibleTasks.length > 0 && (
              <List
                height={window.innerHeight * 0.52}
                itemCount={visibleTasks.length}
                itemSize={ROW_HEIGHT}
                width="100%"
                outerRef={provided.innerRef}
                onScroll={handleScroll}
                style={{
                  overflowX: "hidden",
                  paddingRight: "8px",
                  paddingBottom: "12px",
                }}
              >
                {Row}
              </List>
            )}

            {/* BOTTOM LOADER */}
            {showLoader && visibleTasks.length > 0 && (
              <div className="flex justify-center py-2">
                <div className="w-6 h-6 border-2 border-gray-400 dark:border-gray-200 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default memo(TodoList);
