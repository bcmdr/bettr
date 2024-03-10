import { createClient } from '@/utils/supabase/server';
import Link from 'next/link'

export default async function Votes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();
  console.log(notes); 
  return (<>
  <ul>
    <Link href="/lists/current">Current List</Link>
    {notes?.map(({id, title}) => <li key={id}>{id}: {title}</li>)}
  </ul>
  </>);
}