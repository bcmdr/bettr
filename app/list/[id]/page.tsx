"use client";

import { createClient } from "@/utils/supabase/client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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

interface Sub {
  created_by: string;
  list_id: string;
  choices: Choice[];
  tag: string;
  votes: number;
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
  const choicesToSubmit = useRef<Choice[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [tag, setTag] = useState("");

  const supabase = createClient();

  const getSubs = async () => {
    if (!window.location.hash) return;
    setTag(window.location.hash);
    const { data } = await supabase
      .from("subs")
      .select()
      .eq("tag", window.location.hash)
      .eq("list_id", idToSearch);
    console.log(data);
    setSubs(data as Sub[]);
  };

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
    getSubs();
  }, []);

  const handleSubmit = async () => {
    if (!list.id) return;
    if (!choicesToSubmit.current) return;
    let tagToSubmit = tag || `#${prompt("Leaderboard #")?.trim()}`;
    let name = prompt("What's Your Name?")?.trim();

    if (!tagToSubmit || !name) return;

    console.log(choicesToSubmit.current);

    const subToInsert = {
      created_by: name,
      list_id: list.id,
      choices: choicesToSubmit.current,
      tag: `${tagToSubmit}`,
      votes: 1,
    };

    const { error } = await supabase.from("subs").insert(subToInsert);

    if (error) {
      console.error(error);
      if (error.code === "23505") {
        alert(
          "Score for this user and tag already exists, please submit with a different username"
        );
      }
      return;
    }

    setSubs([...subs, subToInsert]);
    setTag(tagToSubmit);
    window.location.hash = tagToSubmit;
  };

  const handleSave = (choices: Choice[]) => {
    choicesToSubmit.current = choices;
  };

  const onBroadcast = (choices: Choice[]) => {
    choicesToSubmit.current = choices;
  };

  return (
    <>
      {list.choices.length > 0 && (
        <div className="topic">
          <header className="header">
            <div>
              <h2>{list.title}</h2>
              {/* <div className="text-sm">{list.description}</div> */}
            </div>
            <div>
              <span className="p-1 px-2 mr-2 text-sm font-bold"> {tag}</span>
              <button
                className="border border-white p-1 px-2 text-sm"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </button>
            </div>
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
            preview={false}
            broadcast={onBroadcast}
            onSave={handleSave}
          />
        </div>
      )}
      <div className="sub-list">
        {subs?.map((sub, index) => {
          return (
            <div key={index}>
              <div>
                <h3>{sub.created_by}</h3>
                <ChoiceList
                  id={list.id}
                  choices={sub.choices.filter((choice) => choice.selected)}
                  preview={true}
                  broadcast={null}
                  onSave={null}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
