import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import "./page.css";
import ChoiceList from "@/components/ChoiceList";

interface Choice {
  title: string;
  year: string;
  selected: boolean;
  rank: number;
}

export default async function Lists() {
  const supabase = createClient();
  const { data: lists } = await supabase.from("lists").select();
  console.log(lists);
  return (
    <>
      <section className="p-3 mt-3">
        <p className="text-center">
          Select a List. Choose Items. Rank Your Choices.
        </p>
      </section>
      <section>
        <ul className="list-topics">
          {lists
            ?.sort((a, b) =>
              new Date(a.created_at) > new Date(b.created_at) ? 1 : -1
            )
            .map(({ id, title, description, choices }) => (
              <li key={id} className="">
                <details className="topic">
                  <summary className="header sticky top-0" key={id}>
                    <div>
                      <h2>{title}</h2>
                      <p>{"" + description}</p>
                    </div>
                    <div>
                      <Link href={`/list/${id}`}>Go &gt;</Link>
                    </div>
                  </summary>

                  <ChoiceList
                    id={id}
                    choices={choices.map((choice: Choice) => {
                      return {
                        title: choice.title,
                        year: choice.year,
                        rank: -1,
                        selected: false,
                      };
                    })}
                  />
                </details>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
