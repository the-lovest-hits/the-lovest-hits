import { useState } from "react";

function ItemsList(props) {
  const itemsState = props.itemsState;
  const changeItems = props.onCountChange;

  const changeItem = (item) => {
    const newItemsState = [...itemsState];
    const foundedItemIndex = newItemsState.findIndex(findItem => findItem.id === item.id);

    newItemsState.forEach(item => item.active = false);

    newItemsState[foundedItemIndex].active = true;

    changeItems(newItemsState);
  }

  return (
    <>
      {
        itemsState.map((item, index) =>
          <div key={index} className={item.active ? 'cube col-8': 'cube col-2'} onClick={() => changeItem(item)}>
            <div className="cube__content">
              <p>{item.text}</p>
            </div>
          </div>
        )
      }
    </>
  );
}

function AccountAdd() {
  const [itemsState, changeItems] = useState([
    {
      text: 'lorem',
      id: 1,
      active: true
    },
    {
      text: 'lorem2',
      id: 2,
      active: false
    },
    {
      text: 'lorem3',
      id: 3,
      active: false
    }
  ]);

  return (
    <div className="row row--grid">
      <ItemsList itemsState={itemsState} onCountChange={changeItems} />
    </div>
  )
}

export default AccountAdd
