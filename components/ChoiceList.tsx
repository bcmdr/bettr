"use client";

import { useState, useEffect } from "react";
import "./ChoiceList.css";

interface Choice {
  title: string;
  year: string;
  selected: boolean;
  rank: number;
}

interface Counts {
  ranks: Map<string, number>;
  votes: Map<string, number>;
}

interface Props {
  choices: Choice[];
  id: string;
  onSave: Function | null;
  broadcast: Function | null;
  preview: boolean;
  counts: Counts | null;
}

const ChoiceList = (props: Props) => {
  const [choices, setChoices] = useState(props.choices);
  const subRanks = props.counts
    ? Array.from(props.counts.ranks)
        .map(([key, value]) => {
          return { title: key, points: value, rank: -1 };
        })
        .sort((a, b) => {
          return b.points - a.points;
        })
    : null;
  let position = 1;
  subRanks?.forEach((item, index) => {
    item.rank =
      item.points >= subRanks[index + 1]?.points ? position : index + 1;
    if (subRanks[index + 1]?.points < item.points) position = index + 2;
  });
  console.table(subRanks);

  useEffect(() => {
    if (props.preview) return; // don't load preview lists
    const localChoices =
      typeof window !== undefined && window?.localStorage?.getItem(props.id)
        ? JSON.parse(localStorage.getItem(props.id) || "")
        : props.choices;
    setChoices(localChoices);
    props.broadcast?.(localChoices);
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
    const updatedUnselected = unselected.map((choice) => {
      choice.rank = -1;
      return choice;
    });
    setChoices([...updatedChoices, ...updatedUnselected]);
  };

  return (
    <div>
      <ul>
        {choices
          .sort((a, b) => {
            let ar = subRanks?.find((rank) => rank.title === a.title)?.rank;
            let br = subRanks?.find((rank) => rank.title === b.title)?.rank;
            if (!ar) ar = Infinity;
            if (!br) br = Infinity;
            if (br && ar) return ar - br;
            return 0;
          })
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
                <span className="text-gray-500">
                  {choice.year && ` (${choice.year}) `}
                </span>
                {subRanks && (
                  <span className="text-cyan-700 font-normal">
                    {subRanks.findIndex(
                      (rank) => rank.title === choice.title
                    ) >= 0
                      ? `[${
                          subRanks.find((rank) => rank.title === choice.title)
                            ?.rank
                        }]`
                      : ``}
                  </span>
                )}
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
