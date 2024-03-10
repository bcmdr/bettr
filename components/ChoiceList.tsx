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
}

const ChoiceList = (props: Props) => {
  const [choices, setChoices] = useState(props.choices);
  useEffect(() => {
    if (props.choices) {
      setChoices(props.choices);
    }
  }, [props.choices]);

  const toggleSelect = (index: number) => {
    const newChoices = [...choices];
    if (
      !newChoices[index].selected === false &&
      !confirm("Deselect this choice?")
    )
      return;
    newChoices[index].selected = !newChoices[index].selected;
    setChoices(newChoices);
    updateRanks();
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
              <span onClick={() => toggleSelect(index)}>
                {choice.selected && `${choice.rank}. `}
                {choice.title}
                {choice.year && ` (${choice.year})`}
              </span>
              {choice.selected && (
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
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChoiceList;
