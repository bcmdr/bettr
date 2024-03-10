import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import "./page.css";

export default async function Lists() {
  const supabase = createClient();
  const { data: lists } = await supabase.from("lists").select();
  console.log(lists);
  return (
    <>
      <ul className="list-topics">
        {lists?.map(({ id, title, description, choices }) => (
          <div className="topic" key={id}>
            <Link
              style={{
                display: "flex",
                gap: "1.5rem",
                justifyContent: "space-between",
              }}
              href={`/list/${id}`}
            >
              <strong>{title}</strong>
              <span> {description}</span>
            </Link>
          </div>
        ))}
      </ul>
    </>
  );
}
