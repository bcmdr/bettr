"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormEvent } from "react";
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
  const searchParams = useParams();
  const idToSearch = searchParams.id;
  const [list, setList] = useState<List>({
    id: "",
    title: "",
    description: "",
    choices: [],
  });
  const [choices, setChoices] = useState<Choice[]>([]);
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

      // const formattedChoices: Choice[] = [];
      // for (let choice of result.choices) {
      //   formattedChoices.push({
      //     title: choice.title,
      //     year: choice.year,
      //     rank: -1,
      //     selected: false,
      //   });
      // }

      // setChoices(formattedChoices);
    };

    getList();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    console.log(formData);
    // const response = await fetch("/api/submit", {
    //   method: "POST",
    //   body: formData,
    // });

    // // Handle response if necessary
    // const data = await response.json();
    // // ...
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

  return (
    <>
      {list.choices.length > 0 && (
        <div className="topic">
          <header className="header">
            <div>
              <h2>{list.title}</h2>
              <p className="text-sm">{list.description}</p>
            </div>
            <Link className="text-sm" href="/">
              &larr; Back
            </Link>
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
          />
        </div>
      )}
    </>
  );
}
