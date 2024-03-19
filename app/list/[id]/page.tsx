"use client";

import { createClient } from "@/utils/supabase/client";

import {
  useParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import Link from "next/link";
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
  const searchTag = search.get("tag");
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
  const [tag, setTag] = useState(searchTag ? searchTag : null);
  const rankCounts = useRef<Map<string, number>>(new Map<string, number>());
  const voteCounts = useRef<Map<string, number>>(new Map<string, number>());

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
    if (!data?.[0]) {
      rankCounts.current = new Map<string, number>();
      return;
    }
    const maxPoints = data?.[0].choices.length;
    rankCounts.current = new Map<string, number>();
    data?.forEach((sub) => {
      sub.choices.forEach((choice: Choice) => {
        if (choice.selected == false) return;
        let currentCounts = rankCounts.current.get(choice.title);
        currentCounts = currentCounts ? currentCounts : 0;
        rankCounts.current.set(
          choice.title,
          currentCounts + (maxPoints + 1 - choice.rank)
        );
      });
    });
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
  }, [tag]);

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
    prompt("Leaderboard Tag")?.trim().replace(/^#+/, "").toLowerCase() || "";

  const handleSubmit = async () => {
    if (!list.id) return;
    if (!choicesToSubmit.current.some((item) => item.selected))
      return alert("Select choices to add to your submission.");
    let searchTag = search.get("tag");
    let tagToSubmit = searchTag || "";
    if (tagToSubmit.length == 0) {
      let tagReceived = askTag();
      if (!tagReceived) return;
      tagToSubmit = tagReceived;
    }

    // Get Username
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
      tag: `${tagToSubmit}`,
      votes: 1,
    };

    if (!confirm(`Submit to ${tagToSubmit} as ${nameToSubmit}?`)) return;

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
    router.replace(pathname + "?" + createQueryString("tag", tagToSubmit));
    setTag(tagToSubmit);
    getSubs(tagToSubmit);
  };

  const handleSave = (choices: Choice[]) => {
    choicesToSubmit.current = choices;
  };

  const onBroadcast = (choices: Choice[]) => {
    choicesToSubmit.current = choices;
  };

  return (
    <>
      {tag ? (
        <section className="p-3 mt-3 text-center mb-3">
          <h1
            onClick={() => {
              let tagToSet = `${askTag()}`;
              if (tagToSet.length == 0) return;
              router.replace(
                pathname + "?" + createQueryString("tag", tagToSet)
              );
              setTag(tagToSet);
              getSubs(tagToSet);
            }}
            className="font-bold text-xl hover:underline hover:cursor-pointer"
          >
            {tag}
          </h1>
          {loadingSubs ? (
            <p className="text-sm">...</p>
          ) : (
            <p className="text-sm text-cyan-700">
              <a href="#submissions" className="hover:underline">
                {" "}
                {subs?.length || "0"} Submissions
              </a>
            </p>
          )}
        </section>
      ) : (
        <section className="p-3 mt-3 text-center mb-3">
          <div
            onClick={() => {
              let tagToSet = `${askTag()}`;
              if (tagToSet.length == 0) return;
              router.replace(
                pathname + "?" + createQueryString("tag", tagToSet)
              );
              setTag(tagToSet);
              getSubs(tagToSet);
            }}
            className="font-bold text-xl hover:underline hover:cursor-pointer"
          >
            Join a Tag
          </div>
          {/* {loadingSubs ? (
            <p className="text-sm">...</p>
          ) : (
            <p className="text-sm">{subs?.length || "0"} Submissions</p>
          )} */}
        </section>
      )}
      {list.choices.length == 0 ? (
        <>
          <div className="topic">
            <header className="header font-bold text-lg">...</header>
          </div>
        </>
      ) : (
        <div className="topic">
          <header className="header">
            <div className="flex gap-2 items-center">
              <Link href="/">&larr;</Link>
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
            counts={{ ranks: rankCounts.current, votes: voteCounts.current }}
          />
        </div>
      )}
      {!loadingSubs && subs.length > 0 ? (
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
                    counts={null}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
