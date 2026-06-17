import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialItems = {
  todo: [
    { id: 't1', title: 'Review Syrian Economic Data' },
    { id: 't2', title: 'Verify Yemen GDP figures' }
  ],
  inProgress: [
    { id: 'p1', title: 'Analyze Ukraine Energy Sector Impact' }
  ],
  done: [
    { id: 'd1', title: 'Compile Africa Region Summary' }
  ]
};

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card p-4 mb-2 rounded-md shadow-sm border border-border text-sm font-medium hover:ring-2 ring-primary/50 cursor-grab active:cursor-grabbing"
    >
      {props.title}
    </div>
  );
}

const KanbanPage = () => {
  const [items, setItems] = useState(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id) || over.id;

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex(i => i.id === active.id);
      const overIndex = items[overContainer].findIndex(i => i.id === over.id);

      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }));
      }
    } else {
      const activeItems = items[activeContainer];
      const overItems = items[overContainer];
      const activeIndex = activeItems.findIndex(i => i.id === active.id);
      const overIndex = overItems.findIndex(i => i.id === over.id);

      let newIndex;
      if (over.id in items) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      setItems((prev) => {
        const itemToMove = prev[activeContainer][activeIndex];
        const newActiveItems = [...prev[activeContainer]];
        newActiveItems.splice(activeIndex, 1);

        const newOverItems = [...prev[overContainer]];
        newOverItems.splice(newIndex, 0, itemToMove);

        return {
          ...prev,
          [activeContainer]: newActiveItems,
          [overContainer]: newOverItems,
        };
      });
    }
  };

  const findContainer = (id) => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].some((item) => item.id === id));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Investigation Board</h1>
        <p className="text-muted-foreground">Manage your analytical tasks using a Kanban-style drag-and-drop interface.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(items).map(([columnId, columnItems]) => (
            <div key={columnId} className="flex-1 min-w-[300px] bg-secondary/30 p-4 rounded-xl border border-border flex flex-col">
              <h2 className="font-semibold text-sm uppercase mb-4 text-muted-foreground">
                {columnId === 'todo' ? 'To Investigate' : columnId === 'inProgress' ? 'Analyzing' : 'Reviewed'}
                <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                  {columnItems.length}
                </span>
              </h2>
              
              <div className="flex-1">
                <SortableContext
                  id={columnId}
                  items={columnItems.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="min-h-[200px]">
                    {columnItems.map((item) => (
                      <SortableItem key={item.id} id={item.id} title={item.title} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanPage;
