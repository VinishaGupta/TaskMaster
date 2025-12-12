import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FixedSizeList as List } from "react-window";

const ROW_HEIGHT = 58;

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
  const scrollNodeRef = useRef(null);

  // DRAG END
  function handleDragEnd(result) {
    if (!result.destination) {
      onDragEnd();
      return;
    }

    reorderTodos(result.source.index, result.destination.index);
    onDragEnd();
  }

  // SPINNER HANDLER
  const triggerSpinner = (ms = 900) => {
    if (!showLoader) {
      setShowLoader(true);
      setTimeout(() => setShowLoader(false), ms);
    }
  };

  // SCROLL LISTENER (DOM-based)
  useEffect(() => {
    const node = scrollNodeRef.current;
    if (!node) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = node;
        if (scrollTop + clientHeight >= scrollHeight - 80) {
          triggerSpinner();
        }
        ticking = false;
      });
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [visibleTasks.length]);

  // ROW RENDERER — FIXED WITH REAL INDEXING
  const Row = useCallback(
    ({ index, style, data }) => {
      // Spinner row
      if (index === data.items.length && data.showLoader) {
        return (
          <div
            style={style}
            className="flex justify-center items-center"
          >
            <div className="w-7 h-7 border-2 border-gray-400 dark:border-gray-300 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }

      const task = data.items[index];
      if (!task) return null;

      const realIndex = data.startIndex + index;

      return (
        <Draggable draggableId={String(task.id)} index={realIndex} key={task.id}>
          {(prov, snapshot) => (
            <div
              ref={prov.innerRef}
              {...prov.draggableProps}
              style={{
                ...style,
                ...prov.draggableProps.style,
                width: "100%",
              }}
            >
              <div className="px-1 py-[6px]">
                <TodoItem
                  task={task}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  toggleComplete={toggleComplete}
                  dragHandleProps={prov.dragHandleProps}
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

  // EMPTY STATE
  if (visibleTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300 text-lg">
        No matching tasks found
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasklist" mode="virtual">
        {(provided) => (
          <div className="relative h-full">
            <List
              height={window.innerHeight * 0.52}
              itemCount={visibleTasks.length + (showLoader ? 1 : 0)}
              itemSize={ROW_HEIGHT}
              width="100%"
              itemData={{
                items: visibleTasks,
                showLoader,
                startIndex: 0,
              }}
              outerRef={(el) => {
                scrollNodeRef.current = el;

                if (typeof provided.innerRef === "function") {
                  provided.innerRef(el);
                } else if (provided.innerRef) {
                  provided.innerRef.current = el;
                }
              }}
              style={{
                overflowX: "hidden",
                paddingRight: "12px",
              }}
            >
              {Row}
            </List>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default memo(TodoList);
