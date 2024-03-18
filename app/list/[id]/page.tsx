"use client";

import { createClient } from "@/utils/supabase/client";

import {
  useParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
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
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();
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
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [tag, setTag] = useState(search.get("tag") || "global");

  const supabase = createClient();

  const getSubs = async (subTag: string) => {
    // if (!window.location.hash) return;
    setLoadingSubs(true);
    let tagToSearch = subTag ? subTag : tag;
    const { data } = await supabase
      .from("subs")
      .select()
      .eq("tag", tagToSearch)
      .eq("list_id", idToSearch);
    console.log(data);
    setSubs(data as Sub[]);
    setLoadingSubs(false);
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
    getSubs("");
  }, []);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(search.toString());
      params.set(name, value);

      return params.toString();
    },
    [search]
  );

  const askTag = () =>
    prompt("Leaderboard Tag (#)")?.trim().replace(/^#+/, "") || "";

  const handleSubmit = async () => {
    if (!list.id) return;
    if (!choicesToSubmit.current) return;
    let searchTag = search.get("tag");
    let tagToSubmit = searchTag ? searchTag : askTag();
    if (tagToSubmit.length == 0) tagToSubmit = "global";

    let localName = window.localStorage.getItem("username");

    let nameToSubmit = localName
      ? localName
      : prompt(`Submitting To ${tagToSubmit}. Your Name:`)?.trim();
    if (!nameToSubmit) return;

    console.log(choicesToSubmit.current);

    const subToInsert = {
      created_by: nameToSubmit,
      list_id: list.id,
      choices: choicesToSubmit.current,
      tag: `${tagToSubmit.toLowerCase()}`,
      votes: 1,
    };

    const { error } = await supabase.from("subs").insert(subToInsert);

    if (error) {
      console.error(error);
      // if (error.code === "23505") {
      //   alert(
      //     "Score for this user and tag already exists, please submit with a different username"
      //   );
      // }
      return;
    }
    router.push(pathname + "?" + createQueryString("tag", tagToSubmit));
    setSubs([...subs, subToInsert]);
    setTag(tagToSubmit);
  };

  const handleSave = (choices: Choice[]) => {
    choicesToSubmit.current = choices;
  };

  const onBroadcast = (choices: Choice[]) => {
    choicesToSubmit.current = choices;
  };

  return (
    <>
      <section className="p-3 mt-3 text-center">
        <h1
          onClick={() => {
            let tagToSet = `${askTag()}`;
            if (tagToSet.length == 0) return;
            router.push(pathname + "?" + createQueryString("tag", tagToSet));
            setTag(tagToSet);
            getSubs(tagToSet);
          }}
          className="font-bold text-xl"
        >
          {tag}
        </h1>
        {loadingSubs ? (
          <p className="text-sm">...</p>
        ) : (
          <p className="text-sm">{subs?.length || "0"} Submissions</p>
        )}
      </section>
      {list.choices.length == 0 ? (
        <>
          <div className="topic">
            <header className="header font-bold text-lg">...</header>
          </div>
        </>
      ) : (
        <div className="topic">
          <header className="header">
            <div>
              <h2>{list.title}</h2>
              {/* <div className="text-sm">{list.description}</div> */}
            </div>
            <div>
              {/* <span className="p-1 px-2 mr-2 text-sm"> {tag}</span> */}
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
      <div id="submissions" className="sub-list">
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
