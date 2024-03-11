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
}

const ChoiceList = (props: Props) => {
  const [choices, setChoices] = useState(props.choices);

  useEffect(() => {
    const localChoices =
      typeof window !== undefined && window?.localStorage?.getItem(props.id)
        ? JSON.parse(localStorage.getItem(props.id) || "")
        : props.choices;
    setChoices(localChoices);
  }, [props.choices]);

  const saveList = () => {
    localStorage.setItem(props.id, JSON.stringify(choices));
  };

  const toggleSelect = (index: number) => {
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
    const newChoices = [...choices];
    const currentRank = newChoices[index].rank;
    if (direction === "up") {
      let swap = newChoices.find((movie) => movie.rank === currentRank - 1);
      if (!swap) return;
      swap.rank++;
      newChoices[index].rank--;
    } else if (direction === "down") {
      let swap = newChoices.find((movie) => movie.rank === currentRank + 1);
      if (!swap) return;
      swap.rank--;
      newChoices[index].rank++;
    }
    setChoices(newChoices);
    saveList();
  };

  const updateRanks = () => {
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
              {choice.selected ? (
                <div className="options">
                  <button
                    className={`btn`}
                    onClick={() => moveRank(index, "up")}
                  >
                    Better
                  </button>
                  <button
                    className="btn"
                    onClick={() => moveRank(index, "down")}
                  >
                    Worse
                  </button>
                </div>
              ) : (
                <div onClick={() => toggleSelect(index)} className="select">
                  Select
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChoiceList;
