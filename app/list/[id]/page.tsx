"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChoiceList from "@/components/ChoiceList";
import "../../page.css";

interface List {
  id: string;
  title: string;
  description: string;
  choices: Array<Choice>;
}

interface Choice {
  title: string;
  year: string;
  selected: boolean;
  rank: number;
}

export default function ListById() {
  const params = useParams();
  const idToSearch = params.id;
  const [list, setList] = useState<List>({
    id: "",
    title: "",
    description: "",
    choices: [],
  });
  const [choices, setChoices] = useState<Choice[]>([]);
  const [choicesToSubmit, setChoicesToSubmit] = useState<Choice[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const getList = async () => {
      const { data } = await supabase
        .from("lists")
        .select()
        .eq("id", idToSearch);
      const result = data?.[0] as List;
      setList(result);
      setChoices(result.choices);
    };

    getList();

    const getSubs = async () => {
      if (!window.location.hash) return;
      const { data } = await supabase
        .from("subs")
        .select()
        .eq("tag", window.location.hash);
      console.log(data);
    };

    getSubs();
  }, []);

  const handleSubmit = async () => {
    if (!list.id) return;
    if (choicesToSubmit.length <= 0) return;
    let tag = prompt("Leaderboard Tag?")?.trim();
    let name = prompt("Username?")?.trim();

    if (tag && tag?.length <= 0) return;
    if (name && name?.length <= 0) console.log(choicesToSubmit);

    const { error } = await supabase.from("subs").insert({
      created_by: name,
      list_id: list.id,
      choices: choices,
      name_tag: name + "_" + tag,
      tag: `#${tag}`,
      votes: 1,
    });
  };

  const moveItem = (index: number, direction: string) => {
    const newChoices = [...choices];
    // Swap the movie at the current index with the movie at the new index
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < choices.length) {
      const temp = newChoices[index];
      newChoices[index] = newChoices[newIndex];
      newChoices[newIndex] = temp;
      setChoices(newChoices); // Update the state with the new array of movies
    }
  };

  const handleSave = (choices: Choice[]) => {
    setChoicesToSubmit(choices);
  };

  return (
    <>
      {list.choices.length > 0 && (
        <div className="topic">
          <header className="header">
            <Link className="text-sm" href="/">
              &larr; Back
            </Link>
            <div>
              <h2>{list.title}</h2>
              <p className="text-sm">{list.description}</p>
            </div>
            <button
              className="btn"
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </button>
          </header>
          <ChoiceList
            id={list.id}
            choices={list.choices.map((choice) => {
              return {
                title: choice.title,
                year: choice.year,
                rank: -1,
                selected: false,
              };
            })}
            onSave={handleSave}
          />
        </div>
      )}
    </>
  );
}
