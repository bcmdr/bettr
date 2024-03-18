"use client";

import { useState, useEffect } from "react";
import "./ChoiceList.css";

interface Choice {
  title: string;
  year: string;
  selected: boolean;
  rank: number;
}

interface Props {
  choices: Choice[];
  id: string;
  onSave: Function | null;
  broadcast: Function | null;
  preview: boolean;
}

const ChoiceList = (props: Props) => {
  const [choices, setChoices] = useState(props.choices);

  useEffect(() => {
    if (props.preview) return; // don't load preview lists
    const localChoices =
      typeof window !== undefined && window?.localStorage?.getItem(props.id)
        ? JSON.parse(localStorage.getItem(props.id) || "")
        : props.choices;
    setChoices(localChoices);
    props.broadcast?.(choices);
  }, [props.choices]);

  const saveList = () => {
    if (props.preview) return; // don't save preview lists
    props.onSave?.(choices);
    localStorage.setItem(props.id, JSON.stringify(choices));
  };

  const toggleSelect = (index: number) => {
    if (props.preview) return; // don't select preview lists
    const newChoices = [...choices];
    // if (
    //   !newChoices[index].selected === false
    //   // && !confirm("Deselect this choice?")
    // )
    //   return;
    newChoices[index].selected = !newChoices[index].selected;
    setChoices(newChoices);
    updateRanks();
    saveList();
  };

  const moveRank = (index: number, direction: "up" | "down") => {
    if (props.preview) return; // don't move preview lists
    const newChoices = [...choices];
    const currentRank = newChoices[index].rank;
    if (direction === "up") {
      let swap = newChoices.find((choice) => choice.rank === currentRank - 1);
      if (!swap) return;
      swap.rank++;
      newChoices[index].rank--;
    } else if (direction === "down") {
      let swap = newChoices.find((choice) => choice.rank === currentRank + 1);
      if (!swap || swap.rank === -1) return;
      console.log(swap);
      swap.rank--;
      newChoices[index].rank++;
    }
    setChoices(newChoices);
    saveList();
  };

  const updateRanks = () => {
    if (props.preview) return; // don't update preview lists
    const selected = choices.filter((choice) => choice.selected);
    const unselected = choices.filter((choice) => !choice.selected);
    let rank = 1;
    const updatedChoices = selected.map((choice) => {
      choice.rank = rank++;
      return choice;
    });
    setChoices([...updatedChoices, ...unselected]);
  };

  return (
    <div>
      <ul>
        {choices
          .sort((a, b) => {
            return b.rank - a.rank;
          })
          .sort((x, y) => {
            return x.selected == true ? -1 : y.selected == true ? 1 : 0;
          })
          .map((choice, index) => (
            <li
              key={index}
              className={`choice ${choice.selected && "selected"}`}
            >
              <span className="title" onClick={() => toggleSelect(index)}>
                {choice.selected && `${choice.rank}. `}
                {choice.title}
                {choice.year && ` (${choice.year})`}
              </span>
              {!props.preview &&
                (choice.selected ? (
                  <div className="options">
                    <button
                      className={`btn`}
                      onClick={() => moveRank(index, "up")}
                    >
                      &uarr;
                    </button>
                    <button
                      className="btn"
                      onClick={() => moveRank(index, "down")}
                    >
                      &darr;
                    </button>
                  </div>
                ) : (
                  <div onClick={() => toggleSelect(index)} className="select">
                    Select
                  </div>
                ))}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChoiceList;
