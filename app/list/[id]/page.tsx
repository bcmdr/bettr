"use client";

import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormEvent } from "react";

interface List {
  title: string;
  description: string;
  choices: Array<Choice>;
}

interface Choice {
  title: string;
  year: string;
}

export default function ListById() {
  const searchParams = useParams();
  const idToSearch = searchParams.id;
  const [list, setList] = useState<List>({
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
      <form onSubmit={onSubmit} className="bg-gray-300">
        <ol>
          {choices.map((choice, index) => (
            <li key={index} className="list-item m-3 p-2 bg-white">
              <div className="mb-2">
                {index + 1}. {choice.title} ({choice.year})
              </div>
              <div className="btn-container flex">
                <button
                  className="btn flex-grow"
                  type="button"
                  onClick={() => moveItem(index, "up")}
                >
                  Better
                </button>
                <button
                  className="btn flex-grow"
                  type="button"
                  onClick={() => moveItem(index, "down")}
                >
                  Worse
                </button>
              </div>
            </li>
          ))}
        </ol>
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
