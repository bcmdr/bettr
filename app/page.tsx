import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface choice {
  title: string;
  year: string;
}

export default async function Lists() {
  const supabase = createClient();
  const { data: lists } = await supabase.from("lists").select();
  console.log(lists);
  return (
    <>
      <ul>
        {lists?.map(({ id, title, description, choices }) => (
          <div key={id}>
            <Link href={`/list/${id}`}>
              {title} - {description}
            </Link>

            <ol>
              {choices.map((choice: choice, key: any) => (
                <li key={key}>
                  {choice.title} ({choice.year})
                </li>
              ))}
            </ol>
          </div>
        ))}
      </ul>
    </>
  );
}
