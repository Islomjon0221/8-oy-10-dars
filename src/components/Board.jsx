// src/components/Board.jsx
import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Board = () => {
  const [lists, setLists] = useState([
    { id: '1', title: 'To Do', cards: [] },
    { id: '2', title: 'In Progress', cards: [] },
    { id: '3', title: 'Done', cards: [] },
  ]);
  const [cardTitle, setCardTitle] = useState(null)
  const handleChange = (event) => {
    setCardTitle(event.target.value)
  }
  const validate = () => {
    if (!cardTitle){
      alert("You must to enter word")
      return false
    }
    if (cardTitle.trim().length <= 3) {
      alert("word must be more than 3 words")
      return false
    }
    return true
  }
  const handleAddItem = (id) => {
    setLists((prevLists) => {
      return prevLists.map((list, listIndex) => {
        if (list.id === id && validate()) {
          const newItem = {
            id: `${id}-${list.cards.length + 1}`,
            content: cardTitle
          };  
          console.log(cardTitle.length);
          setCardTitle('')        
          return {
            ...list,
            cards: [...list.cards, newItem]
          };
        }
        return list;
      });
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const list = lists.find(list => list.id === source.droppableId);
      const [reorderedItem] = list.cards.splice(source.index, 1);
      list.cards.splice(destination.index, 0, reorderedItem);
    } else {
      const sourceList = lists.find(list => list.id === source.droppableId);
      const destinationList = lists.find(list => list.id === destination.droppableId);
      const [movedItem] = sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, movedItem);
    }

    setLists([...lists]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {lists.map((list, index) => (
          <Droppable key={list.id} droppableId={list.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="list">
                <h3>{list.title}</h3>
                {list.cards.map((card, cardIndex) => (
                  <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="card"
                      >
                        {card.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {
                  list.id == 1 ? (<form onSubmit={(e) => { handleAddItem(list.id), e.preventDefault() }}><input type="text" placeholder='Enter todo ...' value={cardTitle} onChange={handleChange} /></form>) : null
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
